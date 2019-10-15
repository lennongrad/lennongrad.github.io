
var versionNumber = "0.0"
var versionTitle = "Initial"

var scene = new THREE.Scene();
//var cssScene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.1, 50);
var clock = new THREE.Clock();
var loader = new THREE.GLTFLoader();
var renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance" });
var css2DRenderer = new THREE.CSS2DRenderer();
var css3DRenderer = new THREE.CSS3DRenderer();
var raycaster = new THREE.Raycaster();
var stats = new Stats();
raycaster.far = 22;
camera.far = 18;
camera.updateProjectionMatrix();
var mouseVector = new THREE.Vector2();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.top = "50px"
document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);
document.body.appendChild(css2DRenderer.domElement);
document.body.appendChild(css3DRenderer.domElement);
css2DRenderer.domElement.className = "cssRenderer"
css3DRenderer.domElement.className = "cssRenderer"
css3DRenderer.domElement.id = "cssRenderer3D"

function animate2() {

    stats.begin();

    // monitored code goes here

    stats.end();

    requestAnimationFrame(animate2);

}

requestAnimationFrame(animate2);

window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    css2DRenderer.setSize(window.innerWidth, window.innerHeight);
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.onresize();

var tooltipTile = document.getElementById("tooltip-tile")
var buildingsList = document.getElementById("city-districts-buildings")

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

var minimumScrollOut = 14
var minimumScrollIn = 9
var ambientLighting = 1.5
var reachableOverlayColor = "#109fc9"
var reachableOverlayOpacity = .1
var ownerOverlayOpacity = .25
var unitIconHoverAboveTile = .45
var chanceToIgnoreDeepestTile = .8
var initialCameraOffsetX = 70
var initialCameraOffsetY = 5
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
const hexagonGeometry = new THREE.PlaneBufferGeometry(Math.sqrt(3) * hexagonSize, 2.05 * hexagonSize, 1, 1)

ownerBorderShape = new THREE.Shape()
ownerBorderShape.moveTo(Math.sqrt(3) * hexagonSize * .5, hexagonSize * .5)
ownerBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .5, -hexagonSize * .5)
ownerBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .44, -hexagonSize * .5)
ownerBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .44, hexagonSize * .5)
ownerBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .44, hexagonSize * .5)
ownerBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .5, hexagonSize * .5)

var ownerBorders = []
for (var i = 0; i < directions.length; i++) {
    ownerBorders[i] = new THREE.Mesh(
        new THREE.ExtrudeBufferGeometry(ownerBorderShape, { depth: .05, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: .05, bevelThickness: .05 }),
        new THREE.MeshLambertMaterial({ color: reachableOverlayColor, transparent: true, opacity: .95 })
    );
    ownerBorders[i].rotation.z = -Math.PI / 3 * i
}

reachableBorderShape = new THREE.Shape()
reachableBorderShape.moveTo(Math.sqrt(3) * hexagonSize * .5, hexagonSize * .5)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .5, -hexagonSize * .5)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .35, -hexagonSize * .5 - .1)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .35, hexagonSize * .5)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .35, hexagonSize * .5 + .1)
reachableBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .5, hexagonSize * .5)

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
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .2, -hexagonSize * .5 - .4)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .2, hexagonSize * .5)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .2, hexagonSize * .5 + .4)
gradientBorderShape.lineTo(Math.sqrt(3) * hexagonSize * .5, hexagonSize * .5)

var gradientBorders = []
for (var i = 0; i < directions.length; i++) {
    gradientBorders[i] = new THREE.Mesh(
        new THREE.ShapeBufferGeometry(gradientBorderShape),
        new THREE.MeshLambertMaterial({ color: reachableOverlayColor })
    );
    gradientBorders[i].rotation.z = -Math.PI / 3 * i
    gradientBorders[i].position.z = .1 + .01 * i
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
            if (players[0].notificationsRemaining.length >= 1) {
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
        mapOffset.x += Math.min(200, Math.abs(eventData.movementX)) / 100 * Math.sign(eventData.movementX)
        if (mapOffset.x < 0) {
            mapOffset.x = maxOffsetX
        }
        mapOffset.y -= Math.min(200, Math.abs(eventData.movementY)) / 100 * Math.sign(eventData.movementY)
    }

    cameraMove()
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

document.mouseleave = function () {
    cursor.active = false
}

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
                && activeTile != tiles[selectedUnits[0].pos.x][selectedUnits[0].pos.y]
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
        }
        adjustCameraRotation()
        cameraMove()
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

function t(pos, direction) {
    var used = pos
    var returnPosition = true
    var final
    if (pos.x == undefined) {
        used = pos.position
        returnPosition = false
    }

    switch (direction) {
        case directions[0]: final = { x: used.x + 1, y: used.y }; break;
        case directions[1]: final = { x: used.x + (used.y % 2 == 0 ? 0 : 1), y: used.y - 1 }; break;
        case directions[2]: final = { x: used.x + (used.y % 2 == 0 ? -1 : 0), y: used.y - 1 }; break;
        case directions[3]: final = { x: used.x - 1, y: used.y }; break;
        case directions[4]: final = { x: used.x + (used.y % 2 == 0 ? -1 : 0), y: used.y + 1 }; break;
        case directions[5]: final = { x: used.x + (used.y % 2 == 0 ? 0 : 1), y: used.y + 1 }; break;
    }

    if (final.x < 0) {
        final.x = mapSizeX + final.x
    }
    if (final.y < 0) {
        final.y = mapSizeY + final.y
    }
    if (final.x >= mapSizeX) {
        final.x = final.x - mapSizeX
    }
    if (final.y >= mapSizeY) {
        final.y = final.y - mapSizeY
    }

    if (returnPosition) {
        return final
    }
    return tiles[final.x][final.y]
}

function nearby(tile, distance) {
    var final = [tile]
    var lastSet = [tile]

    for (var i = 0; i < distance; i++) {
        var nextSet = []
        for (var e = 0; e < lastSet.length; e++) {
            for (var d = 0; d < directions.length; d++) {
                if (!final.includes(t(lastSet[e], directions[d]))) {
                    final.push(t(lastSet[e], directions[d]))
                    nextSet.push(t(lastSet[e], directions[d]))
                }
            }
        }
        lastSet = nextSet
    }

    return final
}

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

function randomTile() {
    return randomValue(randomValue(tiles))
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
    science: new Yield("Science"),
    commerce: new Yield("Commerce"),
    culture: new Yield("Culture"),
    capital: new Yield("Capital")
}

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

/* Note: roads have not been implemented yet
var roadMaterial =  new THREE.MeshBasicMaterial( { 
    alphaMap: new THREE.TextureLoader().load("terrain/road_alpha.png"), 
    map: new THREE.TextureLoader().load("terrain/road.png"), 
    transparent: true, depthWrite: false,  side: THREE.DoubleSide } )
*/

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
 */
var terrainTypes = {
    grasslands: new Terrain("Grasslands", "terrain/grasslands.png", terrainVariety.land, { food: 2 }),
    grasslandsHills: new Terrain("Grasslands Hills", "terrain/grasslands-hills.png", terrainVariety.land, { food: 2, production: 1 }),
    plains: new Terrain("Plains", "terrain/plains.png", terrainVariety.land, { food: 1, production: 1 }),
    plainsHills: new Terrain("Plains Hills", "terrain/plains-hills.png", terrainVariety.land, { food: 1, production: 2 }),
    tundra: new Terrain("Tundra", "terrain/tundra.png", terrainVariety.land, { food: 1 }),
    tundraHills: new Terrain("Tundra Hills", "terrain/tundra-hills.png", terrainVariety.land, { food: 1, production: 1 }),
    tundraWetlands: new Terrain("Tundra Wetlands", "terrain/tundra-wetlands.png", terrainVariety.land, { food: 2 }),
    desert: new Terrain("Desert", "terrain/desert.png", terrainVariety.land, { production: 1 }),
    desertFloodplains: new Terrain("Desert Floodplains", "terrain/desert-floodplains.png", terrainVariety.land, { food: 2, production: 1 }),
    desertHills: new Terrain("Desert Hills", "terrain/desert-hills.png", terrainVariety.land, { production: 2 }),
    snow: new Terrain("Snow", "terrain/snow.png", terrainVariety.land, {}),
    snowHills: new Terrain("Snow Hills", "terrain/snow-hills.png", terrainVariety.land, { production: 1 }),
    coast: new Terrain("Coast", "terrain/coast.png", terrainVariety.sea, { food: 1, commerce: 1 }),
    ocean: new Terrain("Ocean", "terrain/ocean.png", terrainVariety.sea, {}),
    lake: new Terrain("Lake", "terrain/lake.png", terrainVariety.sea, { food: 2 }),
    ice: new Terrain("Ice", "terrain/ice.png", terrainVariety.sea, {})
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
    notRiver: Symbol("notRiver")
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
                case requirements.coastal: confirm = (nearby(tile, 1).filter(x => x.terrain == terrainTypes.coast).length > 0); break;
                case requirements.notCoastal: confirm = !(nearby(tile, 1).filter(x => x.terrain == terrainTypes.coast).length > 0); break;
                case requirements.savanna: confirm = (tile.features.includes(features.savanna)); break;
                case requirements.notSavanna: confirm = (!tile.features.includes(features.savanna)); break;
                case requirements.river: confirm = (tile.hasRiver); break;
                case requirements.notRiver: confirm = (!tile.hasRiver); break;
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
    forest: new Feature("Forest", 'lowpoly_forest.glb', { scale: .15 }),
    mesa: new Feature("Mesa", 'mesa.glb', { offsetZ: -.05, scale: .6 }),
    savanna: new Feature("Savanna", 'savanna.glb', { scale: .025 })
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
                if (!reachable.map(x => x.tile).includes(t(e.tile, d))) {
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
    tiles.forEach(z => z.forEach(function (e) {
        e.face.remove(e.reachableOverlay)
        e.reachableOverlay = undefined
        e.reachableBorders.forEach(x => e.face.remove(x))
        e.reachableBorders = []
        if (e.attackOverlay != undefined) {
            e.face.remove(e.attackOverlay)
            e.attackOverlay = undefined
        }
    }))
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

var players = [new Civilization(), new Civilization(), new Animals()]
activePlayer = players[0]

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


var mapSizeX = 50
var mapSizeY = 35
var tiles = []
var flatArrayTiles = []
for (var i = 0; i < mapSizeX; i++) {
    tiles.push([])
    for (var e = 0; e < mapSizeY; e++) {
        tiles[i].push(new Tile({ x: i, y: e }))
        flatArrayTiles.push(tiles[i][e])
    }
}

function setElevation(pos, length) {
    var lengthModifier = 1
    if (visitedTiles.filter(x => x.position.x == pos.x && x.position.y == pos.y).length < 1) {
        lengthModifier = alreadyVisitedModifier
    }
    visitedTiles.push(tiles[pos.x][pos.y])

    if (tiles[pos.x][pos.y].depth > maxDepth) {
        return
    }
    tiles[pos.x][pos.y].depth = Math.max(1 + length, tiles[pos.x][pos.y].depth + length * lengthAdditionModifier * lengthModifier)

    length -= lengthDecreaseAmount
    if (length <= minimumLengthToContinue) {
        return
    }

    var noLoss = [false, false, false, false, false, false]
    if (Math.random() < chanceToBeSameElevation) {
        noLoss[randomIndex(noLoss)] = true
    }

    for (var d = 0; d < directions.length; d++) {
        if (Math.random() > chanceToContinue) {
            setElevation(t(pos, directions[d]), noLoss[d] ? (length + lengthDecreaseAmount) : length)
        }
    }
}

function spreadTerrain(tile, terrain, length) {
    tile.terrain = terrain

    for (var d = 0; d < directions.length; d++) {
        if (length < ((terrain == terrainTypes.desert ? (maxSpreadTerrainDesert) : (maxSpreadTerrainPlains)) * Math.random()) + minimumSpreadTerrain
            && t(tile, directions[d]).depth > 1
            && !t(tile, directions[d]).terrain.name.includes("Tundra")
            && !t(tile, directions[d]).terrain.name.includes("Snow")
            && t(tile, directions[d]).terrain != terrain) {
            spreadTerrain(t(tile, directions[d]), terrain, length + 1)
        }
    }
}

function setRiver(tile) {
    if (tile.hasRiver) {
        return
    }

    var possibilities = []

    for (var d = 0; d < directions.length; d++) {
        if (t(tile, directions[d]).depth < tile.depth
            && !t(tile, directions[d]).features.includes(features.mountain)
            && !t(tile, directions[d]).features.includes(features.mesa)) {
            possibilities.push({ direction: d, tile: t(tile, directions[d]) })
        }
    }

    if ((possibilities.length == 0 && tile.terrain != terrainTypes.coast && tile.terrain != terrainTypes.ocean && tile.terrain != terrainTypes.ice)
        || tile.terrain == terrainTypes.snow) {
        tile.terrain = terrainTypes.lake
        tile.depth = Math.max(1, tile.depth - .15)
        return false
    } else if (possibilities.length == 0) {
        return false
    }

    var nextTile
    if (Math.random() < chanceToIgnoreDeepestTile) {
        nextTile = randomValue(possibilities)
    } else {
        nextTile = possibilities.sort(function (x, y) { return y.depth - x.depth })[0]
    }
    setRiver(nextTile.tile)
    nextTile.tile.riverDirections[(nextTile.direction + 3) % 6] = true
    tile.riverDirections[nextTile.direction] = true
    tile.hasRiver = true
    if (tile.terrain == terrainTypes.desert) {
        tile.terrain = terrainTypes.desertFloodplains
    }
    if (tile.terrain == terrainTypes.tundra) {
        tile.terrain = terrainTypes.tundraWetlands
    }

    return true
}

function setMountainRange(tile, length) {
    if (tile.terrain == terrainTypes.desertFloodplains) {
        tile.features.push(features.mesa)
        tile.terrain = terrainTypes.desert
    } else {
        tile.features.push(features.mountain)
    }

    for (var d = 0; d < directions.length; d++) {
        if (t(tile, directions[d]).depth > 1
            && t(tile, directions[d]).terrain != terrainTypes.lake
            && t(tile, directions[d]).terrain != terrainTypes.desert
            && !t(tile, directions[d]).hasRiver
            && Math.abs(t(tile, directions[d]).depth - tile.depth) < .45
            && !t(tile, directions[d]).features.includes(features.mountain)
            && !t(tile, directions[d]).features.includes(features.mesa)
            && (Math.random() > chanceToContinueMountain * (length - 1))) {
            t(tile, directions[d]).depth = tile.depth
            setMountainRange(t(tile, directions[d]), length + 1)
            return
        }
    }
}

function setForest(tile, length) {
    tile.features.push(features.forest)

    for (var d = 0; d < directions.length; d++) {
        if (Math.abs(t(tile, directions[d]).depth - tile.depth) < .3
            && t(tile, directions[d]).depth > 1
            && t(tile, directions[d]).terrain != terrainTypes.lake
            && t(tile, directions[d]).terrain != terrainTypes.desert
            && t(tile, directions[d]).terrain != terrainTypes.desertFloodplains
            && t(tile, directions[d]).terrain != terrainTypes.snow
            && !t(tile, directions[d]).features.includes(features.forest)
            && !t(tile, directions[d]).features.includes(features.savanna)
            && (Math.random() > chanceToContinueForest * (length - 1))) {
            setForest(t(tile, directions[d]), length + 1)
        }
    }
}

var visitedTiles = []
for (var i = 0; i < minimumInitialElevations || Math.random() > chanceToNotContinueElevations; i++) {
    var pos = { x: randomIndex(tiles), y: randomIndex(tiles[0]) }
    setElevation(pos, startingElevationVariance * Math.random() + startingElevationBase)
    visitedTiles = []
}

for (var i = 0; i < 300; i++) {
    var islandSource = randomTile()
    if (nearby(islandSource, 6).filter(x => x.depth > 1).length == 0) {
        setElevation(islandSource.position, startingElevationVariance * Math.random() + startingElevationBase / 4)
    }
}

tiles.forEach(x => x.forEach(function (e) {
    if (e.depth > 1) {
        e.terrain = terrainTypes.grasslands
    } else {
        e.terrain = terrainTypes.ocean
    }
}))

tiles.forEach(x => x.forEach(function (e) {
    if ((e.position.y < (6 + 3 * Math.random()) || e.position.y > mapSizeY - (6 + 3 * Math.random())) &&
        (e.terrain == terrainTypes.grasslands)) {
        e.terrain = terrainTypes.tundra
    }

    if ((e.position.y < (3 + 2 * Math.random()) || e.position.y > mapSizeY - (3 + 2 * Math.random())) &&
        (e.terrain == terrainTypes.grasslands || e.terrain == terrainTypes.tundra)) {
        e.terrain = terrainTypes.snow
        e.features = []
    }

    if (e.position.y < (0 + 2 * Math.random()) || e.position.y > mapSizeY - (1 + 2 * Math.random())) {
        e.depth = 1
        e.terrain = terrainTypes.ice
        e.features = []
    }

    if ((e.position.y < (10) || e.position.y > mapSizeY - (10))) {
        var distance = Math.min(e.position.y, mapSizeY - e.position.y)
        e.depth = Math.pow(Math.abs(e.depth), distance / 12 + 1 / 6)
    }
}))

var desertsCreated = 0
for (var i = 0; i < 500 && desertsCreated < desertsLimit; i++) {
    var desertSource = randomTile()
    if (desertSource.depth > 1 && desertSource.terrain != terrainTypes.snow && desertSource.terrain != terrainTypes.tundra) {
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

for (var i = 0; i < 4; i++) {
    tiles.forEach(x => x.forEach(function (e) {
        if ((nearby(e, 1).filter(x => x.terrain == terrainTypes.plains || x.terrain == terrainTypes.desert).length > 1)
            && e.terrain == terrainTypes.grasslands) {
            e.terrain = terrainTypes.plains
        }
    }))
}

var riversCreated = 0
var riverSource
for (var i = 0; i < 5000 && riversCreated < riversLimit; i++) {
    riverSource = randomTile()
    if (riverSource.depth > 1
        && !nearby(riverSource, 3).some(x => x.hasRiver)
        && !nearby(riverSource, 2).some(y => y.terrain.variety == terrainVariety.sea)) {
        if (!riverSource.hasRiver && setRiver(riverSource)) {
            setMountainRange(riverSource, 0)
        }

        riversCreated++
    }
}

var forestsCreated = 0
var forestSource
for (var i = 0; i < 500 && forestsCreated < forestsLimit; i++) {
    forestSource = randomTile()
    if (forestSource.depth > 1
        && !forestSource.features.includes(features.forest)
        && !forestSource.features.includes(features.savanna)
        && forestSource.terrain != terrainTypes.desert
        && forestSource.terrain != terrainTypes.lake
        && forestSource.terrain != terrainTypes.desertFloodplains
        && forestSource.terrain != terrainTypes.snow
        && nearby(forestSource, 7).filter(x => x.features.includes(features.forest)).length < 1
        && nearby(forestSource, 7).filter(x => x.features.includes(features.savanna)).length < 1) {
        setForest(forestSource, 0)
        forestsCreated++
    }
}

tiles.forEach(function (x) {
    x.forEach(function (e) {
        if (terrainTypes[e.terrain.name.toLowerCase() + "Hills"] != undefined && Math.random() > .6 && !e.hasRiver) {
            e.terrain = terrainTypes[e.terrain.name.toLowerCase() + "Hills"]
        }
    })
})

tiles.forEach(function (x) {
    x.forEach(function (e) {
        if (e.terrain == terrainTypes.plains
            && e.features.length == 0
            && (nearby(e, 1).filter(x => x.features.includes(features.forest)).length > 0
                || nearby(e, 1).filter(x => x.terrain == terrainTypes.desert).length > 0)) {
            e.features.push(features.savanna)
        }
    })
})

tiles.forEach(function (x) {
    x.forEach(function (e) {
        if (e.terrain == terrainTypes.ocean && directions.some(direction => t(e, direction).terrain != terrainTypes.ocean && t(e, direction).terrain != terrainTypes.coast)) {
            e.terrain = terrainTypes.coast
        }
    })
})

var coastalTiles = []
tiles.forEach(function (x) {
    x.forEach(function (e) {
        if (e.terrain == terrainTypes.coast) {
            coastalTiles.push(e)
        }
    })
})

coastalTiles.forEach(function (e) {
    for (var d = 0; d < directions.length; d++) {
        if (Math.random() < chanceToSpreadCoast && t(e, directions[d]).terrain == terrainTypes.ocean) {
            t(e, directions[d]).terrain = terrainTypes.coast
        }
    }
})

tiles.forEach(function (x) {
    x.forEach(function (e) {
        if (e.depth > 1) {
            e.depth = 1 + depthMultiplier * (Math.pow(Math.abs(e.depth), .4) - 1)
        }
    })
});

var resourceChance = .05
tiles.forEach(function (x) {
    x.forEach(function (e) {
        if (Math.random() < resourceChance
            && e.resource == undefined
            && !e.features.includes(features.mountain)
            && e.terrain != terrainTypes.ice) {
            var escape = false
            for (var i = 0; i < 5 && !escape; i++) {
                var resource = randomValueObj(resources)
                if (testRequirements(resource.requirements, e)) {
                    escape = true
                    e.resource = resource
                    if (e.terrain == terrainTypes.ocean) {
                        e.terrain = terrainTypes.coast
                    }
                }
            }
        }
    })
});

tiles.forEach(function (x) {
    x.forEach(function (e) {
        if (nearby(e, 2).filter(x => x.resource != undefined).length == 0) {
            var escape = false
            for (var i = 0; i < 500 && !escape; i++) {
                var resource = randomValueObj(resources)
                if (testRequirements(resource.requirements, e)
                    && !e.features.includes(features.mountain)
                    && e.terrain != terrainTypes.ice) {
                    escape = true
                    e.resource = resource
                    if (e.terrain == terrainTypes.ocean) {
                        e.terrain = terrainTypes.coast
                    }
                }
            }
        }
    })
});

players.filter(x => x instanceof Civilization).forEach(function (p) {
    var esc = false

    while (!esc) {
        var spawnPoint = randomTile()

        if ([terrainTypes.grasslands, terrainTypes.plains].includes(spawnPoint.terrain)
            && !spawnPoint.features.includes(features.mountain)
            && nearby(spawnPoint, 3).filter(x => x.resource != undefined).length > 4
            && nearby(spawnPoint, 10).filter(x => x.units.length > 0).length == 0) {
            var nearbyPoint
            nearby(spawnPoint, 4).forEach(function(tile){
                if(!nearby(spawnPoint, 3).includes(tile) && tile.depth > 1 && !tile.features.includes(features.mountain)) {
                    nearbyPoint = tile
                }
            })

            if (nearbyPoint != undefined) {
                p.units.push(new Unit([unitTypes.settler, unitTypes.warrior], p, spawnPoint.position))
                p.units.push(new Unit(unitTypes.settler, p, nearbyPoint.position))
                esc = true
            }
        }
    }
})

var maxOffsetX = mapSizeX * Math.sqrt(3) * hexagonSize
var mapOffset = { x: maxOffsetX, y: 0 }

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
camera.position.x = initialCameraOffsetX
camera.position.y = initialCameraOffsetY
camera.rotation.order = "ZXY"

function calculateBorders() {
    tiles.forEach(z => z.forEach(function (e) {
        if (e.player != undefined) {
            if (e.borderMeshes != undefined && e.borderMeshes.length > 0) {
                for (var i = 0; i < e.borderMeshes.length; i++) {
                    e.face.remove(e.borderMeshes[i])
                }
            }
            e.borderMeshes = []
            for (var d = 0; d < directions.length; d++) {
                if (t(e, directions[d]).player != e.player) {
                    e.borderMeshes.push(ownerBorders[d].clone())
                    e.face.add(e.borderMeshes.last())
                    e.borderMeshes.last().material.color = e.player.borderColor

                    e.borderMeshes.push(gradientBorders[d].clone())
                    e.face.add(e.borderMeshes.last())
                    e.borderMeshes.last().material = e.player.borderGradientMaterial
                }
            }
        }
    }))

    cameraMove()
}

function cameraMove() {
    if (!modelsLoaded) {
        return
    }

    tiles.forEach(function (x) {
        x.forEach(function (e) {
            e.face.position.x = (((2 * e.position.x + (e.position.y % 2 == 0 ? 0 : 1)) * Math.sqrt(3) / 2 * hexagonSize) + mapOffset.x) % maxOffsetX
            e.face.position.y = (hexagonSize * 3 / 2 * e.position.y) + mapOffset.y - (activeSettlement == undefined ? (camera.position.z - minimumScrollIn) : 0)
        })
    })
}

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
    tiles.forEach(function (x) {
        x.forEach(function (e) {
            e.active = false;
        })
    })

    raycaster.setFromCamera(mouseVector, camera);
    intersects = raycaster.intersectObjects(scene.children)
    if (intersects[0] != undefined && intersects[0].object != undefined) {
        if (intersects[0].object.gamePosition != undefined) {
            activeTile = tiles[intersects[0].object.gamePosition.x][intersects[0].object.gamePosition.y]
            activeTile.active = true
        }
    }

    if (activeTile != previousActiveTile) {
        Unit.displayPaths(selectedUnits, activeTile)
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
    tiles.forEach(function (x) {
        x.forEach(function (e) {
            if (e.active) {
                e.face.position.z = e.depth// + Math.min(.1, e.face.position.z - e.depth + 0.1)
                if (e.attackOverlay != undefined) {
                    e.attackOverlay.rotation.z += .05
                }
                if (e.attackOverlay != undefined || e.developIcon != undefined || e.clearIcon != undefined || e.districtIcon != undefined) {
                    document.body.style.cursor = "pointer"
                }
            } else {
                e.face.position.z = e.depth //+ Math.max(0, e.face.position.z - e.depth - 0.1)
            }

            if (e.active || (viewedSettlement != undefined && viewedSettlement.tiles.includes(e))) {
                e.yieldHolderDIV.style.opacity = "1"
            } else {
                e.yieldHolderDIV.style.opacity = "0"
            }

            if (e.face.material != undefined && e.face.material.opacity < 1) {
                e.face.material.opacity += .1
                if (e.face.material.opacity >= 1) {
                    e.face.material = e.terrain.material
                }
            }
        })
    })

    stats.end();
    requestAnimationFrame(animate);
}

function allModelsLoaded() {
    modelsToLoad--
    if (modelsToLoad == 0) {
        tiles.forEach(function (x) {
            x.forEach(function (e) {
                e.initialize()
            })
        })

        hideTooltip()
        modelsLoaded = true
        animate();
        cameraMove()
        players[0].units[0].tile.centerCameraOnTile()
        players[0].units[0].foundSettlement()
        players[0].units[1].foundSettlement()
        players[0].detectSeen()
        players[0].beginTurn()
        Settlement.changeCityInfoPanel(0)
    }
}