/**
 * A single space on the game map that can have settlements, units, etc. on it. 
 * @param {Position} position An object with x and y values determining where the Tile lies on the Map; map coordinates, NOT screen coordinates
 */
class Tile {
    /**
     * @param {Position} position 
     */
    constructor(position) {
        /** The map coordinate of the Tile on the map. 
         * @type {Position}
        */
        this.position = position

        /** The elevation of the Tile. A depth of 1 is sealevel. Affects the z-offset of the Tile and what terrain effects can generate on it. */
        this.depth = 1

        /** Boolean value for whether or not the Tile has a river on it. Invalid unless at least one value in 'riverDirections' is true */
        this.hasRiver = false

        /** Size 6 array of booleans. Directions of the Tiles to which the river on this Tile connects. See 'directions' for standard order. Only used for Tiles with 'hasRiver' set to true */
        this.riverDirections = [false, false, false, false, false, false]

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
    }

    /**
    * Initializes the graphical representation of the tile on the current map
    */
    initialize() {
        /** The main body of the Tile that contains all the other meshes related to it. Placed in the scene upon being seen by the active player. */
        this.mesh = new THREE.Mesh(tileMeshGeometry, tileMeshMaterial);
        /** A variable accessed after the raycast collides with a Tile to determine where it is within the main Map array */
        this.mesh.gamePosition = this.position

        /** Used to show the texture of the Tile's terrain type ontop of the main mesh */
        this.face = new THREE.Mesh(hexagonGeometry);
        this.face.material = this.terrain.material
        this.mesh.add(this.face)

        /** The meshes with the textures of each branch of river on the tile */
        this.riverMeshes = []
        if (this.hasRiver && this.riverDirections.filter(x => x).length > 0) { // check to see if both 'riverDirections' and 'hasRiver' indicate that a river needs to be rendered
            // for each direction, see if tile has a river pointing towards that direction then create its mesh and rotate it accordingly
            directions.forEach(function (d, index) {
                if (this.riverDirections[index]) {
                    this.riverMeshes.push(new THREE.Mesh(hexagonGeometry, riverMaterial))
                    this.riverMeshes.last().rotation.z = -Math.PI / 3 * index
                    // adding it to the face so that it automatically renders on top of the main mesh
                    this.face.add(this.riverMeshes.last())
                    // hovers slightly above the face to avoid clipping issues
                    this.riverMeshes.z = .01
                }
            }.bind(this))

            if (this.riverMeshes.length == 0) {
                this.hasRiver = false
            }
        } else {
            // if 'riverDirections' has a true value without 'hasRiver', then an error has occured during terrain generation
            if (this.riverDirections.filter(x => x).length > 0) {
                this.riverDirections = [false, false, false, false, false, false]
                console.warn("Error during terrain generation: 'riverDirections' set on tile without 'hasRiver' being true")
            }

            // if 'hasRiver' is true but there are no true 'riverDirections', then an error has occured during terrain generation
            if (this.hasRiver) {
                this.hasRiver = false
                console.warn("Error during terrain generation: 'hasRiver' true despite no activated 'riverDirections'")
            }
        }

        /* Roads are not implemented yet, and the following section will be moved out of initialization to a proper section once they are
        // See above for similar implementation for the 'riverMeshes' 
        this.roadMeshes = []
        if(this.hasRoad){
            directions.forEach(function(d, index){
                if(t(this, d).hasRoad){
                    this.roadMeshes.push(new THREE.Mesh(hexagonGeometry, roadMaterial))
                    this.roadMeshes.last().rotation.z = -Math.PI / 3 * index
                    this.face.add(this.roadMeshes.last())
                    this.roadMeshes.last().position.z = .01
                }
            }.bind(this))
        }
        */

        /** The meshes that display features like forests that are appended to the mesh */
        this.featureMeshes = []
        this.features.forEach(function (f) {
            this.featureMeshes.push(f.model.clone())
            this.mesh.add(this.featureMeshes.last())
            this.featureMeshes.last().position.z = maxDepth
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
            this.mesh.add(this.resourceIcon)
            this.resourceIcon.position.z = maxDepth + .03
        }

        // Have to move the face up the full height of the mesh so that its at the top
        this.face.position.z = maxDepth + .02

        /** Borders which are generated when displaying Tiles a Unit can reach as part of the graphical indicator */
        this.reachableBorders = []

        /** The HTML element for the buy label shown when viewing a nearby Settlement to allow the tile to be bought */
        this.buyLabel = document.createElement("DIV")
        this.buyLabel.className = "tile-buy-button"
        this.buyLabel.onmouseup = function () {
            cursor.active = false
        }
        this.buyLabel.onclick = function () {
            if(activeSettlement.priceToBuyTile(this) <= activePlayer.accumulatedGold){
                activePlayer.accumulatedGold -= activeSettlement.priceToBuyTile(this)
                activeSettlement.acquireTile(this)
                activePlayer.calculateYields()
                activeSettlement.select("working")
                activePlayer.updateTopbar()
            }
        }.bind(this)
        /** The Gold icon that appears within the buy label */
        this.buyLabelIcon = document.createElement("IMG")
        this.buyLabelIcon.src = "yields/gold_5.png"
        this.buyLabel.appendChild(this.buyLabelIcon)
        /** The price text that appears within the buy label */
        this.buyLabelPrice = document.createElement("DIV")
        this.buyLabel.appendChild(this.buyLabelPrice)
        this.buyLabel.setAttribute("inactive", "true")
        /** A label that appears above the tile while viewing a nearby Settlement to allow the tile to be bought */
        this.buyLabel2D = new THREE.CSS2DObject(this.buyLabel)
        this.face.add(this.buyLabel2D)
        this.buyLabel2D.position.z = .02
        this.buyLabel2D.position.y = .5

        this.unitIconHolderDIV = document.createElement("DIV")
        this.unitIconHolder = new THREE.CSS3DSprite(this.unitIconHolderDIV)
        this.unitIconHolder.scale.set(.013, .013, .013)
        this.face.add(this.unitIconHolder)
        this.unitIconHolder.rotation.x = Math.PI / 2
        this.unitIconHolder.position.z = .16
        this.unitIconHolder = unitIconHoverAboveTile
        this.unitIconHolderDIV.className = "unit-icon-holder"
        this.unitIconHolderDIV.onmouseup = function(){
            cursor.active = false
        }

        this.pathMeshes = []

        this.calculateYields()
    }

    /**
    * Returns an array of all the Units with the same position as the tile.
    * @return {array} All the Units that are occupying this tile.
    */
    getUnits() {
        var final = []
        players.forEach(p => p.units.forEach(function (u) {
            if (u.pos.x == this.position.x && u.pos.y == this.position.y) {
                final.push(u)
            }
        }.bind(this)))
        return final
    }

    /**
     * @return {boolean} Whether or not this Tile can have a Settlement founded on it
    */
    canFoundSettlement() {
        return nearby(this, 3).filter(x => x.settlement != undefined).length == 0 
               && this.terrain.variety == terrainVariety.land
    }

    /**
     * Changes the map offset so that the Tile is centered in view
    */
    centerCameraOnTile() {
        mapOffset.x = maxOffsetX + initialCameraOffsetX - (Math.sqrt(3) * hexagonSize * this.position.x)
        mapOffset.y = initialCameraOffsetY - (2.05 * .75 * hexagonSize * this.position.y) + 10
        cameraMove()
    }

    /**
    * Clears a Feature from a tile, removing its graphic and gameplay effects. Alternatively use 'clerAllFeatures' 
    * @param {Feature} feature The specific Feature being cleared from the tile.
    */
    clearFeature(feature) {
        this.mesh.remove(this.featureMeshes[this.features.indexOf(feature)])
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
        this.mesh.remove(this.resourceIcon)
        this.resourceIcon = undefined
        this.resource = undefined
        this.calculateYields() // Resources affect tile yields, so must reevaluate immediately
    }

    /** 
     * Founds a new Settlement on this tile, clearing all of its Features and its Resource then recalculating its yields
     */
    foundSettlement() {
        this.settlement = new Settlement(this.position, activePlayer)
        this.switchOwnership(activePlayer)
        this.player.settlements.push(this.settlement)
        this.settlement.tiles.push(this)

        this.settlement.model.position.z = maxDepth

        for (var i = 0; i < directions.length; i++) {
            t(this, directions[i]).switchOwnership(activePlayer)
            this.settlement.tiles.push(t(this, directions[i]))
        }

        this.clearAllFeatures()
        this.clearResource()
        this.calculateYields()
        activePlayer.detectSeen()
        activePlayer.updateNotifications()
        this.player.calculateYields()
    }

    /**
     * Changes the owner of the Tile to another Player, then refreshes visiblel borders accordingly
     * @param {Player} player The Player which will become the new owner
     */
    switchOwnership(player) {
        this.player = player

        if (this.ownerOverlay == undefined) {
            this.ownerOverlay = new THREE.Mesh(hexagonGeometry, this.player.overlayMaterial);
            this.ownerOverlay.gamePosition = this.position
            this.ownerOverlay.position.z = maxDepth + .025
            this.mesh.add(this.ownerOverlay)
        }

        calculateBorders()
    }

    /**
     * Gives the string used when displaying a Tile's tooltip
     * @return {string} The tooltip text for the Tile
     */
    getTooltip() {
        var final = this.terrain.name + " (" + this.position.x + "," + this.position.y + ")<br>" + (this.hasRiver ? "River<br>" : "")
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
    getString() {
        var finalString = ""
        finalString += this.position.x
        finalString += ","
        finalString += this.position.y
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
    getDevelopment() {
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
        if (this.getDevelopment()) {
            this.development = this.getDevelopment()
        } else {
            return
        }

        this.developed = true
        this.renderCurrentDevelopment()

        tiles.forEach(x => x.forEach(y => y.calculateYields()))
    }

    clearDevelopment() {
        this.developed = false
        this.development = undefined
        this.calculateYields()
    }

    /** Sets the development model to the current improvement of the tile or removes it */
    renderCurrentDevelopment() {
        if (!this.developed) {
            this.mesh.remove(this.developmentModel)
            this.developmentModel = undefined
        } else {
            this.developmentModel = improvement.clone()
            this.developmentModel.scale.set(.005, .005, .005)
            this.developmentModel.rotation.y = Math.random() * Math.PI * 2
            this.mesh.add(this.developmentModel)
            this.developmentModel.position.z = maxDepth
        }

    }

    calculateYields() {
        var me = this
        if (this.yieldIcons != undefined) {
            this.yieldIcons.forEach(function (x) { me.mesh.remove(x); x = undefined })
        }
        this.yieldIcons = []

        this.yields = Object.assign({}, this.terrain.yields)
        if (this.features.includes(features.forest)) {
            this.yields = addYields(this.yields, { production: 1 })
        }
        if (this.features.includes(features.savanna)) {
            this.yields = addYields(this.yields, { food: 1 })
        }
        if (this.hasRiver) {
            this.yields = addYields(this.yields, { food: 1 })
        }

        if (this.getDevelopment() && this.developed && this.development != this.getDevelopment()) {
            this.development = this.getDevelopment()
        } else if (this.developed) {
            this.clearDevelopment
        }

        if (this.developed) {
            this.yields = addYields(this.yields, this.development.yields)
        }

        if (this.resource != undefined && this.resource.development == this.development) {
            this.yields = addYields(this.yields, this.resource.yields)
        }

        if (this.features.includes(features.mountain) || this.features.includes(features.mesa) || this.settlement != undefined) {
            this.yields = {}
        }

        for (var i = 0; i < Object.keys(this.yields).length; i++) {
            this.yieldIcons.push(yields[Object.keys(this.yields)[i]].yieldIcons[Math.min(4, this.yields[Object.keys(this.yields)[i]] - 1)].clone())
            this.yieldIcons[i].position.z = maxDepth + .1
            this.mesh.add(this.yieldIcons[i])
            this.yieldIcons[i].position.x = yieldWidth * (i - ((Object.keys(this.yields).length - 1) / 2))
        }
    }

    clearPathMeshes(){
        this.pathMeshes.forEach(mesh => this.face.remove(mesh))
        this.pathMeshes = []
    }
}