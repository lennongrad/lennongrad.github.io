class Unit {
    constructor(type, player, pos) {
        this.pos = pos
        this.player = player
        this.movementRemaining = 0
        this.asleep = false

        this.troops = []
        if (type.isUnitType) {
            this.troops = [{ type: type, constitution: 1 }]
        } else {
            this.troops = [type]
        }
        /*
                this.icon = new THREE.Sprite(new THREE.SpriteMaterial( 
                    { map: this.troops[0].type.texture, side: THREE.DoubleSide, transparent: true, depthTest: false, depthFunc: THREE.AlwaysDepth } ));
                scene.add(this.icon)*/

        this.iconDIV = document.createElement("DIV")
        this.iconDIV.className = "unit-icon"
        this.iconDIV.unit = this

        this.iconDIV.onclick = function(){
            this.unit.select()
        }

        this.resetTurn()
        this.recalculate()
    }

    recalculate() {
        this.actions = []
        if (this.troops.filter(x => x.type.unitClass == unitClasses.settler).length >= 1) {
            this.actions.push(actions.settle)
        }
        this.actions.push(actions.wakeUp)
        this.actions.push(actions.sleep)
        this.actions.push(actions.wait)
        this.actions.push(actions.move)

        this.iconDIV.innerHTML = " " + this.troops.length + " |"
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
                this.iconDIV.appendChild(newImage)
            }
        }.bind(this))
    }

    select() {
        if (activePlayer == this.player) {
            activeUnit = this
            this.updateActions()
            renderReachable(this)
        }
    }

    split(index) {
        this.player.units.push(new Unit(this.troops.splice(index, index + 1), this.player, this.pos))
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
        this.updateActions()
    }

    foundSettlement() {
        if (this.tile().canFoundSettlement()) {
            this.tile().foundSettlement()
            this.die()
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
        activeUnit.disactivate()
        hideReachable()
    }

    updateActions() {
        document.getElementById("unitactions").innerHTML = ""
        document.getElementById("unitactions").style.right = "0"

        this.actions.forEach(function (e) {
            if ((this.asleep && e == actions.sleep)
                || (!this.asleep && e == actions.wakeUp)) {
                return
            }

            var makeInactive = false
            switch (e) {
                case actions.move: makeInactive = this.determineReachable().length == 1; break;
                case actions.settle: makeInactive = !this.tile().canFoundSettlement() || this.determineReachable().length == 1; break;
                case actions.wait: makeInactive = this.disabled; break;
            }
            if (makeInactive) {
                e.icon.setAttribute("inactive", "true")
            } else {
                e.icon.setAttribute("inactive", "false")
            }
            document.getElementById("unitactions").appendChild(e.icon)
        }.bind(this))
    }

    die() {
        if (this == activeUnit) {
            activeUnit = undefined
            document.getElementById("unitactions").style.right = "-500px"
            hideReachable()
        }
        scene.remove(this.icon)
        removeElement(this.iconDIV)
        this.player.units.splice(this.player.units.indexOf(this), 1)
    }

    tile() {
        return tiles[this.pos.x][this.pos.y]
    }

    movementCost(tile, origin) {
        var final = 1

        /*
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
        }*/

        if (tile.terrain == terrainTypes.ice) {
            final = 100
        }

        if (tile.features == undefined || tile.features.includes(features.mountain) || tile.features.includes(features.mesa)) {
            final = 100
        }

        if (tile.terrain.name.includes("Hills")) {
            final += .5
        }

        if (tile.features.includes(features.forest)) {
            final += .5
        }

        if (!tile.river && origin.river) {
            final += .5
        }

        return final
    }

    determineReachable() {
        var visited = [{ tile: tiles[this.pos.x][this.pos.y], distance: 0 }]
        var fringes = []
        fringes.push([{ tile: tiles[this.pos.x][this.pos.y], distance: 0 }])

        var me = this

        for (var i = 0; i < me.movementRemaining; i++) {
            fringes.push([])
            fringes[i].forEach(function (e) {
                for (var d = 0; d < directions.length; d++) {
                    var neighbor = t(e.tile, directions[d])
                    if (e.distance + me.movementCost(neighbor, e.tile) <= me.movementRemaining) {
                        var sameTiles = visited.filter(y => y.tile.position.x == neighbor.position.x && y.tile.position.y == neighbor.position.y)
                        if (sameTiles.length == 0) {
                            visited.push({ tile: neighbor, distance: e.distance + me.movementCost(neighbor, e.tile) })
                            fringes[i + 1].push({ tile: neighbor, distance: e.distance + me.movementCost(neighbor, e.tile) })
                        } else if (sameTiles[0].distance > e.distance + me.movementCost(neighbor, e.tile)) {
                            sameTiles[0].distance = e.distance + me.movementCost(neighbor, e.tile)
                            fringes[i + 1].push({ tile: neighbor, distance: e.distance + me.movementCost(neighbor, e.tile) })
                        }
                    }
                }
            })
        }

        return visited
    }

    disactivate() {
        this.disabled = true
        if (this == activeUnit) {
            hideReachable()
            activeUnit = undefined
            document.getElementById("unitactions").style.right = "-500px"
        }
        activePlayer.updateNotifications()
    }

    activate() {
        this.disabled = false
        activePlayer.updateNotifications()
    }

    resetTurn() {
        if (!this.asleep) {
            this.activate()
        }
        this.movementRemaining = 2
    }

    move(tile, cost) {
        this.pos = tile
        this.movementRemaining -= cost

        tiles[tile.x][tile.y].unitIconHolderDIV.appendChild(this.iconDIV)
        this.player.detectSeen()

        hideReachable()
        this.wakeUp()
        if (this.determineReachable().length <= 1) {
            this.disactivate()
        } else {
            renderReachable(this)
        }
        this.updateActions()
    }

    getTooltip() {
        var finalText = ""
        //finalText = this.type.name
        return finalText
    }
}
