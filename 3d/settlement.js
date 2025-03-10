
class Settlement {
    constructor(pos, player, map) {
        this.position = pos
        this.worldMap = map
        this.tile = this.worldMap.getTile(this.position)
        this.player = player
        this.name = "Settlement"

        this.population = 1
        this.developmentLevel = 0
        this.tradeRoutes = []
        this.tiles = []
        this.yields = {}
        this.foodCount = 0
        this.cultureCount = 0
        this.heldProduction = 0
        // kept as a whole number to avoid weird floating point issues
        this.taxRate = 50

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
        this.labelName.innerHTML = this.name.toUpperCase()
        this.labelName.className = "city-label-name"
        this.labelName.style.backgroundColor = this.player.color
        this.labelDIV.appendChild(this.labelName)

        this.tile.unitIconHolderDIV.prepend(this.labelDIV)
        this.worldMap.updateUnitIconHolders()

        this.labelDIV.onmouseup = function () {
            cursor.active = false
        }

        this.labelName.onclick = function () {
            if (this != activeSettlement) {
                this.select("working")
            }
        }.bind(this)

        this.labelProd.onclick = function () {
            Settlement.changeCityInfoPanel(0)
            this.displayInfo()
        }.bind(this)
        this.labelPop.onclick = function () {
            Settlement.changeCityInfoPanel(1)
            this.displayInfo()
        }.bind(this)

        this.producible = []
        this.producible[0] = { type: producibleTypes.develop, name: "Develop Tile", progress: 0 }
        this.producible[1] = { type: producibleTypes.clear, name: "Clear Feature", progress: 0 }
        this.producible[2] = { type: producibleTypes.district, name: "Build District", progress: 0 }
        Object.keys(unitTypes).forEach(function (e) {
            this.producible.push({ type: producibleTypes.unit, unit: unitTypes[e], name: unitTypes[e].name, progress: 0 })
        }.bind(this))
        this.producingID = undefined
        this.districts = []
        this.buildDistrict(this.tile)

        this.increaseDevelopmentLevel()

        this.incrementProduction(0)
        this.incrementFood(0)
        this.incrementCulture(0)
    }

    beginTurn() {
        this.tradeRoutes.forEach(function(route){
            if(Settlement.unfilledTradeRouteTiles(route.path).length != 0){
                Settlement.unfilledTradeRouteTiles(route.path)[0].addRoad()
            }
        })

        this.calculateYields()
        this.incrementProduction(this.yields.production)
        this.incrementFood(this.yields.food)
        this.incrementCulture(this.yields.culture)
    }

    increaseDevelopmentLevel(){
        this.developmentLevel++;
    }

    /**
     * A measurement of the value of this Tile, used to determine Culture border growth and which Tiles are Worked by a Settlement
     */
    getTileValue(tile) {
        var final = 0
        Object.keys(tile.yields).forEach(function (x) {
            final += tile.yields[x]
        })
        if (tile.resource != undefined) {
            final *= 2
        }
        if (tile.hasRiver) {
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
                case producibleTypes.district: e.image = "actions/district.png"; break;
                case producibleTypes.building: e.image = e.building.icon; break;
            }
            e.cost = 30
        })
    }

    displayInfo() {
        viewedSettlement = this

        document.getElementById("city-info").style.right = "0"
        document.getElementById("city-production").style.display = "none"
        document.getElementById("city-commerce").style.display = "none"
        document.getElementById("city-districts").style.display = "none"

        this.displayYields()

        switch (activeCityInfoPanel) {
            case 0: this.displayProduction(); break;
            case 1: this.displayCommerce(); break;
            case 2: this.displayDistricts(); break;
        }
    }

    displayProduction() {
        document.getElementById("city-production").style.display = ""
        this.updateProducible()

        document.getElementById("city-production").innerHTML = ""

        var itemSettlement = this

        this.items = []
        this.producible.forEach(function (e, index) {
            if (e.type == producibleTypes.district || e.type == producibleTypes.building) {
                return
            }

            switch (e.type) {
                case producibleTypes.clear: if (!this.tiles.some(x => x.features.includes(features.forest) || x.features.includes(features.savanna))) { return }; break;
                case producibleTypes.develop: if (!this.tiles.some(x => !x.developed && x.plannedDevelopment)) { return }; break;
            }

            if(e.type == producibleTypes.unit && !this.player.unlockedUnits.includes(e.unit)){
                return
            }

            var item = document.createElement("DIV")
            item.className = "city-production-item"
            if (index == this.producingID) {
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
            
            var itemDetailsCost = document.createElement("DIV")
            itemDetailsCost.append(document.getElementById("producible-cost").content.cloneNode(true))
            itemDetailsCost.className = "city-production-item-cost"
            itemDetailsCost.getElementsByTagName("span")[0].innerHTML = ((e.progress != 0) ? (e.progress + "/") : ("")) + e.cost
            itemDetailsCost.getElementsByTagName("span")[1].innerHTML = Math.ceil((e.cost - e.progress) / this.yields.production)
            item.appendChild(itemDetailsCost)

            var itemDetailsName = document.createElement("DIV")
            itemDetailsName.className = "city-production-item-name"
            itemDetailsName.innerHTML = e.name
            item.appendChild(itemDetailsName)

            item.id = index
            item.onclick = function () {
                if (this.id == "0" || this.id == "1") {
                    switch (this.id) {
                        case "0": itemSettlement.select("develop"); break;
                        case "1": itemSettlement.select("clear"); break;
                    }

                    activeSelection = Number(this.id)
                    itemSettlement.items.forEach(function (x) {
                        x.className = "city-production-item"
                    })
                    this.className = "city-production-item city-production-item-active"
                } else {
                    itemSettlement.setProduction(Number(this.id))
                    if (activeSettlement != undefined) {
                        activeSettlement.deselect()
                    }
                    Settlement.hideInfo()
                }
            }

            document.getElementById("city-production").appendChild(item);
            this.items.push(item)
        }.bind(this))
    }

    displayYields() {
        //document.getElementById("city-yields-food-bar").style.width = this.foodCount / this.foodCost() * 100 + "%"
        if (this.yields.food != undefined && this.yields.food > 0) {
            document.getElementById("city-yields-food-count").innerHTML = "+" + Math.floor(this.yields.food * 100) / 100
        } else {
            document.getElementById("city-yields-food-count").innerHTML = "?"
        }
        //document.getElementById("city-yields-food-result").innerHTML = this.population

        //document.getElementById("city-yields-culture-bar").style.width = this.cultureCount / this.cultureCost() * 100 + "%"
        if (this.yields.culture != undefined && this.yields.culture > 0) {
            document.getElementById("city-yields-culture-count").innerHTML = "+" + Math.floor(this.yields.culture * 100) / 100
        } else {
            document.getElementById("city-yields-culture-count").innerHTML = "?"
        }
        //document.getElementById("city-yields-culture-result").innerHTML = this.tiles.length

        if (this.yields.production != undefined && this.yields.production >= 0) {
            document.getElementById("city-yields-production-count").innerHTML = "+" + Math.floor(this.yields.production * 100) / 100
        } else {
            document.getElementById("city-yields-production-count").innerHTML = "?"
        }

        if (this.yields.science != undefined && this.yields.science >= 0) {
            document.getElementById("city-yields-science-count").innerHTML = "+" + Math.floor(this.yields.science * 100) / 100
        } else {
            document.getElementById("city-yields-science-count").innerHTML = "?"
        }

        if (this.yields.commerce != undefined && this.yields.commerce >= 0) {
            document.getElementById("city-yields-commerce-count").innerHTML = "+" + Math.floor(this.yields.commerce * 100) / 100
        } else {
            document.getElementById("city-yields-commerce-count").innerHTML = "?"
        }

        if (this.yields.capital != undefined && this.yields.capital >= 0) {
            document.getElementById("city-yields-capital-count").innerHTML = "+" + Math.floor(this.yields.capital * 100) / 100
        } else {
            document.getElementById("city-yields-capital-count").innerHTML = "?"
        }
    }

    displayCommerce(){
        document.getElementById("city-commerce").style.display = ""
        document.getElementById("city-commerce-conversion-arrow-rate").innerHTML = this.taxRate + "%"
        document.getElementById("city-commerce-conversion-initial-commerce").getElementsByTagName("SPAN")[0].innerHTML = "+" + this.commerceValues.preTaxCommerce
        document.getElementById("city-commerce-conversion-result-commerce").getElementsByTagName("SPAN")[0].innerHTML = "+" + this.commerceValues.postTaxCommerce
        document.getElementById("city-commerce-conversion-result-capital").getElementsByTagName("SPAN")[0].innerHTML = "+" + this.commerceValues.postTaxCapital
        
        document.getElementById("city-commerce-header-level").innerHTML = this.developmentLevel

        this.updateTradeRoutes()
        document.getElementById("city-commerce-routes-header-count").innerHTML = this.tradeRoutes.filter(x => x.active).length + "/" + this.developmentLevel
        document.getElementById("city-commerce-routes").innerHTML = ""
        document.getElementById("city-commerce-routes").appendChild(tradeRouteHeader)
        this.tradeRoutes.forEach(function(route){
            var routeRow = document.createElement("TR")
            routeRow.className = "city-commerce-routes-item"
            routeRow.route= route
  
            var routeName = document.createElement("TD")            
            routeName.innerHTML = route.settlement.name
            routeName.innerHTML += " (" + (route.path.length - Settlement.unfilledTradeRouteTiles(route.path).length - 2) + "/" + (route.path.length - 2) + ")"

            var routeNameIcon = document.createElement("IMG")
            routeNameIcon.src = "checkmark.png"
            routeName.prepend(routeNameIcon)
            routeRow.appendChild(routeName)

            yieldsTradeRouteOrder.forEach(function(y){
                var routeYieldTD = document.createElement("TD")
                if(route.benefits[y.name.toLowerCase()] != undefined){
                    routeYieldTD.innerHTML = route.benefits[y.name.toLowerCase()] 
                } else {
                    routeYieldTD.innerHTML = "0"
                }
                routeRow.appendChild(routeYieldTD)
            })

            if(route.active){
                routeRow.setAttribute("active", "true")
            } else {
                routeRow.setAttribute("active", "false")
            }

            routeRow.onclick = function(){
                if(viewedSettlement.tradeRoutes.filter(x => x.active).length < viewedSettlement.developmentLevel || this.route.active){
                    this.route.active = !this.route.active
                    viewedSettlement.calculateYields()
                    viewedSettlement.displayCommerce()
                }
            }

            routeRow.onmouseover = function(){
                currentWorldMap.displayTradeRoutePath(this.route.path)
            }

            routeRow.onmouseout = function(){
                currentWorldMap.clearPathMeshes()
            }

            document.getElementById("city-commerce-routes").appendChild(routeRow)
        })
    }

    displayDistricts() {
        document.getElementById("city-districts").style.display = ""
        document.getElementById("city-districts-list").innerHTML = ""
        buildingsList.innerHTML = ""
        this.updateProducible()

        var itemSettlement = this

        this.items = []
        this.producible.forEach(function (e, index) {
            if (e.type != producibleTypes.district && e.type != producibleTypes.building) {
                return
            }
            if(e.type == producibleTypes.building && (e.district.hasBuilding(e.building) || !testRequirements(e.building.requirements, e.district.tile, this, e.district))){
                return
            }
            var item = document.createElement("DIV")
            item.className = "city-production-item"
            if (index == this.producingID) {
                item.className = "city-production-item city-production-item-selected"
            }if(e.type == producibleTypes.building && !this.player.unlockedBuildings.includes(e.building)){
                return
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

            var itemDetailsCost = document.createElement("DIV")
            itemDetailsCost.append(document.getElementById("producible-cost").content.cloneNode(true))
            itemDetailsCost.className = "city-production-item-cost"
            itemDetailsCost.getElementsByTagName("span")[0].innerHTML = ((e.progress != 0) ? (e.progress + "/") : ("")) + e.cost
            itemDetailsCost.getElementsByTagName("span")[1].innerHTML = Math.ceil((e.cost - e.progress) / this.yields.production)
            item.appendChild(itemDetailsCost)
            
            var itemDetailsName = document.createElement("DIV")
            itemDetailsName.className = "city-production-item-name"
            itemDetailsName.innerHTML = e.name
            item.appendChild(itemDetailsName)

            item.id = index
            item.onclick = function () {
                if (this.id == "2") {
                    Settlement.hideBuildingProduction()
                    switch (this.id) {
                        case "2": itemSettlement.select("district"); break;
                    }

                    activeSelection = Number(this.id)
                    itemSettlement.items.forEach(function (x) {
                        x.className = "city-production-item"
                    })
                    this.className = "city-production-item city-production-item-active"
                } else {
                    itemSettlement.setProduction(Number(this.id))
                    if (activeSettlement != undefined) {
                        activeSettlement.deselect()
                    }
                    Settlement.hideInfo()
                }
            }

            switch (e.type) {
                case producibleTypes.district: document.getElementById("city-districts-list").appendChild(item); break;
                case producibleTypes.building: item.district = e.district; buildingsList.appendChild(item); break;
            }
            this.items.push(item)
        }.bind(this))

        this.districts.forEach(function (district) {
            document.getElementById("city-districts-list").appendChild(district.element);
        })
    }

    incrementFood(amount) {
        this.foodCount += amount

        if (this.foodCount >= this.foodCost()) {
            this.foodCount -= this.foodCost()
            this.changePopulation(1)
        }

        this.labelLeftBar.style.transform = "translate(-50%, -50%) rotate(" + Math.min(Math.PI, Math.PI * this.foodCount / this.foodCost()) + "rad)"
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
        this.player.detectSeen()
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
                    case producibleTypes.district: this.buildDistrict(this.producible[this.producingID].target); break;
                    case producibleTypes.unit: this.player.units.push(new Unit(this.producible[this.producingID].unit, this.player, this.tile.position, this.worldMap));
                        this.tile.unitIconHolderDIV.appendChild(this.player.units.last().iconDIV); break;
                    case producibleTypes.building: this.producible[this.producingID].district.addBuilding(this.producible[this.producingID].building); break;
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

        this.player.calculateYields()
        this.player.updateNotifications()
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
        this.yields = { production: 1, food: 1, science: 1, culture: 5, capital: 0, commerce: 1 }

        this.tiles.forEach(x => x.resetBuildingYields())
        this.districts.forEach(district => this.yields = addYields(this.yields, district.calculateYields()))
        this.tiles.forEach(x => x.calculateYields())
        var compareStrength = this.tiles.sort(function (x, y) { return this.getTileValue(y) - this.getTileValue(x) }.bind(this))
        for (var i = 0; i < this.population && i < compareStrength.length; i++) {
            compareStrength[i].worked = true
            this.yields = addYields(this.yields, compareStrength[i].yields)
        }

        this.tradeRoutes.forEach(function(route){
            if(route.active && Settlement.unfilledTradeRouteTiles(route.path).length == 0){
                this.yields = addYields(this.yields, route.benefits)
            }
        }.bind(this))

        this.commerceValues = { preTaxCommerce: this.yields.commerce, 
            postTaxCommerce: Math.ceil(this.yields.commerce * (100 - this.taxRate)) / 100, 
            postTaxCapital: this.yields.commerce * this.taxRate / 100 }
        this.yields.capital += this.commerceValues.postTaxCapital
        this.yields.commerce = this.commerceValues.postTaxCommerce

        this.cultureEligibleTiles = []
        this.tiles.forEach(tile => tile.nearby(1).forEach(currentTile => {
            if (!this.cultureEligibleTiles.includes(currentTile) && currentTile.player == undefined && this.tile.nearby(3).includes(currentTile)) {
                this.cultureEligibleTiles.push(currentTile)
            }
        }))

        this.cultureEligibleTiles.forEach(function (x) {
            x.buyLabelPrice.innerHTML = this.priceToBuyTile(x)
            if (this.priceToBuyTile(x) > this.player.accumulatedCapital) {
                x.buyLabel.setAttribute("afford", "false")
            } else {
                x.buyLabel.setAttribute("afford", "true")
            }
        }.bind(this))

        this.cultureTarget = this.cultureEligibleTiles.sort((x, y) => this.getTileValue(y) - this.getTileValue(x))[0]

        this.displayYields()
    }

    showDevelopEligible() {
        this.hideWorked()

        var me = this
        this.tiles.forEach(function (e) {
            if (!e.developed && e.plannedDevelopment && !e.settlement) {
                e.developIcon = developIcon.clone()
                e.developIcon.position.z = .1
                e.face.add(e.developIcon)
            }
        })
    }

    showClearEligible() {
        this.hideWorked()

        var me = this
        this.tiles.forEach(function (e) {
            if ((e.features.includes(features.forest) || e.features.includes(features.savanna)) && !e.features.includes(features.mountain)) {
                e.clearIcon = clearIcon.clone()
                e.clearIcon.position.z = .1
                e.face.add(e.clearIcon)
            }
        })
    }

    showDistrictEligible() {
        this.hideWorked()

        var me = this
        this.tiles.forEach(function (e) {
            if (e.terrain.variety == terrainVariety.land && !e.district && !e.settlement && !e.features.includes(features.mountain)) {
                e.districtIcon = districtIcon.clone()
                e.districtIcon.position.z = .1
                e.face.add(e.districtIcon)
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
                e.workedIcon.position.z = .1
                e.face.add(e.workedIcon)
            }
        })

        this.cultureEligibleTiles.forEach(x => x.face.add(x.buyLabel2D))
    }

    hideWorked() {
        this.tiles.forEach(function (e) {
            if (e.workedIcon != undefined) {
                e.face.remove(e.workedIcon)
                e.workedIcon = undefined
            }

            if (e.developIcon != undefined) {
                e.face.remove(e.developIcon)
                e.developIcon = undefined
            }

            if (e.clearIcon != undefined) {
                e.face.remove(e.clearIcon)
                e.clearIcon = undefined
            }

            if (e.districtIcon != undefined) {
                e.face.remove(e.districtIcon)
                e.districtIcon = undefined
            }
        })

        this.worldMap.forEach(tile => tile.face.remove(tile.buyLabel2D))
    }

    select(view) {
        this.displayInfo()
        if (activeSettlement != undefined && activeSettlement != this) {
            activeSettlement.deselect(true)
        }
        document.getElementById("unitactions").style.left = "-500px"
        hideReachable()

        camera.position.x = this.tile.face.position.x
        camera.position.y = this.tile.face.position.y

        activeSettlement = this
        adjustCameraRotation()
        this.calculateYields()

        switch (view) {
            case "working": this.showWorked(); break;
            case "develop": this.showDevelopEligible(); break;
            case "district": this.showDistrictEligible(); break;
            case "clear": this.showClearEligible(); break;
        }

        if (this.cultureTarget != undefined) {
            this.cultureTarget.face.add(cultureTargetIcon)
        }

        this.worldMap.forEach(tile => {
            if (this.tiles.includes(tile)
                && (view != "develop" || tile.developIcon != undefined)
                && (view != "clear" || tile.clearIcon != undefined)
                && (view != "district" || tile.districtIcon != undefined)) {
                    tile.face.material = tile.terrain.material
            } else {
                tile.face.material = tile.terrain.materialDark
            }
            if (tile.productionTileIcon != undefined) {
                tile.face.remove(tile.productionTileIcon)
                tile.productionTileIcon = undefined
            }
        })

        if (this.producingID != undefined && this.producible[this.producingID].target != undefined) {
            this.producible[this.producingID].target.productionTileIcon = productionTileIcon.clone()
            this.producible[this.producingID].target.face.add(this.producible[this.producingID].target.productionTileIcon)
        }
    }

    deselect(reselecting) {
        if (this == activeSettlement) {
            this.hideWorked()
            activeSettlement = undefined
            activeSelection = undefined
            Settlement.hideInfo()
            adjustCameraRotation()

            if (!reselecting) {
                this.tile.centerCameraOnTile()
            }

            if (cultureTargetIcon.parent != undefined) {
                cultureTargetIcon.parent.remove(cultureTargetIcon)
            }

            this.worldMap.forEach(tile => {
                if (this.player.seen.includes(tile)) {
                    tile.face.material = tile.terrain.material
                } else {
                    tile.face.material = tile.terrain.materialDark
                }
                if (tile.productionTileIcon != undefined) {
                    tile.face.remove(tile.productionTileIcon)
                    tile.productionTileIcon = undefined
                }
            })
        }
    }

    buildDistrict(tile) {
        tile.clearDevelopment()
        tile.district = new District(tile, this.player, this, this.worldMap)
        this.districts.push(tile.district)
        this.worldMap.forEach(tile => tile.calculateYields)
        Object.keys(buildings).forEach(function (building) {
            this.producible.push({ type: producibleTypes.building, building: buildings[building], name: buildings[building].name, district: tile.district, progress: 0, })
        }.bind(this))
    }

    detectSeen() {
        this.tiles.forEach(x => x.nearby(2).forEach(function (tile) {
            if (!this.player.seen.includes(tile)) {
                this.player.seen.push(tile)
            }
        }.bind(this)))
    }

    priceToBuyTile(tile) {
        return 20
    }

    updateTradeRoutes(){
        var activeRoutes = this.tradeRoutes.filter(x => x.active).map(x => x.settlement)
        this.tradeRoutes = []
        var testUnit = new Unit(unitTypes.trader, this.player, this.position, this.worldMap, true)
        players.filter(x => x.settlements != undefined).forEach(x => x.settlements.forEach(function(settlement){
            if(settlement != this){
                var path = testUnit.getPathToTile(settlement.tile)
                path.push(this.tile)
                if(path.length < 10){
                    this.tradeRoutes.push({settlement: settlement, active: activeRoutes.includes(settlement), path: path, benefits: {food: 1, production: 1, commerce: 1, culture: 1, science: 1}})
                }
            }
        }.bind(this)))
    }

    static hideInfo() {
        document.getElementById("city-info").style.right = "-500px"
        viewedSettlement = undefined

        Settlement.hideBuildingProduction()
    }

    static changeCityInfoPanel(newActivePanel) {
        activeCityInfoPanel = newActivePanel;

        Settlement.hideBuildingProduction()

        document.getElementById("city-info-header-production").setAttribute("currentPanel", "false")
        document.getElementById("city-info-header-district").setAttribute("currentPanel", "false")
        document.getElementById("city-info-header-commerce").setAttribute("currentPanel", "false")

        switch (newActivePanel) {
            case 0: document.getElementById("city-info-header-title").innerHTML = "Production";
                document.getElementById("city-info-header-production").setAttribute("currentPanel", "true"); break;
            case 1: document.getElementById("city-info-header-title").innerHTML = "Commerce";
                document.getElementById("city-info-header-commerce").setAttribute("currentPanel", "true"); break;
            case 2: document.getElementById("city-info-header-title").innerHTML = "Districts";
                document.getElementById("city-info-header-district").setAttribute("currentPanel", "true"); break;
        }

        if (viewedSettlement != undefined) {
            setTimeout(function () {
                viewedSettlement.displayInfo()
            }, 100)
        }
    }

    static unfilledTradeRouteTiles(path){
        var invalidTiles = []
        path.forEach(function(tile){
            if(!testRequirements([requirements.passable], tile)){
                invalidTiles.push(tile)
            }
        })
        return invalidTiles
    }

    static hideBuildingProduction() {
        buildingsList.style.transform = "scaleY(0)"
        buildingsList.style.maxHeight = "0"
        if (viewedSettlement != undefined) {
            viewedSettlement.districts.forEach(function (district) {
                district.elementProduction.style.maxWidth = ""
                district.element.style.maxHeight = "2.5vw"
                district.yieldTable.style.transform = "scaleY(0)"
            })
        }
    }

    static increaseTax(){
        if(viewedSettlement != undefined && viewedSettlement.taxRate <= 90){
            viewedSettlement.taxRate += 10
            viewedSettlement.calculateYields()
            viewedSettlement.displayCommerce()
        }
    }

    static decreaseTax(){
        if(viewedSettlement != undefined && viewedSettlement.taxRate >= 10){
            viewedSettlement.taxRate -= 10
            viewedSettlement.calculateYields()
            viewedSettlement.displayCommerce()
        }
    }
}
