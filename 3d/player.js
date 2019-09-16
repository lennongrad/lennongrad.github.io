class Player{
    constructor(){
        this.units = [] 
        this.settlements = []
        this.color = "#" + decimalToHexString(Math.ceil(16777215 * Math.random())) 
        this.borderColor = new THREE.Color(adjustBrightness(this.color, 5))
        this.color = new THREE.Color(this.color)
        this.seen = []
        this.yields = {}

        this.technologyPicks = []
        this.technologyChosen = undefined
        this.technologyCompleted = []

        this.accumulatedCulture = 0
        this.accumulatedGold = 0
        this.heldScience = 0
        this.randomizeTechnology()

        this.overlayMaterial = new THREE.MeshBasicMaterial( { color: this.color,
             alphaMap: hexagonAlpha, transparent: true, opacity: ownerOverlayOpacity, depthWrite: false } )
    }
    
    updateNotifications(){
        var me = this
        this.notificationsRemaining = []
        document.getElementById("notifications").innerHTML = ""
        notifications.forEach(function(n){
            if(n.criteria(me)){
                if(me == players[0]){
                    if(me.notificationsRemaining.length == 0){
                        document.getElementById("nextturn-cover").src = n.iconIMG.src
                    } else {
                        document.getElementById("notifications").appendChild(n.icon)
                    }
                }
                me.notificationsRemaining.push(n)
            }
        })

        if(this == players[0]){
            if(me.notificationsRemaining.length == 0){
                document.getElementById("nextturn").style.backgroundImage = "url('nextturn-back.png')"
                document.getElementById("nextturn-cover").style.display = "none"
            } else {
                document.getElementById("nextturn").style.backgroundImage = ""
                document.getElementById("nextturn-cover").style.display = ""
            }
        }
    }

    beginTurn(){
        this.settlements.forEach(x => x.beginTurn())
        this.updateNotifications()
        if(this != players[0]){
            setTimeout(() => { this.ai() }, 500);
        }
        this.calculateYields()
        this.units.forEach(x => tiles[x.pos.x][x.pos.y].unitIconHolderDIV.appendChild(x.iconDIV))

        if(this.technologyPicks.length >= 1 && this.technologyChosen == undefined){
            this.chooseTechnology(0)
        }

        this.accumulatedGold += this.yields.gold
        this.accumulatedCulture += this.yields.culture
        this.incrementScience(this.yields.science)

        if(this == players[0]){
            this.updateTopbar()
        }
    }

    ai(){
        this.endTurn()
    }

    incrementScience(value){
        if(this.technologyChosen != undefined){
            if(this.heldScience > 0){
                value += this.heldScience
                this.heldScience = 0
            }
            
            if(this.technologyChosen.completion + value > this.technologyChosen.getCost(this)){
                this.technologyCompleted.push(this.technologyChosen)
                this.randomizeTechnology()
                this.chooseTechnology((this.technologyPicks.length > 0) ? 0 : undefined)

                this.heldScience = this.technologyChosen.completion + value - this.technologyChosen.getCost(this)
            } else {
                this.technologyChosen.completion += value
                this.technologyChosen.elementBar.style.transform = "translate(-51%,-50%) rotate(-" + (Math.PI * (this.technologyChosen.completion / this.technologyChosen.getCost(this))) + "rad)"
            }
        } else {
            this.heldScience += value
        }
    }

    randomizeTechnology(){
        var possiblePicks = []
        Object.keys(technologies).forEach(function(tech){
            if(!this.technologyCompleted.includes(technologies[tech])){
                var canInclude = true
                technologies[tech].prerequisites.forEach(function(pre){
                    if(!this.technologyCompleted.includes(pre)){
                        canInclude = false
                    }
                }.bind(this))
                if(canInclude){
                    possiblePicks.push(technologies[tech])
                }
            }
        }.bind(this))

        this.technologyPicks = []
        if(possiblePicks.length >= 3){
            while(this.technologyPicks.length < 3){
                var randomVal = randomValue(possiblePicks)
                if(!this.technologyPicks.includes(randomVal)){
                    this.technologyPicks.push(randomVal)
                }
            }
        } else {
            this.technologyPicks = possiblePicks
        } 
    }

    chooseTechnology(index){
        if(index != undefined){
            this.technologyChosen = this.technologyPicks[index]
        }
        if(this == players[0]){
            document.getElementById("science-holder").innerHTML = ""
            this.technologyPicks.forEach(function(tech, index){
                document.getElementById("science-holder").appendChild(tech.element)
                tech.element.setAttribute("indexInPicks", index)
            })
            if(index != undefined){
                document.getElementById("science-holder").prepend(this.technologyChosen.element)
            }
        }
    }

    endTurn(){
        selectedUnits = []
        document.getElementById("unitactions").style.right = "-500px"
        hideReachable()
        this.units.forEach(x => x.resetTurn())
        activePlayer = players[(players.indexOf(activePlayer) + 1) % players.length]
        if(activeSettlement != undefined){
            activeSettlement.deselect()
        }
        Settlement.hideInfo()

        if(this == players[0]){
            document.getElementById("nextturn").style.backgroundImage = ""
            document.getElementById("nextturn-cover").style.display = ""
            document.getElementById("nextturn-cover").src = "waitingarrow.png"
        }
        activePlayer.beginTurn()
    }

    calculateYields(){
        this.yields = {culture: 0, gold: 0, science: 0, food: 0, production: 0}
        this.settlements.forEach(function(x){x.calculateYields(); this.yields = addYields(this.yields, x.yields)}.bind(this))

        if(this == players[0]){
            document.getElementById("topbar-gold-perturn").innerHTML = "+" + this.yields.gold
            document.getElementById("topbar-science-perturn").innerHTML = "+" + this.yields.science
            document.getElementById("topbar-culture-perturn").innerHTML = "+" + this.yields.culture
            document.getElementById("topbar-food-perturn").innerHTML = "+" + this.yields.food
            document.getElementById("topbar-production-perturn").innerHTML = "+" + this.yields.production
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
                    if(!e.hasBeenAdded){
                        scene.add(e.mesh)
                    }
                } else {
                    e.face.material = e.terrain.materialDark
                }
            }))
        }
    }

    updateTopbar(){
        document.getElementById("topbar-gold-count").innerHTML = this.accumulatedGold
        document.getElementById("topbar-culture-count").innerHTML = this.accumulatedCulture
    }
}