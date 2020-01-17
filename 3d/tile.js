/**
 * A single space on the game map that can have settlements, units, etc. on it. 
 * @param {Position} position An object with x and y values determining where the Tile lies on the Map; map coordinates, NOT screen coordinates
 */
class Tile {
    /**
     * @param {Position} position 
     */
    constructor(position, map) {
        /** The map coordinate of the Tile on the map. 
         * @type {Position}
        */
        this.position = position
        this.worldMap = map
        this.ring = Math.max(Math.abs(this.position.x), Math.abs(this.position.y), Math.abs(this.position.z))

        /** The elevation of the Tile. A depth of 1 is sealevel. Affects the z-offset of the Tile and what terrain effects can generate on it. */
        this.depth = 1

        /** Boolean value for whether or not the Tile has a river on it. Invalid unless at least one value in 'riverDirections' is true */
        this.hasRiver = false

        /** Size 6 array of booleans. Directions of the Tiles to which the river on this Tile connects. See 'directions' for standard order. Only used for Tiles with 'hasRiver' set to true */
        this.riverDirections = [false, false, false, false, false, false]

        /** Boolean value for whether or not the Tile has a road on it. */
        this.hasRoad = false

        /** Boolean value for wheher or not the Tile has a road built on it. Does not need directions, as roads automatically connect to all nearby Tiles with roads. */
        // Note: roads have not been implemented yet
        //this.hasRoad = false

        /** An initially blank array of terrain features present on a Tile. Filled in over the course of map generation. Affects gameplay and graphics both. */
        this.features = []

        /** Whether a player has developed the current tile. Use 'updateDevelopment' or 'clearDevelopment' to change it to true or false, respectively */
        this.developed = false
        /** The type of development currently active on the Tile; only valid if 'developed' is true. Automatically changes during 'calculateYields' */
        this.development = undefined
        /** The model used to show the current development. Use 'renderCurrentDevelopment' to change it after adjusting the current development  */
        this.developmentModel = undefined

        /** Whether the Tile has been added to the scene yet or not, based on being seen by the active player */
        this.hasBeenAdded = false

        /** The Settlement found on this Tile. Create one using 'foundSettlement' */
        this.settlement = undefined

        /** Whether or not the Tile is within sight range of the active Player's Units */
        this.seen = false

        /** Yields added to the tile thanks to a building/district */
        this.buildingYields = {}

        /** Used to only run the neighbour and nearby functions once per input, saving lots of resources */
        this._neighbours = {}
        this._nearby = {}

        /**  */
        this.randomTexture = 0///Math.floor(Math.random() * 2) * 3
    }

    /**
    * Initializes the graphical representation of the tile on the current map
    */
    initialize() {
        /** Used to show the texture of the Tile's terrain type ontop of the main mesh */
        this.face = new THREE.Mesh(hexagonGeometry);
        this.face.gamePosition = this.position
        this.face.position.x = (-this.position.y - this.position.z / 2) * hexagonSizeX * Math.sqrt(3)
        this.face.position.y = hexagonSizeY * 3 / 2 * -this.position.z
        this.face.position.z = this.heightLevel

        /** The meshes with the textures of each branch of river on the tile */
        this.riverMeshes = []
        if (this.hasRiver && this.riverDirections.some(x => x)) { // check to see if both 'riverDirections' and 'hasRiver' indicate that a river needs to be rendered
            // for each direction, see if tile has a river pointing towards that direction then create its mesh and rotate it accordingly
            directions.forEach(function (d, index) {
                if (this.riverDirections[index]) {
                    if (this.neighbour(d).depth == 1) {
                        this.riverMeshes.push(new THREE.Mesh(hexagonGeometry, riverDeltaMaterial))
                    } else if (index == 0) {
                        this.riverMeshes.push(new THREE.Mesh(hexagonGeometry, randomValue(riverMaterials.slice(1))))
                    } else {
                        this.riverMeshes.push(new THREE.Mesh(hexagonGeometry, riverMaterials[0]))
                    }
                    this.riverMeshes.last().rotation.z = -Math.PI / 3 * index
                    // adding it to the face so that it automatically renders on top of the main mesh
                    this.face.add(this.riverMeshes.last())
                    // hovers slightly above the face to avoid clipping issues
                    this.riverMeshes.last().position.z = .0125
                }
            }.bind(this))

            if (this.riverMeshes.length == 0) {
                this.hasRiver = false
            }
        } else {
            // if 'riverDirections' has a true value without 'hasRiver', then an error has occured during terrain generation
            if (this.riverDirections.some(x => x)) {
                this.riverDirections = [false, false, false, false, false, false]
                console.warn("Error during terrain generation: 'riverDirections' set on tile without 'hasRiver' being true")
            }

            // if 'hasRiver' is true but there are no true 'riverDirections', then an error has occured during terrain generation
            if (this.hasRiver) {
                this.hasRiver = false
                console.warn("Error during terrain generation: 'hasRiver' true despite no activated 'riverDirections'")
            }
        }

        /** The meshes that display features like forests that are appended to the mesh */
        this.featureMeshes = []
        this.features.forEach(function (f) {
            this.featureMeshes.push(f.model.clone())
            this.face.add(this.featureMeshes.last())
            if (f.modelProperties.offsetZ != undefined) {
                this.featureMeshes.last().position.z += f.modelProperties.offsetZ
            }
            this.featureMeshes.last().scale.set(this.featureMeshes.last().scale.x * (.8 + .4 * Math.random()),
                this.featureMeshes.last().scale.y * (.8 + .4 * Math.random()),
                this.featureMeshes.last().scale.z * (.8 + .4 * Math.random()))
            this.featureMeshes.last().rotation.y = Math.random() * Math.PI * 2
        }.bind(this))

        // Resources are only added at terrain generation, so we can handle their graphics here rather than upon certain actions
        /** The icon used to display the Tile's resource above its mesh */
        this.resourceIcon = undefined
        if (this.resource != undefined) {
            this.resourceIcon = this.resource.icon.clone()
            this.face.add(this.resourceIcon)
        }

        /** Borders which are generated when displaying Tiles a Unit can reach as part of the graphical indicator */
        this.reachableBorders = []

        /** The HTML element for the buy label shown when viewing a nearby Settlement to allow the tile to be bought */
        this.buyLabel = document.createElement("DIV")
        this.buyLabel.className = "tile-buy-button"
        this.buyLabel.onmouseup = function () {
            cursor.active = false
        }
        this.buyLabel.onclick = function () {
            if (activeSettlement.priceToBuyTile(this) <= activePlayer.accumulatedCapital) {
                activePlayer.accumulatedCapital -= activeSettlement.priceToBuyTile(this)
                activeSettlement.acquireTile(this)
                activePlayer.calculateYields()
                activeSettlement.select("working")
                activePlayer.updateTopbar()
            }
        }.bind(this)

        /** The Capital icon that appears within the buy label */
        this.buyLabelIcon = document.createElement("IMG")
        this.buyLabelIcon.src = "yields/capital.png"
        this.buyLabel.appendChild(this.buyLabelIcon)
        /** The price text that appears within the buy label */
        this.buyLabelPrice = document.createElement("DIV")
        this.buyLabel.appendChild(this.buyLabelPrice)
        /** A label that appears above the tile while viewing a nearby Settlement to allow the tile to be bought */
        this.buyLabel2D = new THREE.CSS2DObject(this.buyLabel)
        this.buyLabel2D.position.z = .02
        this.buyLabel2D.position.y = .5

        this.unitIconHolderDIV = document.createElement("DIV")
        this.unitIconHolder = new THREE.CSS2DObject(this.unitIconHolderDIV)
        this.unitIconHolder.scale.set(.015, .015, .015)
        this.unitIconHolder.position.z = unitIconHoverAboveTile
        this.unitIconHolderDIV.className = "unit-icon-holder"
        this.unitIconHolderDIV.onmouseup = function () {
            cursor.active = false
        }

        this.yieldHolderDIV = document.createElement("DIV")
        this.yieldHolder = new THREE.CSS2DObject(this.yieldHolderDIV)
        this.yieldHolder.position.z = .1
        this.yieldHolderDIV.className = "tile-yield-holder"

        this.elevationMeshes = []
        directions.forEach((direction, directionIndex) => {
            if (this.neighbour(direction) != undefined
                && this.neighbour(direction).heightLevel > this.heightLevel
                && this.neighbour(direction).terrain.elevationMesh != undefined) {

                if (this.terrain == terrainTypes.coast) {
                    this.elevationMeshes.push(this.neighbour(direction).terrain.elevationMesh.clone())
                    this.face.add(this.elevationMeshes.last())
                    this.elevationMeshes.last().rotation.z = -Math.PI / 3 * directionIndex
                    this.elevationMeshes.last().position.z = .1 + Math.random() * .05
/*
                    var angle = Math.atan((this.neighbour(direction).heightLevel - this.heightLevel) / hexagonSize)
                    this.elevationMeshes.last().scale.set(1 / Math.cos(angle), 1, 1)
                    this.elevationMeshes.last().position.z = Math.sin(angle) * -Math.sqrt(3) * hexagonSize * .35
                    this.elevationMeshes.last().rotation.y = -angle
                    this.elevationMeshes.last().rotation.order = "ZXY"*/
                } else {/*
                    this.elevationMeshes.push(this.neighbour(direction).terrain.elevationMeshVertical.clone())
                    this.face.add(this.elevationMeshes.last())
                    this.elevationMeshes.last().rotation.z = -Math.PI / 3 * directionIndex

                    this.elevationMeshes.last().position.x = Math.cos(directionIndex * Math.PI / 3) * Math.sqrt(3) * hexagonSizeX * .5
                    this.elevationMeshes.last().position.y = -Math.sin(directionIndex * Math.PI / 3) * Math.sqrt(3) * hexagonSizeY * .5
                    this.elevationMeshes.last().scale.set(this.neighbour(direction).heightLevel - this.heightLevel, 1, 1)
                    this.elevationMeshes.last().rotation.y = Math.PI / 2
                    this.elevationMeshes.last().position.z = (this.neighbour(direction).heightLevel - this.heightLevel)
                    this.elevationMeshes.last().rotation.order = "ZXY"*/
                }
            }
        })

        this.pathMeshes = []

        this.cultureInfluence = new Dictionary()

        this.calculateYields()
    }

    /**
    * Returns an array of all the Units with the same position as the tile.
    * @return {array} All the Units that are occupying this tile.
    */
    get units() {
        var final = []
        players.forEach(p => p.units.forEach(function (u) {
            if (u.position.x == this.position.x && u.position.y == this.position.y && u.position.z == this.position.z) {
                final.push(u)
            }
        }.bind(this)))
        return final
    }

    /**
     * @return {boolean} Whether or not this Tile can have a Settlement founded on it
    */
    canFoundSettlement() {
        return this.nearby(3).every(x => x.settlement == undefined)
            && this.terrain.variety == terrainVariety.land
    }

    /**
     * Changes the map offset so that the Tile is centered in view
    */
    centerCameraOnTile() {
        camera.position.x = this.face.position.x
        camera.position.y = this.face.position.y + (activeSettlement == undefined ? (camera.position.z - minimumScrollIn) : 0) * 1.65 - 7
    }

    /**
    * Clears a Feature from a tile, removing its graphic and gameplay effects. Alternatively use 'clerAllFeatures' 
    * @param {Feature} feature The specific Feature being cleared from the tile.
    */
    clearFeature(feature) {
        this.face.remove(this.featureMeshes[this.features.indexOf(feature)])
        this.featureMeshes.splice(this.features.indexOf(feature), 1)
        this.features.splice(this.features.indexOf(features), 1)
        this.calculateYields() // Features affect tile yields, so must reevaluate immediately
    }

    /**
     * Performs the 'clearFeature' action on every Feature on the tile, removing all of them graphically and in the gameplay
     */
    clearAllFeatures() {
        for (var i = this.features.length - 1; i >= 0; i--) { // in reverse order as elements will be removed in the process
            this.clearFeature(this.features[i])
        }
    }

    /**
     * Removes the Resource present on a tile then updates its yield.
    */
    clearResource() {
        this.face.remove(this.resourceIcon)
        this.resourceIcon = undefined
        this.resource = undefined
        this.calculateYields() // Resources affect tile yields, so must reevaluate immediately
    }

    /** 
     * Founds a new Settlement on this tile, clearing all of its Features and its Resource then recalculating its yields
     */
    foundSettlement() {
        this.switchOwnership(activePlayer)
        this.settlement = new Settlement(this.position, this.player, this.worldMap)
        this.player.settlements.push(this.settlement)

        this.nearby(1).forEach(function (tile) {
            tile.switchOwnership(this.player)
            this.settlement.tiles.push(tile)
        }.bind(this))

        this.calculateYields()
        this.player.detectSeen()
        this.player.updateNotifications()
        this.player.calculateYields()
    }

    /**
     * Changes the owner of the Tile to another Player, then refreshes visible borders accordingly
     * @param {Player} player The Player which will become the new owner
     */
    switchOwnership(player) {
        players.forEach(x => this.cultureInfluence.setValue(x, 0))
        this.cultureInfluence.setValue(player, 100)
        this.updateOwnership()
    }

    updateOwnership() {
        if (this.settlement) {
            this.player = this.settlement.player
        } else {
            var topPlayer = players[0]
            players.forEach(x => {
                if (this.cultureInfluence.getValue(x) > this.cultureInfluence.getValue(topPlayer)) {
                    topPlayer = x
                }
            })
            this.player = topPlayer
        }

        this.worldMap.calculateBorders()
    }

    /**
     * Gives the string used when displaying a Tile's tooltip
     * @return {string} The tooltip text for the Tile
     */
    get tooltip() {
        var final = this.terrain.name + " (" + this.position.x + "," + this.position.y + "," + this.position.z + "," + this.ring + ")<br>" + (this.hasRiver ? "River<br>" : "")
        for (var i = 0; i < this.features.length; i++) {
            final += this.features[i].name + "<br>"
        }
        final += this.resource == undefined ? "" : (this.resource.name + "<br>")
        if (this.developed) {
            final += "Developed: " + this.development.name + "<br>"
        }
        return final
    }

    /**
     * Generates a string version of the Tile's data that can be used to save to localStorage
     * @return {string} The data of the Tile in a string format to be parsed
     */
    get string() {
        var finalString = ""
        finalString += this.position.x
        finalString += ","
        finalString += this.position.y
        finalString += ","
        finalString += this.position.z
        finalString += ","
        finalString += this.depth
        finalString += ","
        finalString += this.hasRiver ? 1 : 0
        for (var d = 0; d < directions.length; d++) {
            finalString += ","
            finalString += this.riverDirections[d] ? 1 : 0
        }
        for (var d = 0; d < this.features.length; d++) {
            finalString += ","
            finalString += this.features[d].name
        }
        return finalString
    }

    /**
     * Returns the Development that would be appropriate for the Tile with its current Features, Terrain, and Resource status. Used to update its Development.
     * @returns {Development} The Tile's appropriate Development
     */
    get plannedDevelopment() {
        var final
        if (this.terrain.name.includes("Hill")) {
            final = developments.quarry
        }

        if ([terrainTypes.grasslands, terrainTypes.plains, terrainTypes.desertFloodplains, terrainTypes.tundraWetlands].includes(this.terrain)) {
            final = developments.farm
        }

        if (this.resource != undefined) {
            final = this.resource.development
        }

        if (this.features.includes(features.forest)) {
            final = developments.sawmill
        }

        if (this.features.includes(features.savanna)) {
            final = developments.reserve
        }

        if (this.terrain == terrainTypes.coast) {
            final = developments.fishery
        }

        if (final == undefined || this.features.includes(features.mountain)) {
            final = false
        }

        return final
    }

    updateDevelopment() {
        if (this.plannedDevelopment) {
            this.development = this.plannedDevelopment
        } else {
            return
        }

        this.developed = true
        this.renderCurrentDevelopment()

        this.worldMap.forEach(tile => tile.calculateYields())
    }

    clearDevelopment() {
        this.developed = false
        this.development = undefined
        this.calculateYields()
    }

    /** Sets the development model to the current improvement of the tile or removes it */
    renderCurrentDevelopment() {
        if (!this.developed) {
            this.face.remove(this.developmentModel)
            this.developmentModel = undefined
        } else {
            this.developmentModel = improvement.clone()
            this.developmentModel.scale.set(.005, .005, .005)
            this.developmentModel.rotation.y = Math.random() * Math.PI * 2
            this.face.add(this.developmentModel)
        }

    }

    calculateYields() {
        this.yields = Object.assign({}, this.terrain.yields)
        if (this.features.includes(features.forest)) {
            this.addYield({ production: 1 })
        }
        if (this.features.includes(features.savanna)) {
            this.addYield({ food: 1 })
        }
        if (this.hasRiver) {
            this.addYield({ food: 1 })
        }

        if (this.plannedDevelopment && this.developed && this.development != this.plannedDevelopment) {
            this.development = this.plannedDevelopment
        } else if (this.developed) {
            this.clearDevelopment()
        }

        if (this.developed) {
            this.addYield(this.development.yields)
        }

        if (this.resource != undefined && this.resource.development == this.development) {
            this.addYield(this.resource.yields)
        }

        if (this.features.includes(features.mountain) || this.features.includes(features.mesa) || this.district) {
            this.yields = {}
        }

        this.addYield(this.buildingYields)

        this.renderYieldIcons()
    }

    addYield(addition) {
        this.yields = addYields(this.yields, addition)
    }

    addBuildingYields(addition) {
        this.buildingYields = addYields(this.buildingYields, addition)
    }

    resetBuildingYields() {
        this.buildingYields = {}
    }

    renderYieldIcons() {
        this.yieldHolderDIV.innerHTML = ""
        Object.keys(this.yields).forEach(y => {
            var yieldIcon = document.createElement("DIV")
            var yieldIconText = document.createElement("SPAN")
            yieldIconText.innerHTML = this.yields[y]
            yieldIcon.appendChild(yieldIconText)
            yieldIcon.className = "yield-icon-" + y
            this.yieldHolderDIV.appendChild(yieldIcon)
        })
    }

    displayAsSeen() {
        this.seen = true
        if (!this.hasBeenAdded) {
            scene.add(this.face)
            this.face.material = this.terrain.material[this.randomTexture].clone()
            this.face.material.opacity = 0
            this.hasBeenAdded = true
        } else {
            this.face.material = this.terrain.material[this.randomTexture]
        }
        this.renderYieldIcons()
    }

    displayAsNotSeen() {
        this.seen = false
        this.face.material = this.terrain.materialDark[this.randomTexture]
        this.renderYieldIcons()
    }

    differentPlayerOnTile(player) {
        return this.units.some(x => x.player != player)
    }

    clearPathMeshes() {
        this.pathMeshes.forEach(mesh => this.face.remove(mesh))
        this.pathMeshes = []
    }

    addRoad() {
        this.hasRoad = true
        this.worldMap.updateRoadMeshes()
    }


    neighbour(direction) {
        if (this._neighbours[direction] == undefined) {
            this._neighbours[direction] = this.worldMap.getTile({
                x: this.position.x + directionVectors[direction].x,
                y: this.position.y + directionVectors[direction].y,
                z: this.position.z + directionVectors[direction].z
            })
            if (this._neighbours[direction] == undefined) {
                this._neighbours[direction] = 0
            }
        }

        return this._neighbours[direction] == 0 ? undefined : this._neighbours[direction]
    }

    nearby(distance) {
        if (this._nearby[distance] == undefined) {
            var final = [this]
            var lastSet = [this]

            for (var i = 0; i < distance; i++) {
                var nextSet = []
                for (var e = 0; e < lastSet.length; e++) {
                    directions.forEach(direction => {
                        if (lastSet[e].neighbour(direction) != undefined && !final.includes(lastSet[e].neighbour(direction))) {
                            final.push(lastSet[e].neighbour(direction))
                            nextSet.push(lastSet[e].neighbour(direction))
                        }
                    })
                }
                lastSet = nextSet
            }
            this._nearby[distance] = final
        }

        return this._nearby[distance]
    }
}