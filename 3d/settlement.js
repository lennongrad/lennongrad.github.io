
class Settlement {
    constructor(pos, player) {
        this.position = pos
        this.tile = tiles[pos.x][pos.y]
        this.player = player

        this.population = 1
        this.tiles = []
        this.yields = {}
        this.foodCount = 0
        this.cultureCount = 0
        this.heldProduction = 0

        this.model = settlement.clone()
        this.model.scale.set(.0025, .0025, .0025)
        this.model.rotation.y = Math.random() * Math.PI * 2
        tiles[this.position.x][this.position.y].mesh.add(this.model)

        this.labelDIV = document.createElement("DIV")
        this.labelDIV.className = "city-label"

        this.labelLeftCircle = document.createElement("div")
        this.labelLeftCircle.className = "city-label-left-circle"
        this.labelDIV.appendChild(this.labelLeftCircle)

        this.labelLeftBar = document.createElement("DIV")
        this.labelLeftBar.className = "city-label-left-bar"
        this.labelLeftCircle.appendChild(this.labelLeftBar)

        this.labelPop = document.createElement("DIV")
        this.labelPop.innerHTML = this.population
        this.labelPop.className = "city-label-pop"
        this.labelDIV.appendChild(this.labelPop)

        this.labelRightCircle = document.createElement("div")
        this.labelRightCircle.className = "city-label-right-circle"
        this.labelDIV.appendChild(this.labelRightCircle)

        this.labelRightBar = document.createElement("DIV")
        this.labelRightBar.className = "city-label-right-bar"
        this.labelRightCircle.appendChild(this.labelRightBar)

        this.labelProd = document.createElement("DIV")
        this.labelProd.className = "city-label-prod"
        this.labelDIV.appendChild(this.labelProd)

        this.labelProdImage = document.createElement("IMG")
        this.labelProdImage.src = "unknown.png"
        this.labelProd.appendChild(this.labelProdImage)

        this.labelName = document.createElement("DIV")
        this.labelName.innerHTML = "SETTLEMENT"
        this.labelName.className = "city-label-name"
        this.labelDIV.appendChild(this.labelName)

        this.tile.unitIconHolderDIV.prepend(this.labelDIV)

        this.labelDIV.onmouseup = function () {
            cursor.active = false
        }

        var me = this
        this.labelName.onclick = function () {
            if (me != activeSettlement) {
                me.select("working")
            }
        }

        this.labelProd.onclick = function () {
            Settlement.changeCityInfoPanel(0)
            me.displayInfo()
        }
        this.labelPop.onclick = function () {
            Settlement.changeCityInfoPanel(1)
            me.displayInfo()
        }

        this.producible = []
        this.producible[0] = { type: producibleTypes.develop, name: "Develop Tile", progress: 0 }
        this.producible[1] = { type: producibleTypes.clear, name: "Clear Feature", progress: 0 }
        Object.keys(unitTypes).forEach(function (e) {
            me.producible.push({ type: producibleTypes.unit, unit: unitTypes[e], name: unitTypes[e].name, progress: 0 })
        })
        this.producingID = undefined
        this.incrementProduction(0)
        this.incrementFood(0)
        this.incrementCulture(0)
    }

    beginTurn() {
        this.incrementProduction(this.yields.production)
        this.incrementFood(this.yields.food)
        this.incrementCulture(this.yields.culture)
    }

    /**
     * A measurement of the value of this Tile, used to determine Culture border growth and which Tiles are Worked by a Settlement
     */
    getTileValue(tile) {
        var final = 0
        Object.keys(tile.yields).forEach(function (x) {
            final += tile.yields[x] * (x == "gold" ? .5 : 1)
        })
        if (tile.resource != undefined) {
            final *= 2
        }
        if (tile.river) {
            final *= 1.2
        }
        return final
    }

    updateProducible() {
        this.producible.forEach(function (e) {
            switch (e.type) {
                case producibleTypes.clear: e.image = "actions/clear.png"; break;
                case producibleTypes.develop: e.image = "actions/build.png"; break;
                case producibleTypes.unit: e.image = "unitIcons/prod_" + e.name + ".png"; break;
            }
            e.cost = 30
        })
    }

    displayInfo(){
        viewedSettlement = this

        document.getElementById("city-info").style.right = "0"
        document.getElementById("city-production").style.display = "none"
        document.getElementById("city-yields").style.display = "none"
        switch(activeCityInfoPanel){
            case 0: this.displayProduction(); break;
            case 1: this.displayYields(); break;
        }
    }

    displayProduction() {
        document.getElementById("city-production").style.display = ""
        this.updateProducible()

        document.getElementById("city-production").innerHTML = ""
        var me = this

        this.items = []
        this.producible.forEach(function (e, index) {
            switch (e.type) {
                case producibleTypes.clear: if (me.tiles.filter(x => x.features.includes(features.forest) || x.features.includes(features.savanna)).length == 0) { return }; break;
                case producibleTypes.develop: if (me.tiles.filter(x => !x.developed && x.getDevelopment()).length == 0) { return }; break;
            }

            var item = document.createElement("DIV")
            item.className = "city-production-item"
            if (index == me.producingID) {
                item.className = "city-production-item city-production-item-selected"
            }

            var itemImage = document.createElement("DIV")
            itemImage.className = "city-production-item-image"
            var itemImageIMG = document.createElement("IMG")
            itemImageIMG.src = e.image
            itemImage.appendChild(itemImageIMG)
            item.appendChild(itemImage)

            if (e.type == producibleTypes.unit) {
                itemImageIMG.className = "invert"
            }

            var itemDetails = document.createElement("DIV")
            itemDetails.className = "city-production-item-details"
            var itemDetailsName = document.createElement("DIV")
            itemDetailsName.className = "city-production-item-name"
            itemDetailsName.innerHTML = e.name
            var itemDetailsCost = document.createElement("DIV")
            itemDetailsCost.className = "city-production-item-cost"
            var itemDetailsCostSpan = document.createElement("SPAN")
            itemDetailsCostSpan.innerHTML = ((e.progress != 0) ? (e.progress + " / ") : ("")) + e.cost + " "
            var itemDetailsCostImage = document.createElement("IMG")
            itemDetailsCostImage.src = "yields/production_5.png"
            itemDetailsCost.appendChild(itemDetailsCostSpan)
            itemDetailsCost.appendChild(itemDetailsCostImage)
            itemDetails.appendChild(itemDetailsName)
            itemDetails.appendChild(itemDetailsCost)
            item.appendChild(itemDetails)

            item.id = index
            item.onclick = function () {
                if (this.id == "0" || this.id == "1") {
                    me.select(this.id == "0" ? "develop" : "clear")
                    activeSelection = Number(this.id)
                    me.items.forEach(function (x) {
                        x.className = "city-production-item"
                    })
                    this.className = "city-production-item city-production-item-active"
                } else {
                    me.setProduction(Number(this.id))
                    if (activeSettlement != undefined) {
                        activeSettlement.deselect()
                    }
                    Settlement.hideInfo()
                }
            }

            document.getElementById("city-production").appendChild(item)
            me.items.push(item)
        })
    }

    displayYields() {
        document.getElementById("city-yields").style.display = ""

        document.getElementById("city-yields-food-bar").style.width = this.foodCount / this.foodCost() * 100 + "%"
        if (this.yields.food != undefined && this.yields.food > 0) {
            document.getElementById("city-yields-food-turns").innerHTML = Math.ceil((this.foodCost() - this.foodCount) / this.yields.food)
            document.getElementById("city-yields-food-count").innerHTML = "+" + Math.floor(this.yields.food)
        } else {
            document.getElementById("city-yields-food-turns").innerHTML = "?"
            document.getElementById("city-yields-food-count").innerHTML = "?"
        }
        document.getElementById("city-yields-food-result").innerHTML = this.population

        document.getElementById("city-yields-culture-bar").style.width = this.cultureCount / this.cultureCost() * 100 + "%"
        if (this.yields.culture != undefined && this.yields.culture > 0) {
            document.getElementById("city-yields-culture-turns").innerHTML = Math.ceil((this.cultureCost() - this.cultureCount) / this.yields.culture)
            document.getElementById("city-yields-culture-count").innerHTML = "+" + Math.floor(this.yields.culture)
        } else {
            document.getElementById("city-yields-culture-turns").innerHTML = "?"
            document.getElementById("city-yields-culture-count").innerHTML = "?"
        }
        document.getElementById("city-yields-culture-result").innerHTML = this.tiles.length

        document.getElementById("city-yields-production-count").innerHTML = "+" + Math.floor(this.yields.production)
        if (this.producingID != undefined) {
            document.getElementById("city-yields-production").style.height = ""
            document.getElementById("city-yields-turns-production").style.display = ""
            document.getElementById("city-yields-bar-production").style.display = ""
            document.getElementById("city-yields-production-turns").innerHTML = Math.ceil((this.producible[this.producingID].cost - this.producible[this.producingID].progress) / this.yields.production)
            document.getElementById("city-yields-production-bar").style.width = this.producible[this.producingID].progress / this.producible[this.producingID].cost * 100 + "%"
        } else {
            document.getElementById("city-yields-production").style.height = "35px"
            document.getElementById("city-yields-turns-production").style.display = "none"
            document.getElementById("city-yields-bar-production").style.display = "none"
        }
        if (this.yields.science != undefined && this.yields.science > 0) {
            document.getElementById("city-yields-science-count").innerHTML = "+" + Math.floor(this.yields.science)
        } else {
            document.getElementById("city-yields-science-count").innerHTML = "?"
        }
        if (this.yields.gold != undefined && this.yields.gold > 0) {
            document.getElementById("city-yields-gold-count").innerHTML = "+" + Math.floor(this.yields.gold)
        } else {
            document.getElementById("city-yields-gold-count").innerHTML = "?"
        }
    }

    incrementFood(amount) {
        this.foodCount += amount

        if (this.foodCount >= this.foodCost()) {
            this.foodCount -= this.foodCost()
            this.changePopulation(1)
        }

        this.labelLeftBar.style.transform = "translate(-50%, -50%) rotate(" + (Math.PI * this.foodCount / this.foodCost()) + "rad)"
    }

    incrementCulture(amount) {
        this.cultureCount += amount

        while (this.cultureCount >= this.cultureCost() && this.cultureTarget != undefined) {
            this.cultureCount -= this.cultureCost()
            this.acquireTile(this.cultureTarget)
            this.player.calculateYields()
        }
    }

    changePopulation(amount) {
        this.population += amount
        this.labelPop.innerHTML = this.population
        this.player.calculateYields()
    }

    foodCost() {
        return 20
    }

    cultureCost() {
        return 20
    }

    acquireTile(tile) {
        this.tiles.push(tile)
        tile.switchOwnership(this.player)
        this.calculateYields()
    }

    incrementProduction(amount) {
        if (this.producingID != undefined) {
            var cost = this.producible[this.producingID].cost
            if (this.producible[this.producingID].progress + amount >= cost) {
                this.heldProduction = this.producible[this.producingID].progress + amount - cost
                this.producible[this.producingID].progress = 0
                switch (this.producible[this.producingID].type) {
                    case producibleTypes.develop: this.producible[this.producingID].target.updateDevelopment(); break;
                    case producibleTypes.clear: this.producible[this.producingID].target.clearAllFeatures(); break;
                    case producibleTypes.unit: this.player.units.push(new Unit(this.producible[this.producingID].unit, this.player, this.tile.position))
                }
                this.producingID = undefined
                this.labelProdImage.src = "unknown.png"
            } else {
                this.producible[this.producingID].progress += amount
            }
        } else {
            this.heldProduction += amount
        }

        if (this.producingID != undefined) {
            this.labelRightBar.style.transform = "translate(-50%, -50%) rotate(-" + (Math.PI * this.producible[this.producingID].progress / cost) + "rad)"
        } else {
            this.labelRightBar.style.transform = "translate(-50%, -50%) rotate(0rad)"
        }
    }

    setProduction(id) {
        this.producingID = id
        this.labelProdImage.src = this.producible[id].image
        if (this.heldProduction > 0) {
            var held = this.heldProduction
            this.heldProduction = 0
            this.incrementProduction(held)
        } else {
            this.incrementProduction(0)
        }
        activePlayer.updateNotifications()
    }

    calculateYields() {
        this.tiles.forEach(x => x.worked = false)
        this.yields = {}

        this.tiles.forEach(x => x.calculateYields())
        var compareStrength = this.tiles.sort(function (x, y) { return this.getTileValue(y) - this.getTileValue(x) }.bind(this))
        for (var i = 0; i < this.population && i < compareStrength.length; i++) {
            compareStrength[i].worked = true
            this.yields = addYields(this.yields, compareStrength[i].yields)
        }

        this.yields = addYields({ production: 1, food: 1, science: 1, culture: 5, gold: 1 }, this.yields)

        this.cultureEligibleTiles = []
        this.tiles.forEach(function (x) {
            directions.forEach(function (d) {
                var currentTile = t(x, d)
                if (!this.cultureEligibleTiles.includes(currentTile) && currentTile.player == undefined && nearby(this.tile, 3).includes(currentTile)) {
                    this.cultureEligibleTiles.push(currentTile)
                }
            }.bind(this))
        }.bind(this))

        this.cultureEligibleTiles.forEach(function(x){
            x.buyLabelPrice.innerHTML = this.priceToBuyTile(x)
            if(this.priceToBuyTile(x) > this.player.accumulatedGold){
                x.buyLabel.setAttribute("afford", "false")
            } else {
                x.buyLabel.setAttribute("afford", "true")
            }
        }.bind(this))

        this.cultureTarget = this.cultureEligibleTiles.sort((x, y) => this.getTileValue(y) - this.getTileValue(x))[0]
    }

    showDevelopEligible() {
        this.hideWorked()

        var me = this
        this.tiles.forEach(function (e) {
            if (!e.developed && e.getDevelopment() && !e.settlement) {
                e.developIcon = developIcon.clone()
                e.developIcon.position.z = maxDepth + .1
                e.mesh.add(e.developIcon)
            }
        })
    }

    showClearEligible() {
        this.hideWorked()

        var me = this
        this.tiles.forEach(function (e) {
            if ((e.features.includes(features.forest) || e.features.includes(features.savanna)) && !e.features.includes(features.mountain)) {
                e.clearIcon = clearIcon.clone()
                e.clearIcon.position.z = maxDepth + .1
                e.mesh.add(e.clearIcon)
            }
        })
    }

    showWorked() {
        this.hideWorked()

        var me = this
        this.tiles.forEach(function (e) {
            if (Object.keys(e.yields).length != 0) {
                if (e.worked) {
                    e.workedIcon = workedIcon.clone()
                } else {
                    e.workedIcon = unworkedIcon.clone()
                }
                e.workedIcon.position.z = maxDepth + .1
                e.mesh.add(e.workedIcon)
            }
        })

        this.cultureEligibleTiles.forEach(x => x.buyLabel.setAttribute("inactive", "false"))
    }

    hideWorked() {
        this.tiles.forEach(function (e) {
            if (e.workedIcon != undefined) {
                e.mesh.remove(e.workedIcon)
                e.workedIcon = undefined
            }

            if (e.developIcon != undefined) {
                e.mesh.remove(e.developIcon)
                e.developIcon = undefined
            }

            if (e.clearIcon != undefined) {
                e.mesh.remove(e.clearIcon)
                e.clearIcon = undefined
            }
        })

        tiles.forEach(y => y.forEach(x => x.buyLabel.setAttribute("inactive", "true")))
    }

    select(view) {
        this.displayInfo()
        if (activeSettlement != undefined && activeSettlement != this) {
            activeSettlement.deselect(true)
        }
        document.getElementById("unitactions").style.right = "-500px"
        hideReachable()

        mapOffset.x = maxOffsetX + initialCameraOffsetX - (Math.sqrt(3) * hexagonSize * this.position.x)
        mapOffset.y = initialCameraOffsetY - (2.05 * .75 * hexagonSize * this.position.y) + 2
        camera.rotation.x = 0
        activeSettlement = this
        this.calculateYields()

        switch (view) {
            case "working": this.showWorked(); break;
            case "develop": this.showDevelopEligible(); break;
            case "clear": this.showClearEligible(); break;
        }

        if(this.cultureTarget != undefined){
            this.cultureTarget.face.add(cultureTargetIcon)
        }

        var me = this
        tiles.forEach(x => x.forEach(function (e) {
            if (me.tiles.includes(e) && (view != "develop" || e.developIcon != undefined) && (view != "clear" || e.clearIcon != undefined)) {
                e.face.material = e.terrain.material
            } else {
                e.face.material = e.terrain.materialDark
            }
            if (e.productionTileIcon != undefined) {
                e.mesh.remove(e.productionTileIcon)
                e.productionTileIcon = undefined
            }
        }))

        if (this.producingID != undefined && this.producible[this.producingID].target != undefined) {
            this.producible[this.producingID].target.productionTileIcon = productionTileIcon.clone()
            this.producible[this.producingID].target.mesh.add(this.producible[this.producingID].target.productionTileIcon)
        }
    }

    deselect(reselecting) {
        if (this == activeSettlement) {
            this.hideWorked()
            activeSettlement = undefined
            activeSelection = undefined
            Settlement.hideInfo()
            camera.rotation.x = cameraRotationBase * (1 - (camera.position.z - minimumScrollIn) / (minimumScrollOut - minimumScrollIn))

            if (!reselecting) {
                this.tile.centerCameraOnTile()
            }

            if(cultureTargetIcon.parent != undefined){
                cultureTargetIcon.parent.remove(cultureTargetIcon)
            }

            var me = this
            tiles.forEach(x => x.forEach(function (e) {
                if (me.player.seen.includes(e)) {
                    e.face.material = e.terrain.material
                } else {
                    e.face.material = e.terrain.materialDark
                }
                if (e.productionTileIcon != undefined) {
                    e.mesh.remove(e.productionTileIcon)
                    e.productionTileIcon = undefined
                }
            }))
        }
    }

    priceToBuyTile(tile){
        return 20
    }

    static hideInfo(){
        document.getElementById("city-info").style.right = "-400px"
        viewedSettlement = undefined
    }

    static changeCityInfoPanel(newActivePanel){
        activeCityInfoPanel = newActivePanel;

        document.getElementById("city-info-header-production").setAttribute("currentPanel", "false")
        document.getElementById("city-info-header-yields").setAttribute("currentPanel", "false")

        switch(newActivePanel){
            case 0: document.getElementById("city-info-header-production").setAttribute("currentPanel", "true"); break;
            case 1: document.getElementById("city-info-header-yields").setAttribute("currentPanel", "true"); break;
        }

        if(viewedSettlement != undefined){
            viewedSettlement.displayInfo()
        }
    }
}
