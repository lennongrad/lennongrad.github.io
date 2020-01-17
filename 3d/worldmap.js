

class WorldMap {
    constructor(size) {
        this.size = size
        this.tiles = []
        for (var x = -size; x <= size; x++) {
            for (var y = -size; y <= size; y++) {
                for (var z = -size; z <= size; z++) {
                    if (x + y + z == 0) {
                        this.tiles.push(new Tile({ x: x, y: y, z: z }, this))
                    }
                }
            }
        }

        this.mapZoomOut = 0
        this.mapZoomChange = 0
        this.yDisplacement = 0
    }

    generateMap() {
        this.visitedTiles = []
        for (var i = 0; i < minimumInitialElevations || Math.random() > chanceToNotContinueElevations; i++) {
            var startingTile = this.randomTile()
            this.setElevation(startingTile, startingElevationVariance * Math.random() + startingElevationBase)
            this.visitedTiles = []
        }

        for (var i = 0; i < 300; i++) {
            var islandSource = this.randomTile()
            if (!islandSource.nearby(6).some(x => x.depth > 1)) {
                this.setElevation(islandSource, startingElevationVariance * Math.random() + startingElevationBase / 4)
            }
        }

        this.forEach(function (tile) {
            if (tile.depth > 1) {
                tile.terrain = terrainTypes.grasslands
            } else {
                tile.terrain = terrainTypes.ocean
            }
        })
        /*
                this.forEach(function (tile) {
                    if ((tile.position.y < (6 + 3 * Math.random()) || tile.position.y > mapSizeY - (6 + 3 * Math.random())) &&
                        (tile.terrain == terrainTypes.grasslands)) {
                        tile.terrain = terrainTypes.tundra
                    }
        
                    if ((tile.position.y < (3 + 2 * Math.random()) || tile.position.y > mapSizeY - (3 + 2 * Math.random())) &&
                        (tile.terrain == terrainTypes.grasslands || tile.terrain == terrainTypes.tundra)) {
                        tile.terrain = terrainTypes.snow
                        tile.features = []
                    }
        
                    if (tile.position.y < (0 + 2 * Math.random()) || tile.position.y > mapSizeY - (1 + 2 * Math.random())) {
                        tile.depth = 1
                        tile.terrain = terrainTypes.ice
                        tile.features = []
                    }
        
                    if ((tile.position.y < (10) || tile.position.y > mapSizeY - (10))) {
                        var distance = Math.min(tile.position.y, mapSizeY - tile.position.y)
                        tile.depth = Math.pow(Math.abs(tile.depth), distance / 12 + 1 / 6)
                    }
                })
        */
        this.desertsCreated = 0
        for (var i = 0; i < 500 && this.desertsCreated < desertsLimit; i++) {
            var desertSource = this.randomTile()
            if (desertSource.depth > 1 && desertSource.terrain != terrainTypes.snow && desertSource.terrain != terrainTypes.tundra) {
                this.spreadTerrain(desertSource, terrainTypes.desert, 0)
                this.desertsCreated++
            }
        }

        for (var i = 0; i < 4; i++) {
            this.forEach(tile => {
                if ((tile.nearby(1).filter(x => x.terrain == terrainTypes.plains || x.terrain == terrainTypes.desert).length > 1)
                    && tile.terrain == terrainTypes.grasslands) {
                    tile.terrain = terrainTypes.plains
                }
            })
        }

        this.riversCreated = 0
        this.riverSource
        for (var i = 0; i < 5000 && this.riversCreated < riversLimit; i++) {
            this.riverSource = this.randomTile()
            if (this.riverSource.depth > 1
                && !this.riverSource.nearby(3).some(x => x.hasRiver)
                && !this.riverSource.nearby(2).some(y => y.terrain.variety == terrainVariety.sea)) {
                if (!this.riverSource.hasRiver && this.setRiver(this.riverSource)) {
                    this.setMountainRange(this.riverSource, 0)
                }

                this.riversCreated++
            }
        }

        this.forestsCreated = 0
        this.forestSource
        for (var i = 0; i < 500 && this.forestsCreated < forestsLimit; i++) {
            this.forestSource = this.randomTile()
            if (this.forestSource.depth > 1
                && !this.forestSource.features.includes(features.forest)
                && !this.forestSource.features.includes(features.savanna)
                && this.forestSource.terrain != terrainTypes.desert
                && this.forestSource.terrain != terrainTypes.lake
                && this.forestSource.terrain != terrainTypes.desertFloodplains
                && this.forestSource.terrain != terrainTypes.snow
                && this.forestSource.nearby(7).filter(x => x.features.includes(features.forest)).length < 1
                && this.forestSource.nearby(7).filter(x => x.features.includes(features.savanna)).length < 1) {
                this.setForest(this.forestSource, 0)
                this.forestsCreated++
            }
        }

        this.forEach(tile => {
            if (terrainTypes[tile.terrain.name.toLowerCase() + "Hills"] != undefined && Math.random() > .6 && !tile.hasRiver) {
                tile.terrain = terrainTypes[tile.terrain.name.toLowerCase() + "Hills"]
            }
        })

        this.forEach(tile => {
            if (tile.terrain == terrainTypes.plains
                && tile.features.length == 0
                && (tile.nearby(1).filter(x => x.features.includes(features.forest)).length > 0
                    || tile.nearby(1).filter(x => x.terrain == terrainTypes.desert).length > 0)) {
                tile.features.push(features.savanna)
            }
        })

        this.coastalTiles = []
        this.forEach(tile => {
            if (tile.terrain == terrainTypes.ocean && tile.nearby(1).some(x => x.terrain.variety != terrainVariety.sea)) {
                tile.terrain = terrainTypes.coast
                this.coastalTiles.push(tile)
            }
        })

        this.coastalTiles.forEach(function (e) {
            for (var d = 0; d < directions.length; d++) {
                if (Math.random() < chanceToSpreadCoast && e.neighbour(directions[d]) != undefined && e.neighbour(directions[d]).terrain == terrainTypes.ocean) {
                    e.neighbour(directions[d]).terrain = terrainTypes.coast
                }
            }
        })

        this.forEach(tile => {
            if (tile.depth > 1) {
                tile.depth = 1 + depthMultiplier * (Math.pow(Math.abs(tile.depth), .4) - 1)
            }
        })

        this.forEach(tile => {
            if (Math.random() < resourceChance
                && tile.resource == undefined
                && !tile.features.includes(features.mountain)
                && tile.terrain != terrainTypes.ice) {
                var escape = false
                for (var i = 0; i < 5 && !escape; i++) {
                    var resource = randomValueObj(resources)
                    if (testRequirements(resource.requirements, tile)) {
                        escape = true
                        tile.resource = resource
                        if (tile.terrain == terrainTypes.ocean) {
                            tile.terrain = terrainTypes.coast
                        }
                    }
                }
            }
        })

        this.forEach(tile => {
            if (tile.nearby(2).filter(x => x.resource != undefined).length == 0) {
                var escape = false
                for (var i = 0; i < 500 && !escape; i++) {
                    var resource = randomValueObj(resources)
                    if (testRequirements(resource.requirements, tile)
                        && !tile.features.includes(features.mountain)
                        && tile.terrain != terrainTypes.ice) {
                        escape = true
                        tile.resource = resource
                        if (tile.terrain == terrainTypes.ocean) {
                            tile.terrain = terrainTypes.coast
                        }
                    }
                }
            }
        })
    }
    
    initialize(){
        this.forEach(tile => {
            //tile.heightLevel = (Math.ceil(Math.pow(tile.depth, .75) * 100) - (Math.ceil(Math.pow(tile.depth, .75) * 100) % 25)) / 100
            tile.heightLevel = 1
            if(tile.terrain.variety == terrainVariety.land){
                tile.heightLevel = 1.05
            }
        })
        this.forEach(tile => tile.initialize())
        
        this.mapDrawingTiles = shuffleArray(this.tiles).sort((a, b) => {
            return (a.terrain.variety == terrainVariety.sea && b.terrain.variety != terrainVariety.sea) ? 1 : -1
        }).sort((a, b) => {
            return (a.terrain == terrainTypes.ocean && b.terrain != terrainTypes.ocean) ? -1 : 1
        })
    }

    forEach(func) {
        this.tiles.forEach(func)
    }

    getTile(position) {
        return this.tiles.filter(tile => tile.position.x == position.x && tile.position.y == position.y && tile.position.z == position.z)[0]
    }

    randomTile() {
        return randomValue(this.tiles)
    }

    setElevation(tile, length) {
        var lengthModifier = 1
        if (this.visitedTiles.indexOf(tile) == -1) {
            lengthModifier = alreadyVisitedModifier
        }
        this.visitedTiles.push(tile)

        if (tile.depth > maxDepth) {
            return
        }
        tile.depth = Math.max(1 + length, tile.depth + length * lengthAdditionModifier * lengthModifier)

        length -= lengthDecreaseAmount
        if (length <= minimumLengthToContinue) {
            return
        }

        var noLoss = [false, false, false, false, false, false]
        if (Math.random() < chanceToBeSameElevation) {
            noLoss[randomIndex(noLoss)] = true
        }

        for (var d = 0; d < directions.length; d++) {
            if (Math.random() > chanceToContinue && tile.neighbour(directions[d]) != undefined) {
                this.setElevation(tile.neighbour(directions[d]), noLoss[d] ? (length + lengthDecreaseAmount) : length)
            }
        }
    }

    spreadTerrain(tile, terrain, length) {
        tile.terrain = terrain

        for (var d = 0; d < directions.length; d++) {
            if (length < ((terrain == terrainTypes.desert ? (maxSpreadTerrainDesert) : (maxSpreadTerrainPlains)) * Math.random()) + minimumSpreadTerrain
                && tile.neighbour(directions[d]) != undefined
                && tile.neighbour(directions[d]).depth > 1
                && !tile.neighbour(directions[d]).terrain.name.includes("Tundra")
                && !tile.neighbour(directions[d]).terrain.name.includes("Snow")
                && tile.neighbour(directions[d]).terrain != terrain) {
                this.spreadTerrain(tile.neighbour(directions[d]), terrain, length + 1)
            }
        }
    }

    setRiver(tile) {
        if (tile.hasRiver) {
            return
        }

        var possibilities = []

        for (var d = 0; d < directions.length; d++) {
            if (tile.neighbour(directions[d]) != undefined
                && tile.neighbour(directions[d]).depth < tile.depth
                && !tile.neighbour(directions[d]).features.includes(features.mountain)
                && !tile.neighbour(directions[d]).features.includes(features.mesa)) {
                possibilities.push({ direction: d, tile: tile.neighbour(directions[d]) })
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
        this.setRiver(nextTile.tile)
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

    setMountainRange(tile, length) {
        if (tile.terrain == terrainTypes.desertFloodplains) {
            tile.features.push(features.mesa)
            tile.terrain = terrainTypes.desert
        } else {
            tile.features.push(features.mountain)
        }

        for (var d = 0; d < directions.length; d++) {
            if (tile.neighbour(directions[d]) != undefined
                && tile.neighbour(directions[d]).depth > 1
                && tile.neighbour(directions[d]).terrain != terrainTypes.lake
                && tile.neighbour(directions[d]).terrain != terrainTypes.desert
                && !tile.neighbour(directions[d]).hasRiver
                && Math.abs(tile.neighbour(directions[d]).depth - tile.depth) < .45
                && !tile.neighbour(directions[d]).features.includes(features.mountain)
                && !tile.neighbour(directions[d]).features.includes(features.mesa)
                && (Math.random() > chanceToContinueMountain * (length - 1))) {
                tile.neighbour(directions[d]).depth = tile.depth
                this.setMountainRange(tile.neighbour(directions[d]), length + 1)
                return
            }
        }
    }

    setForest(tile, length) {
        tile.features.push(features.forest)

        for (var d = 0; d < directions.length; d++) {
            if (tile.neighbour(directions[d]) != undefined
                && Math.abs(tile.neighbour(directions[d]).depth - tile.depth) < .3
                && tile.neighbour(directions[d]).depth > 1
                && tile.neighbour(directions[d]).terrain != terrainTypes.lake
                && tile.neighbour(directions[d]).terrain != terrainTypes.desert
                && tile.neighbour(directions[d]).terrain != terrainTypes.desertFloodplains
                && tile.neighbour(directions[d]).terrain != terrainTypes.snow
                && !tile.neighbour(directions[d]).features.includes(features.forest)
                && !tile.neighbour(directions[d]).features.includes(features.savanna)
                && (Math.random() > chanceToContinueForest * (length - 1))) {
                this.setForest(tile.neighbour(directions[d]), length + 1)
            }
        }
    }

    updateRoadMeshes() {
        this.forEach(tile => {
            if (tile.roadMeshes != undefined) {
                tile.roadMeshes.forEach(function (mesh) {
                    tile.face.remove(mesh)
                })
            }
            tile.roadMeshes = []
            directions.forEach(function (direction, index) {
                if (tile.neighbour(direction) != undefined && ((tile.hasRoad && (tile.neighbour(direction).hasRoad
                    || (!tile.neighbour(direction).features.includes(features.mountain) && !tile.neighbour(direction).features.includes(features.mesa) && tile.neighbour(direction).hasRiver)))
                    || (tile.hasRiver && tile.neighbour(direction).hasRoad) && !tile.features.includes(features.mesa) && !tile.features.includes(features.mountain)) && !tile.riverDirections[index]) {
                    tile.roadMeshes.push(new THREE.Mesh(hexagonGeometry, randomValue(roadMaterials)))
                    tile.roadMeshes.last().rotation.z = -Math.PI / 3 * index
                    tile.face.add(tile.roadMeshes.last())
                    tile.roadMeshes.last().position.z = .001
                }
            })
        })
    }

    calculateBorders() {
        this.forEach(tile => {
            if (tile.player != undefined) {
                if (tile.borderMeshes != undefined && tile.borderMeshes.length > 0) {
                    tile.borderMeshes.forEach(mesh => tile.face.remove(mesh))
                }
                tile.borderMeshes = []
                directions.forEach((direction, index) => {
                    if (tile.neighbour(direction) == undefined || tile.neighbour(direction).player != tile.player) {
                        tile.borderMeshes.push(gradientBorders[index].clone())
                        tile.face.add(tile.borderMeshes.last())
                        tile.borderMeshes.last().material = tile.player.borderGradientMaterial
                    }
                })
            }
        })
    }

    displayPaths(units, destination) {
        this.clearPathMeshes()

        units.forEach(unit => {
            var pathwayTiles
            if (unit.path != undefined) {
                pathwayTiles = unit.path.slice()
            } else if (destination != undefined && unit.getPathToTile(destination) != false) {
                pathwayTiles = unit.getPathToTile(destination).reverse()
            }

            if (pathwayTiles != undefined) {
                pathwayTiles.push(unit.tile)

                this.forEach(tile => {
                    if (pathwayTiles.includes(tile)) {
                        directions.forEach(function (direction, directionIndex) {
                            if (pathwayTiles.includes(tile.neighbour(direction))) {
                                tile.pathMeshes.push(unitPathMesh.clone())
                                tile.face.add(tile.pathMeshes.last())
                                tile.pathMeshes.last().rotation.z = -Math.PI / 3 * directionIndex

                                if (tile.neighbour(direction).heightLevel > tile.heightLevel) {
                                    var angle = Math.atan((Math.pow(tile.neighbour(direction).heightLevel, .65) - Math.pow(tile.heightLevel, .65)) / hexagonSize)
                                    tile.pathMeshes.last().scale.set(1 / Math.cos(angle), 1, 1)
                                    tile.pathMeshes.last().rotation.y = -angle * 1.1
                                    tile.pathMeshes.last().rotation.order = "ZXY"
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    displayTradeRoutePath(routePath) {
        this.clearPathMeshes()
        var path = routePath.slice()

        this.forEach(tile => {
            if (path.includes(tile)) {
                directions.forEach(function (direction, directionIndex) {
                    if (path.includes(tile.neighbour(direction))) {
                        tile.pathMeshes.push(commercePathMesh.clone())
                        tile.face.add(tile.pathMeshes.last())
                        tile.pathMeshes.last().rotation.z = -Math.PI / 3 * directionIndex

                        if (tile.neighbour(direction).heightLevel > tile.heightLevel) {
                            var angle = Math.atan((tile.neighbour(direction).heightLevel - tile.heightLevel) / hexagonSize)
                            tile.pathMeshes.last().scale.set(1 / Math.cos(angle), 1, 1)
                            tile.pathMeshes.last().rotation.y = -angle * 1.1
                            tile.pathMeshes.last().rotation.order = "ZXY"
                        }
                    }
                })
            }
        })
    }

    drawMap() {
        var context = document.querySelector('#hexagon-map').getContext('2d')
        var width = document.getElementById('hexagon-map').getBoundingClientRect().width
        var height = document.getElementById('hexagon-map').getBoundingClientRect().height
        document.getElementById('hexagon-map').width = width
        document.getElementById('hexagon-map').height = height

        context.beginPath()
        context.rect(0, 0, width, height)
        context.fillStyle = "#000"
        context.fill()

        var size = 7 - this.mapZoomOut
        var globalX = width / 2 - camera.position.x * .75 * size
        var globalY = height / 2 + (camera.position.y - this.yDisplacement) * .75 * size

        this.mapDrawingTiles.forEach(tile => {
            if (tile.hasBeenAdded) {
                context.beginPath();
                context.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

                var x = (-tile.position.y - tile.position.z / 2) * size * Math.sqrt(3) * .8
                var y = size * 3 / 2 * tile.position.z * .8
/*
                for (var side = 0; side < 7; side++) {
                    context.lineTo(
                        x + size * 1.5 * Math.cos(side * 2 * Math.PI / 6 + Math.PI / 6 + Math.random() * .5) + globalX,
                        y + size * 1.5 * Math.sin(side * 2 * Math.PI / 6 + Math.PI / 6 + Math.random() * .5) + globalY);
                }*/

                for (var side = 0; side < 25; side++) {
                    context.lineTo(
                        x + size * (1.5 + .25 * Math.random()) * Math.cos(side * 2 * Math.PI / 24 + Math.PI / 24 + Math.random() * .15) + globalX,
                        y + size * (1.5 + .25 * Math.random()) * Math.sin(side * 2 * Math.PI / 24 + Math.PI / 24 + Math.random() * .15) + globalY);
                }

                context.fillStyle = tile.terrain.colour;
                context.fill();
            }
        })
    }

    increaseMapZoom() {
        this.mapZoomChange = 2
    }

    decreaseMapZoom() {
        this.mapZoomChange = -2
    }

    clearPathMeshes() {
        this.forEach(tile => tile.clearPathMeshes())
    }

    updateUnitIconHolders() {
        this.forEach(tile => {
            if (tile.district != undefined || tile.units.length != 0) {
                tile.face.add(tile.unitIconHolder)
            } else {
                tile.face.remove(tile.unitIconHolder)
            }
        })
    }
}