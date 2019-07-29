var versionNumber = "0.0"
var versionTitle = "Initial"

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var clock = new THREE.Clock();
var loader = new THREE.GLTFLoader();
var renderer = new THREE.WebGLRenderer();
var raycaster = new THREE.Raycaster();
raycaster.far = 25;
var mouseVector = new THREE.Vector2();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var chanceToContinue = .25
var chanceToBeSameElevation = .6
var lengthDecreaseAmount = .1
var minimumLengthToContinue = .25
var maximumElevation = 7
var startingElevationBase = .25
var startingElevationVariance = .75
var minimumInitialElevations = 15
var chanceToNotContinueElevations = .2
var chanceToSpreadCoast = .25
var lengthAdditionModifier = .05
var alreadyVisitedModifier = .2
var depthMultiplier = 1.5

var minimumScrollOut = 13
var minimumScrollIn = 9
var ambientLighting = 1
var unitLighting = 1.75
var unitLightingDistance = 8
var seenLighting = .25
var ownershipOpacity = .2

$(document).ready(function () {
})

var debug = false;
var cursor = {x: 0, y: 0, active: false};

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];
var directions = ["l", "r", "ul", "ur", "dl", "dr"]
var hexagonSize = 1
var hexagonShape = new THREE.Shape();
hexagonShape.moveTo(0, -hexagonSize)
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(0, hexagonSize);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(0, -hexagonSize)

var ownerBordersShape = [new THREE.Shape(), new THREE.Shape(), new THREE.Shape(), new THREE.Shape(), new THREE.Shape(), new THREE.Shape()]
//L
ownerBordersShape[0].moveTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize / 2.4, -hexagonSize / 2 - hexagonSize / 10)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize / 2.4, -hexagonSize / 2)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize / 2.4, hexagonSize / 2 + hexagonSize / 10)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2)
//R
ownerBordersShape[1].moveTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize / 2.4, -hexagonSize / 2 - hexagonSize / 10)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize / 2.4, hexagonSize / 2)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize / 2.4, hexagonSize / 2 + hexagonSize / 10)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2)
//UL
ownerBordersShape[2].moveTo(0, hexagonSize)
ownerBordersShape[2].lineTo(hexagonSize / 7, hexagonSize / 1.15)
ownerBordersShape[2].lineTo(0, hexagonSize / 1.15)
ownerBordersShape[2].lineTo(-Math.sqrt(3) * hexagonSize / 2.5, hexagonSize / 2) 
ownerBordersShape[2].lineTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2 - hexagonSize / 10) 
ownerBordersShape[2].lineTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2)
ownerBordersShape[2].lineTo(0, hexagonSize)
//UR
ownerBordersShape[3].moveTo(0, hexagonSize)
ownerBordersShape[3].lineTo(-hexagonSize / 7, hexagonSize / 1.15)
ownerBordersShape[3].lineTo(0, hexagonSize / 1.15)
ownerBordersShape[3].lineTo(Math.sqrt(3) * hexagonSize / 2.5, hexagonSize / 2) 
ownerBordersShape[3].lineTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2 - hexagonSize / 10) 
ownerBordersShape[3].lineTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2)
ownerBordersShape[3].lineTo(0, hexagonSize)
//DL
ownerBordersShape[4].moveTo(0, -hexagonSize)
ownerBordersShape[4].lineTo(hexagonSize / 7, -hexagonSize / 1.15)
ownerBordersShape[4].lineTo(0, -hexagonSize / 1.15)
ownerBordersShape[4].lineTo(-Math.sqrt(3) * hexagonSize / 2.5, -hexagonSize / 2) 
ownerBordersShape[4].lineTo(-Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2 + hexagonSize / 5) 
ownerBordersShape[4].lineTo(-Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2)
ownerBordersShape[4].lineTo(0, -hexagonSize)
//DR
ownerBordersShape[5].moveTo(0, -hexagonSize)
ownerBordersShape[5].lineTo(-hexagonSize / 7, -hexagonSize / 1.15)
ownerBordersShape[5].lineTo(0, -hexagonSize / 1.15)
ownerBordersShape[5].lineTo(Math.sqrt(3) * hexagonSize / 2.5, -hexagonSize / 2) 
ownerBordersShape[5].lineTo(Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2 + hexagonSize / 5) 
ownerBordersShape[5].lineTo(Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2)
ownerBordersShape[5].lineTo(0, -hexagonSize)

var ownerBorders = []
for(var i = 0; i < directions.length; i++){
    ownerBorders[i] = new THREE.Mesh( 
        new THREE.ExtrudeGeometry(ownerBordersShape[i], { depth: .1, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: .1, bevelThickness: .1 }),
        new THREE.MeshLambertMaterial({color: "#050505"}) 
    );
}

var keys = {
    87: {keydown: function(){}, keyup: function(){}, active: false}, // up
    83: {keydown: function(){}, keyup: function(){}, active: false}, // down
    65: {keydown: function(){}, keyup: function(){}, active: false}, // left
    68: {keydown: function(){}, keyup: function(){}, active: false},  // right
    13: {keydown: function(){players[0].endTurn()}, keyup: function(){}, active: false}  
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

    cameraMove()
    
    mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseVector.y = - ( (event.clientY - 5) / window.innerHeight ) * 2 + 1;
});

window.addEventListener('mousedown', function (e) {
    cursor.active = true;

    if(hoveredUnit != undefined){
        activeUnit = hoveredUnit
        renderReachable(activeUnit)
    }
    
    if(activeTile != undefined && activeTile.reachableOverlay != undefined){
        activeUnit.move(activeTile.position, activeTile.reachableOverlay.reachableDistance)
    }
})

window.addEventListener('mouseup', function (e) {
    cursor.active = false;
});

document.body.addEventListener('wheel',function(event){
    camera.position.z += event.deltaY / 5
    if(camera.position.z > minimumScrollOut){
        camera.position.z = minimumScrollOut
    } else if(camera.position.z < minimumScrollIn){
        camera.position.z = minimumScrollIn
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
        this.texture = new THREE.TextureLoader().load(texture)
        this.material = new THREE.MeshLambertMaterial( { alphaMap: hexagonAlpha, transparent: true, depthWrite: false, map: this.texture } )
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
var hexagonGeometry = new THREE.PlaneGeometry(Math.sqrt(3) * hexagonSize, 2.05 * hexagonSize, 1, 1)
class Tile{
    constructor(position){
        this.position = position
        this.depth = 1

        this.light = new THREE.PointLight( 0xffffff, seenLighting, unitLightingDistance );
    }

    initialize(){
        this.mesh = new THREE.Mesh( 
            new THREE.ExtrudeGeometry(hexagonShape,  { depth: this.depth, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: .5 } ), 
            new THREE.MeshLambertMaterial({color: "#050505"}) 
        );
        scene.add(this.mesh)

        this.face = new THREE.Mesh(hexagonGeometry);
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
        this.face.material = this.terrain.material
    }

    seen(){
        scene.add( this.light );
    }

    goto(){
        mapOffset.x = 40 - (Math.sqrt(3) * hexagonSize * this.position.x)
        mapOffset.y = 70 - (2.05 * hexagonSize * this.position.y)
        cameraMove()
    }

    foundSettlement(){
        this.settlement = new Settlement(this.position)
        activePlayer.settlements.push(this.settlement)

        this.switchOwnership(activePlayer) 
        for(var i = 0; i < directions.length; i++){
            t(this, directions[i]).switchOwnership(activePlayer)
        }
    }

    switchOwnership(player){
        this.player = player

        if(this.ownerOverlay == undefined){
            this.ownerOverlay = new THREE.Mesh(hexagonGeometry, this.player.overlayMaterial);
            this.ownerOverlay.gamePosition = this.position
            scene.add(this.ownerOverlay)
        }

        calculateBorders()
    }
}

var overlayMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF, alphaMap: hexagonAlpha, transparent: true, opacity: .2, depthWrite: false } )
function renderReachable(unit){
    hideReachable()
    
    var reachable = unit.determineReachable()

    if(reachable.length > 1){
        reachable.forEach(function(e){
            e.tile.reachableOverlay = new THREE.Mesh(hexagonGeometry, overlayMaterial)
            e.tile.reachableOverlay.reachablePos = e.tile.position
            e.tile.reachableOverlay.reachableDistance = e.distance
            scene.add(e.tile.reachableOverlay)
        })
    }
}

function hideReachable(){
    tiles.forEach(z => z.forEach(function(e){
        scene.remove(e.reachableOverlay)
        e.reachableOverlay = undefined
    }))
}

class UnitType{
    constructor(name, ocean, filename){
        this.name = name
        this.ocean = ocean //temp   
        this.texture = new THREE.TextureLoader().load( 'uniticons/' + filename );
    }
}

var unitTypes = {
    infantry: new UnitType("Infantry", false, "infantry.png"),
    sea: new UnitType("Sea", true, "sea.png")
}

var unitIconAlpha = new THREE.TextureLoader().load( 'uniticons/alpha.png' );

class Unit{
    constructor(type, pos){
        this.type = type
        this.pos = pos
        this.movementRemaining = 0

        this.icon = new THREE.Sprite(new THREE.SpriteMaterial( { map: this.type.texture, alphaMap: unitIconAlpha, side: THREE.DoubleSide, transparent: true } ));
        scene.add(this.icon)

        this.light = new THREE.PointLight( 0xffffff, unitLighting, unitLightingDistance );
        scene.add( this.light );
        this.lightNorth = new THREE.PointLight( 0xffffff, unitLighting, unitLightingDistance );
        scene.add( this.lightNorth );
        this.lightWest = new THREE.PointLight( 0xffffff, unitLighting, unitLightingDistance );
        scene.add( this.lightWest );
        this.lightEast = new THREE.PointLight( 0xffffff, unitLighting, unitLightingDistance );
        scene.add( this.lightEast );
        this.lightSouth = new THREE.PointLight( 0xffffff, unitLighting, unitLightingDistance );
        scene.add( this.lightSouth );
        

        this.resetTurn()
    }

    movementCost(tile){
        var final = 1

        if(this.type.ocean){
            if(tile.terrain == terrainTypes.coast){
                final += .25
            }
            if(tile.terrain == terrainTypes.ocean){
                final += .5
            }
        } else{
            if(tile.terrain == terrainTypes.coast){
                final += .5
            }
            if(tile.terrain == terrainTypes.ocean){
                final = 100
            }
        }

        return final
    }

    determineReachable(){
        var visited = [{tile: tiles[this.pos.x][this.pos.y], distance: 0}]
        var fringes = []
        fringes.push([{tile: tiles[this.pos.x][this.pos.y], distance: 0}])

        var self = this

        for(var i = 0; i < self.movementRemaining; i++){
            fringes.push([])
            fringes[i].forEach(function(e){
                for(var d = 0; d < directions.length; d++){
                    var neighbor = t(e.tile, directions[d])
                    if(e.distance + self.movementCost(neighbor) <= self.movementRemaining){
                        var sameTiles = visited.filter(y => y.tile.position.x == neighbor.position.x && y.tile.position.y == neighbor.position.y)
                        if(sameTiles.length == 0){
                            visited.push({tile: neighbor, distance: e.distance + self.movementCost(neighbor)})
                            fringes[i + 1].push({tile: neighbor, distance: e.distance + self.movementCost(neighbor)})
                        } else if(sameTiles[0].distance > e.distance + self.movementCost(neighbor)) {
                            sameTiles[0].distance = e.distance + self.movementCost(neighbor)
                            fringes[i + 1].push({tile: neighbor, distance: e.distance + self.movementCost(neighbor)})
                        }
                    }
                }
            })
        }

        return visited
    }

    disactivate(){
        this.icon.material.opacity = .5
    }

    resetTurn(){
        this.icon.material.opacity = .9
        this.movementRemaining = 4
    }

    move(tile, cost){
        this.pos = tile
        this.movementRemaining -= cost
        
        if(this.determineReachable().length <= 1){
            this.disactivate()
        }

        tiles[tile.x][tile.y].seen()

        cameraMove()
        hideReachable()
    }
}

class Player{
    constructor(){
        this.units = [] 
        this.settlements = []
        this.overlayMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color(Math.random(), Math.random(), Math.random()),
             alphaMap: hexagonAlpha, transparent: true, opacity: ownershipOpacity, depthWrite: false } )
    }

    endTurn(){
        hideReachable()
        this.units.forEach(x => x.resetTurn())
        activePlayer = players[(players.indexOf(activePlayer) + 1) % players.length]
    }
}
var players = [new Player()]
activePlayer = players[0]

class Settlement{
    constructor(pos){
        this.position = pos

        this.model = settlement.clone()
        this.model.scale.set(.0025, .0025, .0025)
        this.model.rotation.y = Math.random() * Math.PI * 2
        scene.add(this.model)
    }
}

players[0].units.push(new Unit(unitTypes.infantry, {x: 0, y: 0}))
players[0].units.push(new Unit(unitTypes.sea, {x: 2, y: 2}))

var mapSizeX = 65
var mapSizeY = 40
var tiles = []
var flatArrayTiles = []
for(var i = 0; i < mapSizeX; i++){
    tiles.push([])
    for(var e = 0; e < mapSizeY; e++){
        tiles[i].push(new Tile({x: i, y: e}))
        flatArrayTiles.push(tiles[i][e])
    }
}

function setElevation(pos, length){
    var lengthModifier = 1
    if(visitedTiles.filter(x => x.position.x == pos.x && x.position.y == pos.y).length < 1){
        lengthModifier = alreadyVisitedModifier
    }
    visitedTiles.push(tiles[pos.x][pos.y])

    if(tiles[pos.x][pos.y].depth > maximumElevation){
        return
    }
    tiles[pos.x][pos.y].depth = Math.max(1 + length, tiles[pos.x][pos.y].depth + length * lengthAdditionModifier * lengthModifier)

    length -= lengthDecreaseAmount
    if(length <= minimumLengthToContinue){
        return
    }

    var noLoss = [false, false, false, false, false, false]
    if(Math.random() < chanceToBeSameElevation){
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

var visitedTiles = []
for(var i = 0; i < minimumInitialElevations || Math.random() > chanceToNotContinueElevations; i++){
    var pos = {x: randomIndex(tiles), y: randomIndex(tiles[0])}
    setElevation(pos, startingElevationVariance * Math.random() + startingElevationBase)
    visitedTiles = []
}

tiles.forEach(function(x){x.forEach(function(e){
    if(e.depth > 1){
        e.depth = 1 + depthMultiplier * (Math.pow(e.depth, .5) - 1)
    }
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

var coastalTiles = []
tiles.forEach(function(x){x.forEach(function(e){
    if(e.terrain == terrainTypes.coast){
        coastalTiles.push(e)
    }
})})

coastalTiles.forEach(function(e){
    if(Math.random() < chanceToSpreadCoast && t(e, "r").terrain == terrainTypes.ocean){
        t(e, "r").setTerrain(terrainTypes.coast)
    }
    if(Math.random() < chanceToSpreadCoast && t(e, "l").terrain == terrainTypes.ocean){
        t(e, "l").setTerrain(terrainTypes.coast)
    }
    if(Math.random() < chanceToSpreadCoast && t(e, "ur").terrain == terrainTypes.ocean){
        t(e, "ur").setTerrain(terrainTypes.coast)
    }
    if(Math.random() < chanceToSpreadCoast && t(e, "ul").terrain == terrainTypes.ocean){
        t(e, "ul").setTerrain(terrainTypes.coast)
    }
    if(Math.random() < chanceToSpreadCoast && t(e, "dr").terrain == terrainTypes.ocean){
        t(e, "dr").setTerrain(terrainTypes.coast)
    }
    if(Math.random() < chanceToSpreadCoast && t(e, "dl").terrain == terrainTypes.ocean){
        t(e, "dl").setTerrain(terrainTypes.coast)
    }
})

var maxOffsetX= mapSizeX * Math.sqrt(3) * hexagonSize
var maxOffsetY = mapSizeY * 3 / 2 * hexagonSize
var mapOffset = {x: maxOffsetX, y: maxOffsetY}
var activeUnit = undefined
var hoveredUnit = undefined

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
*/

var settlement
loader.load('scene.gltf', function ( gltf ) { 
    settlement = gltf.scene; 
    settlement.rotation.x = Math.PI / 2

    tiles[0][1].foundSettlement()
}, function ( xhr ) {}, function ( error ) {});

var hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x000000, ambientLighting );
scene.add( hemisphereLight );

camera.position.z = (minimumScrollIn + minimumScrollOut) / 2
camera.rotation.x = .6
camera.position.x = 40
camera.position.y = 5

function calculateBorders(){
    tiles.forEach(z => z.forEach(function(e){
        if(e.player != undefined){
            if(e.borderMeshes != undefined && e.borderMeshes.length > 0){
                for(var i = 0; i < e.borderMeshes.length; i++){
                    scene.remove(e.borderMeshes[i])
                }
            }
            e.borderMeshes = []
            for(var d = 0; d < directions.length; d++){
                if(t(e, directions[d]).player != e.player){
                    e.borderMeshes.push(ownerBorders[d].clone())
                    scene.add(e.borderMeshes[e.borderMeshes.length - 1])
                }
            }
        }
    }))
}

function cameraMove(){
    tiles.forEach(function(x){x.forEach(function(e){
        e.mesh.position.x = (((2 * e.position.x  + (e.position.y % 2 == 0 ? 0 : 1)) * Math.sqrt(3) / 2 * hexagonSize) + mapOffset.x) % maxOffsetX
        e.face.position.x = e.mesh.position.x
        e.light.position.x = e.mesh.position.x
        e.mesh.position.y = ((hexagonSize * 3/2 * e.position.y) + mapOffset.y) % maxOffsetY
        e.face.position.y = e.mesh.position.y
        e.light.position.y = e.mesh.position.y

        if(e.reachableOverlay != undefined){
            e.reachableOverlay.position.x = e.face.position.x
            e.reachableOverlay.position.y = e.face.position.y
        }

        if(e.ownerOverlay != undefined){
            e.ownerOverlay.position.x = e.face.position.x
            e.ownerOverlay.position.y = e.face.position.y
        }

        if(e.borderMeshes != undefined){
            e.borderMeshes.forEach(function(d){
                d.position.x = e.face.position.x
                d.position.y = e.face.position.y
            })
        }
    })})

    players.forEach(x => x.units.forEach(function(e){
        e.icon.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x
        e.icon.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y - .2
        e.icon.position.z = tiles[e.pos.x][e.pos.y].face.position.z + .5

        e.light.position.z = tiles[e.pos.x][e.pos.y].face.position.z + 1.75
        e.lightNorth.position.z = tiles[e.pos.x][e.pos.y].face.position.z + 1.75
        e.lightEast.position.z = tiles[e.pos.x][e.pos.y].face.position.z + 1.75
        e.lightWest.position.z = tiles[e.pos.x][e.pos.y].face.position.z + 1.75
        e.lightSouth.position.z = tiles[e.pos.x][e.pos.y].face.position.z + 1.75
        
        e.light.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x
        e.light.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y
        e.lightNorth.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x
        e.lightNorth.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y + maxOffsetY 
        e.lightWest.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x - maxOffsetX
        e.lightWest.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y
        e.lightEast.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x + maxOffsetX
        e.lightEast.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y
        e.lightSouth.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x
        e.lightSouth.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y - maxOffsetY
    }))

    players.forEach(x => x.settlements.forEach(function(e){
        e.model.position.x = tiles[e.position.x][e.position.y].mesh.position.x
        e.model.position.y = tiles[e.position.x][e.position.y].mesh.position.y
    }))
}

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

    hoveredUnit = undefined
	raycaster.setFromCamera( mouseVector, camera );
    var intersects = raycaster.intersectObjects( scene.children )
    if(intersects[0] != undefined && intersects[0].object != undefined){
        if(intersects[0].object.gamePosition != undefined){
            activeTile = tiles[intersects[0].object.gamePosition.x][intersects[0].object.gamePosition.y]
            activeTile.active = true
        } else if(intersects[0].object.reachablePos != undefined){
            activeTile = tiles[intersects[0].object.reachablePos.x][intersects[0].object.reachablePos.y]
            activeTile.active = true
        } else if(intersects[0].object.unitID != undefined){
            hoveredUnit = players[intersects[0].object.playerID].units[intersects[0].object.unitID]
        }
    }

    tiles.forEach(function(x){x.forEach(function(e){
        if(e.active){
            e.mesh.position.z = Math.min(.3, e.mesh.position.z + 0.07)
        } else {
            e.mesh.position.z = Math.max(0, e.mesh.position.z - 0.1)
        }
        e.face.position.z = e.mesh.position.z + e.depth + .02
        e.light.position.z = e.mesh.position.z + e.depth + 1
        if(e.settlement != undefined){
            e.settlement.model.position.z = e.face.position.z
        }
        if(e.reachableOverlay != undefined){
            e.reachableOverlay.position.z = e.face.position.z + .05
        }
        if(e.ownerOverlay != undefined){
            e.ownerOverlay.position.z = e.face.position.z + .06
        }
        if(e.borderMeshes != undefined){
            e.borderMeshes.forEach(function(d){
                d.position.z = e.face.position.z
            })
        }
    })})

    for(var i = 0; i < players.length; i++){
        for(var e = 0; e < players[i].units.length; e++){
            players[i].units[e].icon.playerID = i
            players[i].units[e].icon.unitID = e
        }
    }
}

tiles[0][0].goto()
hideTooltip()
animate();