class Unit {
    constructor(type, player, pos) {
        this.pos = pos
        this.player = player
        this.movementRemaining = 0
        this.asleep = false

        this.troops = []
        if(type.length == undefined){
            type = [type]
        }
        type.forEach(function(t){
            if (t.isUnitType != undefined) {
                this.troops.push(new Troop(t))
            } else {
                this.troops.push(t)
            }
            this.troops.last().unit = this
        }.bind(this))

        this.path = undefined

        this.iconDIV = document.createElement("DIV")
        this.iconDIV.className = "unit-icon"
        this.iconDIV.unit = this
        this.iconDIV.onclick = function () {
            this.unit.select()
        }
        if(this.player instanceof Animals){
            this.iconDIV.style.backgroundColor = "#700"
        }
        this.iconTroopsDIV = document.createElement("DIV")
        this.iconTroopsDIV.className = "unit-icon-troops"
        this.iconDIV.appendChild(this.iconTroopsDIV)

        this.iconMoraleDIV = document.createElement("DIV")
        this.iconMoraleDIV.className = "unit-icon-morale"
        this.iconMoraleBarDIV = document.createElement("DIV")
        this.iconMoraleDIV.appendChild(this.iconMoraleBarDIV)
        this.iconDIV.appendChild(this.iconMoraleDIV)

        this.resetTurn()
        this.updateInfo()
    }

    updateInfo() {
        this.iconTroopsDIV.innerHTML = " " + this.troops.length + " |"
        Object.keys(unitClasses).forEach(function (unitClass) {
            var atLeastOne = false
            this.troops.forEach(function (troop) {
                if (troop.type.unitClass == unitClasses[unitClass]) {
                    atLeastOne = true
                }
            }.bind(this))

            if (atLeastOne) {
                var newImage = document.createElement("IMG")
                newImage.src = "uniticons/class_" + unitClasses[unitClass].name.toLowerCase() + ".png"
                this.iconTroopsDIV.appendChild(newImage)
            }
        }.bind(this))

        this.iconMoraleBarDIV.style.height = this.troops.reduce((x,y) => x + y.constitution, 0) / this.troops.reduce((x,y) => x + y.type.constitution, 0) * 100 + "%"
    }

    select() {
        if (activePlayer == this.player && !selectedUnits.includes(this)) {
            if (!keys.shift.active && !keys.ctrl.active) {
                Unit.deselectAllUnits()
            }
            selectedUnits.push(this)
            Unit.updateActions()
            if (Unit.selectedUnitsOnSameTile() && Unit.selectedUnitsHaveSameMovement()) {
                renderReachable(this)
            } else {
                hideReachable()
            }
            this.iconDIV.setAttribute("selected", "true")
            Unit.updateActions()
        } else if (activePlayer == this.player) {
            if (!keys.shift.active) {
                if (keys.ctrl.active) {
                    this.deselect()
                } else {
                    Unit.deselectAllUnits()
                }
            }
        }
        Unit.displayPaths(selectedUnits)
    }

    deselect() {
        if (selectedUnits.includes(this)) {
            selectedUnits.splice(selectedUnits.indexOf(this), 1)
            document.getElementById("unitactions").style.left = "-500px"
            this.iconDIV.setAttribute("selected", "false")

            if (selectedUnits.length == 1) {
                renderReachable(selectedUnits[0])
            } else {
                hideReachable()
            }
        }
        if(selectedUnits.length == 0){
            document.getElementById("troop-info").innerHTML = ""
        }
        Unit.updateActions()
        Unit.displayPaths(selectedUnits)
    }

    split(index) {
        if(this.troops.length > 1){
            this.player.units.push(new Unit(this.troops.splice(index, index + 1), this.player, this.pos))
            this.player.units.last().move(this.pos)
            this.updateInfo()
            return this.player.units.last()
        }
    }

    sleep() {
        this.asleep = true
        this.disactivate()
    }

    wakeUp() {
        this.asleep = false
        if (this.determineReachable().length > 1) {
            this.activate()
        }
        Unit.updateActions()
    }

    foundSettlement() {
        if (this.tile.canFoundSettlement()) {
            this.tile.foundSettlement()
            this.troops.filter(x => x.type == unitTypes.settler)[0].die()
        }
    }

    moveButton() {
        if (reachableIsRendered) {
            hideReachable()
        } else {
            renderReachable(this)
        }
    }

    wait() {
        this.disactivate()
    }

    mergeMultiple(oldUnits) {
        oldUnits.forEach(function (unit) {
            this.merge(unit)
        }.bind(this))
    }

    merge(oldUnit) {
        this.troops = this.troops.concat(oldUnit.troops)
        this.troops.forEach(x => x.unit = this)
        oldUnit.troops = []
        this.movementRemaining = Math.min(this.movementRemaining, oldUnit.movementRemaining)
        oldUnit.die()
        this.updateInfo()
        Unit.updateActions()
        if(this.movementRemaining == 0){
            this.disactivate()
        }
    }

    die() {
        if (this.troops.length == 0) {
            this.deselect()
            scene.remove(this.icon)
            removeElement(this.iconDIV)
            this.player.units.splice(this.player.units.indexOf(this), 1)
            this.player.updateNotifications()
        } else {
            this.updateInfo()
            Unit.updateActions()
        }
    }

    get tile() {
        return tiles[this.pos.x][this.pos.y]
    }

    movementCost(tile, origin) {
        // base cost for moving a single tile
        var final = 1

        // tiles that are impassable an arbitrarily high value
        if (
            // terrain type    
            tile.terrain == terrainTypes.ice
            || tile.terrain == terrainTypes.ocean
            // terrain features
            || tile.features == undefined
            || tile.features.includes(features.mountain)
            || tile.features.includes(features.mesa)) {
            final = cannotPassTile
        }

        if (tile.terrain.name.includes("Hills")
            || (tile.features.includes(features.forest))
            || (!tile.hasRiver && origin.hasRiver && tile.terrain.variety == terrainVariety.land)
            || (tile.terrain.variety != origin.terrain.variety)) {
            final += 1
        }

        return final
    }
    
    setPath(tile) {
        var pathway = this.getPathToTile(tile)
        if (!pathway) {
            return false
        }

        this.assignPath(pathway.reverse())
        this.disactivate()
    }

    assignPath(path){
        this.path = path
        Unit.displayPaths(selectedUnits)
        //this.deselect()
    }

    // based off of this explanation https://www.redblobgames.com/pathfinding/a-star/introduction.html
    getPathToTile(tile) {
        if (tile == this.tile) {
            return false
        }

        var frontier = new PriorityQueue((a, b) => a[1] < b[1])
        frontier.push([this.tile, 0])
        var cameFrom = new Dictionary()
        cameFrom.setValue(this.tile, undefined)
        var costSoFar = new Dictionary()
        costSoFar.setValue(this.tile, 0)

        var attempts = 1000
        while (!frontier.isEmpty() && attempts > 0) {
            var current = frontier.pop()[0]
            if (current == tile) {
                break
            }

            nearby(current, 1).splice(1).forEach(function (next) {
                if (this.movementCost(next, current) < cannotPassTile) {
                    var newCost = costSoFar.getValue(current) + this.movementCost(next, current)
                    if (costSoFar.getValue(next) == undefined || newCost < costSoFar.getValue(next)) {
                        costSoFar.setValue(next, newCost)
                        frontier.push([next, newCost])
                        cameFrom.setValue(next, current)
                    }
                }
            }.bind(this))

            attempts--
        }

        if (cameFrom.getValue(tile) == undefined) {
            return false
        }

        var current = tile
        var path = []
        while (current != this.tile) {
            path.push(current)
            current = cameFrom.getValue(current)
        }

        return path
    }

    // will redo this at some point to use dictionary/priority queue
    determineReachable() {
        var visited = [{ tile: tiles[this.pos.x][this.pos.y], distance: 0 }]
        var fringes = []
        fringes.push([{ tile: tiles[this.pos.x][this.pos.y], distance: 0 }])

        for (var i = 0; i < this.movementRemaining; i++) {
            fringes.push([])
            fringes[i].forEach(function (e) {
                for (var d = 0; d < directions.length; d++) {
                    var neighbor = t(e.tile, directions[d])
                    if (e.distance + this.movementCost(neighbor, e.tile) <= this.movementRemaining) {
                        var sameTiles = visited.filter(y => y.tile.position.x == neighbor.position.x && y.tile.position.y == neighbor.position.y)
                        if (sameTiles.length == 0) {
                            visited.push({ tile: neighbor, distance: e.distance + this.movementCost(neighbor, e.tile) })
                            fringes[i + 1].push({ tile: neighbor, distance: e.distance + this.movementCost(neighbor, e.tile) })
                        } else if (sameTiles[0].distance > e.distance + this.movementCost(neighbor, e.tile)) {
                            sameTiles[0].distance = e.distance + this.movementCost(neighbor, e.tile)
                            fringes[i + 1].push({ tile: neighbor, distance: e.distance + this.movementCost(neighbor, e.tile) })
                        }
                    }
                }
            }.bind(this))
        }

        return visited
    }

    disactivate() {
        this.iconDIV.setAttribute("inactive", "true")
        this.disabled = true
        this.deselect()
        hideReachable()
        activePlayer.updateNotifications()
    }

    activate() {
        this.iconDIV.setAttribute("inactive", "false")
        this.disabled = false
        activePlayer.updateNotifications()
    }

    resetTurn() {
        if (this.path != undefined) {
            while (this.determineReachable().filter(x => x.tile == this.path[0]).length == 1) {
                this.move(this.path[0].position, this.determineReachable().filter(x => x.tile == this.path[0])[0].distance)
                this.path.shift()
            }
            if (this.path.length == 0) {
                this.assignPath(undefined)
            } else {
                this.disactivate()
            }
        }

        if (!this.asleep && this.path == undefined) {
            this.activate()
        }

        this.movementRemaining = 20
        this.troops.forEach(function(troop){
            if(troop.type.unitClass.movement < this.movementRemaining){
                this.movementRemaining = troop.type.unitClass.movement 
            }
        }.bind(this))
    }

    move(position, cost) {
        this.pos = position
        this.movementRemaining -= cost

        tiles[position.x][position.y].unitIconHolderDIV.appendChild(this.iconDIV)
        this.player.detectSeen()

        hideReachable()
        this.wakeUp()
        if (this.determineReachable().length <= 1) {
            this.disactivate()
        } else if(this.player == players[0]){
            renderReachable(this)
        }
        Unit.updateActions()
    }

    moveToAttack(tile){
        if(this.determineReachable().map(x => x.tile).includes(tile)){
            while (!nearby(this.tile, 1).includes(tile)) {
                var pathToDefender = this.getPathToTile(tile).reverse()
                this.move(pathToDefender[0].position, this.determineReachable().filter(x => x.tile == pathToDefender[0])[0].distance)
            }
        }
    }

    detectSeen(){
        var frontier = [this.tile]
        var visited = [this.tile]
        var unitOnHill = this.tile.terrain.name.includes("Hill")
        while(frontier.length >= 1){
            var currentTile = frontier.shift()
            nearby(currentTile, 1).forEach(function(tile){
                if(!this.player.seen.includes(tile)){
                    this.player.seen.push(tile)
                }
                if(((!tile.terrain.name.includes("Hill") && !tile.features.includes(features.forest)) || unitOnHill)
                && !tile.features.includes(features.mountain)
                && !visited.includes(tile)
                && nearby(this.tile, 1).includes(tile)){
                    frontier.push(tile)
                    visited.push(tile)
                }
            }.bind(this))
        }
    }

    get frontlineTroops(){
        return this.troops.filter(x => frontlineClasses.includes(x.type.unitClass))
    }

    get backlineTroops(){
        return this.troops.filter(x => backlineClasses.includes(x.type.unitClass))
    }

    get supportTroops(){
        return this.troops.filter(x => supportClasses.includes(x.type.unitClass))
    }

    get tooltip() {
        var finalText = ""
        //finalText = this.type.name
        return finalText
    }

    get troopInfo(){
        var troopInfoDIV = document.createElement("DIV")
        troopInfoDIV.className = "troop-info-box"

        this.troops.forEach(function(troop, index){
            var troopInfoTroopDIV = document.createElement("DIV")
            troopInfoTroopDIV.className = "troop-info-troop-div"
            troopInfoTroopDIV.onclick = function(){
                this.split(index).select()
            }.bind(this)

            var troopInfoTroopIMG = document.createElement("IMG")
            troopInfoTroopIMG.src = troop.type.filename
            troopInfoTroopDIV.appendChild(troopInfoTroopIMG)
            troopInfoDIV.appendChild(troopInfoTroopDIV)
        }.bind(this))

        return troopInfoDIV
    }

    static deselectAllUnits() {
        for (var i = selectedUnits.length - 1; i >= 0; i--) {
            selectedUnits[i].deselect()
        }
    }

    static updateActions() {
        if (selectedUnits.length == 0) {
            return
        }
        unitActions = []
        if (Unit.selectedUnitsOnSameTile()) {
            if (selectedUnits.filter(x => x.troops.filter(x => x.type.unitClass == unitClasses.settler).length >= 1).length == 1) {
                unitActions.push(actions.settle)
            }
            if (selectedUnits.length > 1) {
                unitActions.push(actions.merge)
            }
        }
        if (selectedUnits.some(x => x.asleep)) {
            unitActions.push(actions.wakeUp)
        }
        if (selectedUnits.some(x => !x.asleep)) {
            unitActions.push(actions.sleep)
        }
        unitActions.push(actions.wait)
        if (Unit.selectedUnitsHaveSameMovement()) {
            unitActions.push(actions.move)
        }

        document.getElementById("unitactions").innerHTML = ""
        document.getElementById("unitactions").style.left = "0"

        unitActions.forEach(function (e) {
            var makeInactive = false
            switch (e) {
                case actions.move: makeInactive = selectedUnits[0].determineReachable().length == 1; break;
                case actions.settle:
                    makeInactive = !selectedUnits.filter(x => x.troops.filter(x => x.type.unitClass == unitClasses.settler).length >= 1)[0].tile.canFoundSettlement()
                    makeInactive |= selectedUnits.filter(x => x.troops.filter(x => x.type.unitClass == unitClasses.settler).length >= 1)[0].determineReachable().length == 1;
                    break;
                case actions.wait: makeInactive = !selectedUnits.every(x => !x.disabled); break;
            }
            if (makeInactive) {
                e.icon.setAttribute("inactive", "true")
            } else {
                e.icon.setAttribute("inactive", "false")
            }
            document.getElementById("unitactions").appendChild(e.icon)
        })

        document.getElementById("troop-info").innerHTML = ""
        selectedUnits.forEach(function(unit){
            document.getElementById("troop-info").appendChild(unit.troopInfo)
        })
    }

    static displayPaths(units, destination) {
        tiles.forEach(x => x.forEach(function (tile) {
            tile.clearPathMeshes()
        }))

        units.forEach(function (unit) {
            var pathwayTiles
            if (unit.path != undefined) {
                pathwayTiles = unit.path.slice()
            } else if (destination != undefined && unit.getPathToTile(destination) != false) {
                pathwayTiles = unit.getPathToTile(destination).reverse()
            }

            if (pathwayTiles != undefined) {
                pathwayTiles.push(unit.tile)

                tiles.forEach(x => x.forEach(function (tile) {
                    if (pathwayTiles.includes(tile)) {
                        directions.forEach(function (direction, directionIndex) {
                            if (pathwayTiles.includes(t(tile, direction))) {
                                tile.pathMeshes.push(unitPathMesh.clone())
                                tile.face.add(tile.pathMeshes.last())
                                tile.pathMeshes.last().rotation.z = -Math.PI / 3 * directionIndex

                                if (t(tile, direction).depth > tile.depth) {
                                    var angle = Math.atan((t(tile, direction).depth - tile.depth) / hexagonSize)
                                    tile.pathMeshes.last().scale.set(1 / Math.cos(angle), 1, 1)
                                    tile.pathMeshes.last().rotation.y = -angle * 1.1
                                    tile.pathMeshes.last().rotation.order = "ZXY"
                                }
                            }
                        })
                    }
                }))
            }
        })
    }

    static selectedUnitsOnSameTile(){
        var result = true
        if (selectedUnits.length > 1) {
            for (var i = 0; i < selectedUnits.length - 1; i++) {
                if (selectedUnits[i].tile != selectedUnits[i + 1].tile) {
                    result = false
                }
            }
        }
        return result
    }

    static selectedUnitsHaveSameMovement(){
        var result = true
        if (selectedUnits.length > 1) {
            for (var i = 0; i < selectedUnits.length - 1; i++) {
                if (selectedUnits[i].movementRemaining != selectedUnits[i + 1].movementRemaining) {
                    result = false
                }
            }
        }
        return result
    }

    static resolveCombat(attacker, defender){
        var attackers = attacker, defenders = defender
        if(attackers.length == undefined){
            attackers = [attacker]
        }
        if(defenders.length == undefined){
            defenders = [defender]
        }
        attackers.forEach(x => x.troops.forEach(function(troop){
            if(defender != undefined){
                var target
                if(defenders.some(x => x.frontlineTroops.length > 0)){
                    target = randomValue(defenders.reduce((x,y) => x.concat(y.frontlineTroops), []))
                } else if(defenders.some(x => x.backlineTroops.length > 0)){
                    target = randomValue(defenders.reduce((x,y) => x.concat(y.backlineTroops), []))
                } else {
                    target = randomValue(defenders.reduce((x,y) => x.concat(y.supportTroops), []))
                }

                target.takeDamage(troop.strength)
            }
        }))

        attackers.forEach(x => x.movementRemaining = 0)
    }
}
