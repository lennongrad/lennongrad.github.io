var versionNumber = "0.0"
var versionTitle = "Initial"

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var clock = new THREE.Clock();
var loader = new THREE.GLTFLoader();
var renderer = new THREE.WebGLRenderer();
var raycaster = new THREE.Raycaster();
raycaster.far = 20;
var mouseVector = new THREE.Vector2();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var chanceToContinue = .25
var chanceToBeSameElevation = .95
var lengthDecreaseAmount = .09
var minimumLengthToContinue = 0
var maximumElevation = 3.5
var startingElevationBase = .8
var startingElevationVariance = 1.4

$(document).ready(function () {
})

var debug = false;
var cursor = {x: 0, y: 0, active: false};

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];
var hexagonSize = 1

var keys = {
    87: {keydown: function(){}, keyup: function(){}, active: false}, // up
    83: {keydown: function(){}, keyup: function(){}, active: false}, // down
    65: {keydown: function(){}, keyup: function(){}, active: false}, // left
    68: {keydown: function(){}, keyup: function(){}, active: false}  // right
}

window.addEventListener('mousemove', function (e) {
    cursor.y = e.pageY;
    cursor.x = e.pageX;	

    if(cursor.active){
        mapOffset.x += e.movementX / 100
        if(mapOffset.x < 0){
            mapOffset.x = maxOffsetX
        }
        mapOffset.y -= e.movementY / 100
        if(mapOffset.y < 0){
            mapOffset.y = maxOffsetY
        }
    }

    tiles.forEach(function(x){x.forEach(function(e){
        e.mesh.position.x = (((2 * e.position.x  + (e.position.y % 2 == 0 ? 0 : 1)) * Math.sqrt(3) / 2 * hexagonSize) + mapOffset.x) % maxOffsetX
        e.face.position.x = e.mesh.position.x
        e.mesh.position.y = ((hexagonSize * 3/2 * e.position.y) + mapOffset.y) % maxOffsetY
        e.face.position.y = e.mesh.position.y
    })})
    
    mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseVector.y = - ( (event.clientY - 5) / window.innerHeight ) * 2 + 1;
});

window.addEventListener('mousedown', function (e) {
    cursor.active = true;
})

window.addEventListener('mouseup', function (e) {
    cursor.active = false;
});

document.body.addEventListener('wheel',function(event){
    camera.position.z += event.deltaY / 5
    if(camera.position.z > 11){
        camera.position.z = 11
    } else if(camera.position.z < 4){
        camera.position.z = 4
    }
    return false; 
}, false);

document.addEventListener('keydown', function (event) {
    if (keys[event.keyCode] == undefined) {
        return
    }
    keys[event.keyCode].keydown()
    keys[event.keyCode].active = true
});

document.addEventListener('keyup', function (event) {
    if (keys[event.keyCode] == undefined) {
        return
    }
    keys[event.keyCode].keyup()
    keys[event.keyCode].active = false
});

function t(pos, direction){
    var used = pos
    var returnPosition = true
    var final
    if(pos.x == undefined){
        used = pos.position
        returnPosition = false
    }
    
    switch(direction){
        case "l": final = {x: used.x - 1, y: used.y}; break;
        case "r": final = {x: used.x + 1, y: used.y}; break;
        case "ul": final = {x: used.x + (used.y % 2 == 0 ? -1 : 0), y: used.y + 1}; break;
        case "ur": final = {x: used.x + (used.y % 2 == 0 ? 0 : 1), y: used.y + 1}; break;
        case "dl": final = {x: used.x + (used.y % 2 == 0 ? -1 : 0), y: used.y - 1}; break;
        case "dr": final = {x: used.x + (used.y % 2 == 0 ? 0 : 1), y: used.y - 1}; break;
    }

    if(final.x < 0){
        final.x = mapSizeX + final.x
    }
    if(final.y < 0){
        final.y = mapSizeY + final.y
    }
    if(final.x >= mapSizeX){
        final.x = final.x - mapSizeX
    }
    if(final.y >= mapSizeY){
        final.y = final.y - mapSizeY
    }

    if(returnPosition){
        return final
    }
    return tiles[final.x][final.y]
}

function log(value, base) {
    return Math.log(value) / Math.log(base)
}

function removeElement(element) {
    element.parentNode.removeChild(element);
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

function randomIndex(arr) {
    return Math.floor(arr.length * Math.random())
}

function randomValue(arr) {
    return arr[randomIndex(arr)]
}

function randomValueObj(obj){
    return obj[randomValue(Object.keys(obj))]
}

function adjustBrightness(col, amt) {
    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var R = parseInt(col.substring(0, 2), 16);
    var G = parseInt(col.substring(2, 4), 16);
    var B = parseInt(col.substring(4, 6), 16);

    R = R + amt;
    G = G + amt;
    B = B + amt;

    if (R > 255) R = 255;
    else if (R < 0) R = 0;

    if (G > 255) G = 255;
    else if (G < 0) G = 0;

    if (B > 255) B = 255;
    else if (B < 0) B = 0;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return (usePound ? "#" : "") + RR + GG + BB;

}

function numberExtension(number, sigFig) {
    number = number.toString();
    while(sigFig > number.length) {
        number = number + "0";
    }
    return number;
}

function decimalToHexString(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }

    number = number.toString(16).toUpperCase();
    for (y = 0; y < 7 - number.toString().length; y++) {
        number = "0" + number;
    }

    return number;
}

function small_int(e) {
    var size = Math.floor(Math.log10(Math.abs(e))) + 1;
    var suffix = "";

    if (size < 4) {
        return e.toString().substring(0, 3);
    } else {
        e = e.toExponential(9);
        e = e.substring(0, 4 + size % 3 + 4);
    }
    if (size >= 4) {
        switch (size % 3) {
            case 0: e = e.substring(0, 1) + e.substring(2, 4) + "." + e.substring(4); e = e.substring(0, 7); break;
            case 1: e = e.substring(0, 5); break;
            case 2: e = e.substring(0, 1) + e.substring(2, 3) + "." + e.substring(3); e = e.substring(0, 6); break;
        }
        suffix = suffixes[Math.floor((size - 1) / 3)]
    }
    if ((Math.floor((size - 1) / 3)) < suffixes.length) {
        return e + suffix;
    } else {
        return e + "e" + (size - 3);
    }
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            e.code === 22 ||                               // everything except Firefox
            e.code === 1014 ||                             //test name field too, because code might not be present everything except Firefox
            e.name === 'QuotaExceededError' ||             // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;                          // acknowledge QuotaExceededError only if there's something already stored
    }
}

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}	

function capitalize(str) {
    return str[0].toUpperCase() + str.substring(1);
}

function exportStr() {
    var data = [versionNumber]

    return JSON.stringify(data)
}

function importString(str) {
    if (!isJSON(str)) {
        return false
    }
    var data = JSON.parse(str)
    if (data.length != 1 || data[0] != versionNumber) {
        alert("This data is incompatible.")

        return false
    }
    return true
}

function saveData() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem("save", exportStr())
    }
}

function resetData() {
    if (storageAvailable('localStorage')) {
        localStorage.removeItem("save")
        location.reload()
    }
}

function loadData(str) {
    if (storageAvailable('localStorage')) {
        localStorage.setItem("save", str)
        location.reload()
    } else {
        importString(str)
    }
}

function copyToClipboard(str) {
    const tempElement = document.createElement('textarea');  // Create a <textarea> element
    tempElement.value = str;                                 // Set its value to the string that you want copied
    tempElement.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    tempElement.style.position = 'absolute';
    tempElement.style.left = '150vw';                        // Move outside the screen to make it invisible
    document.body.appendChild(tempElement);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0               // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)          // Store selection if found
            : false;                                         // Mark as false to know no selection existed before
    tempElement.select();                                    // Select the <textarea> content
    document.execCommand('copy');                            // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(tempElement);                  // Remove the <textarea> element
    if (selected) {                                          // If a selection existed before copying
        document.getSelection().removeAllRanges();           // Unselect everything on the HTML document
        document.getSelection().addRange(selected);          // Restore the original selection
    }
};

// Audio
//var snd = new Audio("click.wav");
// snd.play();

function showTooltip(elem) {
    document.getElementById("tooltip").innerHTML = elem.getAttribute("message")
    document.getElementById("tooltip").style.left = elem.getBoundingClientRect().left + elem.getBoundingClientRect().width / 2 + "px"
    document.getElementById("tooltip").style.top = elem.getBoundingClientRect().top - window.innerHeight / 22 + "px"
    document.getElementById("tooltip").style.opacity = .92
}

function hideTooltip() {
    document.getElementById("tooltip").style.opacity = 0
}

if (storageAvailable('localStorage')) {
    if (localStorage.getItem("save") != undefined) {
        if (!importString(localStorage.getItem("save"))) {
            localStorage.removeItem("save")
            location.reload()
        }
    }
}

class Terrain{
    constructor(name, texture){
        this.name = name
        this.textureFilename = texture
        this.texture = new THREE.TextureLoader().load(texture);
    }
}
var terrainAlpha = new THREE.TextureLoader().load("terrain/alpha.png");

var terrainTypes = {
    grasslands: new Terrain("Grasslands", "terrain/grasslands.png"),
    grasslandsHills: new Terrain("Grasslands Hills", "terrain/grasslands-hills.png"),
    plains: new Terrain("Plains", "terrain/plains.png"),
    plainsHills: new Terrain("Plains Hills", "terrain/plains-hills.png"),
    tundra: new Terrain("Tundra", "terrain/tundra.png"),
    tundraHills: new Terrain("Tundra Hills", "terrain/tundra-hills.png"),
    desert: new Terrain("Desert", "terrain/desert.png"),
    desertHills: new Terrain("Desert Hills", "terrain/desert-hills.png"),
    snow: new Terrain("Snow", "terrain/snow.png"),
    snowHills: new Terrain("Snow Hills", "terrain/snow-hills.png"),
    coast: new Terrain("Coast", "terrain/coast.png"),
    ocean: new Terrain("Ocean", "terrain/ocean.png"),
    ice: new Terrain("Ice", "terrain/ice.png")
}

var hexagonAlpha = new THREE.TextureLoader().load("terrain/alpha.png")
class Tile{
    constructor(position){
        this.position = position
        this.depth = 1
    }

    initialize(){
        this.mesh = new THREE.Mesh( 
            new THREE.ExtrudeGeometry(hexagonShape,  { depth: this.depth, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: .5 } ), 
            new THREE.MeshLambertMaterial({color: "#050505"}) 
        );
        scene.add(this.mesh)

        this.face = new THREE.Mesh(new THREE.PlaneGeometry(Math.sqrt(3) * hexagonSize, 2.05 * hexagonSize, 1, 1), 
            new THREE.MeshBasicMaterial( { alphaMap: hexagonAlpha, transparent: true, depthWrite: false } ));
        this.face.gamePosition = this.position
        scene.add(this.face)

        if(this.depth > 1){
            this.setTerrain(terrainTypes.grasslands)
        } else {
            this.setTerrain(terrainTypes.ocean)
        }
    }

    setTerrain(terrain){
        this.terrain = terrain
        this.face.material.map = this.terrain.texture
    }
}

var hexagonShape = new THREE.Shape();
hexagonShape.moveTo(0, -hexagonSize)
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(0, hexagonSize);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(0, -hexagonSize)

var mapSizeX = 85
var mapSizeY = 50
var tiles = []
for(var i = 0; i < mapSizeX; i++){
    tiles.push([])
    for(var e = 0; e < mapSizeY; e++){
        tiles[i].push(new Tile({x: i, y: e}))
    }
}

function setElevation(pos, length){
    if(tiles[pos.x][pos.y].depth > maximumElevation){
        return
    }
    tiles[pos.x][pos.y].depth += length

    length -= lengthDecreaseAmount
    if(length <= minimumLengthToContinue){
        return
    }

    var noLoss = [false, false, false, false, false, false]
    if(Math.random() > chanceToBeSameElevation){
        noLoss[randomIndex(noLoss)] = true
    }

    if(Math.random() > chanceToContinue){
        setElevation(t(pos, "l"), noLoss[0] ? (length + lengthDecreaseAmount) : length)
    }
    if(Math.random() > chanceToContinue){
        setElevation(t(pos, "r"), noLoss[1] ? (length + lengthDecreaseAmount) : length)
    }
    if(Math.random() > chanceToContinue){
        setElevation(t(pos, "ul"), noLoss[2] ? (length + lengthDecreaseAmount) : length)
    }
    if(Math.random() > chanceToContinue){
        setElevation(t(pos, "ur"), noLoss[3] ? (length + lengthDecreaseAmount) : length)
    }
    if(Math.random() > chanceToContinue){
        setElevation(t(pos, "dl"), noLoss[4] ? (length + lengthDecreaseAmount) : length)
    }
    if(Math.random() > chanceToContinue){
        setElevation(t(pos, "dr"), noLoss[5] ? (length + lengthDecreaseAmount) : length)
    }
}


for(var i = 0; Math.random() > ((.1 * i) - 1); i++){
    setElevation({x: randomIndex(tiles), y: randomIndex(tiles[0])}, startingElevationVariance * Math.random() + startingElevationBase)
}

tiles.forEach(function(x){x.forEach(function(e){
    e.initialize()
})})

tiles.forEach(function(x){x.forEach(function(e){
    if( e.terrain == terrainTypes.ocean &&
        ((t(e, "r").terrain != terrainTypes.ocean && (t(e, "r").terrain != terrainTypes.coast)) ||
        (t(e,  "l").terrain != terrainTypes.ocean && (t(e, "l").terrain != terrainTypes.coast)) ||
        (t(e, "ur").terrain != terrainTypes.ocean && (t(e, "ur").terrain != terrainTypes.coast)) ||
        (t(e, "ul").terrain != terrainTypes.ocean && (t(e, "ul").terrain != terrainTypes.coast)) ||
        (t(e, "dr").terrain != terrainTypes.ocean && (t(e, "dr").terrain != terrainTypes.coast)) ||
        (t(e, "dl").terrain != terrainTypes.ocean && (t(e, "dl").terrain != terrainTypes.coast)))){
            e.setTerrain(terrainTypes.coast)
    }
})})

var maxOffsetX= mapSizeX * Math.sqrt(3) * hexagonSize
var maxOffsetY = mapSizeY * 3 / 2 * hexagonSize
var mapOffset = {x: maxOffsetX, y: maxOffsetY}

/*
var runnerTexture = new THREE.TextureLoader().load( 'exampleAnimation.png' );
var runnerTextureAlpha = new THREE.TextureLoader().load( 'exampleAnimationAlpha.png' );
annie = new TextureAnimator( runnerTexture, 10, 1, 10, 75 ); // texture, #horiz, #vert, #total, duration.
annieAlpha = new TextureAnimator( runnerTextureAlpha, 10, 1, 10, 75 ); // texture, #horiz, #vert, #total, duration.
var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, alphaMap: runnerTextureAlpha, side: THREE.DoubleSide, transparent: true } );
var runnerGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
runner.position.set(0,0,0);
scene.add(runner);

var background
loader.load('scene.gltf', function ( gltf ) { 
    background = gltf.scene; 
    background.scale.set(10,10,10)
    background.rotation.y = -Math.PI / 2
    background.position.x = -150
    background.position.z = 250
    background.position.y = -40
    scene.add( gltf.scene );
}, function ( xhr ) {}, function ( error ) {});*/

var hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 12.4 );
scene.add( hemisphereLight );

camera.position.z = 6
camera.rotation.x = .6
camera.position.x = 40
camera.position.y = 5

var delta
function animate() {
    delta = clock.getDelta()    
   // annie.update(1000 * delta)
   // annieAlpha.update(1000 * delta)
	requestAnimationFrame( animate );
    renderer.render( scene, camera );
    
    activeTile = undefined
    tiles.forEach(function(x){x.forEach(function(e){
        e.active = false; 
    })})

	raycaster.setFromCamera( mouseVector, camera );
    var intersects = raycaster.intersectObjects( scene.children )
    if(intersects[0].object.gamePosition != undefined){
        activeTile = tiles[intersects[0].object.gamePosition.x][intersects[0].object.gamePosition.y]
        activeTile.active = true
    }	

    tiles.forEach(function(x){x.forEach(function(e){
        if(e.active){
            e.mesh.position.z = Math.min(.3, e.mesh.position.z + 0.07)
        } else {
            e.mesh.position.z = Math.max(0, e.mesh.position.z - 0.1)
        }
        e.face.position.z = e.mesh.position.z + e.depth + .02
    })})
}

hideTooltip()
animate();