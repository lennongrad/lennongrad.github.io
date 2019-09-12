/**
 * @typedef {{x: number, y: number}}
 */
var Position

class Yield {
    constructor(name) {
        this.name = name

        this.yieldIcons = []
        for (var i = 0; i < 5; i++) {
            this.yieldIcons.push(new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: new THREE.TextureLoader().load("yields/" + this.name.toLowerCase() + "_" + (i + 1) + ".png"),
                    transparent: true, depthTest: false
                })
            ))
            this.yieldIcons[i].scale.set(yieldScale, yieldScale, yieldScale)
        }
    }
}

class Terrain {
    constructor(name, texture, variety, yields) {
        this.name = name
        this.textureFilename = texture
        this.texture = new THREE.TextureLoader().load(texture)
        this.material = new THREE.MeshLambertMaterial({ alphaMap: hexagonAlpha, transparent: true, depthWrite: false, map: this.texture })
        this.materialDark = new THREE.MeshLambertMaterial({ alphaMap: hexagonAlpha, color: "#555", transparent: true, depthWrite: false, map: this.texture })
        this.variety = variety
        this.yields = yields
    }
}

class Development {
    constructor(name, yields) {
        this.name = name
        this.yields = yields
    }
}

class Resource {
    constructor(name, development, yields, requirements) {
        this.name = name
        this.yields = yields
        this.development = development
        this.requirements = requirements

        this.icon = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: new THREE.TextureLoader().load("resources/" + this.name.toLowerCase() + ".png"),
                transparent: true, depthTest: false
            })
        )
        this.icon.scale.set(.45, .45, .45)
        this.icon.position.y = -.45
    }
}

class Feature {
    constructor(name, filename, modelProperties) {
        this.name = name
        this.modelProperties = modelProperties

        var me = this
        loader.load(filename, function (gltf) {
            me.model = gltf.scene;
            if (modelProperties.scale != undefined) {
                me.model.scale.set(modelProperties.scale, modelProperties.scale, modelProperties.scale)
            }
            if (modelProperties.offsetX != undefined) {
                me.model.position.x = modelProperties.offsetX
            }
            if (modelProperties.offsetY != undefined) {
                me.model.position.y = modelProperties.offsetY
            }
            me.model.rotation.x = Math.PI / 2
            allModelsLoaded()
        }, function (xhr) { }, function (error) { });
    }
}

class Notification {
    constructor(name, filename, criteria, click) {
        this.name = name
        this.icon = document.createElement("DIV")
        this.iconIMG = document.createElement("IMG")
        this.iconIMG.src = filename
        this.icon.appendChild(this.iconIMG)
        this.criteria = criteria
        this.icon.onclick = click
        this.click = click
    }
}

class Action {
    constructor(name, filename, func) {
        this.name = name
        this.icon = document.createElement("DIV")
        this.iconImage = document.createElement("IMG")
        this.iconImage.setAttribute("draggable", "false");
        this.iconImage.src = "actions/" + filename
        this.icon.onclick = func
        this.icon.action = this
        this.icon.appendChild(this.iconImage)
    }
}

class UnitClass {
    constructor(name, canMoveInOcean) {
        this.name = name
        this.canMoveInOcean = canMoveInOcean
    }
}

class UnitType {
    constructor(name, unitClass, filename) {
        this.name = name
        this.unitClass = unitClass
        this.iconSRC = "unitIcons/prod_" + this.name + ".png"
        this.filename = "uniticons/" + filename
        this.texture = new THREE.TextureLoader().load(this.filename);

        this.isUnitType = true
    }
}

class Technology {
    constructor(name, filename, type, unlockList) {
        this.name = name
        this.filename = "techs/" + filename + ".png"
        this.type = type
        this.prerequisites = []
        this.unlockList = unlockList

        this.completion = 0

        this.element = document.createElement("DIV")
        this.element.className = "science-row"

        var elementName = document.createElement("DIV")
        elementName.innerHTML = this.name.toUpperCase()
        elementName.className = "science-row-name"
        this.element.appendChild(elementName)

        var elementUnlocks = document.createElement("DIV")
        elementUnlocks.className = "science-row-unlocks"
        this.unlockList.forEach(function (item) {
            var unlockElement = document.createElement("DIV")
            var unlockElementIcon = document.createElement("IMG")
            unlockElementIcon.src = item.iconSRC
            unlockElement.appendChild(unlockElementIcon)
            elementUnlocks.appendChild(unlockElement)
        })
        this.element.appendChild(elementUnlocks)

        var elementIcon = document.createElement("DIV")
        elementIcon.className = "science-row-icon"
        var elementIconImg = document.createElement("IMG")
        elementIconImg.src = this.filename
        elementIcon.appendChild(elementIconImg)
        this.element.appendChild(elementIcon)

        var elementProgress = document.createElement("DIV")
        elementProgress.className = "science-row-progress"
        this.elementBar = document.createElement("DIV")
        this.elementBar.className = "science-row-bar"
        elementProgress.appendChild(this.elementBar)
        this.element.appendChild(elementProgress)

        var elementInfo = document.createElement("DIV")
        elementInfo.className = "science-row-info"

        if (this.type != technologyTypes.none) {
            var elementType = document.createElement("DIV")
            elementType.className = "science-row-type science-row-type-" + this.type.toLowerCase()
            var elementTypeIcon = document.createElement("IMG")
            switch (this.type) {
                case technologyTypes.engineering: elementTypeIcon.src = "yields/production_5.png"; break;
                case technologyTypes.society: elementTypeIcon.src = "yields/culture_5.png"; break;
                case technologyTypes.theoretical: elementTypeIcon.src = "yields/science_5.png"; break;
            }
            elementType.appendChild(elementTypeIcon)
            var elementTypeTitle = document.createElement("SPAN")
            elementTypeTitle.innerHTML = this.type
            elementType.appendChild(elementTypeTitle)
            elementInfo.appendChild(elementType)
        }
        this.elementTurns = document.createElement("SPAN")
        this.elementTurns.className = "science-row-turns"
        this.elementTurns.innerHTML = 0
        elementInfo.appendChild(this.elementTurns)
        var elementTurnsIcon = document.createElement("IMG")
        elementTurnsIcon.className = "science-row-turns-icon"
        elementTurnsIcon.src = "clock.png"
        elementInfo.appendChild(elementTurnsIcon)
        this.element.appendChild(elementInfo)

        this.element.onclick = function(){
            activePlayer.chooseTechnology(this.getAttribute("indexInPicks"))
        }
    }

    getCost(player){
        return 20;
    }
}