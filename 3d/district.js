class District {
    constructor(tile, player, settlement, map) {
        this.tile = tile
        this.player = player
        this.name = "District"
        this.settlement = settlement
        this._buildings = []
        this._yields = []
        this.name = "District"
        this.worldMap = map

        this.model = districtModel.clone()
        this.model.scale.set(.0025, .0025, .0025)
        this.model.rotation.y = Math.random() * Math.PI * 2
        this.tile.face.add(this.model)

        this.tile.district = this
        this.tile.addRoad()
        this.tile.clearAllFeatures()
        this.tile.clearResource()

        this.element = document.createElement("DIV")
        this.element.style.maxHeight = "2.5vw"
        this.element.className = "city-district-item"
        this.elementProduction = document.createElement("DIV")
        this.elementProduction.className = "city-district-item-production"
        this.elementProduction.district = this
        this.elementProductionIMG = document.createElement("IMG")
        this.elementProductionIMG.src = "cityinfo_production.png"
        this.elementProduction.appendChild(this.elementProductionIMG)
        this.element.appendChild(this.elementProduction)
        this.elementName = document.createElement("DIV")
        this.elementName.className = "city-district-item-name"
        this.element.appendChild(this.elementName)
        this.yieldTable = document.createElement("TABLE")
        this.element.appendChild(this.elementProduction)
        this.elementNameBox = document.createElement("DIV")
        this.elementNameBox.innerHTML = this.name
        this.elementNameBox.className = "city-district-item-name-box"
        this.elementName.appendChild(this.elementNameBox)
        this.element.appendChild(this.yieldTable)

        this.elementProduction.onclick = function () {
            if (this.style.maxWidth == "") {
                Settlement.hideBuildingProduction()
                this.style.maxWidth = "calc(100% - 9px)"

                setTimeout(function () {
                    insertAfter(buildingsList, this.parentNode)
                    for(var i = 0; i < buildingsList.children.length; i++){
                        if(buildingsList.children[i].district == this.district){
                            buildingsList.children[i].style.display = ""
                        } else {
                            buildingsList.children[i].style.display = "none"
                        }
                    }
                    buildingsList.style.transform = ""
                    buildingsList.style.maxHeight = "1000px"
                }.bind(this), 100)
            } else {
                Settlement.hideBuildingProduction()
            }
        }

        var element = this.element
        var yieldTable = this.yieldTable
        this.elementName.onclick = function(){
            if(element.style.maxHeight == "2.5vw"){
                Settlement.hideBuildingProduction()
                element.style.maxHeight = ""
                yieldTable.style.transform = ""
            } else {
                Settlement.hideBuildingProduction()
            }
        }

        this.districtLabel = document.createElement("DIV")
        this.districtLabel.innerHTML = this.name
        this.districtLabel.className = "district-label"
        this.districtLabel.style.backgroundColor = this.player.color
        this.tile.unitIconHolderDIV.prepend(this.districtLabel)
        this.worldMap.updateUnitIconHolders()

        this.districtLabel.district = this
        this.districtLabel.onclick = function(){
            this.district.settlement.displayInfo()
            Settlement.changeCityInfoPanel(2)
            this.district.elementName.onclick()
        }
    }

    addBuilding(building){
        this._buildings.push({type: building})
    }

    hasBuilding(building){
        return this._buildings.some(x => x.type == building)
    }

    buildingIsActive(building){
        return this.hasBuilding(building)
    }

    calculateYields(){
        this._yields = { food: 0, production: 0, capital: 0, commerce: 0, culture: 0, science: 0 }
        this.yieldTable.innerHTML = ""

        var iconsRow = document.createElement("TR")
        var yieldsTD = document.createElement("TD")
        yieldsTD.innerHTML = "Yields"
        iconsRow.appendChild(yieldsTD)
        Object.keys(yields).forEach(function(yieldName){
            var td = document.createElement("TD")
            td.appendChild(yields[yieldName].yieldIMG.cloneNode())
            iconsRow.appendChild(td)
        }.bind(this))
        this.yieldTable.appendChild(iconsRow)

        this._buildings.forEach(function(building){
            Object.keys(buildingModifiers).forEach(function(modifier){
                if(building.type.getModifier(buildingModifiers[modifier])){
                    buildingModifiers[modifier].processModifier(this, building, building.type.getModifier(buildingModifiers[modifier]))
                }
            }.bind(this))
            this.addYield(building.type.yields)

            var tr = document.createElement("TR")
            var buildingNameTD = document.createElement("TD")
            buildingNameTD.innerHTML = building.type.name
            tr.appendChild(buildingNameTD)
            Object.keys(yields).forEach(function(yieldName){
                var td = document.createElement("TD")
                td.innerHTML = building.type.yields[yieldName]
                tr.appendChild(td)
            }.bind(this))
            this.yieldTable.appendChild(tr)
        }.bind(this))

        var totalsRow = document.createElement("TR")
        var totalsTD = document.createElement("TD")
        totalsTD.innerHTML = "Total"
        totalsRow.appendChild(totalsTD)
        Object.keys(yields).forEach(function(yieldName){
            var td = document.createElement("TD")
            td.innerHTML = this._yields[yieldName]
            totalsRow.appendChild(td)
        }.bind(this))
        this.yieldTable.appendChild(totalsRow)

        return this._yields
    }

    addYield(addition){
        this._yields = addYields(this._yields, addition)
    }
}