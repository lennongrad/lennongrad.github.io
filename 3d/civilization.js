class Civilization extends Player {
    constructor() {
        super()

        this.settlements = []
        this.borderColor = new THREE.Color(adjustBrightness(this.color, 5))
        this.borderGradientMaterial = new THREE.MeshLambertMaterial({ color: this.borderColor, transparent: true, alphaMap: borderGradientMap })
        this.yields = {}

        this.technologyPicks = []
        this.technologyChosen = undefined
        this.technologyCompleted = []
        this.unlockedBuildings = [buildings.granary]
        this.unlockedUnits = [unitTypes.settler, unitTypes.warrior, unitTypes.horseman, unitTypes.chariot, unitTypes.slinger, unitTypes.catapult]

        this.accumulatedCulture = 0
        this.accumulatedCapital = 0
        this.heldScience = 0
        this.randomizeTechnology()

        this.overlayMaterial = new THREE.MeshBasicMaterial({
            color: this.color,
            alphaMap: hexagonAlpha, transparent: true, opacity: ownerOverlayOpacity, depthWrite: false
        })
    }

    beginTurn() {
        super.beginTurn()

        this.settlements.forEach(x => x.beginTurn())
        this.calculateYields()

        if (this.technologyPicks.length >= 1 && this.technologyChosen == undefined) {
            this.chooseTechnology(0)
        }

        this.accumulatedCapital += this.yields.capital
        this.accumulatedCulture += this.yields.culture
        this.incrementScience(this.yields.science)

        if (this == players[0]) {
            this.updateTopbar()
            if (this.notificationsRemaining.length >= 1) {
                this.notificationsRemaining[0].click()
            }
        }
    }

    endTurn() {
        super.endTurn()
        if (activeSettlement != undefined) {
            activeSettlement.deselect()
        }
        Settlement.hideInfo()
    }

    incrementScience(value) {
        if (this.technologyChosen != undefined) {
            if (this.heldScience > 0) {
                value += this.heldScience
                this.heldScience = 0
            }

            if (this.technologyChosen.completion + value > this.technologyChosen.getCost(this)) {
                this.unlockTechnology(this.technologyChosen)
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

    unlockTechnology(technology){
        this.technologyCompleted.push(technology)
        technology.unlockList.forEach(function(unlock){
            if(unlock.isUnitType){
                this.unlockedUnits.push(unlock)
            }
            if(unlock.isBuildingType){
                this.unlockedBuildings.push(unlock)
            }
        }.bind(this))
    }

    randomizeTechnology() {
        var possiblePicks = []
        Object.keys(technologies).forEach(function (tech) {
            if (!this.technologyCompleted.includes(technologies[tech])) {
                var canInclude = true
                technologies[tech].prerequisites.forEach(function (pre) {
                    if (!this.technologyCompleted.includes(pre)) {
                        canInclude = false
                    }
                }.bind(this))
                if (canInclude) {
                    possiblePicks.push(technologies[tech])
                }
            }
        }.bind(this))

        this.technologyPicks = []
        if (possiblePicks.length >= 3) {
            while (this.technologyPicks.length < 3) {
                var randomVal = randomValue(possiblePicks)
                if (!this.technologyPicks.includes(randomVal)) {
                    this.technologyPicks.push(randomVal)
                }
            }
        } else {
            this.technologyPicks = possiblePicks
        }
    }

    chooseTechnology(index) {
        if (index != undefined) {
            this.technologyChosen = this.technologyPicks[index]
        }
        if (this == players[0]) {
            document.getElementById("science-holder").innerHTML = ""
            this.technologyPicks.forEach(function (tech, index) {
                document.getElementById("science-holder").appendChild(tech.element)
                tech.element.setAttribute("indexInPicks", index)
            })
            if (index != undefined) {
                document.getElementById("science-holder").prepend(this.technologyChosen.element)
            }
        }
    }

    detectSeen() {
        this.seen = []
        this.units.forEach(function (unit) {
            unit.detectSeen()
        }.bind(this))

        this.settlements.forEach(function (settlement) {
            settlement.detectSeen()
        }.bind(this))

        if (this == players[0]) {
            tiles.forEach(x => x.forEach(function (tile) {
                if (this.seen.includes(tile)) {
                    tile.displayAsSeen()
                } else {
                    tile.displayAsNotSeen()
                }
            }.bind(this)))
        }
    }

    calculateYields() {
        this.yields = { culture: 0, capital: 0, commerce: 0, science: 0, food: 0, production: 0 }
        this.settlements.forEach(function (x) {
            x.calculateYields(); this.yields = addYields(this.yields, x.yields)
        }.bind(this))

        if (this == players[0]) {
            document.getElementById("topbar-capital-perturn").innerHTML = "+" + this.yields.capital
            document.getElementById("topbar-science-perturn").innerHTML = "+" + this.yields.science
            document.getElementById("topbar-culture-perturn").innerHTML = "+" + this.yields.culture
        }
    }

    updateTopbar() {
        document.getElementById("topbar-capital-count").innerHTML = this.accumulatedCapital
        document.getElementById("topbar-culture-count").innerHTML = this.accumulatedCulture
    }
}