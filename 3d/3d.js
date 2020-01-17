
var versionNumber = "0.0"
var versionTitle = "Initial"

var scene = new THREE.Scene();
//var cssScene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1);
var clock = new THREE.Clock();
var loader = new THREE.GLTFLoader();
var renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance" });
var css2DRenderer = new THREE.CSS2DRenderer();
var css3DRenderer = new THREE.CSS3DRenderer();
var raycaster = new THREE.Raycaster();
var stats = new Stats();
raycaster.far = 22;
camera.far = 17;
camera.updateProjectionMatrix();
var mouseVector = new THREE.Vector2();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left = "320px"
document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);
document.body.appendChild(css2DRenderer.domElement);
document.body.appendChild(css3DRenderer.domElement);
css2DRenderer.domElement.className = "cssRenderer"
css3DRenderer.domElement.className = "cssRenderer"
css3DRenderer.domElement.id = "cssRenderer3D"

window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    css2DRenderer.setSize(window.innerWidth, window.innerHeight);
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    if(this.currentWorldMap != this.undefined){
        currentWorldMap.drawMap()
    }
}
window.onresize();

var tooltipTile = document.getElementById("tooltip-tile")
var buildingsList = document.getElementById("city-districts-buildings")
var tradeRouteHeader = document.getElementById("city-commerce-routes-header")

var chanceToContinue = .1
var chanceToBeSameElevation = .6
var lengthDecreaseAmount = .1
var minimumLengthToContinue = .25
var maxDepth = 6
var startingElevationBase = .25
var startingElevationVariance = .75
var minimumInitialElevations = 2
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
var resourceChance = .05

var minimumScrollOut = 15
var minimumScrollIn = 9
var ambientLighting = 2
var reachableOverlayColor = "#109fc9"
var reachableOverlayOpacity = .1
var ownerOverlayOpacity = .25
var unitIconHoverAboveTile = .45
var chanceToIgnoreDeepestTile = .8
var initialCameraOffsetX = 0
var initialCameraOffsetY = 0
var cameraRotationBase = .75

var debug = false;
var cursor = { x: 0, y: 0, active: false, lastMoved: 0 };
var dragInitialPoint = { x: 0, y: 0 }
var dragTopLeftPoint = { x: 0, y: 0 }
var dragBottomRightPoint = { x: 0, y: 0 }
var activeCityInfoPanel = 0
var activeTile
var selectedUnits = []
var unitActions = []
var activeSettlement = undefined
var viewedSettlement = undefined

const cannotPassTile = 10000
const suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];
const directions = [Symbol("r"),
Symbol("dr"),
Symbol("dl"),
Symbol("l"),
Symbol("ul"),
Symbol("ur")]

var directionVectors = {}
directionVectors[directions[0]] = { x: 1, y: -1, z: 0 }
directionVectors[directions[1]] = { x: 0, y: -1, z: 1 }
directionVectors[directions[2]] = { x: -1, y: 0, z: 1 }
directionVectors[directions[3]] = { x: -1, y: +1, z: 0 }
directionVectors[directions[4]] = { x: 0, y: 1, z: -1 }
directionVectors[directions[5]] = { x: 1, y: 0, z: -1 }

const hexagonSize = 1
var hexagonShape = new THREE.Shape();
hexagonShape.moveTo(0, -hexagonSize)
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(0, hexagonSize);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(0, -hexagonSize)

const hexagonAlpha = new THREE.TextureLoader().load("terrain/alpha.png")
var hexagonAlphaRotations = []
directions.forEach((direction, index) => {
    hexagonAlphaRotations.push(new THREE.TextureLoader().load("terrain2/alpha.png"))
    hexagonAlphaRotations.last().center = new THREE.Vector2(.5, .5)
    hexagonAlphaRotations.last().rotation = index * Math.PI / 3
})
const stripAlpha = new THREE.TextureLoader().load("terrain2/alpha-strip.png")
const hexagonGeometry = new THREE.PlaneBufferGeometry(Math.sqrt(3) * hexagonSize, 2.05 * hexagonSize, 1, 1)

var reachableBorderShape = new THREE.Shape()
reachableBorderShape.moveTo(Math.sqrt(3) * hexagonSize * .52, hexagonSize * .5 + .02)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .52, -hexagonSize * .5)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .4, -hexagonSize * .5 - .11)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .4, hexagonSize * .5 + .11)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .52, hexagonSize * .5 + .02)

var reachableBorders = []
for (var i = 0; i < directions.length; i++) {
    reachableBorders[i] = new THREE.Mesh(
        new THREE.ShapeBufferGeometry(reachableBorderShape),
        new THREE.MeshLambertMaterial({ color: reachableOverlayColor })
    );
    reachableBorders[i].rotation.z = -Math.PI / 3 * i
    reachableBorders[i].position.z = .001
}

gradientBorderShape = new THREE.Shape()
gradientBorderShape.moveTo(Math.sqrt(3) * hexagonSize * .5, hexagonSize * .5)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .5, -hexagonSize * .5)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .2, -hexagonSize * .5 - .15)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .2, hexagonSize * .5)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .2, hexagonSize * .5 + .15)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .5, hexagonSize * .5)


var gradientBorders = []
for (var i = 0; i < directions.length; i++) {
    gradientBorders[i] = new THREE.Mesh(
        new THREE.ShapeBufferGeometry(gradientBorderShape),
        new THREE.MeshLambertMaterial({ color: reachableOverlayColor })
    );
    gradientBorders[i].rotation.z = -Math.PI / 3 * i
    gradientBorders[i].position.z = .1 + .01 * (i + 1)
}

var fullLength = hexagonSize * .9
var unitPathShape = new THREE.Shape()
unitPathShape.moveTo(0, .05)
unitPathShape.lineTo(0, -.05)
unitPathShape.lineTo(fullLength, -.05)
unitPathShape.lineTo(fullLength, .05)
unitPathShape.lineTo(0, .05)

var unitPathHole1 = new THREE.Shape()
unitPathHole1.moveTo(fullLength * .1, .07)
unitPathHole1.lineTo(fullLength * .1, -.07)
unitPathHole1.lineTo(fullLength * .4, -.07)
unitPathHole1.lineTo(fullLength * .4, .07)
unitPathHole1.lineTo(fullLength * .1, .07)
var unitPathHole2 = new THREE.Shape()
unitPathHole2.moveTo(fullLength * .6, .07)
unitPathHole2.lineTo(fullLength * .6, -.07)
unitPathHole2.lineTo(fullLength * .9, -.07)
unitPathHole2.lineTo(fullLength * .9, .07)
unitPathHole2.lineTo(fullLength * .8, .07)

var commercePathShape = new THREE.Shape()
commercePathShape.holes.push(unitPathHole1, unitPathHole2)

var unitPathMesh = new THREE.Mesh(
    new THREE.ExtrudeBufferGeometry(unitPathShape, { bevelEnabled: true, depth: .12, bevelSize: .02, bevelThickness: .02 }),
    new THREE.MeshLambertMaterial({ color: reachableOverlayColor })
)
var commercePathMesh = new THREE.Mesh(
    new THREE.ExtrudeBufferGeometry(commercePathShape, { bevelEnabled: true, depth: .03, bevelSize: .15, bevelThickness: .01 }),
    new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffc117") })
)

var hexagonSizeX = hexagonSize * .88 
var hexagonSizeY = hexagonSize * .92
var elevationShape = new THREE.Shape()
elevationShape.moveTo(Math.sqrt(3) * hexagonSizeX * .6, hexagonSizeY * .5 - .09)
elevationShape.lineTo(Math.sqrt(3) * hexagonSizeX * .6, -hexagonSizeY * .5)
elevationShape.lineTo(Math.sqrt(3) * hexagonSizeX * .3, -hexagonSizeY * .5 - .15)
elevationShape.lineTo(Math.sqrt(3) * hexagonSizeX * .3, hexagonSizeY * .5 + .15)
elevationShape.lineTo(Math.sqrt(3) * hexagonSizeX * .6, hexagonSizeY * .5 - .09)

var elevationShapeVertical = new THREE.Shape()
elevationShapeVertical.moveTo(2, hexagonSizeY * .5)
elevationShapeVertical.lineTo(2, -hexagonSizeY * .5)
elevationShapeVertical.lineTo(0, -hexagonSizeY * .5)
elevationShapeVertical.lineTo(0, hexagonSizeY * .5)
elevationShapeVertical.lineTo(2, hexagonSizeY * .5)

var keys = {
    up: { key: 87, keydown: function () { }, keyup: function () { }, active: false },
    down: { key: 83, keydown: function () { }, keyup: function () { }, active: false },
    left: { key: 65, keydown: function () { }, keyup: function () { }, active: false },
    right: { key: 68, keydown: function () { }, keyup: function () { }, active: false },
    ctrl: { key: 17, keydown: function () { }, keyup: function () { }, active: false },
    shift: {
        key: 16, keydown: function () {
            document.getElementById("drag-catch").style.pointerEvents = ""
        }, keyup: function () {
            document.getElementById("drag-catch").style.pointerEvents = "none"
        }, active: false
    },
    enter: {
        key: 13, keydown: function () {
            if (players[0].notificationsRemaining.length >= 1 && !keys.shift.active) {
                players[0].notificationsRemaining[0].click()
            } else {
                players[0].endTurn()
            }
        }, keyup: function () { }, active: false
    }
}

document.ondragstart = function (event) {
    if (event.target.nodeName.toUpperCase() == "IMG") {
        return false;
    }
};

var dontHideReachable = false
window.addEventListener('mousemove', function (eventData) {
    cursor.y = eventData.pageY;
    cursor.x = eventData.pageX;
    cursor.lastMoved = 0;

    if (cursor.active && Math.abs(eventData.movementX) < 300 && Math.abs(eventData.movementY) < 300) {
        camera.position.x -= eventData.movementX / 100
        camera.position.y += eventData.movementY / 100
        currentWorldMap.drawMap()
    }

    dontHideReachable = true

    mouseVector.x = (eventData.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = - ((eventData.clientY - 5) / window.innerHeight) * 2 + 1;
});

window.addEventListener('mousedown', function (eventData) {
    if (eventData.which === 1 || eventData.which === 2) { //left
        if (renderer.domElement.matches(':hover')) {
            cursor.active = true
            dontHideReachable = false
        }
    }
})

document.body.addEventListener('mouseout', function (e) {
    cursor.active = false
});

document.onmouseup = function (eventData) {
    if (renderer.domElement.matches(':hover')) {
        if (eventData.which === 1) { //left
            cursor.active = false;

            if (!dontHideReachable) {
                Settlement.hideInfo()
                Unit.deselectAllUnits()

                if ((activeSelection == 0 || activeSelection == 1 || activeSelection == 2)
                    && (activeSelection != 0 || activeTile.developIcon != undefined)
                    && (activeSelection != 1 || activeTile.clearIcon != undefined)
                    && (activeSelection != 2 || activeTile.districtIcon != undefined)
                    && activeSettlement.tiles.includes(activeTile)) {
                    activeSettlement.producible[activeSelection].target = activeTile
                    activeSettlement.setProduction(activeSelection)
                    activeSelection = undefined
                    activeSettlement.select("working")
                }

                if (activeSettlement != undefined) {
                    activeSettlement.deselect()
                }
            }
        } else if (eventData.which === 3) { //right
            if (selectedUnits.length >= 1
                && Unit.selectedUnitsOnSameTile()
                && Unit.selectedUnitsHaveSameMovement()
                && activeTile != undefined
                && activeTile != selectedUnits[0].tile
                && selectedUnits[0].determineReachable().map(x => x.tile).includes(activeTile)
                && activeTile.attackOverlay == undefined) {
                let tileDistance = activeTile.reachableOverlay.reachableDistance
                for (var i = selectedUnits.length - 1; i >= 0; i--) {
                    if (selectedUnits[i].disabled) {
                        selectedUnits[i].activate()
                    }
                    selectedUnits[i].assignPath(undefined)
                    selectedUnits[i].move(activeTile.position, tileDistance)
                }
            }

            if (selectedUnits.length >= 1
                && activeTile != undefined
                && activeTile.attackOverlay == undefined) {
                for (var i = selectedUnits.length - 1; i >= 0; i--) {
                    selectedUnits[i].setPath(activeTile)
                }
            }

            if (activeTile.attackOverlay != undefined) {
                selectedUnits.forEach(x => x.moveToAttack(activeTile))
                Unit.resolveCombat(selectedUnits, activeTile.units)
                if (activeTile.units.length == 0) {
                    selectedUnits.slice(0).forEach(x => x.move(activeTile.position, x.determineReachable().filter(x => x.tile == activeTile).distance))
                }
                selectedUnits.slice(0).forEach(x => x.disactivate())
            }

            if (activeSettlement != undefined) {
                activeSettlement.deselect()
            }
        } else { //middle
            cursor.active = false
        }
    }
}

function adjustCameraRotation() {
    if (activeSettlement != undefined) {
        camera.rotation.x = 0
    } else {
        camera.rotation.x = cameraRotationBase * (1 - (camera.position.z - minimumScrollIn) / (minimumScrollOut - minimumScrollIn))
    }
}

document.body.addEventListener('wheel', function (event) {
    if (renderer.domElement.matches(':hover')) {
        camera.position.z += event.deltaY / 5
        if (camera.position.z > minimumScrollOut) {
            camera.position.z = minimumScrollOut
        } else if (camera.position.z < minimumScrollIn) {
            camera.position.z = minimumScrollIn
        } else {
            camera.position.y += event.deltaY / 4
            currentWorldMap.yDisplacement += event.deltaY / 4
        }
        currentWorldMap.drawMap()
        adjustCameraRotation()
        return false;
    }
}, false);

document.addEventListener('keydown', function (event) {
    var foundMatch = keys[Object.keys(keys).filter(x => keys[x].key == event.keyCode)[0]]
    if (foundMatch == undefined) {
        return
    }
    foundMatch.keydown()
    foundMatch.active = true
});

document.addEventListener('keyup', function (event) {
    var foundMatch = keys[Object.keys(keys).filter(x => keys[x].key == event.keyCode)[0]]
    if (foundMatch == undefined) {
        return
    }
    foundMatch.keyup()
    foundMatch.active = false
});

document.getElementById("drag-catch").onmousedown = function (event) {
    dragInitialPoint = { x: event.clientX, y: event.clientY }
    document.getElementById("drag-catch-box").style.display = ""
    this.onmousemove(event)
}

document.getElementById("drag-catch").onmouseup = function (event) {
    document.getElementById("drag-catch-box").style.display = "none"

    if (!keys.ctrl.active) {
        Unit.deselectAllUnits()
    }

    activePlayer.units.forEach(function (unit) {
        if (unit.iconDIV.getBoundingClientRect().left > dragTopLeftPoint.x
            && unit.iconDIV.getBoundingClientRect().top > dragTopLeftPoint.y
            && unit.iconDIV.getBoundingClientRect().right < dragBottomRightPoint.x
            && unit.iconDIV.getBoundingClientRect().bottom < dragBottomRightPoint.y) {
            unit.select()
        }
    })
}
document.getElementById("drag-catch").onmouseout = function () {
    if (cursor.active) {
        document.getElementById("drag-catch").onmouseup()
    }
}

document.getElementById("drag-catch").onmousemove = function (event) {
    dragTopLeftPoint = { x: Math.min(dragInitialPoint.x, event.clientX), y: Math.min(dragInitialPoint.y, event.clientY) }
    dragBottomRightPoint = { x: Math.max(dragInitialPoint.x, event.clientX), y: Math.max(dragInitialPoint.y, event.clientY) }
    document.getElementById("drag-catch-box").style.left = dragTopLeftPoint.x + "px"
    document.getElementById("drag-catch-box").style.top = dragTopLeftPoint.y + "px"
    document.getElementById("drag-catch-box").style.width = Math.abs(dragTopLeftPoint.x - dragBottomRightPoint.x) + "px"
    document.getElementById("drag-catch-box").style.height = Math.abs(dragTopLeftPoint.y - dragBottomRightPoint.y) + "px"
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

var yieldScale = .3
var yieldWidth = yieldScale

var yields = {
    food: new Yield("Food"),
    production: new Yield("Production"),
    commerce: new Yield("Commerce"),
    science: new Yield("Science"),
    culture: new Yield("Culture"),
    capital: new Yield("Capital")
}
var yieldsTradeRouteOrder = [yields.food, yields.production, yields.commerce, yields.science, yields.culture]

var terrainAlpha = new THREE.TextureLoader().load("terrain/alpha.png");
var riverMaterials = [
    new THREE.MeshBasicMaterial({
        alphaMap: new THREE.TextureLoader().load("terrain/river0_alpha.png"),
        map: new THREE.TextureLoader().load("terrain/river0.png"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        alphaMap: new THREE.TextureLoader().load("terrain/river1_alpha.png"),
        map: new THREE.TextureLoader().load("terrain/river1.png"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        alphaMap: new THREE.TextureLoader().load("terrain/river2_alpha.png"),
        map: new THREE.TextureLoader().load("terrain/river2.png"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    }),
]

var riverDeltaMaterial = new THREE.MeshBasicMaterial({
    alphaMap: new THREE.TextureLoader().load("terrain/riverDelta_alpha.png"),
    map: new THREE.TextureLoader().load("terrain/riverDelta.png"),
    transparent: true, depthWrite: false, side: THREE.DoubleSide
})
var borderGradientMap = new THREE.TextureLoader().load("weirdAlpha.png")

var roadMaterials = [
    new THREE.MeshBasicMaterial({
        alphaMap: new THREE.TextureLoader().load("terrain/road0_alpha.png"),
        map: new THREE.TextureLoader().load("terrain/road0.png"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        alphaMap: new THREE.TextureLoader().load("terrain/road1_alpha.png"),
        map: new THREE.TextureLoader().load("terrain/road1.png"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        alphaMap: new THREE.TextureLoader().load("terrain/road2_alpha.png"),
        map: new THREE.TextureLoader().load("terrain/road2.png"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        alphaMap: new THREE.TextureLoader().load("terrain/road3_alpha.png"),
        map: new THREE.TextureLoader().load("terrain/road3.png"),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
    })
]

/**
 * Whether a Terrain is 'land' or 'sea'
 * @enum {string}
 */
var terrainVariety = {
    land: Symbol("land"),
    sea: Symbol("sea")
}
// note: I am not pleased with this name right now, but it's the best I've thought of

/**
 * The type of Terrain a type has, such as 'grasslands' or 'coast'
 * @enum {Terrain}
 **/
var terrainTypes = {
    grasslands: new Terrain("Grasslands", "grasslands.png", "grasslands", terrainVariety.land, { food: 2 }, "#82943C"),
    grasslandsHills: new Terrain("Grasslands Hills", "grasslands-hills.png", "grasslands", terrainVariety.land, { food: 2, production: 1 }, "#82943C"),
    plains: new Terrain("Plains", "plains.png", "plains", terrainVariety.land, { food: 1, production: 1 }, "#A1A539"),
    plainsHills: new Terrain("Plains Hills", "plains-hills.png", "plains", terrainVariety.land, { food: 1, production: 2 }, "#A1A539"),
    tundra: new Terrain("Tundra", "tundra.png", "tundra", terrainVariety.land, { food: 1 }, "#99C"),
    tundraHills: new Terrain("Tundra Hills", "tundra-hills.png", "tundra", terrainVariety.land, { food: 1, production: 1 }, "#99C"),
    tundraWetlands: new Terrain("Tundra Wetlands", "tundra-wetlands.png", "tundra", terrainVariety.land, { food: 2 }, "#99C"),
    desert: new Terrain("Desert", "desert.png", "desert", terrainVariety.land, { production: 1 }, "#f0e4a8"),
    desertFloodplains: new Terrain("Desert Floodplains", "desert-floodplains.png", "desert", terrainVariety.land, { food: 2, production: 1 }, "#f0e4a8"),
    desertHills: new Terrain("Desert Hills", "desert-hills.png", "desert", terrainVariety.land, { production: 2 }, "#f0e4a8"),
    snow: new Terrain("Snow", "snow.png", "snow", terrainVariety.land, {}, "#fff"),
    snowHills: new Terrain("Snow Hills", "snow-hills.png", "snow", terrainVariety.land, { production: 1 }, "#fff"),
    coast: new Terrain("Coast", "coast.png", "", terrainVariety.sea, { food: 1, commerce: 1 }, "#4080e6"),
    ocean: new Terrain("Ocean", "ocean.png", "", terrainVariety.sea, {}, "#2969cf"),
    lake: new Terrain("Lake", "lake.png", "", terrainVariety.sea, { food: 2 }, "#496da6"),
    ice: new Terrain("Ice", "ice.png", "", terrainVariety.sea, {}, "#fff")
}

/**
 * Requirements that things like Resources use to determine which Tiles they can generate on
 * @enum {string}
 */
var requirements = {
    forest: Symbol("forest"),
    notForest: Symbol("notForest"),
    hills: Symbol("hills"),
    notHills: Symbol("notHills"),
    land: Symbol("land"),
    notLand: Symbol("notLand"),
    desert: Symbol("desert"),
    notDesert: Symbol("notDesert"),
    tundra: Symbol("tundra"),
    notTundra: Symbol("notTundra"),
    snow: Symbol("snow"),
    notSnow: Symbol("notSnow"),
    standard: Symbol("standard"),
    notStandard: Symbol("notStandard"),
    coastal: Symbol("coastal"),
    notCoastal: Symbol("notCoastal"),
    savanna: Symbol("savanna"),
    notSavanna: Symbol("notSavanna"),
    river: Symbol("river"),
    notRiver: Symbol("notRiver"),
    passable: Symbol("passable")
}

/**
 * Used to check a Tile against a list of requirements given, i.e. a Resource to check whether it can spawn on a tile
 * @param {Tile} tile The Tile being checked by the requirements.
 * @param {requirements} requirementsList A list of requirements that a Tile must pass to return true
 * @return {boolean} Whether the Tile passes all of the requirements listed
 */
function testRequirements(requirementsList, tile, settlement, district) {
    // the final return value that, while true, will be checked against the 'requirementsList' and set to false if it fails any of them
    var confirm = true

    requirementsList.forEach(function (e) {
        if (confirm) {
            switch (e) {
                // tile
                case requirements.forest: confirm = (tile.features.includes(features.forest)); break;
                case requirements.notForest: confirm = (!tile.features.includes(features.forest)); break;
                case requirements.hills: confirm = (tile.terrain.name.includes("Hill")); break;
                case requirements.notHills: confirm = (!tile.terrain.name.includes("Hill")); break;
                case requirements.land: confirm = (tile.terrain.variety == terrainVariety.land); break;
                case requirements.notLand: confirm = (tile.terrain.variety != terrainVariety.land); break;
                case requirements.desert: confirm = (tile.terrain.name.includes("Desert")); break;
                case requirements.notDesert: confirm = !(tile.terrain.name.includes("Desert")); break;
                case requirements.tundra: confirm = (tile.terrain.name.includes("Tundra")); break;
                case requirements.notTundra: confirm = !(tile.terrain.name.includes("Tundra")); break;
                case requirements.snow: confirm = (tile.terrain == terrainTypes.snow); break;
                case requirements.notSnow: confirm = (tile.terrain != terrainTypes.snow); break;
                case requirements.standard: confirm = (
                    tile.terrain.name.includes("Plains")
                    || tile.terrain.name.includes("Grasslands")
                    || tile.terrain.name.includes("Floodlands")
                    || tile.terrain.name.includes("Wetlands")); break;
                case requirements.notStandard: confirm = !(
                    tile.terrain.name.includes("Plains")
                    || tile.terrain.name.includes("Grasslands")
                    || tile.terrain.name.includes("Floodlands")
                    || tile.terrain.name.includes("Wetlands")); break;
                case requirements.coastal: confirm = (tile.nearby(1).filter(x => x.terrain == terrainTypes.coast).length > 0); break;
                case requirements.notCoastal: confirm = !(tile.nearby(1).filter(x => x.terrain == terrainTypes.coast).length > 0); break;
                case requirements.savanna: confirm = (tile.features.includes(features.savanna)); break;
                case requirements.notSavanna: confirm = (!tile.features.includes(features.savanna)); break;
                case requirements.river: confirm = (tile.hasRiver); break;
                case requirements.notRiver: confirm = (!tile.hasRiver); break;
                case requirements.passable: confirm = (tile.terrain.variety == terrainVariety.sea) || tile.hasRoad || tile.hasRiver; break;
                // settlement
                // district
            }
        }
    })

    return confirm
}

var developments = {
    farm: new Development("Farm", { food: 1 }),
    plantation: new Development("Plantation", { commerce: 1 }),
    fishery: new Development("Fishery", { food: 1 }),
    mine: new Development("Mine", { commerce: 1 }),
    quarry: new Development("Quarry", { production: 1 }),
    pasture: new Development("Pasture", { food: 1 }),
    reserve: new Development("Reserve", { commerce: 1 }),
    sawmill: new Development("Sawmill", { production: 1 })
}

var resources = {
    aggregate: new Resource("Aggregate", developments.quarry, { production: 2 }, [requirements.notHills, requirements.land]),
    //aluminum: new Resource(""          , {}             , [])                      ,
    amber: new Resource("amber", developments.sawmill, { commerce: 3 }, [requirements.forest]),
    banana: new Resource("Banana", developments.plantation, { food: 2 }, [requirements.standard, requirements.forest]),
    cattle: new Resource("Cattle", developments.pasture, { food: 2 }, [requirements.standard, requirements.notForest]),
    cinnamon: new Resource("Cinnamon", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    citrus: new Resource("Citrus", developments.plantation, { food: 1 }, [requirements.standard, requirements.notHills, requirements.forest]),
    clams: new Resource("Clams", developments.fishery, { commerce: 3 }, [requirements.notLand, requirements.coastal]),
    cloves: new Resource("Cloves", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    coal: new Resource("Coal", developments.quarry, { production: 2 }, [requirements.land]),
    cocoa: new Resource("Cocoa", developments.quarry, { commerce: 3 }, [requirements.standard, requirements.forest]),
    coffee: new Resource("Coffee", developments.plantation, { commerce: 2, production: 1 }, [requirements.standard, requirements.forest]),
    copper: new Resource("Copper", developments.mine, { production: 2 }, [requirements.land]),
    corn: new Resource("Corn", developments.farm, { food: 2 }, [requirements.standard, requirements.notHills]),
    cotton: new Resource("Cotton", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.notHills]),
    crabs: new Resource("Crabs", developments.fishery, { commerce: 2, food: 1 }, [requirements.notLand, requirements.coastal]),
    deer: new Resource("Deer", developments.reserve, { commerce: 2, food: 1 }, [requirements.forest, requirements.notHill]),
    diamonds: new Resource("Diamonds", developments.mine, { commerce: 4, production: 1 }, [requirements.hills]),
    elephants: new Resource("Elephants", developments.reserve, { commerce: 4, food: 1 }, [requirements.savanna]),
    fish: new Resource("Fish", developments.fishery, { food: 2 }, [requirements.notLand, requirements.coastal]),
    furbearers: new Resource("Furbearers", developments.reserve, { commerce: 2, food: 1 }, [requirements.forest]),
    gold: new Resource("Gold", developments.mine, { commerce: 6 }, [requirements.hills]),
    grapes: new Resource("Grapes", developments.plantation, { commerce: 2, food: 1 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    guano: new Resource("Guano", developments.mine, { production: 1, food: 1 }, [requirements.notStandard, requirements.coastal, requirements.land, requirements.notForest]),
    gypsum: new Resource("Gypsum", developments.quarry, { commerce: 2, production: 1 }, [requirements.hills]),
    honeybees: new Resource("Honeybees", developments.pasture, { commerce: 2, food: 1 }, [requirements.forest, requirements.standard]),
    horse: new Resource("Horse", developments.pasture, { production: 2 }, [requirements.standard, requirements.notHills]),
    iron: new Resource("Iron", developments.mine, { production: 2 }, [requirements.land]),
    jade: new Resource("Jade", developments.mine, { commerce: 3 }, [requirements.hills]),
    latex: new Resource("Latex", developments.plantation, { commerce: 2, production: 1 }, [requirements.forest, requirements.standard]),
    marble: new Resource("Marble", developments.quarry, { commerce: 3 }, [requirements.hills]),
    mercury: new Resource("Mercury", developments.mine, { commerce: 3 }, [requirements.hills]),
    murex: new Resource("Murex", developments.fishery, { commerce: 3 }, [requirements.notLand, requirements.coastal]),
    nitre: new Resource("Nitre", developments.quarry, { production: 1, food: 1 }, [requirements.land]),
    //oil: new Resource("Oil"            , {production: 2}, [requirements.notForest]),
    olives: new Resource("Olives", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    pigs: new Resource("Pigs", developments.pasture, { food: 2 }, [requirements.notHills, requirements.standard]),
    platinum: new Resource("Platinum", developments.mine, { production: 2, commerce: 1 }, [requirements.land]),
    poppies: new Resource("Poppies", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.notHills]),
    potato: new Resource("Potato", developments.farm, { food: 2 }, [requirements.standard, requirements.notHills]),
    rice: new Resource("Rice", developments.farm, { food: 2 }, [requirements.standard, requirements.river]),
    sage: new Resource("Sage", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.notHills]),
    salt: new Resource("Salt", developments.mine, { commerce: 1, production: 2 }, [requirements.land, requirements.notCoastal]),
    seaweed: new Resource("Seaweed", developments.fishery, { food: 2 }, [requirements.notLand, requirements.coastal]),
    sheep: new Resource("Sheep", developments.pasture, { food: 2 }, [requirements.land, requirements.notSnow]),
    silkworms: new Resource("Silkworms", developments.pasture, { commerce: 3 }, [requirements.forest]),
    silver: new Resource("Silver", developments.mine, { commerce: 2, production: 1 }, [requirements.land]),
    spices: new Resource("Spices", developments.plantation, { commerce: 3 }, [requirements.coastal, requirements.land, requirements.notSnow, requirements.notTundra]),
    sugarcane: new Resource("Sugarcane", developments.plantation, { commerce: 3 }, [requirements.land, requirements.coastal, requirements.notTundra, requirements.notSnow]),
    tea: new Resource("Tea", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.coastal]),
    tobacco: new Resource("Tobacco", developments.plantation, { commerce: 3 }, [requirements.standard, requirements.coastal]),
    turtles: new Resource("Turtles", developments.fishery, { commerce: 2, food: 1 }, [requirements.notLand, requirements.coastal]),
    //uranium: new Resource("Uranium"    , {production: 2}, [requirements.land])     ,
    whales: new Resource("Whales", developments.fishery, { commerce: 2, food: 1 }, [requirements.notLand, requirements.coastal]),
    wheat: new Resource("Wheat", developments.farm, { food: 2 }, [requirements.standard]),
}

var buildingModifiers = {
    /** resources: [], bonus: {} */
    resourceBonus: {
        processModifier: function (district, building, modifier) {
            district.settlement.tiles.forEach(function (tile) {
                if (modifier.resources.includes(tile.resource)) {
                    tile.addBuildingYields(modifier.bonus)
                }
            })
        }
    }
}

var buildings = {
    granary: new Building("Granary", "granary", [], { food: 2 }, "A granary", [
        { type: buildingModifiers.resourceBonus, resources: [resources.wheat], bonus: { food: 1 } }
    ]),
    watermill: new Building("Watermill", "watermill", [requirements.river], { production: 1, food: 1 }, "A watermill", [])
}

var features = {
    mountain: new Feature("Mountain", 'Mountain.glb', { offsetZ: -.05, scale: .67 }),
    forest: new Feature("Forest", 'lowpoly_forest.glb', { scale: .13 }),
    mesa: new Feature("Mesa", 'mesa.glb', { offsetZ: -.05, scale: .6 }),
    savanna: new Feature("Savanna", 'savanna.glb', { scale: .0235 })
}

var productionTileIcon = new THREE.Mesh(
    hexagonGeometry, new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("construction.jpg"),
        alphaMap: hexagonAlpha, transparent: true, opacity: .4, depthWrite: false
    })
)
productionTileIcon.position.z = .02

var cultureTargetIcon = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("culture.png"),
    transparent: true, opacity: .4, depthTest: false
}))
cultureTargetIcon.position.z = .02
cultureTargetIcon.scale.set(2, 2, 2)

var attackOverlay = new THREE.Mesh(
    hexagonGeometry, new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("attack-indicator.png"),
        alphaMap: new THREE.TextureLoader().load("attack-indicator-alpha.png"), transparent: true, opacity: 1, depthWrite: false
    })
)
attackOverlay.scale.set(.8, .68, 1);

function addYields(y1, y2) {
    var final = {}
    Object.keys(y1).forEach(x => final[x] = (final[x] == undefined) ? (y1[x]) : (final[x] + y1[x]))
    Object.keys(y2).forEach(x => final[x] = (final[x] == undefined) ? (y2[x]) : (final[x] + y2[x]))
    return final
}

var overlayMaterial = new THREE.MeshBasicMaterial({ color: reachableOverlayColor, alphaMap: hexagonAlpha, transparent: true, opacity: reachableOverlayOpacity, depthWrite: false })
var reachableIsRendered = false
function renderReachable(unit) {
    hideReachable()

    var reachable = unit.determineReachable()
    reachableIsRendered = true

    if (reachable.length > 1) {
        reachable.forEach(function (e) {
            e.tile.reachableOverlay = new THREE.Mesh(hexagonGeometry, overlayMaterial)
            e.tile.reachableOverlay.reachablePos = e.tile.position
            e.tile.reachableOverlay.reachableDistance = e.distance
            e.tile.reachableOverlay.position.z = .08
            e.tile.face.add(e.tile.reachableOverlay)

            e.tile.reachableBorders = []
            directions.forEach(function (d, index) {
                if (!reachable.map(x => x.tile).includes(e.tile.neighbour(d))) {
                    e.tile.reachableBorders.push(reachableBorders[index].clone())
                    e.tile.face.add(e.tile.reachableBorders[e.tile.reachableBorders.length - 1])
                }
            })

            if (e.tile.differentPlayerOnTile(unit.player)) {
                e.tile.attackOverlay = attackOverlay.clone()
                e.tile.face.add(e.tile.attackOverlay)
            }
        })
    }
}

function hideReachable() {
    if (!modelsLoaded) {
        return
    }

    reachableIsRendered = false
    currentWorldMap.forEach(tile => {
        tile.face.remove(tile.reachableOverlay)
        tile.reachableOverlay = undefined
        tile.reachableBorders.forEach(x => tile.face.remove(x))
        tile.reachableBorders = []
        if (tile.attackOverlay != undefined) {
            tile.face.remove(tile.attackOverlay)
            tile.attackOverlay = undefined
        }
    })

    renderer.renderLists.dispose();
}

var notifications = [
    new Notification("City Production", "notifications/production.png", function (player) {
        if (player.settlements != undefined) {
            return player.settlements.filter(x => x.producingID == undefined).length > 0
        }
    }, function () { // on activation
        Settlement.changeCityInfoPanel(0)
        activePlayer.settlements.filter(x => x.producingID == undefined)[0].displayInfo()
        activePlayer.settlements.filter(x => x.producingID == undefined)[0].tile.centerCameraOnTile()
    }),
    new Notification("Unit Movement", "notifications/unit.png", function (p) {
        return p.units.filter(x => !x.disabled).length > 0
    }, function () { // on activation
        var targetUnit = activePlayer.units.filter(x => !x.disabled)[0]

        if (selectedUnits.length == 1 && activePlayer.units.filter(x => !x.disabled).includes(selectedUnits[0])) {
            targetUnit = activePlayer.units.filter(x => !x.disabled)[(activePlayer.units.filter(x => !x.disabled).indexOf(selectedUnits[0]) + 1) % activePlayer.units.filter(x => !x.disabled).length]
        }

        if (activeSettlement != undefined) {
            activeSettlement.deselect()
        }

        if (targetUnit != undefined) {
            targetUnit.tile.centerCameraOnTile()
            targetUnit.select()
        } else {
            activePlayer.updateNotifications()
        }
    })
]

var actions = {
    wait: new Action("Wait", "wait.png", function () {
        for (var i = selectedUnits.length - 1; i >= 0; i--) {
            selectedUnits[i].wait()
        }
    }),
    sleep: new Action("Sleep", "sleep.png", function () {
        for (var i = selectedUnits.length - 1; i >= 0; i--) {
            selectedUnits[i].sleep()
        }
    }),
    wakeUp: new Action("Wake Up", "wake.png", function () {
        for (var i = selectedUnits.length - 1; i >= 0; i--) {
            selectedUnits[i].wakeUp()
        }
    }),
    merge: new Action("Merge", "merge.png", function () {
        var temp = selectedUnits.splice(1)
        selectedUnits[0].mergeMultiple(temp)
        if (selectedUnits.length == 1) {
            renderReachable(selectedUnits[0])
        }
    }),
    settle: new Action("Settle", "settle.png", function () {
        if (selectedUnits.length == 1 && selectedUnits[0].determineReachable().length > 1) {
            selectedUnits[0].foundSettlement()
        }
    }),
    move: new Action("Move", "move.png", function () {
        if (Unit.selectedUnitsHaveSameMovement() && Unit.selectedUnitsOnSameTile()) {
            selectedUnits[0].moveButton()
        }
    })
}

var unitClasses = {
    infantry: new UnitClass("Infantry", 2, false),
    lightCavalry: new UnitClass("Light Cavalry", 4, false),
    heavyCavalry: new UnitClass("Heavy Cavalry", 3, false),
    ranged: new UnitClass("Ranged", 2, false),
    artillery: new UnitClass("Artillery", 2, false),
    settler: new UnitClass("Settler", 2, false),
    trader: new UnitClass("Trader", 1, false)
}

frontlineClasses = [unitClasses.infantry, unitClasses.lightCavalry, unitClasses.heavyCavalry]
backlineClasses = [unitClasses.ranged, unitClasses.artillery]
supportClasses = [unitClasses.settler]

var unitTypes = {
    warrior: new UnitType("Warrior", unitClasses.infantry, "warrior.png", 1, 4),
    horseman: new UnitType("Horseman", unitClasses.lightCavalry, "horseman.png", 2, 4),
    chariot: new UnitType("Chariot", unitClasses.heavyCavalry, "chariot.png", 3, 4),
    slinger: new UnitType("Slinger", unitClasses.ranged, "slinger.png", 3, 3),
    catapult: new UnitType("Catapult", unitClasses.artillery, "catapult.png", 4, 2),
    settler: new UnitType("Settler", unitClasses.settler, "settler.png", 0, 1),
    trader: new UnitType("Trader", unitClasses.trader, "", 1, 1)
}

var technologyTypes = {
    engineering: "Engineering",
    society: "Society",
    theoretical: "Theoretical",
    none: "None"
}

var technologies = {
    animalHusbandry: new Technology("Animal Husbandry", "animalhusbandry", technologyTypes.none, []),
    archery: new Technology("Archery", "archery", technologyTypes.none, []),
    astrology: new Technology("Astrology", "astrology", technologyTypes.none, []),
    bronzeWorking: new Technology("Bronze Working", "bronzeworking", technologyTypes.none, []),
    irrigation: new Technology("Irrigation", "irrigation", technologyTypes.none, []),
    masonry: new Technology("Masonry", "masonry", technologyTypes.none, []),
    mining: new Technology("Mining", "mining", technologyTypes.none, []),
    pottery: new Technology("Pottery", "pottery", technologyTypes.none, []),
    sailing: new Technology("Sailing", "sailing", technologyTypes.none, []),
    wheel: new Technology("Wheel", "wheel", technologyTypes.none, []),
    writing: new Technology("Writing", "writing", technologyTypes.society, [])
}

technologies.bronzeWorking.prerequisites = [technologies.mining]
technologies.irrigation.prerequisites = [technologies.pottery]
technologies.wheel.prerequisites = [technologies.mining]

var producibleTypes = {
    develop: Symbol("develop"),
    clear: Symbol("clear"),
    unit: Symbol("unit"),
    district: Symbol("district"),
    building: Symbol("building")
}

var activeSelection = undefined
var workedIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load("worked.png"), depthTest: false })
)

var unworkedIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load("unworked.png"), depthTest: false })
)

var developIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load("actions/build.png"), depthTest: false })
)

var clearIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load("actions/clear.png"), depthWrite: false })
)

var districtIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load("actions/district.png"), depthWrite: false })
)

var tileIcons = [workedIcon, unworkedIcon, developIcon, clearIcon, districtIcon]
tileIcons.forEach(function (e) {
    e.scale.set(.5, .5, .5)
    e.position.z = .3
    e.position.y = .6
})

var mapSize = 25
var currentWorldMap = new WorldMap(mapSize)
currentWorldMap.generateMap()

var modelsToLoad = 6
var modelsLoaded = false
var districtModel
loader.load('scene.gltf', function (gltf) {
    districtModel = gltf.scene;
    districtModel.rotation.x = Math.PI / 2

    allModelsLoaded()
}, function (xhr) { }, function (error) { });

var improvement
loader.load('farm.glb', function (gltf) {
    improvement = gltf.scene;
    improvement.rotation.x = Math.PI / 2

    allModelsLoaded()
}, function (xhr) { }, function (error) { });

var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, ambientLighting);
scene.add(hemisphereLight);

camera.rotation.x = cameraRotationBase
camera.position.z = minimumScrollIn
camera.rotation.x = cameraRotationBase * (1 - (camera.position.z - minimumScrollIn) / (minimumScrollOut - minimumScrollIn))
camera.rotation.order = "ZXY"

function nextTurnButton() {
    if (players[0].notificationsRemaining.length > 0) {
        players[0].notificationsRemaining[0].click()
    } else {
        players[0].endTurn()
    }
}

var delta
var intersects
function animate() {
    stats.begin();

    delta = clock.getDelta()
    // annie.update(1000 * delta)
    // annieAlpha.update(1000 * delta)
    renderer.render(scene, camera);
    css2DRenderer.render(scene, camera);
    css3DRenderer.render(scene, camera);

    cursor.lastMoved += delta

    var previousActiveTile = activeTile
    activeTile = undefined
    currentWorldMap.forEach(tile => tile.active = false)

    raycaster.setFromCamera(mouseVector, camera);
    intersects = raycaster.intersectObjects(scene.children)
    if (intersects[0] != undefined && intersects[0].object != undefined) {
        if (intersects[0].object.gamePosition != undefined) {
            activeTile = currentWorldMap.getTile(intersects[0].object.gamePosition)
            activeTile.active = true
        }
    }

    if (activeTile != previousActiveTile && activeTile != undefined && previousActiveTile != undefined) {
        currentWorldMap.displayPaths(selectedUnits, activeTile)
        activeTile.face.add(activeTile.yieldHolder)
        activeTile.yieldHolderDIV.style.opacity = "1"
        previousActiveTile.face.remove(previousActiveTile.yieldHolder)
        previousActiveTile.yieldHolderDIV.style.opacity = "0"
    }

    if (activeTile != undefined && cursor.lastMoved > .25) {
        tooltipTile.innerHTML = ""
        tooltipTile.innerHTML += activeTile.tooltip
        tooltipTile.style.left = cursor.x + "px"
        tooltipTile.style.top = cursor.y + "px"
        tooltipTile.style.opacity = "1"
    } else {
        tooltipTile.style.transition = ""
        tooltipTile.style.opacity = "0"
        tooltipTile.offsetLeft;
        tooltipTile.style.transition = ".2s opacity"
    }

    document.body.style.cursor = ""
    currentWorldMap.forEach(tile => {
        if (tile.active) {
            if (tile.attackOverlay != undefined) {
                tile.attackOverlay.rotation.z += .05
            }
            if (tile.attackOverlay != undefined || tile.developIcon != undefined || tile.clearIcon != undefined || tile.districtIcon != undefined) {
                document.body.style.cursor = "pointer"
            }
        }

        if (tile.active || (viewedSettlement != undefined && viewedSettlement.tiles.includes(tile))) {
        } 

        if (tile.face.material != undefined && tile.face.material.opacity < 1) {
            tile.face.material.opacity += .1
            if (tile.face.material.opacity >= 1) {
                tile.face.material = tile.terrain.material[tile.randomTexture]
            }
        }
    })

    if(Math.abs(currentWorldMap.mapZoomChange) < .05){
        currentWorldMap.mapZoomChange = 0
    }

    if(currentWorldMap.mapZoomChange != 0){
        var incrementValue = (.05 + ((Math.abs(currentWorldMap.mapZoomChange) >= 1) ? (Math.pow(Math.abs(currentWorldMap.mapZoomChange), .2) * .05) : 0)) * .75
        if(currentWorldMap.mapZoomChange > 0){
            currentWorldMap.mapZoomOut += incrementValue
            currentWorldMap.mapZoomChange -= incrementValue
        } else {
            currentWorldMap.mapZoomOut -= incrementValue
            currentWorldMap.mapZoomChange += incrementValue
        }
        currentWorldMap.drawMap()
    }

    stats.end();
    requestAnimationFrame(animate);
}


var players = [new Civilization(currentWorldMap), new Civilization(currentWorldMap), new Animals(currentWorldMap)]
activePlayer = players[0]

function allModelsLoaded() {
    modelsToLoad--
    if (modelsToLoad == 0) {
        currentWorldMap.initialize()

        //players.filter(x => x instanceof Civilization).forEach(function (p) {
        p = players[0]
        var esc = false

        while (!esc) {
            var spawnPoint = currentWorldMap.randomTile()

            if ([terrainTypes.grasslands, terrainTypes.plains].includes(spawnPoint.terrain)
                && !spawnPoint.features.includes(features.mountain)
                && spawnPoint.nearby(3).filter(x => x.resource != undefined).length > 4) {
                //  && spawnPoint.nearby(10).filter(x => x.units.length > 0).length == 0) {
                var nearbyPoint1, nearbyPoint2
                spawnPoint.nearby(4).forEach(function (tile) {
                    if (!spawnPoint.nearby(3).includes(tile) && tile.depth > 1 && !tile.features.includes(features.mountain) && nearbyPoint2 == undefined) {
                        if (nearbyPoint1 == undefined) {
                            nearbyPoint1 = tile
                        } else if (!nearbyPoint1.nearby(3).includes(tile)) {
                            nearbyPoint2 = tile
                        }
                    }
                })

                p.units.push(new Unit([unitTypes.settler, unitTypes.warrior], p, spawnPoint.position, currentWorldMap))
                if (nearbyPoint1 != undefined) {
                    p.units.push(new Unit(unitTypes.settler, p, nearbyPoint1.position, currentWorldMap))
                }
                if (nearbyPoint2 != undefined) {
                    p.units.push(new Unit(unitTypes.settler, p, nearbyPoint2.position, currentWorldMap))
                }
                esc = true
            }
        }

        hideTooltip()
        modelsLoaded = true
        animate()
        players[0].units[0].tile.centerCameraOnTile()
        players[0].units[0].foundSettlement()
        players[0].units[1].foundSettlement()
        players[0].beginTurn()
        players[0].detectSeen()
        Settlement.changeCityInfoPanel(0)
    }
}
