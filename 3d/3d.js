
var versionNumber = "0.0"
var versionTitle = "Initial"

var scene = new THREE.Scene();
//var cssScene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 50);
var clock = new THREE.Clock();
var loader = new THREE.GLTFLoader();
var renderer = new THREE.WebGLRenderer();
var cssRenderer = new THREE.CSS2DRenderer();
var raycaster = new THREE.Raycaster();
raycaster.far = 25;
var mouseVector = new THREE.Vector2();
document.body.appendChild(renderer.domElement);
document.body.appendChild(cssRenderer.domElement);
cssRenderer.domElement.id = "cssRenderer"

window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.onresize();

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
var activeCityInfoPanel = 0

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];
var directions = ["r", "dr", "dl", "l", "ul", "ur"]
var hexagonSize = 1
var hexagonShape = new THREE.Shape();
hexagonShape.moveTo(0, -hexagonSize)
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(0, hexagonSize);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, hexagonSize / 2);
hexagonShape.lineTo(-Math.sqrt(3) * hexagonSize / 2, -hexagonSize / 2);
hexagonShape.lineTo(0, -hexagonSize)

var hexagonAlpha = new THREE.TextureLoader().load("terrain/alpha.png")
var hexagonGeometry = new THREE.PlaneBufferGeometry(Math.sqrt(3) * hexagonSize, 2.05 * hexagonSize, 1, 1)

function makeTileBorderMeshes(standardDisplacement, partialTowardsCenter, smallAmount, farBeginning, slightlyClose, offsetClose, meshProperties) {

    var shapes = [new THREE.Shape(), new THREE.Shape(), new THREE.Shape(), new THREE.Shape(), new THREE.Shape(), new THREE.Shape()]
    //R
    shapes[0].moveTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
    shapes[0].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
    shapes[0].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement - smallAmount)
    shapes[0].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement)
    shapes[0].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement + smallAmount)
    shapes[0].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
    //DR
    shapes[1].moveTo(0, -hexagonSize)
    shapes[1].lineTo(-hexagonSize * farBeginning, -hexagonSize * offsetClose)
    shapes[1].lineTo(0, -hexagonSize * slightlyClose)
    shapes[1].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement)
    shapes[1].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement + smallAmount * 2)
    shapes[1].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
    shapes[1].lineTo(0, -hexagonSize)
    //DL
    shapes[2].moveTo(0, -hexagonSize)
    shapes[2].lineTo(hexagonSize * farBeginning, -hexagonSize * offsetClose)
    shapes[2].lineTo(0, -hexagonSize * slightlyClose)
    shapes[2].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement)
    shapes[2].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement + smallAmount * 2)
    shapes[2].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
    shapes[2].lineTo(0, -hexagonSize)
    //L
    shapes[3].moveTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
    shapes[3].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, -hexagonSize * standardDisplacement)
    shapes[3].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement - smallAmount)
    shapes[3].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, -hexagonSize * standardDisplacement)
    shapes[3].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement + smallAmount)
    shapes[3].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
    //UL
    shapes[4].moveTo(0, hexagonSize)
    shapes[4].lineTo(hexagonSize * farBeginning, hexagonSize * offsetClose)
    shapes[4].lineTo(0, hexagonSize * slightlyClose)
    shapes[4].lineTo(-Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement)
    shapes[4].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement - smallAmount)
    shapes[4].lineTo(-Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
    shapes[4].lineTo(0, hexagonSize)
    //UR
    shapes[5].moveTo(0, hexagonSize)
    shapes[5].lineTo(-hexagonSize * farBeginning, hexagonSize * offsetClose)
    shapes[5].lineTo(0, hexagonSize * slightlyClose)
    shapes[5].lineTo(Math.sqrt(3) * hexagonSize * partialTowardsCenter, hexagonSize * standardDisplacement)
    shapes[5].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement - smallAmount)
    shapes[5].lineTo(Math.sqrt(3) * hexagonSize * standardDisplacement, hexagonSize * standardDisplacement)
    shapes[5].lineTo(0, hexagonSize)

    var borders = []
    for (var i = 0; i < directions.length; i++) {
        borders[i] = new THREE.Mesh(
            new THREE.ExtrudeBufferGeometry(shapes[i], meshProperties),
            new THREE.MeshLambertMaterial({ color: reachableOverlayColor })
        );
        borders[i].position.z = maxDepth + .01
    }
    return borders
}
var ownerBorders = makeTileBorderMeshes(.5, .44, 0, 0, .95, .9, { depth: .08, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: .05, bevelThickness: .05 })
var reachableBorders = makeTileBorderMeshes(.5, .35, .1, .1, .85, .95, { depth: .02, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: .05, bevelThickness: .05 })


var keys = {
    87: { keydown: function () { }, keyup: function () { }, active: false }, // up
    83: { keydown: function () { }, keyup: function () { }, active: false }, // down
    65: { keydown: function () { }, keyup: function () { }, active: false }, // left
    68: { keydown: function () { }, keyup: function () { }, active: false },  // right
    13: { keydown: function () { players[0].endTurn() }, keyup: function () { }, active: false }
}

$(document).on("dragstart", function (e) {
    if (e.target.nodeName.toUpperCase() == "IMG") {
        return false;
    }
});

var dontHideReachable = false
window.addEventListener('mousemove', function (eventData) {
    cursor.y = eventData.pageY;
    cursor.x = eventData.pageX;
    cursor.lastMoved = 0;

    if (cursor.active) {
        mapOffset.x += eventData.movementX / 100
        if (mapOffset.x < 0) {
            mapOffset.x = maxOffsetX
        }
        mapOffset.y -= eventData.movementY / 100
    }

    cameraMove()
    dontHideReachable = true

    mouseVector.x = (eventData.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = - ((eventData.clientY - 5) / window.innerHeight) * 2 + 1;
});

window.addEventListener('mousedown', function (eventData) {
    if (eventData.which === 1) { //left
        if (renderer.domElement.matches(':hover')) {
            cursor.active = true;
            dontHideReachable = false
        }
    }
})

$(document).mouseleave(function () {
    cursor.active = false
});

$("body").mouseup(function (eventData) {
    if (renderer.domElement.matches(':hover')) {
        if (eventData.which === 1) { //left
            cursor.active = false;

            if (!dontHideReachable) {
                Settlement.hideInfo()
                activeUnit = undefined
                document.getElementById("unitactions").style.right = "-500px"
                hideReachable()

                if ((activeSelection == 0 || activeSelection == 1)
                    && (activeSelection == 1 || !activeTile.developed)
                    && (activeSelection == 0 || activeTile.features.includes(features.forest) || activeTile.features.includes(features.savanna))
                    && activeSettlement.tiles.includes(activeTile)
                    && activeTile.getDevelopment()) {
                    activeSettlement.producible[activeSelection].target = activeTile
                    activeSettlement.setProduction(activeSelection)
                    activeSelection = undefined
                    activeSettlement.select("working")
                }

                if (activeSettlement != undefined &&
                    (hoveredUnit != undefined || (activeTile != undefined && activeTile.player != activeSettlement.player))) {
                    activeSettlement.deselect()
                }
            }

            if (hoveredUnit != undefined && hoveredUnit.determineReachable().length > 0) {
                hoveredUnit.select()
            }
        } else if (eventData.which === 3) { //right
            if (activeTile != undefined && activeTile.reachableOverlay != undefined && activeTile != tiles[activeUnit.pos.x][activeUnit.pos.y]) {
                if (activeUnit.disabled) {
                    activeUnit.activate()
                }
                activeUnit.move(activeTile.position, activeTile.reachableOverlay.reachableDistance)
            }

            if (activeSettlement != undefined) {
                activeSettlement.deselect()
            }
        } else { //midle

        }
    }
})

document.body.addEventListener('wheel', function (event) {
    if (renderer.domElement.matches(':hover')) {
        camera.position.z += event.deltaY / 5
        if (camera.position.z > minimumScrollOut) {
            camera.position.z = minimumScrollOut
        } else if (camera.position.z < minimumScrollIn) {
            camera.position.z = minimumScrollIn
        }
        if (activeSettlement == undefined) {
            camera.rotation.x = cameraRotationBase * (1 - (camera.position.z - minimumScrollIn) / (minimumScrollOut - minimumScrollIn))
        }
        cameraMove()
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


function t(pos, direction) {
    var used = pos
    var returnPosition = true
    var final
    if (pos.x == undefined) {
        used = pos.position
        returnPosition = false
    }

    switch (direction) {
        case "l": final = { x: used.x - 1, y: used.y }; break;
        case "r": final = { x: used.x + 1, y: used.y }; break;
        case "ul": final = { x: used.x + (used.y % 2 == 0 ? -1 : 0), y: used.y + 1 }; break;
        case "ur": final = { x: used.x + (used.y % 2 == 0 ? 0 : 1), y: used.y + 1 }; break;
        case "dl": final = { x: used.x + (used.y % 2 == 0 ? -1 : 0), y: used.y - 1 }; break;
        case "dr": final = { x: used.x + (used.y % 2 == 0 ? 0 : 1), y: used.y - 1 }; break;
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
    gold: new Yield("Gold"),
    culture: new Yield("Culture")
}
var terrainAlpha = new THREE.TextureLoader().load("terrain/alpha.png");
var riverMaterial = new THREE.MeshLambertMaterial({
    alphaMap: new THREE.TextureLoader().load("terrain/river_alpha.png"),
    map: new THREE.TextureLoader().load("terrain/river.png"),
    transparent: true, depthWrite: false, side: THREE.DoubleSide
})

/* Note: roads have not been implemented yet
var roadMaterial =  new THREE.MeshLambertMaterial( { 
    alphaMap: new THREE.TextureLoader().load("terrain/road_alpha.png"), 
    map: new THREE.TextureLoader().load("terrain/road.png"), 
    transparent: true, depthWrite: false,  side: THREE.DoubleSide } )
*/

/**
 * Whether a Terrain is 'land' or 'sea'
 * @enum {string}
 */
var terrainVariety = {
    land: "land",
    sea: "sea"
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
    coast: new Terrain("Coast", "terrain/coast.png", terrainVariety.sea, { food: 1, gold: 1 }),
    ocean: new Terrain("Ocean", "terrain/ocean.png", terrainVariety.sea, {}),
    lake: new Terrain("Lake", "terrain/lake.png", terrainVariety.sea, { food: 2 }),
    ice: new Terrain("Ice", "terrain/ice.png", terrainVariety.sea, {})
}

/**
 * Requirements that things like Resources use to determine which Tiles they can generate on
 * @enum {string}
 */
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

/**
 * Used to check a Tile against a list of requirements given, i.e. a Resource to check whether it can spawn on a tile
 * @param {Tile} tile The Tile being checked by the requirements.
 * @param {requirements} requirementsList A list of requirements that a Tile must pass to return true
 * @return {boolean} Whether the Tile passes all of the requirements listed
 */
function testRequirements(tile, requirementsList) {
    // the final return value that, while true, will be checked against the 'requirementsList' and set to false if it fails any of them
    var confirm = true

    requirementsList.forEach(function (e) {
        switch (e) {
            case requirements.forest: confirm = !confirm ? false : (tile.features.includes(features.forest)); break;
            case requirements.notForest: confirm = !confirm ? false : (!tile.features.includes(features.forest)); break;
            case requirements.hills: confirm = !confirm ? false : (tile.terrain.name.includes("Hill")); break;
            case requirements.notHills: confirm = !confirm ? false : (!tile.terrain.name.includes("Hill")); break;
            case requirements.land: confirm = !confirm ? false : (tile.terrain.variety == terrainVariety.land); break;
            case requirements.notLand: confirm = !confirm ? false : (tile.terrain.variety != terrainVariety.land); break;
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

    return confirm
}

var developments = {
    farm: new Development("Farm", { food: 1 }),
    plantation: new Development("Plantation", { gold: 1 }),
    fishery: new Development("Fishery", { food: 1 }),
    mine: new Development("Mine", { gold: 1 }),
    quarry: new Development("Quarry", { production: 1 }),
    pasture: new Development("Pasture", { food: 1 }),
    reserve: new Development("Reserve", { gold: 1 }),
    sawmill: new Development("Sawmill", { production: 1 })
}

var resources = {
    aggregate: new Resource("Aggregate", developments.quarry, { production: 2 }, [requirements.notHills, requirements.land]),
    //aluminum: new Resource(""          , {}             , [])                      ,
    amber: new Resource("amber", developments.sawmill, { gold: 3 }, [requirements.forest]),
    banana: new Resource("Banana", developments.plantation, { food: 2 }, [requirements.standard, requirements.forest]),
    cattle: new Resource("Cattle", developments.pasture, { food: 2 }, [requirements.standard, requirements.notForest]),
    cinnamon: new Resource("Cinnamon", developments.plantation, { gold: 3 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    citrus: new Resource("Citrus", developments.plantation, { food: 1 }, [requirements.standard, requirements.notHills, requirements.forest]),
    clams: new Resource("Clams", developments.fishery, { gold: 3 }, [requirements.notLand, requirements.coastal]),
    cloves: new Resource("Cloves", developments.plantation, { gold: 3 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    coal: new Resource("Coal", developments.quarry, { production: 2 }, [requirements.land]),
    cocoa: new Resource("Cocoa", developments.quarry, { gold: 3 }, [requirements.standard, requirements.forest]),
    coffee: new Resource("Coffee", developments.plantation, { gold: 2, production: 1 }, [requirements.standard, requirements.forest]),
    copper: new Resource("Copper", developments.mine, { production: 2 }, [requirements.land]),
    corn: new Resource("Corn", developments.farm, { food: 2 }, [requirements.standard, requirements.notHills]),
    cotton: new Resource("Cotton", developments.plantation, { gold: 3 }, [requirements.standard, requirements.notHills]),
    crabs: new Resource("Crabs", developments.fishery, { gold: 2, food: 1 }, [requirements.notLand, requirements.coastal]),
    deer: new Resource("Deer", developments.reserve, { gold: 2, food: 1 }, [requirements.forest, requirements.notHill]),
    diamonds: new Resource("Diamonds", developments.mine, { gold: 4, production: 1 }, [requirements.hills]),
    elephants: new Resource("Elephants", developments.reserve, { gold: 4, food: 1 }, [requirements.savanna]),
    fish: new Resource("Fish", developments.fishery, { food: 2 }, [requirements.notLand, requirements.coastal]),
    furbearers: new Resource("Furbearers", developments.reserve, { gold: 2, food: 1 }, [requirements.forest]),
    gold: new Resource("Gold", developments.mine, { gold: 6 }, [requirements.hills]),
    grapes: new Resource("Grapes", developments.plantation, { gold: 2, food: 1 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    guano: new Resource("Guano", developments.mine, { production: 1, food: 1 }, [requirements.notStandard, requirements.coastal, requirements.land, requirements.notForest]),
    gypsum: new Resource("Gypsum", developments.quarry, { gold: 2, production: 1 }, [requirements.hills]),
    honeybees: new Resource("Honeybees", developments.pasture, { gold: 2, food: 1 }, [requirements.forest, requirements.standard]),
    horse: new Resource("Horse", developments.pasture, { production: 2 }, [requirements.standard, requirements.notHills]),
    iron: new Resource("Iron", developments.mine, { production: 2 }, [requirements.land]),
    jade: new Resource("Jade", developments.mine, { gold: 3 }, [requirements.hills]),
    latex: new Resource("Latex", developments.plantation, { gold: 2, production: 1 }, [requirements.forest, requirements.standard]),
    marble: new Resource("Marble", developments.quarry, { gold: 3 }, [requirements.hills]),
    mercury: new Resource("Mercury", developments.mine, { gold: 3 }, [requirements.hills]),
    murex: new Resource("Murex", developments.fishery, { gold: 3 }, [requirements.notLand, requirements.coastal]),
    nitre: new Resource("Nitre", developments.quarry, { production: 1, food: 1 }, [requirements.land]),
    //oil: new Resource("Oil"            , {production: 2}, [requirements.notForest]),
    olives: new Resource("Olives", developments.plantation, { gold: 3 }, [requirements.standard, requirements.notHills, requirements.coastal]),
    pigs: new Resource("Pigs", developments.pasture, { food: 2 }, [requirements.notHills, requirements.standard]),
    platinum: new Resource("Platinum", developments.mine, { production: 2, gold: 1 }, [requirements.land]),
    poppies: new Resource("Poppies", developments.plantation, { gold: 3 }, [requirements.standard, requirements.notHills]),
    potato: new Resource("Potato", developments.farm, { food: 2 }, [requirements.standard, requirements.notHills]),
    rice: new Resource("Rice", developments.farm, { food: 2 }, [requirements.standard, requirements.river]),
    sage: new Resource("Sage", developments.plantation, { gold: 3 }, [requirements.standard, requirements.notHills]),
    salt: new Resource("Salt", developments.mine, { gold: 1, production: 2 }, [requirements.land, requirements.notCoastal]),
    seaweed: new Resource("Seaweed", developments.fishery, { food: 2 }, [requirements.notLand, requirements.coastal]),
    sheep: new Resource("Sheep", developments.pasture, { food: 2 }, [requirements.land, requirements.notSnow]),
    silkworms: new Resource("Silkworms", developments.pasture, { gold: 3 }, [requirements.forest]),
    silver: new Resource("Silver", developments.mine, { gold: 2, production: 1 }, [requirements.land]),
    spices: new Resource("Spices", developments.plantation, { gold: 3 }, [requirements.coastal, requirements.land, requirements.notSnow, requirements.notTundra]),
    sugarcane: new Resource("Sugarcane", developments.plantation, { gold: 3 }, [requirements.land, requirements.coastal, requirements.notTundra, requirements.notSnow]),
    tea: new Resource("Tea", developments.plantation, { gold: 3 }, [requirements.standard, requirements.coastal]),
    tobacco: new Resource("Tobacco", developments.plantation, { gold: 3 }, [requirements.standard, requirements.coastal]),
    turtles: new Resource("Turtles", developments.fishery, { gold: 2, food: 1 }, [requirements.notLand, requirements.coastal]),
    //uranium: new Resource("Uranium"    , {production: 2}, [requirements.land])     ,
    whales: new Resource("Whales", developments.fishery, { gold: 2, food: 1 }, [requirements.notLand, requirements.coastal]),
    wheat: new Resource("Wheat", developments.farm, { food: 2 }, [requirements.standard]),
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
productionTileIcon.position.z = maxDepth + .02

var cultureTargetIcon = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("culture.png"),
    transparent: true, opacity: .4, depthTest: false
}))
cultureTargetIcon.position.z = .02
cultureTargetIcon.scale.set(2, 2, 2)

var tileMeshGeometry = new THREE.ExtrudeBufferGeometry(hexagonShape, { depth: maxDepth, bevelEnabled: false })
var tileMeshMaterial = new THREE.MeshLambertMaterial({ color: "#050505" })

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
            e.tile.reachableOverlay.position.z = maxDepth + .08
            e.tile.mesh.add(e.tile.reachableOverlay)

            e.tile.reachableBorders = []
            directions.forEach(function (d, index) {
                if (!reachable.map(x => x.tile).includes(t(e.tile, d))) {
                    e.tile.reachableBorders.push(reachableBorders[index].clone())
                    e.tile.mesh.add(e.tile.reachableBorders[e.tile.reachableBorders.length - 1])
                }
            })
        })
    }
}

function hideReachable() {
    if (!modelsLoaded) {
        return
    }

    reachableIsRendered = false
    tiles.forEach(z => z.forEach(function (e) {
        e.mesh.remove(e.reachableOverlay)
        e.reachableOverlay = undefined
        e.reachableBorders.forEach(x => e.mesh.remove(x))
        e.reachableBorders = []
    }))
    renderer.renderLists.dispose();
}

var notifications = [
    new Notification("City Production", "notifications/production.png", function (p) {
        return p.settlements.filter(x => x.producingID == undefined).length > 0
    }, function () {
        Settlement.changeCityInfoPanel(0)
        activePlayer.settlements.filter(x => x.producingID == undefined)[0].displayInfo()
        activePlayer.settlements.filter(x => x.producingID == undefined)[0].tile.centerCameraOnTile()
    }), new Notification("Unit Movement", "notifications/unit.png", function (p) {
        return p.units.filter(x => !x.disabled).length > 0
    }, function () {
        var targetUnit = activePlayer.units.filter(x => !x.disabled)[0]

        if (activePlayer.units.filter(x => !x.disabled).includes(activeUnit)) {
            targetUnit = activePlayer.units.filter(x => !x.disabled)[(activePlayer.units.filter(x => !x.disabled).indexOf(activeUnit) + 1) % activePlayer.units.filter(x => !x.disabled).length]
        }

        if (activeSettlement != undefined) {
            activeSettlement.deselect()
        }

        if(targetUnit != undefined){
            targetUnit.tile().centerCameraOnTile()
            targetUnit.select()
        } else {
            activePlayer.updateNotifications()
        }
    })
]

var actions = {
    wait: new Action("Wait", "wait.png", function () {
        if (activeUnit != undefined) {
            activeUnit.wait()
        }
    }),
    sleep: new Action("Sleep", "sleep.png", function () {
        if (activeUnit != undefined) {
            activeUnit.sleep()
        }
    }),
    wakeUp: new Action("Wake Up", "wake.png", function () {
        if (activeUnit != undefined) {
            activeUnit.wakeUp()
        }
    }),
    settle: new Action("Settle", "settle.png", function () {
        if (activeUnit != undefined && activeUnit.determineReachable().length > 1) {
            activeUnit.foundSettlement()
        }
    }),
    move: new Action("Move", "move.png", function () {
        if (activeUnit != undefined) {
            activeUnit.moveButton()
        }
    })
}

var unitClasses = {
    infantry: new UnitClass("Infantry", false, []),
    ship: new UnitClass("Ship", false, []),
    settler: new UnitClass("Settler", false, [actions.settle])
}

var unitTypes = {
    infantry: new UnitType("Infantry", unitClasses.infantry, "infantry.png"),
    sea: new UnitType("Sea", unitClasses.ship, "sea.png"),
    settler: new UnitType("Settler", unitClasses.settler, "settler.png")
}


var players = [new Player(), new Player()]
activePlayer = players[0]

var producibleTypes = {
    develop: "develop",
    clear: "clear",
    unit: "unit"
}

function clearSelection() {
    if (activeSelection != undefined) {
        activeSelection = undefined
        activeSettlement.select("working")
    }
}

var activeSelection = undefined
var workedIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load("worked.png"), transparent: true, depthTest: false })
)

var unworkedIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load("unworked.png"), transparent: true, depthTest: false })
)

var developIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load("actions/build.png"),
        transparent: true, depthTest: false
    })
)

var clearIcon = new THREE.Sprite(
    new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load("actions/clear.png"),
        transparent: true, depthWrite: false
    })
)

var tileIcons = [workedIcon, unworkedIcon, developIcon, clearIcon]
tileIcons.forEach(function (e) {
    e.scale.set(.5, .5, .5)
    e.position.z = maxDepth + .3
    e.position.y = .6
})


var mapSizeX = 70
var mapSizeY = 50
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
    if ((riverSource.depth > 2.2 || (riverSource.depth > 1 && Math.random() < chanceToGenerateRiverDespiteDepth))
        && nearby(riverSource, 5).filter(x => x.hasRiver).length == 0) {
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
        if (e.terrain == terrainTypes.ocean &&
            ((t(e, "r").terrain != terrainTypes.ocean && (t(e, "r").terrain != terrainTypes.coast)) ||
                (t(e, "l").terrain != terrainTypes.ocean && (t(e, "l").terrain != terrainTypes.coast)) ||
                (t(e, "ur").terrain != terrainTypes.ocean && (t(e, "ur").terrain != terrainTypes.coast)) ||
                (t(e, "ul").terrain != terrainTypes.ocean && (t(e, "ul").terrain != terrainTypes.coast)) ||
                (t(e, "dr").terrain != terrainTypes.ocean && (t(e, "dr").terrain != terrainTypes.coast)) ||
                (t(e, "dl").terrain != terrainTypes.ocean && (t(e, "dl").terrain != terrainTypes.coast)))) {
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
                if (testRequirements(e, resource.requirements)) {
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
                if (testRequirements(e, resource.requirements)
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

players.forEach(function (p) {
    var esc = false

    while (!esc) {
        var spawnPoint = randomTile()

        if ([terrainTypes.grasslands, terrainTypes.plains].includes(spawnPoint.terrain)
            && !spawnPoint.features.includes(features.mountain)
            && nearby(spawnPoint, 3).filter(x => x.resource != undefined).length > 4
            && nearby(spawnPoint, 10).filter(x => x.getUnits().length > 0).length == 0) {
            var nearbyPoint
            directions.forEach(function (d) {
                if (t(spawnPoint, d).depth > 1 && !t(spawnPoint, d).features.includes(features.mountain)) {
                    nearbyPoint = t(spawnPoint, d)
                }
            })

            if (nearbyPoint != undefined) {
                p.units.push(new Unit(unitTypes.settler, p, spawnPoint.position))
                p.units.push(new Unit(unitTypes.infantry, p, nearbyPoint.position))

                esc = true
            }
        }
    }
})

var maxOffsetX = mapSizeX * Math.sqrt(3) * hexagonSize
var mapOffset = { x: maxOffsetX, y: 0 }
var activeUnit = undefined
var hoveredUnit = undefined
var activeSettlement = undefined
var viewedSettlement = undefined

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
loader.load('scene.gltf', function (gltf) {
    settlement = gltf.scene;
    settlement.rotation.x = Math.PI / 2

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
                    e.mesh.remove(e.borderMeshes[i])
                }
            }
            e.borderMeshes = []
            for (var d = 0; d < directions.length; d++) {
                if (t(e, directions[d]).player != e.player) {
                    e.borderMeshes.push(ownerBorders[d].clone())
                    e.mesh.add(e.borderMeshes[e.borderMeshes.length - 1])
                    e.borderMeshes[e.borderMeshes.length - 1].material.color = e.player.borderColor
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
            e.mesh.position.x = (((2 * e.position.x + (e.position.y % 2 == 0 ? 0 : 1)) * Math.sqrt(3) / 2 * hexagonSize) + mapOffset.x) % maxOffsetX
            e.mesh.position.y = (hexagonSize * 3 / 2 * e.position.y) + mapOffset.y - (activeSettlement == undefined ? (camera.position.z - minimumScrollIn) : 0)
        })
    })

    players.forEach(x => x.units.forEach(function (e) {
        e.icon.position.x = tiles[e.pos.x][e.pos.y].mesh.position.x
        e.icon.position.y = tiles[e.pos.x][e.pos.y].mesh.position.y + ((activeSettlement != undefined) ? (1) : (.4))
    }))
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
    delta = clock.getDelta()
    // annie.update(1000 * delta)
    // annieAlpha.update(1000 * delta)
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //cssRenderer.render( cssScene, camera );
    cssRenderer.render(scene, camera);

    cursor.lastMoved += delta

    activeTile = undefined
    tiles.forEach(function (x) {
        x.forEach(function (e) {
            e.active = false;
        })
    })

    hoveredUnit = undefined

    if (renderer.domElement.matches(':hover')) {
        raycaster.setFromCamera(mouseVector, camera);
        intersects = raycaster.intersectObjects(scene.children)
        if (intersects[0] != undefined && intersects[0].object != undefined) {
            if (intersects[0].object.gamePosition != undefined) {
                activeTile = tiles[intersects[0].object.gamePosition.x][intersects[0].object.gamePosition.y]
                activeTile.active = true
            } else if (intersects[0].object.unitID != undefined) {
                hoveredUnit = players[intersects[0].object.playerID].units[intersects[0].object.unitID]
                activeTile = tiles[hoveredUnit.pos.x][hoveredUnit.pos.y]
                activeTile.active = true
            }
        }
    }

    if (activeTile != undefined && cursor.lastMoved > .25) {
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

    tiles.forEach(function (x) {
        x.forEach(function (e) {
            if (e.active) {
                e.mesh.position.z = e.depth + Math.min(.2, e.mesh.position.z - e.depth + 0.1)
            } else {
                e.mesh.position.z = e.depth + Math.max(0, e.mesh.position.z - e.depth - 0.1)
            }
        })
    })

    players.forEach(x => x.units.forEach(function (e) {
        e.icon.position.z = tiles[e.pos.x][e.pos.y].mesh.position.z + maxDepth + unitIconHoverAboveTile
    }))

    for (var i = 0; i < players.length; i++) {
        for (var e = 0; e < players[i].units.length; e++) {
            players[i].units[e].icon.playerID = i
            players[i].units[e].icon.unitID = e
        }
    }
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
        players[0].units[0].tile().centerCameraOnTile()
        players[0].detectSeen()
        players[0].beginTurn()
        Settlement.changeCityInfoPanel(0)
    }
}