class Unit{
    constructor(type, player, pos){
        this.type = type
        this.pos = pos
        this.player = player
        this.movementRemaining = 0
        this.asleep = false

        this.icon = new THREE.Sprite(new THREE.SpriteMaterial( 
            { map: this.type.texture, side: THREE.DoubleSide, transparent: true, depthTest: false, depthFunc: THREE.AlwaysDepth } ));
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
        if(activePlayer == this.player){
            activeUnit = this
            this.updateActions()
            renderReachable(this)
        }
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
        if(this.tile().canFoundSettlement()){
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
                case actions.settle: makeInactive = !me.tile().canFoundSettlement() || me.determineReachable().length == 1; break;
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
