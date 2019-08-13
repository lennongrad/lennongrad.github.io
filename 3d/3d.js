var versionNumber = "0.0"
var versionTitle = "Initial"

var scene = new THREE.Scene();
//var cssScene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 52, window.innerWidth / window.innerHeight, 0.1, 50 );
var clock = new THREE.Clock();
var loader = new THREE.GLTFLoader();
var renderer = new THREE.WebGLRenderer();
var cssRenderer = new THREE.CSS2DRenderer();
var raycaster = new THREE.Raycaster();
raycaster.far = 25;
var mouseVector = new THREE.Vector2();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
cssRenderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( cssRenderer.domElement );
cssRenderer.domElement.id = "cssRenderer"

window.onresize = function(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
}

var tooltipTile = document.getElementById("tooltip-tile")

var chanceToContinue = .25
var chanceToBeSameElevation = .6
var lengthDecreaseAmount = .1
var minimumLengthToContinue = .25
var maxDepth = 6
var startingElevationBase = .25
var startingElevationVariance = .75
var minimumInitialElevations = 9
var chanceToNotContinueElevations = .25
var chanceToSpreadCoast = .25
var lengthAdditionModifier = .05
var alreadyVisitedModifier = .2
var depthMultiplier = 1.5
var riversLimit = 150
var chanceToGenerateRiverDespiteDepth = .01
var desertsLimit = 5
var maxSpreadTerrainPlains = 12
var maxSpreadTerrainDesert = 5
var minimumSpreadTerrain = 2
var chanceToContinueMountain = .45
var chanceToContinueForest = .2
var forestsLimit = 25

var minimumScrollOut = 28
var minimumScrollIn = 18
var ambientLighting = 1.5
var reachableOverlayOpacity = .3
var ownerOverlayOpacity = .1
var unitIconHoverAboveTile = .45
var chanceToIgnoreDeepestTile = .8
var initialCameraOffsetX = 70
var initialCameraOffsetY = 5
var cameraRotationBase = .75

var debug = false;
var cursor = {x: 0, y: 0, active: false, lastMoved: 0};

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];
var directions = ["l", "r", "ul", "ur", "dl", "dr"]
var directionsClockwise = ["r", "dr", "dl", "l", "ul", "ur"]
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
var standardDisplacement = .5
var partialTowardsCenter = .49
var fullTowardsCenter = .48
var smallAmount = 0
var farBeginning = 0
var slightlyClose = .95
//L
ownerBordersShape[0].moveTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement - smallAmount)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement + smallAmount)
ownerBordersShape[0].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
//R
ownerBordersShape[1].moveTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement - smallAmount)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement + smallAmount)
ownerBordersShape[1].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
//UL
ownerBordersShape[2].moveTo(0, hexagonSize)
ownerBordersShape[2].lineTo(hexagonSize * farBeginning, hexagonSize * slightlyClose)
ownerBordersShape[2].lineTo(0, hexagonSize * slightlyClose)
ownerBordersShape[2].lineTo(-Math.sqrt(3) * hexagonSize * fullTowardsCenter, hexagonSize * standardDisplacement) 
ownerBordersShape[2].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement - smallAmount) 
ownerBordersShape[2].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
ownerBordersShape[2].lineTo(0, hexagonSize)
//UR
ownerBordersShape[3].moveTo(0, hexagonSize)
ownerBordersShape[3].lineTo(-hexagonSize * farBeginning, hexagonSize * slightlyClose)
ownerBordersShape[3].lineTo(0, hexagonSize * slightlyClose)
ownerBordersShape[3].lineTo(Math.sqrt(3) * hexagonSize * fullTowardsCenter, hexagonSize * standardDisplacement) 
ownerBordersShape[3].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement - smallAmount) 
ownerBordersShape[3].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
ownerBordersShape[3].lineTo(0, hexagonSize)
//DL
ownerBordersShape[4].moveTo(0, -hexagonSize)
ownerBordersShape[4].lineTo(hexagonSize * farBeginning, -hexagonSize * slightlyClose)
ownerBordersShape[4].lineTo(0, -hexagonSize * slightlyClose)
ownerBordersShape[4].lineTo(-Math.sqrt(3) * hexagonSize * fullTowardsCenter, -hexagonSize * standardDisplacement) 
ownerBordersShape[4].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement + smallAmount * 2) 
ownerBordersShape[4].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
ownerBordersShape[4].lineTo(0, -hexagonSize)
//DR
ownerBordersShape[5].moveTo(0, -hexagonSize)
ownerBordersShape[5].lineTo(-hexagonSize * farBeginning, -hexagonSize * slightlyClose)
ownerBordersShape[5].lineTo(0, -hexagonSize * slightlyClose)
ownerBordersShape[5].lineTo(Math.sqrt(3) * hexagonSize * fullTowardsCenter, -hexagonSize * standardDisplacement) 
ownerBordersShape[5].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement + smallAmount * 2) 
ownerBordersShape[5].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
ownerBordersShape[5].lineTo(0, -hexagonSize)

var ownerBorders = []
for(var i = 0; i < directions.length; i++){
    ownerBorders[i] = new THREE.Mesh( 
        new THREE.ExtrudeBufferGeometry(ownerBordersShape[i], { depth: .08, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: .05, bevelThickness: .05 }),
        new THREE.MeshLambertMaterial({color: "#050505" }) 
    );
}
 
document.oncontextmenu = cancelContextMenu = function(e) {
    if (e && e.stopPropagation)
      e.stopPropagation();
 
     return false;
}


var keys = {
    87: {keydown: function(){}, keyup: function(){}, active: false}, // up
    83: {keydown: function(){}, keyup: function(){}, active: false}, // down
    65: {keydown: function(){}, keyup: function(){}, active: false}, // left
    68: {keydown: function(){}, keyup: function(){}, active: false},  // right
    13: {keydown: function(){players[0].endTurn()}, keyup: function(){}, active: false}  
}

$(document).on("dragstart", function(e) {
    if (e.target.nodeName.toUpperCase() == "IMG") {
        return false;
    }
});

var dontHideReachable = false
window.addEventListener('mousemove', function (eventData) {
    cursor.y = eventData.pageY;
    cursor.x = eventData.pageX;	
    cursor.lastMoved = 0;

    if(cursor.active){
        mapOffset.x += eventData.movementX / 100
        if(mapOffset.x < 0){
            mapOffset.x = maxOffsetX
        }
        mapOffset.y -= eventData.movementY / 100
    }

    cameraMove()
    dontHideReachable = true
    
    mouseVector.x = ( eventData.clientX / window.innerWidth ) * 2 - 1;
	mouseVector.y = - ( (eventData.clientY - 5) / window.innerHeight ) * 2 + 1;
});

window.addEventListener('mousedown', function (eventData) {
    if (eventData.which === 1) { //left
        if(renderer.domElement.matches(':hover')){
            cursor.active = true;
            dontHideReachable = false
        }
    }
})

$(document).mouseleave(function () {
    cursor.active = false
});

$("body").mouseup(function(eventData) {
    if(renderer.domElement.matches(':hover')){
        if (eventData.which === 1) { //left
            cursor.active = false;
        
            if(!dontHideReachable){
                document.getElementById("city-production").style.right = "-400px"
                activeUnit = undefined
                document.getElementById("unitactions").style.right = "-500px"
                hideReachable()

                if((activeSelection == 0 || activeSelection == 1) 
                && (activeSelection == 1 || !activeTile.developed)
                && (activeSelection == 0 || activeTile.features.includes(features.forest) || activeTile.features.includes(features.savanna)) 
                && activeSettlement.tiles.includes(activeTile) 
                && activeTile.determineDevelopment()){
                    activeSettlement.producible[activeSelection].target = activeTile
                    activeSettlement.setProduction(activeSelection)
                    activeSelection = undefined
                    activeSettlement.select("working")
                }

                if(activeSettlement != undefined && 
                    (hoveredUnit != undefined || (activeTile != undefined && activeTile.player != activeSettlement.player))){
                    activeSettlement.deselect()
                }
            }
        
            if(hoveredUnit != undefined && hoveredUnit.determineReachable().length > 0){
                hoveredUnit.select()
            }
        } else if(eventData.which === 3){ //right
            if(activeTile != undefined && activeTile.reachableOverlay != undefined && activeTile != tiles[activeUnit.pos.x][activeUnit.pos.y]){
                if(activeUnit.disabled){
                    activeUnit.activate()
                }
                activeUnit.move(activeTile.position, activeTile.reachableOverlay.reachableDistance)
            }

            if(activeSettlement != undefined){
                activeSettlement.deselect()
            }
        } else { //midle
    
        }
    }
})

document.body.addEventListener('wheel',function(event){
    if(renderer.domElement.matches(':hover')){
        camera.position.z += event.deltaY / 5
        if(camera.position.z > minimumScrollOut){
            camera.position.z = minimumScrollOut
        } else if(camera.position.z < minimumScrollIn){
            camera.position.z = minimumScrollIn
        }
        if(activeSettlement == undefined){
            camera.rotation.x = cameraRotationBase * (1 - (camera.position.z - minimumScrollIn) / (minimumScrollOut - minimumScrollIn))
        }
        return false; 
    }
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

function nearby(tile, distance){
    var final = [tile]
    var lastSet = [tile]

    for(var i = 0; i < distance; i++){
        var nextSet = []
        for(var e = 0; e < lastSet.length; e++){
            for(var d = 0; d < directions.length; d++){
                if(!final.includes(t(lastSet[e], directions[d]))){
                    final.push(t(lastSet[e], directions[d]))
                    nextSet.push(t(lastSet[e], directions[d]))
                }
            }
        }
        lastSet = nextSet
    }

    return final
}

function randomTile(){
    return randomValue(randomValue(tiles))
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
    for (y = 0; y < 6 - number.toString().length; y++) {
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

var yieldsAlpha = []
for(var i = 0; i < 5; i++){
    yieldsAlpha.push(new THREE.TextureLoader().load("yields/alpha_" + (i + 1) + ".png"))
}    
var yieldScale = .3
var yieldWidth = yieldScale
class Yield{
    constructor(name){
        this.name = name
        
        this.yieldIcons = []
        for(var i = 0; i < 5; i++){
            this.yieldIcons.push( new THREE.Sprite( 
                new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("yields/" + this.name.toLowerCase() + "_" + (i + 1) + ".png"), 
                                             alphaMap: yieldsAlpha[i], transparent: true, depthTest: false}) 
            )) 
            this.yieldIcons[i].scale.set(yieldScale, yieldScale, yieldScale)
        }
    }
}

var yields = {
    food: new Yield("Food"),
    production: new Yield("Production"),
    science: new Yield("Science"),
    gold: new Yield("Gold")
}

class Terrain{
    constructor(name, texture, yields){
        this.name = name
        this.textureFilename = texture
        this.texture = new THREE.TextureLoader().load(texture)
        this.material = new THREE.MeshLambertMaterial( { alphaMap: hexagonAlpha, transparent: true, depthWrite: false, map: this.texture } )
        this.materialDark = new THREE.MeshLambertMaterial( { alphaMap: hexagonAlpha, color: "#555", transparent: true, depthWrite: false, map: this.texture } )
        this.yields = yields
    }
}
var terrainAlpha = new THREE.TextureLoader().load("terrain/alpha.png");
var riverMaterial =  new THREE.MeshLambertMaterial( { 
    alphaMap: new THREE.TextureLoader().load("terrain/river_alpha.png"), 
    map: new THREE.TextureLoader().load("terrain/river.png"), 
    transparent: true, depthWrite: false,  side: THREE.DoubleSide } )
var roadMaterial =  new THREE.MeshLambertMaterial( { 
    alphaMap: new THREE.TextureLoader().load("terrain/road_alpha.png"), 
    map: new THREE.TextureLoader().load("terrain/road.png"), 
    transparent: true, depthWrite: false,  side: THREE.DoubleSide } )

var terrainTypes = {
    grasslands: new Terrain("Grasslands", "terrain/grasslands.png", {food: 2}),
    grasslandsHills: new Terrain("Grasslands Hills", "terrain/grasslands-hills.png", {food: 2, production: 1}),
    plains: new Terrain("Plains", "terrain/plains.png", {food: 1, production: 1}),
    plainsHills: new Terrain("Plains Hills", "terrain/plains-hills.png", {food: 1, production: 2}),
    tundra: new Terrain("Tundra", "terrain/tundra.png", {food: 1}),
    tundraHills: new Terrain("Tundra Hills", "terrain/tundra-hills.png", {food: 1, production: 1}),
    tundraWetlands: new Terrain("Tundra Wetlands", "terrain/tundra-wetlands.png", {food: 2}),
    desert: new Terrain("Desert", "terrain/desert.png", {production: 1}),
    desertFloodplains: new Terrain("Desert Floodplains", "terrain/desert-floodplains.png", {food: 2, production: 1}),
    desertHills: new Terrain("Desert Hills", "terrain/desert-hills.png", {production: 2}),
    snow: new Terrain("Snow", "terrain/snow.png", {}),
    snowHills: new Terrain("Snow Hills", "terrain/snow-hills.png", {production: 1}),
    coast: new Terrain("Coast", "terrain/coast.png", {food: 1, gold: 1}),
    ocean: new Terrain("Ocean", "terrain/ocean.png", {}),
    lake: new Terrain("Lake", "terrain/lake.png", {food: 2}),
    ice: new Terrain("Ice", "terrain/ice.png", {})
}

var landTerrain = [terrainTypes.grasslands, terrainTypes.grasslandsHills, terrainTypes.plains, terrainTypes.plainsHills, terrainTypes.tundra, terrainTypes.tundraHills,
                   terrainTypes.desert, terrainTypes.desertFloodplains, terrainTypes.hills, terrainTypes.snow, terrainTypes.snowHills]

var seaTerrain = [terrainTypes.coast, terrainTypes.ocean, terrainTypes.lake, terrainTypes.ice]

var requirements = {
    forest: "forest",
    notForest: "notForest",
    hills: "hills",
    notHills: "notHills",
    land: "land",
    notLand: "notLand",
    desert: "desert",
    notDesert: "notDesert",
    tundra: "tundra",
    notTundra: "notTundra",
    snow: "snow",
    notSnow: "notSnow",
    standard: "standard",
    notStandard: "notStandard",
    coastal: "coastal",
    notCoastal: "notCoastal",
    savanna: "savanna",
    notSavanna: "notSavanna",
    river: "river",
    notRiver: "notRiver"
}

function testRequirements(tile, requirementsList){
    var confirm = true

    requirementsList.forEach(function(e){
        switch(e){
            case requirements.forest: confirm = !confirm ? false : (tile.features.includes(features.forest)); break;
            case requirements.notForest: confirm = !confirm ? false : (!tile.features.includes(features.forest)); break;
            case requirements.hills: confirm = !confirm ? false : (tile.terrain.name.includes("Hill")); break;
            case requirements.notHills: confirm = !confirm ? false : (!tile.terrain.name.includes("Hill")); break;
            case requirements.land: confirm = !confirm ? false : (landTerrain.includes(tile.terrain)); break;
            case requirements.notLand: confirm = !confirm ? false : (seaTerrain.includes(tile.terrain)); break;
            case requirements.desert: confirm = !confirm ? false : (tile.terrain.name.includes("Desert")); break;
            case requirements.notDesert: confirm = !confirm ? false : !(tile.terrain.name.includes("Desert")); break;
            case requirements.tundra: confirm = !confirm ? false : (tile.terrain.name.includes("Tundra")); break;
            case requirements.notTundra: confirm = !confirm ? false : !(tile.terrain.name.includes("Tundra")); break;
            case requirements.snow: confirm = !confirm ? false : (tile.terrain == terrainTypes.snow); break;
            case requirements.notSnow: confirm = !confirm ? false : (tile.terrain != terrainTypes.snow); break;
            case requirements.standard: confirm = !confirm ? false : (tile.terrain.name.includes("Plains") 
                                                                      || tile.terrain.name.includes("Grasslands")
                                                                      || tile.terrain.name.includes("Floodlands")
                                                                      || tile.terrain.name.includes("Wetlands")); break;
            case requirements.notStandard: confirm = !confirm ? false : !(tile.terrain.name.includes("Plains") 
                                                                      || tile.terrain.name.includes("Grasslands")
                                                                      || tile.terrain.name.includes("Floodlands")
                                                                      || tile.terrain.name.includes("Wetlands")); break;
            case requirements.coastal: confirm = !confirm ? false : (nearby(tile, 1).filter(x => x.terrain == terrainTypes.coast).length > 0); break;
            case requirements.notCoastal: confirm = !confirm ? false : !(nearby(tile, 1).filter(x => x.terrain == terrainTypes.coast).length > 0); break;
            case requirements.savanna: confirm = !confirm ? false : (tile.features.includes(features.savanna)); break;
            case requirements.notSavanna: confirm = !confirm ? false : (!tile.features.includes(features.savanna)); break;
            case requirements.river: confirm = !confirm ? false : (tile.river); break;
            case requirements.notRiver: confirm = !confirm ? false : (!tile.river); break;
        }
    })

    if(tile.features.includes(features.mountain) || tile.terrain == terrainTypes.ice){
        confirm = false
    }

    return confirm
}

class Development{
    constructor(name, yields){
        this.name = name
        this.yields = yields
    }
}

var developments = {
    farm: new Development("Farm", {food: 1}),
    plantation: new Development("Plantation", {gold: 1}),
    fishery: new Development("Fishery", {food: 1}),
    mine: new Development("Mine", {gold: 1}),
    quarry: new Development("Quarry", {production: 1}),
    pasture: new Development("Pasture", {food: 1}),
    reserve: new Development("Reserve", {gold: 1}),
    sawmill: new Development("Sawmill", {production: 1})
}

class Resource{
    constructor(name, development, yields, requirements){
        this.name = name
        this.yields = yields
        this.development = development
        this.requirements = requirements

        this.icon = new THREE.Sprite( 
            new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("resources/" + this.name.toLowerCase() + ".png"), 
                                      alphaMap: new THREE.TextureLoader().load("resources/" + this.name.toLowerCase() + "_alpha.png"),
                                      transparent: true, depthTest: false}) 
        )
        this.icon.scale.set(.45,.45,.45)
        this.icon.position.y = -.45
    }
}

var resources = {
	aggregate: new Resource("Aggregate"  , developments.quarry, {production: 2}, [requirements.notHills   , requirements.land])      ,
	//aluminum: new Resource(""          , {}             , [])                      ,
	amber: new Resource("amber"          , developments.sawmill, {gold: 3}      , [requirements.forest])   ,
	banana: new Resource("Banana"        , developments.plantation, {food: 2}      , [requirements.standard   , requirements.forest])    ,
	cattle: new Resource("Cattle"        , developments.pasture, {food: 2}      , [requirements.standard   , requirements.notForest]) ,
	cinnamon: new Resource("Cinnamon"    , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.notHills    , requirements.coastal])   ,
	citrus: new Resource("Citrus"        , developments.plantation, {food: 1}      , [requirements.standard   , requirements.notHills    , requirements.forest])    ,
	clams: new Resource("Clams"          , developments.fishery, {gold: 3}      , [requirements.notLand    , requirements.coastal])   ,
	cloves: new Resource("Cloves"        , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.notHills    , requirements.coastal])   ,
	coal: new Resource("Coal"            , developments.quarry, {production: 2}, [requirements.land])     ,
	cocoa: new Resource("Cocoa"          , developments.quarry, {gold: 3}      , [requirements.standard   , requirements.forest])    ,
	coffee: new Resource("Coffee"        , developments.plantation, {gold: 2       , production: 1}           , [requirements.standard   , requirements.forest])    ,
	copper: new Resource("Copper"        , developments.mine, {production: 2}, [requirements.land])     ,
	corn: new Resource("Corn"            , developments.farm, {food: 2}      , [requirements.standard   , requirements.notHills])  ,
	cotton: new Resource("Cotton"        , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.notHills])  ,
	crabs: new Resource("Crabs"          , developments.fishery, {gold: 2       , food: 1}                 , [requirements.notLand    , requirements.coastal])   ,
	deer: new Resource("Deer"            , developments.reserve, {gold: 2       , food: 1}                 , [requirements.forest     , requirements.notHill])   ,
	diamonds: new Resource("Diamonds"    , developments.mine, {gold: 4       , production: 1}           , [requirements.hills])    ,
	elephants: new Resource("Elephants"  , developments.reserve, {gold: 4       , food: 1}                 , [requirements.savanna])  ,
	fish: new Resource("Fish"            , developments.fishery, {food: 2}      , [requirements.notLand    , requirements.coastal])   ,
	furbearers: new Resource("Furbearers", developments.reserve, {gold: 2       , food: 1}                 , [requirements.forest])   ,
	gold: new Resource("Gold"            , developments.mine, {gold: 6}      , [requirements.hills])    ,
	grapes: new Resource("Grapes"        , developments.plantation, {gold: 2       , food: 1}                 , [requirements.standard   , requirements.notHills    , requirements.coastal]),
	guano: new Resource("Guano"          , developments.mine, {production: 1 , food: 1}                 , [requirements.notStandard, requirements.coastal     , requirements.land     , requirements.notForest]),
	gypsum: new Resource("Gypsum"        , developments.quarry, {gold: 2       , production: 1}           , [requirements.hills])    ,
	honeybees: new Resource("Honeybees"  , developments.pasture, {gold: 2       , food: 1}                 , [requirements.forest     , requirements.standard])  ,
	horse: new Resource("Horse"          , developments.pasture, {production: 2}, [requirements.standard   , requirements.notHills])  ,
	iron: new Resource("Iron"            , developments.mine, {production: 2}, [requirements.land])     ,
	jade: new Resource("Jade"            , developments.mine, {gold: 3}      , [requirements.hills])    ,
	latex: new Resource("Rubber"         , developments.plantation, {gold: 2       , production: 1}           , [requirements.forest     , requirements.standard])  ,
	marble: new Resource("Marble"        , developments.quarry, {gold: 3}      , [requirements.hills])    ,
	mercury: new Resource("Mercury"      , developments.mine, {gold: 3}      , [requirements.hills])    ,
	murex: new Resource("Murex"          , developments.fishery, {gold: 3}      , [requirements.notLand    , requirements.coastal])   ,
	nitre: new Resource("Nitre"          , developments.quarry, {production: 1 , food: 1}                 , [requirements.land])     ,
	//oil: new Resource("Oil"            , {production: 2}, [requirements.notForest]),
	olives: new Resource("Olives"        , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.notHills    , requirements.coastal])   ,
	pigs: new Resource("Pigs"            , developments.pasture, {food: 2}      , [requirements.notHills   , requirements.standard])  ,
	platinum: new Resource("Platinum"    , developments.mine, {production: 2 , gold: 1}                 , [requirements.land])     ,
	poppies: new Resource("Poppies"      , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.notHills])  ,
	potato: new Resource("Potato"        , developments.farm, {food: 2}      , [requirements.standard   , requirements.notHills])  ,
	rice: new Resource("Rice"            , developments.farm, {food: 2}      , [requirements.standard   , requirements.river])     ,
	sage: new Resource("Sage"            , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.notHills])  ,
	salt: new Resource("Salt"            , developments.mine, {gold: 1       , production: 2}           , [requirements.land       , requirements.notCoastal]),
	seaweed: new Resource("Seaweed"      , developments.fishery, {food: 2}      , [requirements.notLand    , requirements.coastal])   ,
	sheep: new Resource("Sheep"          , developments.pasture, {food: 2}      , [requirements.land       , requirements.notSnow])   ,
	silkworms: new Resource("Silkworms"  , developments.pasture, {gold: 3}      , [requirements.forest])   ,
	silver: new Resource("Silver"        , developments.mine, {gold: 2       , production: 1}           , [requirements.land])     ,
	spices: new Resource("Spices"        , developments.plantation, {gold: 3}      , [requirements.coastal    , requirements.land, requirements.notSnow, requirements.notTundra])      ,
	sugarcane: new Resource("Sugarcane"  , developments.plantation, {gold: 3}      , [requirements.land       , requirements.coastal     , requirements.notTundra   , requirements.notSnow]),
	tea: new Resource("Tea"              , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.coastal])   ,
	tobacco: new Resource("Tobacco"      , developments.plantation, {gold: 3}      , [requirements.standard   , requirements.coastal])   ,
	turtles: new Resource("Turtle"       , developments.fishery, {gold: 2       , food: 1}                 , [requirements.notLand    , requirements.coastal])   ,
	//uranium: new Resource("Uranium"    , {production: 2}, [requirements.land])     ,
	whales: new Resource("Whales"        , developments.fishery, {gold: 2       , food: 1}                 , [requirements.notLand    , requirements.coastal])   ,
	wheat: new Resource("Wheat"          , developments.farm, {food: 2}      , [requirements.standard]) ,
}

class Feature{
    constructor(name, filename, modelProperties){
        this.name = name
        this.modelProperties = modelProperties

        var me = this
        loader.load(filename, function ( gltf ) { 
            me.model = gltf.scene; 
            if(modelProperties.scale != undefined){
                me.model.scale.set(modelProperties.scale, modelProperties.scale, modelProperties.scale)
            }
            if(modelProperties.offsetX != undefined){
                me.model.position.x = modelProperties.offsetX
            }
            if(modelProperties.offsetY != undefined){
                me.model.position.y = modelProperties.offsetY
            }
            me.model.rotation.x = Math.PI / 2
            allModelsLoaded()
        }, function ( xhr ) {}, function ( error ) {});
    }
}

var features = {
    mountain: new Feature("Mountain", 'mountain.glb', {offsetZ: -.05, scale: .67}),
    forest: new Feature("Forest", 'lowpoly_forest.glb', {scale: .15}),
    mesa: new Feature("Mesa", 'mesa.glb', {offsetZ: -.05, scale: .6}),
    savanna: new Feature("Savanna", 'savanna.glb', {scale: .025})
}

var hexagonAlpha = new THREE.TextureLoader().load("terrain/alpha.png")
var hexagonGeometry = new THREE.PlaneBufferGeometry(Math.sqrt(3) * hexagonSize, 2.05 * hexagonSize, 1, 1)

var productionTileIcon = new THREE.Mesh(
    hexagonGeometry, new THREE.MeshBasicMaterial( { map:  new THREE.TextureLoader().load("construction.jpg"),  
                                                alphaMap: hexagonAlpha, transparent: true, opacity: .4, depthWrite: false } )
)
productionTileIcon.position.z = maxDepth + .02

var tileMeshGeometry =  new THREE.ExtrudeBufferGeometry(hexagonShape,  { depth: maxDepth, bevelEnabled: false } )
var tileMeshMaterial = new THREE.MeshLambertMaterial({color: "#050505"}) 
class Tile{
    constructor(position){
        this.position = position
        this.depth = 1
        this.river = false
        this.riverDirections = [false, false, false, false, false, false]
        this.road = false
        this.features = []
        this.developed = false
    }

    initialize(){
        this.added = false

        this.mesh = new THREE.Mesh(tileMeshGeometry, tileMeshMaterial);
        //scene.add(this.mesh)
        this.mesh.gamePosition = this.position

        this.face = new THREE.Mesh(hexagonGeometry);
        this.face.material = this.terrain.material

        this.mesh.add(this.face)
        var me = this

        this.riverMeshes = []
        if(this.river){
            for(var d = 0; d < directionsClockwise.length; d++){
                if(this.riverDirections[d]){
                    this.riverMeshes.push(new THREE.Mesh(hexagonGeometry, riverMaterial))
                    this.riverMeshes[this.riverMeshes.length - 1].rotation.z = -Math.PI / 3 * d
                }
            }

            this.riverMeshes.forEach(function(x){
                me.face.add(x);
                x.position.z = .01
            })
            if(this.riverMeshes.length == 0){
                this.river = false
            }
        }

        this.roadMeshes = []
        if(this.road){
            for(var d = 0; d < directionsClockwise.length; d++){
                if(t(this, directionsClockwise[d]).road){
                    this.roadMeshes.push(new THREE.Mesh(hexagonGeometry, roadMaterial))
                    this.roadMeshes[this.roadMeshes.length - 1].rotation.z = -Math.PI / 3 * d
                }
            }

            this.roadMeshes.forEach(function(x){
                me.face.add(x);
                x.position.z = .01
            })
            if(this.roadMeshes.length == 0){
                this.road = false
            }
        }

        this.featureMeshes = []
        this.features.forEach(function(f){
            me.featureMeshes.push(f.model.clone())
            me.mesh.add(me.featureMeshes[me.featureMeshes.length - 1])
            me.featureMeshes[me.featureMeshes.length - 1].position.z = maxDepth
            if(f.modelProperties.offsetZ != undefined){
                me.featureMeshes[me.featureMeshes.length - 1].position.z += f.modelProperties.offsetZ
            }
            me.featureMeshes[me.featureMeshes.length - 1].rotation.y = Math.random() * Math.PI * 2
        })

        if(this.resource != undefined){
            this.resourceIcon = this.resource.icon.clone()
            this.mesh.add(this.resourceIcon)
            this.resourceIcon.position.z = maxDepth + .03
        }

        this.face.position.z = maxDepth + .02

        this.calculateYields()
    }

    canSettle(){
        return nearby(this, 3).filter(x => x.settlement != undefined).length == 0
    }

    goto(){
        mapOffset.x = maxOffsetX + initialCameraOffsetX - (Math.sqrt(3) * hexagonSize * this.position.x)
        mapOffset.y = initialCameraOffsetY - (2.05 * .75 * hexagonSize * this.position.y) + (32 - camera.position.z) 
        cameraMove()
    }

    clearFeature(feature){
        this.mesh.remove(this.featureMeshes[this.features.indexOf(feature)])
        this.featureMeshes.splice(this.features.indexOf(feature), 1)
        this.features.splice(this.features.indexOf(features), 1)
        this.calculateYields()
    }

    clearAllFeatures(){
        for(var i = this.features.length - 1; i >= 0; i--){
           this.clearFeature(this.features[i])
        }
    }

    clearResource(){
        this.mesh.remove(this.resourceIcon)
        this.resourceIcon = undefined
        this.resource = undefined
        this.calculateYields()
    }

    clearDevelopment(){
        this.developed = false
        this.development = undefined
        this.mesh.remove(this.devModel)
        this.devModel = undefined
        this.calculateYields()
    }

    foundSettlement(){
        this.settlement = new Settlement(this.position, activePlayer)
        activePlayer.settlements.push(this.settlement)

        this.settlement.model.position.z = maxDepth

        this.switchOwnership(activePlayer) 
        for(var i = 0; i < directions.length; i++){
            t(this, directions[i]).switchOwnership(activePlayer)
            this.settlement.tiles.push(t(this, directions[i]))
        }

        this.settlement.label.position.z = maxDepth + 1.1
        this.mesh.add(this.settlement.label)

        this.clearAllFeatures()
        this.clearResource()
        this.calculateYields()
        activePlayer.detectSeen()
        activePlayer.updateNotifications()
    }

    strength(){
        var final = 0
        for(var i = 0; i < Object.keys(this.yields).length; i++){
            final += this.yields[Object.keys(this.yields)[i]]
        }
        return final
    }

    switchOwnership(player){

        this.player = player

        if(this.ownerOverlay == undefined){
            this.ownerOverlay = new THREE.Mesh(hexagonGeometry, this.player.overlayMaterial);
            this.ownerOverlay.gamePosition = this.position
            this.ownerOverlay.position.z = maxDepth + .025
            this.mesh.add(this.ownerOverlay)
        }

        calculateBorders()
    }

    getTooltip(){
        var final = this.terrain.name + " (" + this.position.x + "," + this.position.y + ")<br>" + (this.river ? "River<br>" : "")
        for(var i = 0; i < this.features.length; i++){
            final += this.features[i].name + "<br>"
        }
        final += this.resource == undefined ? "" : (this.resource.name + "<br>")
        if(this.developed){
            final += "Developed: " + this.development.name + "<br>"
        }
        return final
    }

    getString(){
        var finalString = ""
        finalString += this.position.x
        finalString += ","
        finalString += this.position.y
        finalString += ","
        finalString += this.depth
        finalString += ","
        finalString += this.river ? 1 : 0
        for(var d = 0; d < directions.length; d++){
            finalString += ","
            finalString += this.riverDirections[d] ? 1 : 0  
        }
        for(var d = 0; d < this.features.length; d++){
            finalString += ","
            finalString += this.features[d].name
        }
        return finalString
    }

    determineDevelopment(){
        var final
        if(this.terrain.name.includes("Hill")){
            final = developments.quarry
        }

        if([terrainTypes.grasslands, terrainTypes.plains, terrainTypes.desertFloodplains, terrainTypes.tundraWetlands].includes(this.terrain)){
            final = developments.farm
        }

        if(this.resource != undefined){
            final = this.resource.development
        }

        if(this.features.includes(features.forest)){
            final = developments.sawmill
        }

        if(this.features.includes(features.savanna)){
            final = developments.reserve
        }

        if(this.terrain == terrainTypes.coast){
            final = developments.fishery
        }

        if(final == undefined || this.features.includes(features.mountain)){
            final = false
        }

        return final
    }

    setDevelopment(){
        if(this.determineDevelopment()){
            this.development = this.determineDevelopment()
        } else {
            return
        }

        this.devModel = improvement.clone()
        this.devModel.scale.set(.005, .005, .005)
        this.devModel.rotation.y = Math.random() * Math.PI * 2
        this.mesh.add(this.devModel)
        this.devModel.position.z = maxDepth

        this.developed = true

        tiles.forEach(x => x.forEach(y => y.calculateYields()))
    }

    calculateYields(){
        var me = this
        if(this.yieldIcons != undefined){
            this.yieldIcons.forEach(function(x){me.mesh.remove(x); x = undefined})
        }
        this.yieldIcons = []

        this.yields = Object.assign({}, this.terrain.yields)
        if(this.features.includes(features.forest)){
           this.yields = addYields(this.yields, {production: 1})
        }
        if(this.features.includes(features.savanna)){
            this.yields = addYields(this.yields, {food: 1})
        }
        if(this.river){
            this.yields = addYields(this.yields, {food: 1})
        }

        if(this.determineDevelopment() && this.developed && this.development != this.determineDevelopment()){
            this.development = this.determineDevelopment()
        } else if(this.developed){
            this.clearDevelopment
        }

        if(this.developed){
            this.yields = addYields(this.yields, this.development.yields)
        }

        if(this.resource != undefined && this.resource.development == this.development){
            this.yields = addYields(this.yields, this.resource.yields)
        }

        if(this.features.includes(features.mountain) || this.features.includes(features.mesa) || this.settlement != undefined){
            this.yields = {}
        }

        for(var i = 0; i < Object.keys(this.yields).length; i++){
            this.yieldIcons.push(yields[Object.keys(this.yields)[i]].yieldIcons[Math.min(4, this.yields[Object.keys(this.yields)[i]] - 1)].clone())
            this.yieldIcons[i].position.z = maxDepth + .1
            this.mesh.add(this.yieldIcons[i])
            this.yieldIcons[i].position.x = yieldWidth * (i - ((Object.keys(this.yields).length - 1) / 2))
        }
    }
}

function addYields(y1, y2){
    var final = {}
    Object.keys(y1).forEach(x => final[x] = (final[x] == undefined) ? (y1[x]) : (final[x] + y1[x]))
    Object.keys(y2).forEach(x => final[x] = (final[x] == undefined) ? (y2[x]) : (final[x] + y2[x]))
    return final
}

var overlayMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF, alphaMap: hexagonAlpha, transparent: true, opacity: reachableOverlayOpacity, depthWrite: false } )
var reachableIsRendered = false
function renderReachable(unit){
    hideReachable()
    
    var reachable = unit.determineReachable()
    reachableIsRendered = true

    if(reachable.length > 1){
        reachable.forEach(function(e){
            e.tile.reachableOverlay = new THREE.Mesh(hexagonGeometry, overlayMaterial)
            e.tile.reachableOverlay.reachablePos = e.tile.position
            e.tile.reachableOverlay.reachableDistance = e.distance
            e.tile.reachableOverlay.position.z = maxDepth + .05
            e.tile.mesh.add(e.tile.reachableOverlay)
        })
    }
}

function hideReachable(){
    if(!modelsLoaded){
        return
    }

    reachableIsRendered = false
    tiles.forEach(z => z.forEach(function(e){
        e.mesh.remove(e.reachableOverlay)
        e.reachableOverlay = undefined
    }))
    renderer.renderLists.dispose();
}

class Notification{
    constructor(name, filename, criteria, click){
        this.name = name
        this.icon = document.createElement("DIV")
        this.iconIMG = document.createElement("IMG")
        this.iconIMG.src = filename
        this.icon.appendChild(this.iconIMG)
        this.criteria = criteria
        this.icon.onclick = click
        this.click = click
    }
}

var notifications = [
    new Notification("City Production", "notifications/production.png", function(p){
        return p.settlements.filter(x => x.producingID == undefined).length > 0
    }, function(){
        activePlayer.settlements.filter(x => x.producingID == undefined)[0].displayProduction()
        activePlayer.settlements.filter(x => x.producingID == undefined)[0].tile.goto()
    }), new Notification("Unit Movement", "notifications/unit.png", function(p){
        return p.units.filter(x => !x.disabled).length > 0
    }, function(){
        var targetUnit = activePlayer.units.filter(x => !x.disabled)[0]

        if(activePlayer.units.filter(x => !x.disabled).includes(activeUnit)){
            targetUnit = activePlayer.units.filter(x => !x.disabled)[(activePlayer.units.filter(x => !x.disabled).indexOf(activeUnit) + 1) % activePlayer.units.filter(x => !x.disabled).length]
        }

        targetUnit.tile().goto()
        targetUnit.select()
    })
]

class Action{
    constructor(name, filename, func){
        this.name = name
        this.icon = document.createElement("DIV")
        this.iconImage = document.createElement("IMG")
        this.iconImage.setAttribute("draggable", "false");
        this.iconImage.src = "actions/" + filename
        this.icon.onclick = func
        this.icon.action = this
        this.icon.appendChild(this.iconImage)
    }
}

var actions = {
    wait: new Action("Wait", "wait.png",function(){
        if(activeUnit != undefined){
            activeUnit.wait()
        }
    }),
    sleep: new Action("Sleep", "sleep.png", function(){
        if(activeUnit != undefined){
            activeUnit.sleep()
        }
    }),
    wakeUp: new Action("Wake Up", "wake.png", function(){
        if(activeUnit != undefined){
            activeUnit.wakeUp()
        }
    }),
    settle: new Action("Settle", "settle.png", function(){
        if(activeUnit != undefined && activeUnit.determineReachable().length > 1){
            activeUnit.foundSettlement()
        }
    }),
    move: new Action("Move", "move.png", function(){
        if(activeUnit != undefined){
            activeUnit.moveButton()
        }
    })
}

class UnitClass{
    constructor(name, canMoveInOcean, actionsUnit){
        this.name = name
        this.actions = actionsUnit
        this.canMoveInOcean = canMoveInOcean

        this.actions.push(actions.wait)
        this.actions.push(actions.move)
        this.actions.push(actions.wakeUp)
        this.actions.push(actions.sleep)
    }
}

var unitClasses = {
    infantry: new UnitClass("Infantry", false, []),
    ship: new UnitClass("Ship", false, []),
    settler: new UnitClass("Settler", false, [actions.settle])
}

class UnitType{
    constructor(name, unitClass, filename){
        this.name = name
        this.unitClass = unitClass
        this.texture = new THREE.TextureLoader().load( 'uniticons/' + filename );
    }
}

var unitTypes = {
    infantry: new UnitType("Infantry", unitClasses.infantry, "infantry.png"),
    sea: new UnitType("Sea", unitClasses.ship, "sea.png"),
    settler: new UnitType("Settler", unitClasses.settler, "settler.png")
}

var unitIconAlpha = new THREE.TextureLoader().load( 'uniticons/alpha.png' );

class Unit{
    constructor(type, player, pos){
        this.type = type
        this.pos = pos
        this.player = player
        this.movementRemaining = 0
        this.asleep = false

        this.icon = new THREE.Sprite(new THREE.SpriteMaterial( 
            { map: this.type.texture, alphaMap: unitIconAlpha, side: THREE.DoubleSide, transparent: true, depthTest: false, depthFunc: THREE.AlwaysDepth } ));
        scene.add(this.icon)
        this.icon.scale.set(.65, .65, .65)      

        this.actionIcons = []
        var me = this
        this.type.unitClass.actions.forEach(function(x){
            me.actionIcons.push(x.icon)
        })

        this.resetTurn()
    }

    select(){
        activeUnit = this
        this.updateActions()
        renderReachable(this)
    }

    sleep(){
        this.asleep = true
        this.disactivate()
    }
    
    wakeUp(){
        this.asleep = false
        if(this.determineReachable().length > 1){
            this.activate()
        }
        this.updateActions()
    }

    foundSettlement(){
        if(this.tile().canSettle()){
            this.tile().foundSettlement()
            this.die()
        }
    }

    moveButton(){
        if(reachableIsRendered){
            hideReachable()
        } else {
            renderReachable(this)
        }
    }

    wait(){
        activeUnit.disactivate()
        hideReachable()
    }

    updateActions(){
        document.getElementById("unitactions").innerHTML = ""
        document.getElementById("unitactions").style.right = "0"
        var me = this
        this.actionIcons.forEach(function(e){
            if((me.asleep && e.action == actions.sleep)
            || (!me.asleep && e.action == actions.wakeUp)){
                return
            }

            var makeInactive = false
            switch(e.action){
                case actions.move: makeInactive = me.determineReachable().length == 1; break;
                case actions.settle: makeInactive = !me.tile().canSettle() || me.determineReachable().length == 1; break;
                case actions.wait: makeInactive = me.disabled; break;
            }
            if(makeInactive){
                e.setAttribute("inactive", "true")
            } else {
                e.setAttribute("inactive", "false")
            }
            document.getElementById("unitactions").appendChild(e)
        })
    }

    die(){
        if(this == activeUnit){
            activeUnit = undefined
            document.getElementById("unitactions").style.right = "-500px"
            hideReachable()
        }
        scene.remove(this.icon)
        this.icon = undefined
        this.player.units.splice(this.player.units.indexOf(this), 1)
    }

    tile(){
        return tiles[this.pos.x][this.pos.y]
    }

    movementCost(tile, origin){
        var final = 1

        if(this.type.unitClass.ocean){
            if(tile.terrain == terrainTypes.coast){
                final += 0
            }
            if(tile.terrain == terrainTypes.ocean){
                final += .5
            }
        } else{
            if(tile.terrain == terrainTypes.coast){
                final += 100
            }
            if(tile.terrain == terrainTypes.ocean){
                final = 100
            }
        }

        if(tile.terrain == terrainTypes.ice){
            final = 100
        }

        if(tile.features == undefined || tile.features.includes(features.mountain) || tile.features.includes(features.mesa)){
            final = 100
        }

        if(tile.terrain.name.includes("Hills")){
            final += .5
        }

        if(tile.features.includes(features.forest)){
            final += .5
        }

        if(!tile.river && origin.river){
            final += .5
        }

        return final
    }

    determineReachable(){
        var visited = [{tile: tiles[this.pos.x][this.pos.y], distance: 0}]
        var fringes = []
        fringes.push([{tile: tiles[this.pos.x][this.pos.y], distance: 0}])

        var me = this

        for(var i = 0; i < me.movementRemaining; i++){
            fringes.push([])
            fringes[i].forEach(function(e){
                for(var d = 0; d < directions.length; d++){
                    var neighbor = t(e.tile, directions[d])
                    if(e.distance + me.movementCost(neighbor, e.tile) <= me.movementRemaining){
                        var sameTiles = visited.filter(y => y.tile.position.x == neighbor.position.x && y.tile.position.y == neighbor.position.y)
                        if(sameTiles.length == 0){
                            visited.push({tile: neighbor, distance: e.distance + me.movementCost(neighbor, e.tile)})
                            fringes[i + 1].push({tile: neighbor, distance: e.distance + me.movementCost(neighbor, e.tile)})
                        } else if(sameTiles[0].distance > e.distance + me.movementCost(neighbor, e.tile)) {
                            sameTiles[0].distance = e.distance + me.movementCost(neighbor, e.tile)
                            fringes[i + 1].push({tile: neighbor, distance: e.distance + me.movementCost(neighbor, e.tile)})
                        }
                    }
                }
            })
        }

        return visited
    }

    disactivate(){
        this.disabled = true
        this.icon.material.opacity = .5
        if(this == activeUnit){
            hideReachable()
            activeUnit = undefined
            document.getElementById("unitactions").style.right = "-500px"
        }
        activePlayer.updateNotifications()
    }

    activate(){
        this.icon.material.opacity = .9
        this.disabled = false
        activePlayer.updateNotifications()
    }

    resetTurn(){
        if(!this.asleep){
            this.activate()
        }
        this.movementRemaining = 2
    }

    move(tile, cost){
        this.pos = tile
        this.movementRemaining -= cost

        cameraMove()
        this.player.detectSeen()

        hideReachable()
        this.wakeUp()
        if(this.determineReachable().length <= 1){
            this.disactivate()
        } else {
            renderReachable(this)
        }
        this.updateActions()
    }

    getTooltip(){
        var tooltipDiv = document.createElement("DIV")
        tooltipDiv.innerHTML += this.type.name
        return tooltipDiv
    }
}

class Player{
    constructor(){
        this.units = [] 
        this.settlements = []
        this.color = "#" + decimalToHexString(Math.ceil(16777215 * Math.random())) 
        this.borderColor = new THREE.Color(adjustBrightness(this.color, 5))
        this.color = new THREE.Color(this.color)
        this.seen = []

        this.overlayMaterial = new THREE.MeshBasicMaterial( { color: this.color,
             alphaMap: hexagonAlpha, transparent: true, opacity: ownerOverlayOpacity, depthWrite: false } )
    }
    
    updateNotifications(){
        var me = this
        this.notificationsRemaining = []
        document.getElementById("notifications").innerHTML = ""
        notifications.forEach(function(n){
            if(n.criteria(me)){
                if(me.notificationsRemaining.length == 0){
                    document.getElementById("nextturn-cover").src = n.iconIMG.src
                } else {
                    document.getElementById("notifications").appendChild(n.icon)
                }
                me.notificationsRemaining.push(n)
            }
        })

        if(me.notificationsRemaining.length == 0){
            document.getElementById("nextturn").style.backgroundImage = "url('nextturn-back.png')"
            document.getElementById("nextturn-cover").style.display = "none"
        } else {
            document.getElementById("nextturn").style.backgroundImage = ""
            document.getElementById("nextturn-cover").style.display = ""
        }
    }

    beginTurn(){
        this.settlements.forEach(x => x.beginTurn())
        this.updateNotifications()
    }

    endTurn(){
        activeUnit = undefined
        document.getElementById("unitactions").style.right = "-500px"
        hideReachable()
        this.units.forEach(x => x.resetTurn())
        activePlayer = players[(players.indexOf(activePlayer) + 1) % players.length]
        activePlayer.beginTurn()
        if(activeSettlement != undefined){
            activeSettlement.deselect()
        }
    }

    detectSeen(){
        this.seen = []
        var me = this
        this.units.forEach(function(e){
            nearby(e.tile(), 2).forEach(function(x){
                if(!me.seen.includes(x)){
                    me.seen.push(x)
                }
            })
        })
        this.settlements.forEach(function(e){
            nearby(e.tile, 4).forEach(function(x){
                if(!me.seen.includes(x)){
                    me.seen.push(x)
                }
            })
        })

        if(this == players[0]){
            tiles.forEach(x => x.forEach(function(e){
                if(me.seen.includes(e)){
                    e.face.material = e.terrain.material
                    if(!e.added){
                        scene.add(e.mesh)
                    }
                } else {
                    e.face.material = e.terrain.materialDark
                }
            }))
        }
    }
}
var players = [new Player()]
activePlayer = players[0]

var producibleTypes = {
    develop: "develop",
    clear: "clear",
    unit: "unit"
}

function clearSelection(){
    if(activeSelection != undefined){
        activeSelection = undefined
        activeSettlement.select("working")
    }
}

var activeSelection = undefined
class Settlement{
    constructor(pos, player){
        this.position = pos
        this.tile = tiles[pos.x][pos.y]
        this.player = player

        this.model = settlement.clone()
        this.model.scale.set(.0025, .0025, .0025)
        this.model.rotation.y = Math.random() * Math.PI * 2
        tiles[this.position.x][this.position.y].mesh.add(this.model)

        this.labelDIV = document.createElement("DIV")
        this.labelDIV.className = "city-label"

        this.labelLeftCircle = document.createElement("div")
        this.labelLeftCircle.className = "city-label-left-circle"
        this.labelDIV.appendChild(this.labelLeftCircle)

        this.labelLeftBar = document.createElement("DIV")
        this.labelLeftBar.className = "city-label-left-bar"
        this.labelLeftCircle.appendChild(this.labelLeftBar)
        this.labelLeftBar.style.transform = "translate(-50%, -50%) rotate(" + (Math.PI * Math.random()) + "rad)"

        this.labelPop = document.createElement("DIV")
        this.labelPop.innerHTML = 2
        this.labelPop.className = "city-label-pop"
        this.labelDIV.appendChild(this.labelPop)

        this.labelRightCircle = document.createElement("div")
        this.labelRightCircle.className = "city-label-right-circle"
        this.labelDIV.appendChild(this.labelRightCircle)

        this.labelRightBar = document.createElement("DIV")
        this.labelRightBar.className = "city-label-right-bar"
        this.labelRightCircle.appendChild(this.labelRightBar)

        this.labelProd = document.createElement("DIV")
        this.labelProd.className = "city-label-prod"
        this.labelDIV.appendChild(this.labelProd)

        this.labelProdImage = document.createElement("IMG")
        this.labelProdImage.src = "unknown.png"
        this.labelProd.appendChild(this.labelProdImage)

        this.labelName = document.createElement("DIV")
        this.labelName.innerHTML = "SETTLEMENT"
        this.labelName.className = "city-label-name"
        this.labelDIV.appendChild(this.labelName)

        var me = this
        this.labelName.onclick = function(){
            if(me != activeSettlement){
                me.select("working")
            }
        }

        this.labelProd.onclick = function(){
            me.displayProduction()
        }

        this.label = new THREE.CSS2DObject(this.labelDIV)

        this.population = 2
        this.tiles = []
        this.yields = {}
        this.heldProduction = 0

        this.producible = []
        this.producible[0] = {type: producibleTypes.develop, name: "Develop Tile", progress: 0}
        this.producible[1] = {type: producibleTypes.clear, name: "Clear Feature", progress: 0}
        Object.keys(unitTypes).forEach(function(e){
            me.producible.push({type: producibleTypes.unit, unit: unitTypes[e], name: unitTypes[e].name, progress: 0})
        })
        this.producingID = undefined
        this.incrementProduction(0)
    }

    beginTurn(){
        this.calculateYields()
        this.yields = addYields({production: 1, food: 1}, this.yields)
        this.incrementProduction(this.yields.production)
    }

    updateProducible(){
        this.producible.forEach(function(e){
            switch(e.type){
                case producibleTypes.clear: e.image = "actions/clear.png"; break;
                case producibleTypes.develop: e.image = "actions/build.png"; break;
                case producibleTypes.unit: e.image = "unitIcons/prod_" + e.name + ".png"; break;
            }
            e.cost = 30
        })
    }

    displayProduction(){
        this.updateProducible()

        document.getElementById("city-production-items").innerHTML = ""
        document.getElementById("city-production").style.right = 0
        var me = this

        this.items = []
        this.producible.forEach(function(e, index){
            switch(e.type){
                case producibleTypes.clear: if(me.tiles.filter(x => x.features.includes(features.forest) || x.features.includes(features.savanna)).length == 0){return}; break;
                case producibleTypes.develop: if(me.tiles.filter(x => !x.developed && x.determineDevelopment()).length == 0){return}; break;
            }

            var item = document.createElement("DIV")
            item.className = "city-production-item"
            if(index == me.producingID){
                item.className = "city-production-item city-production-item-selected"
            }

            var itemImage = document.createElement("DIV")
            itemImage.className = "city-production-item-image"
            var itemImageIMG = document.createElement("IMG")
            itemImageIMG.src = e.image
            itemImage.appendChild(itemImageIMG)
            item.appendChild(itemImage)

            if(e.type == producibleTypes.unit){
                itemImageIMG.className = "invert"
            }

            var itemDetails = document.createElement("DIV")
            itemDetails.className = "city-production-item-details"
            var itemDetailsName = document.createElement("DIV")
            itemDetailsName.className = "city-production-item-name"
            itemDetailsName.innerHTML = e.name
            var itemDetailsCost = document.createElement("DIV")
            itemDetailsCost.className = "city-production-item-cost"
            var itemDetailsCostSpan = document.createElement("SPAN")
            itemDetailsCostSpan.innerHTML = ((e.progress != 0) ? (e.progress + " / ") : ("")) + e.cost + " "
            var itemDetailsCostImage = document.createElement("IMG")
            itemDetailsCostImage.src = "yields/production_5.png"
            itemDetailsCost.appendChild(itemDetailsCostSpan)
            itemDetailsCost.appendChild(itemDetailsCostImage)
            itemDetails.appendChild(itemDetailsName)
            itemDetails.appendChild(itemDetailsCost)
            item.appendChild(itemDetails)

            item.id = index
            item.onclick = function(){
                if(this.id == "0" || this.id == "1"){
                    me.producingID = undefined
                    me.labelProdImage.src = "unknown.png"
                    me.labelRightBar.style.transform = "translate(-50%, -50%) rotate(0rad)"
                    me.select(this.id == "0" ? "develop" : "clear")
                    activeSelection = Number(this.id)
                    me.items.forEach(function(x){
                        x.className = "city-production-item"
                    })
                    this.className = "city-production-item city-production-item-active"
                } else {
                    me.setProduction(Number(this.id))
                    document.getElementById("city-production").style.right = "-400px"
                }
            }

            document.getElementById("city-production-items").appendChild(item)
            me.items.push(item)
        })
    }

    incrementProduction(amount){
        if(this.producingID != undefined){
            var cost = this.producible[this.producingID].cost
            if(this.producible[this.producingID].progress + amount >= cost){
                this.heldProduction = this.producible[this.producingID].progress + amount - cost
                this.producible[this.producingID].progress = 0
                switch(this.producible[this.producingID].type){
                    case producibleTypes.develop: this.producible[this.producingID].target.setDevelopment(); break;
                    case producibleTypes.clear: this.producible[this.producingID].target.clearAllFeatures(); break;
                    case producibleTypes.unit: this.player.units.push(new Unit(this.producible[this.producingID].unit, this.player, this.tile.position))
                }
                this.producingID = undefined
                this.labelProdImage.src = "unknown.png"
            } else {
                this.producible[this.producingID].progress += amount
            }
        } else {
            this.heldProduction += amount
        }

        if(this.producingID != undefined){
            this.labelRightBar.style.transform = "translate(-50%, -50%) rotate(-" + (Math.PI * this.producible[this.producingID].progress / cost) + "rad)"
        } else {
            this.labelRightBar.style.transform = "translate(-50%, -50%) rotate(0rad)"
        }
    }

    setProduction(id){
        this.producingID = id
        this.labelProdImage.src = this.producible[id].image
        if(this.heldProduction > 0){
            var held = this.heldProduction
            this.heldProduction = 0
            this.incrementProduction(held)
        } else {
            this.incrementProduction(0)
        }
        activePlayer.updateNotifications()
    }

    calculateYields(){
        this.tiles.forEach(x => x.worked = false)
        this.yields = {}

        this.tiles.forEach(x => x.calculateYields())
        var compareStrength = this.tiles.sort(function(x,y){return y.strength() - x.strength()})
        for(var i = 0; i < this.population && i < compareStrength.length; i++){
            compareStrength[i].worked = true
            this.yields = addYields(this.yields, compareStrength[i].yields)
        }

    }

    showDevelopEligible(){
        this.hideWorked()

        var me = this
        this.tiles.forEach(function(e){
            if(!e.developed && e.determineDevelopment()){
                e.developIcon = developIcon.clone()
                e.developIcon.position.z = maxDepth + .1
                e.mesh.add(e.developIcon)
            }
        })
    }

    showClearEligible(){
        this.hideWorked()

        var me = this
        this.tiles.forEach(function(e){
            if(e.features.includes(features.forest) || e.features.includes(features.savanna)){
                e.clearIcon = clearIcon.clone()
                e.clearIcon.position.z = maxDepth + .1
                e.mesh.add(e.clearIcon)
            }
        })
    }

    showWorked(){
        this.hideWorked()

        var me = this
        this.tiles.forEach(function(e){
            if(Object.keys(e.yields).length != 0){
                if(e.worked){
                    e.workedIcon = workedIcon.clone()
                } else {
                    e.workedIcon = unworkedIcon.clone()
                } 
                e.workedIcon.position.z = maxDepth + .1
                e.mesh.add(e.workedIcon)
            }
        })
    }

    hideWorked(){
        this.tiles.forEach(function(e){
            if(e.workedIcon != undefined){
                e.mesh.remove(e.workedIcon)
                e.workedIcon = undefined
            }

            if(e.developIcon != undefined){
                e.mesh.remove(e.developIcon)
                e.developIcon = undefined
            }

            if(e.clearIcon != undefined){
                e.mesh.remove(e.clearIcon)
                e.clearIcon = undefined
            }
        })
    }

    select(view){
        if(activeSettlement != undefined && activeSettlement != this){
            activeSettlement.deselect(true)
        }
        mapOffset.x = maxOffsetX + initialCameraOffsetX - (Math.sqrt(3) * hexagonSize * this.position.x)
        mapOffset.y = initialCameraOffsetY - (2.05 * .75 * hexagonSize * this.position.y) + 2
        camera.rotation.x = 0
        activeSettlement = this
        this.calculateYields()
        
        switch(view){
            case "working": this.showWorked(); break;
            case "develop": this.showDevelopEligible(); break;
            case "clear": this.showClearEligible(); break;
        }

        var me = this
        tiles.forEach(x => x.forEach(function(e){
            if(me.tiles.includes(e) && (view != "develop" || e.developIcon != undefined) && (view != "clear" || e.clearIcon != undefined)){
                e.face.material = e.terrain.material
            } else {
                e.face.material = e.terrain.materialDark
            }
            if(e.productionTileIcon != undefined){
                e.mesh.remove(e.productionTileIcon)
                e.productionTileIcon = undefined
            }
        }))

        if(this.producingID != undefined && this.producible[this.producingID].target != undefined){
            this.producible[this.producingID].target.productionTileIcon = productionTileIcon.clone()
            this.producible[this.producingID].target.mesh.add(this.producible[this.producingID].target.productionTileIcon)
        }
    }

    deselect(reselecting){
        if(this == activeSettlement){
            this.hideWorked()
            activeSettlement = undefined
            activeSelection = undefined
            document.getElementById("city-production").style.right = "-400px"
            camera.rotation.x = cameraRotationBase * (1 - (camera.position.z - minimumScrollIn) / (minimumScrollOut - minimumScrollIn))
            
            if(!reselecting){
                this.tile.goto()
            }

            var me = this
            tiles.forEach(x => x.forEach(function(e){
                if(me.player.seen.includes(e)){
                    e.face.material = e.terrain.material
                } else {
                    e.face.material = e.terrain.materialDark
                }
                if(e.productionTileIcon != undefined){
                    e.mesh.remove(e.productionTileIcon)
                    e.productionTileIcon = undefined
                }
            }))
        }
    }
}

var workedIcon =  new THREE.Sprite( 
    new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("worked.png"), alphaMap: new THREE.TextureLoader().load("workedAlpha.png"), transparent: true, depthTest: false })
) 

var unworkedIcon =  new THREE.Sprite( 
    new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("unworked.png"), alphaMap: new THREE.TextureLoader().load("workedAlpha.png"), transparent: true, depthTest: false })
) 

var developIcon = new THREE.Sprite( 
    new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("actions/build.png"), 
    alphaMap: new THREE.TextureLoader().load("actions/build_alpha.png"), transparent: true, depthTest: false })
) 

var clearIcon = new THREE.Sprite( 
    new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("actions/clear.png"), 
    alphaMap: new THREE.TextureLoader().load("actions/clear_alpha.png"), transparent: true, depthTest: false })
) 

var tileIcons = [workedIcon, unworkedIcon, developIcon, clearIcon]
tileIcons.forEach(function(e){
    e.scale.set(.5, .5, .5)
    e.position.z = maxDepth + .3
    e.position.y = .6
})


var mapSizeX = 70
var mapSizeY = 50
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

    if(tiles[pos.x][pos.y].depth > maxDepth){
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

    for(var d = 0; d < directions.length; d++){
        if(Math.random() > chanceToContinue){
            setElevation(t(pos, directions[d]), noLoss[d] ? (length + lengthDecreaseAmount) : length)
        }
    }
}

function spreadTerrain(tile, terrain, length){
    tile.terrain = terrain

    for(var d = 0; d < directions.length; d++){
        if(length < ((terrain == terrainTypes.desert ? (maxSpreadTerrainDesert) : (maxSpreadTerrainPlains)) * Math.random()) + minimumSpreadTerrain 
        && t(tile, directions[d]).depth > 1 
        && !t(tile, directions[d]).terrain.name.includes("Tundra")
        && !t(tile, directions[d]).terrain.name.includes("Snow")
        && t(tile, directions[d]).terrain != terrain){
            spreadTerrain(t(tile, directions[d]), terrain, length + 1)
        }
    }
}

function setRiver(tile){
    if(tile.river){
        return
    }

    var possibilities = []

    for(var d = 0; d < directionsClockwise.length; d++){
        if(t(tile, directionsClockwise[d]).depth < tile.depth 
            && !t(tile, directionsClockwise[d]).features.includes(features.mountain)
            && !t(tile, directionsClockwise[d]).features.includes(features.mesa)){
            possibilities.push({direction: d, tile: t(tile, directionsClockwise[d])})
        }
    }

    if((possibilities.length == 0 && tile.terrain != terrainTypes.coast && tile.terrain != terrainTypes.ocean && tile.terrain != terrainTypes.ice) 
    || tile.terrain == terrainTypes.snow){
        tile.terrain = terrainTypes.lake
        tile.depth = Math.max(1, tile.depth - .15)
        return false
    } else if(possibilities.length == 0){
        return false
    }

    var nextTile
    if(Math.random() < chanceToIgnoreDeepestTile){
        nextTile = randomValue(possibilities)
    } else {
        nextTile = possibilities.sort(function(x,y){return y.depth - x.depth})[0]
    }
    setRiver(nextTile.tile)
    nextTile.tile.riverDirections[(nextTile.direction + 3) % 6] = true
    tile.riverDirections[nextTile.direction] = true
    tile.river = true
    if(tile.terrain == terrainTypes.desert){
        tile.terrain = terrainTypes.desertFloodplains
    }
    if(tile.terrain == terrainTypes.tundra){
        tile.terrain = terrainTypes.tundraWetlands
    }

    return true
}

function setMountainRange(tile, length){
    if(tile.terrain == terrainTypes.desertFloodplains){
        tile.features.push(features.mesa)
        tile.terrain = terrainTypes.desert
    } else {
        tile.features.push(features.mountain)
    }

    for(var d = 0; d < directions.length; d++){
        if(t(tile, directions[d]).depth > 1 
        && t(tile, directions[d]).terrain != terrainTypes.lake
        && t(tile, directions[d]).terrain != terrainTypes.desert
        && !t(tile, directions[d]).river
        && Math.abs(t(tile, directions[d]).depth - tile.depth) < .45
        && !t(tile, directions[d]).features.includes(features.mountain)
        && !t(tile, directions[d]).features.includes(features.mesa)
        && (Math.random() > chanceToContinueMountain * (length - 1))){
            t(tile, directions[d]).depth = tile.depth
            setMountainRange(t(tile, directions[d]), length + 1)
            return
        }
    }
}

function setForest(tile, length){
    tile.features.push(features.forest)

    for(var d = 0; d < directions.length; d++){
        if(Math.abs(t(tile, directions[d]).depth - tile.depth) < .3
        && t(tile, directions[d]).depth > 1
        && t(tile, directions[d]).terrain != terrainTypes.lake
        && t(tile, directions[d]).terrain != terrainTypes.desert
        && t(tile, directions[d]).terrain != terrainTypes.desertFloodplains
        && t(tile, directions[d]).terrain != terrainTypes.snow
        && !t(tile, directions[d]).features.includes(features.forest)
        && !t(tile, directions[d]).features.includes(features.savanna)
        && (Math.random() > chanceToContinueForest * (length - 1))){
            setForest(t(tile, directions[d]), length + 1)
        }
    }
}

var visitedTiles = []
for(var i = 0; i < minimumInitialElevations || Math.random() > chanceToNotContinueElevations; i++){
    var pos = {x: randomIndex(tiles), y: randomIndex(tiles[0])}
    setElevation(pos, startingElevationVariance * Math.random() + startingElevationBase)
    visitedTiles = []
}

for(var i = 0; i < 300; i++){
    var islandSource = randomTile()
    if(nearby(islandSource, 6).filter(x => x.depth > 1).length == 0){
        setElevation(islandSource.position, startingElevationVariance * Math.random() + startingElevationBase / 4)
    }
}

tiles.forEach(x => x.forEach(function(e){
    if(e.depth > 1){
        e.terrain = terrainTypes.grasslands
    } else {
        e.terrain = terrainTypes.ocean
    }
}))

tiles.forEach(x => x.forEach(function(e){
    if((e.position.y < (6 + 3 * Math.random()) || e.position.y > mapSizeY - (6 + 3 * Math.random())) && 
    (e.terrain == terrainTypes.grasslands)){
        e.terrain = terrainTypes.tundra
    }

    if((e.position.y < (3 + 2 * Math.random()) || e.position.y > mapSizeY - (3 + 2 * Math.random())) && 
    (e.terrain == terrainTypes.grasslands || e.terrain == terrainTypes.tundra)){
        e.terrain = terrainTypes.snow
        e.features = []
    }

    if(e.position.y < (0 + 2 * Math.random()) || e.position.y > mapSizeY - (1 + 2 * Math.random())){
        e.depth = 1
        e.terrain = terrainTypes.ice
        e.features = []
    }

    if((e.position.y < (10) || e.position.y > mapSizeY - (10))){
        var distance = Math.min(e.position.y, mapSizeY - e.position.y)
        e.depth = Math.pow(e.depth, distance / 12 + 1/6)
    }
}))

var desertsCreated = 0
for(var i = 0; i < 500 && desertsCreated < desertsLimit; i++){
    var desertSource = randomTile()
    if(desertSource.depth > 1 && desertSource.terrain != terrainTypes.snow && desertSource.terrain != terrainTypes.tundra){
        spreadTerrain(desertSource, terrainTypes.desert, 0)
        desertsCreated++
    }
}
/*
for(var i = 0; i < 500; i++){
    var plainsSource = randomTile()
    if(plainsSource.terrain == terrainTypes.grasslands){
        plainsSource.terrain = terrainTypes.plains
    }
}*/

for(var i = 0; i < 4; i++){
    tiles.forEach(x => x.forEach(function(e){
        if((nearby(e, 1).filter(x => x.terrain == terrainTypes.plains || x.terrain == terrainTypes.desert).length > 1)
        && e.terrain == terrainTypes.grasslands){
            e.terrain = terrainTypes.plains
        }
    }))
}

var riversCreated = 0
var riverSource
for(var i = 0; i < 500 && riversCreated < riversLimit; i++){
    riverSource = randomTile()
    if((riverSource.depth > 2.5 || (riverSource.depth > 1 && Math.random() < chanceToGenerateRiverDespiteDepth))
        && nearby(riverSource, 5).filter(x => x.river).length == 0){
        if(!riverSource.river && setRiver(riverSource)){
            setMountainRange(riverSource, 0)
        }
        
        riversCreated++
    }
}

var forestsCreated = 0
var forestSource
for(var i = 0; i < 500 && forestsCreated < forestsLimit; i++){
    forestSource = randomTile()
    if(forestSource.depth > 1
        && !forestSource.features.includes(features.forest)
        && !forestSource.features.includes(features.savanna)
        && forestSource.terrain != terrainTypes.desert
        && forestSource.terrain != terrainTypes.lake
        && forestSource.terrain != terrainTypes.desertFloodplains
        && forestSource.terrain != terrainTypes.snow
        && nearby(forestSource, 7).filter(x => x.features.includes(features.forest)).length < 1
        && nearby(forestSource, 7).filter(x => x.features.includes(features.savanna)).length < 1){
        setForest(forestSource, 0)
        forestsCreated++
    }
}

tiles.forEach(function(x){x.forEach(function(e){
    if(terrainTypes[e.terrain.name.toLowerCase() + "Hills"] != undefined && Math.random() > .6 && !e.river){
        e.terrain = terrainTypes[e.terrain.name.toLowerCase() + "Hills"]
    }
})})

tiles.forEach(function(x){x.forEach(function(e){
    if(e.terrain == terrainTypes.plains
    && e.features.length == 0
    && (nearby(e, 1).filter(x => x.features.includes(features.forest)).length > 0
    || nearby(e, 1).filter(x => x.terrain == terrainTypes.desert).length > 0)){
        e.features.push(features.savanna)
    }
})})

tiles.forEach(function(x){x.forEach(function(e){
    if( e.terrain == terrainTypes.ocean &&
        ((t(e, "r").terrain != terrainTypes.ocean && (t(e, "r").terrain != terrainTypes.coast)) ||
        (t(e,  "l").terrain != terrainTypes.ocean && (t(e, "l").terrain != terrainTypes.coast)) ||
        (t(e, "ur").terrain != terrainTypes.ocean && (t(e, "ur").terrain != terrainTypes.coast)) ||
        (t(e, "ul").terrain != terrainTypes.ocean && (t(e, "ul").terrain != terrainTypes.coast)) ||
        (t(e, "dr").terrain != terrainTypes.ocean && (t(e, "dr").terrain != terrainTypes.coast)) ||
        (t(e, "dl").terrain != terrainTypes.ocean && (t(e, "dl").terrain != terrainTypes.coast)))){
            e.terrain = terrainTypes.coast
    }
})})

var coastalTiles = []
tiles.forEach(function(x){x.forEach(function(e){
    if(e.terrain == terrainTypes.coast){
        coastalTiles.push(e)
    }
})})

coastalTiles.forEach(function(e){
    for(var d = 0; d < directions.length; d++){
        if(Math.random() < chanceToSpreadCoast && t(e, directions[d]).terrain == terrainTypes.ocean){
            t(e, directions[d]).terrain = terrainTypes.coast
        }
    }
})

tiles.forEach(function(x){x.forEach(function(e){
    if(e.depth > 1){
        e.depth = 1 + depthMultiplier * (Math.pow(e.depth, .4) - 1)
    }
})});

var resourceChance = .05
tiles.forEach(function(x){x.forEach(function(e){
    if(Math.random() < resourceChance 
       && e.resource == undefined 
       && !e.features.includes(features.mountain)
       && e.terrain != terrainTypes.ice){
        var escape = false
        for(var i = 0; i < 5 && !escape; i++){
            var resource = randomValueObj(resources)
            if(testRequirements(e, resource.requirements)){
                escape = true
                e.resource = resource
                if(e.terrain == terrainTypes.ocean){
                    e.terrain = terrainTypes.coast
                }
            }
        }
    }
})});

tiles.forEach(function(x){x.forEach(function(e){
    if(nearby(e, 2).filter(x => x.resource != undefined).length == 0){
        var escape = false
        for(var i = 0; i < 500 && !escape; i++){
            var resource = randomValueObj(resources)
            if(testRequirements(e, resource.requirements)){
                escape = true
                e.resource = resource
                if(e.terrain == terrainTypes.ocean){
                    e.terrain = terrainTypes.coast
                }
            }
        }
    }
})});

players.forEach(function(p){
    var esc = false

    while(!esc){
        var spawnPoint = randomTile()
    
        if([terrainTypes.grasslands, terrainTypes.plains].includes(spawnPoint.terrain) 
        && !spawnPoint.features.includes(features.mountain)
        && nearby(spawnPoint, 3).filter(x => x.resource != undefined).length > 4){
            var nearbyPoint
            directions.forEach(function(d){
                if(t(spawnPoint, d).depth > 1 && !t(spawnPoint,d).features.includes(features.mountain)){
                    nearbyPoint = t(spawnPoint, d)
                }
            })

            if(nearbyPoint != undefined){
                p.units.push(new Unit(unitTypes.settler, p, spawnPoint.position))
                p.units.push(new Unit(unitTypes.infantry, p, nearbyPoint.position))
                
                esc = true
            }

        }
    }
})

var maxOffsetX = mapSizeX * Math.sqrt(3) * hexagonSize
var mapOffset = {x: maxOffsetX, y: 0}
var activeUnit = undefined
var hoveredUnit = undefined
var activeSettlement = undefined

/*
var runnerTexture = new THREE.TextureLoader().load( 'exampleAnimation.png' );
var runnerTextureAlpha = new THREE.TextureLoader().load( 'exampleAnimationAlpha.png' );
annie = new TextureAnimator( runnerTexture, 10, 1, 10, 75 ); // texture, #horiz, #vert, #total, duration.
annieAlpha = new TextureAnimator( runnerTextureAlpha, 10, 1, 10, 75 ); // texture, #horiz, #vert, #total, duration.
var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, alphaMap: runnerTextureAlpha, side: THREE.DoubleSide, transparent: true } );
var runnerGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
runner.position.set(0,0,0);
*/

var modelsToLoad = 6
var modelsLoaded = false
var settlement
loader.load('scene.gltf', function ( gltf ) { 
    settlement = gltf.scene; 
    settlement.rotation.x = Math.PI / 2
    
    allModelsLoaded()
}, function ( xhr ) {}, function ( error ) {});

var improvement
loader.load('farm.glb', function ( gltf ) { 
    improvement = gltf.scene; 
    improvement.rotation.x = Math.PI / 2
    
    allModelsLoaded()
}, function ( xhr ) {}, function ( error ) {});

var hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x000000, ambientLighting );
scene.add( hemisphereLight );

camera.rotation.x = cameraRotationBase
camera.position.z = minimumScrollIn
camera.rotation.x = cameraRotationBase * (1 - (camera.position.z - minimumScrollIn) / (minimumScrollOut - minimumScrollIn))
camera.position.x = initialCameraOffsetX
camera.position.y = initialCameraOffsetY
camera.rotation.order = "ZXY"

function calculateBorders(){
    tiles.forEach(z => z.forEach(function(e){
        if(e.player != undefined){
            if(e.borderMeshes != undefined && e.borderMeshes.length > 0){
                for(var i = 0; i < e.borderMeshes.length; i++){
                    e.mesh.remove(e.borderMeshes[i])
                }
            }
            e.borderMeshes = []
            for(var d = 0; d < directions.length; d++){
                if(t(e, directions[d]).player != e.player){
                    e.borderMeshes.push(ownerBorders[d].clone())
                    e.mesh.add(e.borderMeshes[e.borderMeshes.length - 1])
                    e.borderMeshes[e.borderMeshes.length - 1].material.color = e.player.borderColor
                }
            }

            e.borderMeshes.forEach(x => x.position.z = maxDepth)
        }
    }))

    cameraMove()
}

function cameraMove(){
    if(!modelsLoaded){
        return
    }
    tiles.forEach(function(x){x.forEach(function(e){
        e.mesh.position.x = (((2 * e.position.x  + (e.position.y % 2 == 0 ? 0 : 1)) * Math.sqrt(3) / 2 * hexagonSize) + mapOffset.x) % maxOffsetX
        e.mesh.position.y = (hexagonSize * 3/2 * e.position.y) + mapOffset.y
    })})

    players.forEach(x => x.units.forEach(function(e){
        e.icon.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x
        e.icon.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y + ((activeSettlement != undefined) ? (1) : (.4))
    }))
}

function nextTurnButton(){
    if(players[0].notificationsRemaining.length > 0){
        players[0].notificationsRemaining[0].click()
    } else {
        players[0].endTurn()
    }
}

var delta
var intersects
function animate() {
    delta = clock.getDelta()    
   // annie.update(1000 * delta)
   // annieAlpha.update(1000 * delta)
	requestAnimationFrame( animate );
    renderer.render( scene, camera );
    //cssRenderer.render( cssScene, camera );
    cssRenderer.render( scene, camera );

    cursor.lastMoved += delta
    
    activeTile = undefined
    tiles.forEach(function(x){x.forEach(function(e){
        e.active = false; 
    })})

    hoveredUnit = undefined

    if(renderer.domElement.matches(':hover')){
        raycaster.setFromCamera( mouseVector, camera );
        intersects = raycaster.intersectObjects( scene.children )
        if(intersects[0] != undefined && intersects[0].object != undefined){
            if(intersects[0].object.gamePosition != undefined){
                activeTile = tiles[intersects[0].object.gamePosition.x][intersects[0].object.gamePosition.y]
                activeTile.active = true
            } else if(intersects[0].object.unitID != undefined){
                hoveredUnit = players[intersects[0].object.playerID].units[intersects[0].object.unitID]
                activeTile = tiles[hoveredUnit.pos.x][hoveredUnit.pos.y]
                activeTile.active = true
            }
        }
    }

    if(activeTile != undefined && cursor.lastMoved > .25){
        tooltipTile.innerHTML = ""
        tooltipTile.innerHTML += (hoveredUnit == undefined) ? (activeTile.getTooltip()) : (hoveredUnit.getTooltip())
        tooltipTile.style.left = cursor.x + "px"
        tooltipTile.style.top = cursor.y + "px"
        tooltipTile.style.opacity = "1"
    } else {
        tooltipTile.style.transition = ""
        tooltipTile.style.opacity = "0"
        tooltipTile.offsetLeft;
        tooltipTile.style.transition = ".2s opacity"
    }

    tiles.forEach(function(x){x.forEach(function(e){
        if(e.active){
            e.mesh.position.z = e.depth + Math.min(.2, e.mesh.position.z - e.depth + 0.1)
        } else {
            e.mesh.position.z = e.depth + Math.max(0, e.mesh.position.z - e.depth - 0.1)
        }
    })})

    players.forEach(x => x.units.forEach(function(e){
        e.icon.position.z = tiles[e.pos.x][e.pos.y].mesh.position.z + maxDepth + unitIconHoverAboveTile
    }))

    for(var i = 0; i < players.length; i++){
        for(var e = 0; e < players[i].units.length; e++){
            players[i].units[e].icon.playerID = i
            players[i].units[e].icon.unitID = e
        }
    }
}

function allModelsLoaded(){
    modelsToLoad--
    if(modelsToLoad == 0){
        tiles.forEach(function(x){x.forEach(function(e){
            e.initialize()
        })})
        
        hideTooltip()
        modelsLoaded = true
        animate();
        cameraMove()
        players[0].units[0].tile().goto()
        players[0].detectSeen()
        players[0].beginTurn()
    }
}