class Yield {
    constructor(name) {
        this.name = name
        this.yieldIMG = document.createElement("IMG")
        this.yieldIMG.src = "yields/" + this.name.toLowerCase() + ".png"

        this.yieldIcons = []
        for (var i = 0; i < 5; i++) {
            this.yieldIcons.push(new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: new THREE.TextureLoader().load("yields/" + this.name.toLowerCase() + "_" + /*(i + 1)*/5 + ".png"),
                    depthTest: false
                })
            ), new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: new THREE.TextureLoader().load("yields/" + this.name.toLowerCase() + "_" + /*(i + 1)*/5 + ".png"),
                    depthTest: false, color: new THREE.Color("#555")
                })
            ))
        }
        this.yieldIcons.forEach(icon => icon.scale.set(yieldScale, yieldScale, yieldScale))
    }
}

//var testBump = new THREE.TextureLoader().load("testBump.png")

class Terrain {
    constructor(name, texture, elevationTexture, variety, yields, colour) {
        this.name = name

        this.textureFilename = "terrain2/" + texture

        this.material = []
        this.materialDark = []
        directions.forEach((direction, index) => {
            var texture = new THREE.TextureLoader().load(this.textureFilename)
            texture.rotation = index * Math.PI / 3
            texture.center = new THREE.Vector2(.5, .5)
            this.material.push(new THREE.MeshBasicMaterial({ 
                alphaMap: hexagonAlphaRotations[index],/* bumpScale: 2, bumpMap: testBump,*/ transparent: true, depthWrite: false, opacity: 1, map: texture }))
            this.materialDark.push(new THREE.MeshBasicMaterial({ 
                alphaMap: hexagonAlphaRotations[index], color: "#555", transparent: true, opacity: 1, depthWrite: false, map: texture }))
        })

        if(variety == terrainVariety.land){
            this.elevationTextureFilename = "terrain2/" + elevationTexture + "-strip.png"
            this.elevationTexture = new THREE.TextureLoader().load(this.elevationTextureFilename)
            this.elevationMaterial = new THREE.MeshBasicMaterial({ map: this.elevationTexture, side: THREE.DoubleSide, alphaMap: stripAlpha, transparent: true, color: "#fff", opacity: 1 })
            this.elevationMesh = new THREE.Mesh(
                new THREE.ShapeBufferGeometry(elevationShape, { }),
                this.elevationMaterial
            )
            this.elevationMeshVertical = new THREE.Mesh(
                new THREE.ShapeBufferGeometry(elevationShapeVertical, { }),
                this.elevationMaterial
            )
        }

        this.variety = variety
        this.yields = yields
        this.colour = colour
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
                map: new THREE.TextureLoader().load("resources/" + this.name.toLowerCase() + ".png"), depthTest: false
            })
        )
        this.icon.scale.set(.45, .45, .45)
        this.icon.position.y = -.45
        this.icon.position.z = .03
    }
}

class Feature {
    constructor(name, filename, modelProperties) {
        this.name = name
        this.modelProperties = modelProperties
        
        loader.load(filename, function (gltf) {
            this.model = gltf.scene;
            if (modelProperties.scale != undefined) {
                this.model.scale.set(modelProperties.scale, modelProperties.scale, modelProperties.scale)
            }
            if (modelProperties.offsetX != undefined) {
                this.model.position.x = modelProperties.offsetX
            }
            if (modelProperties.offsetY != undefined) {
                this.model.position.y = modelProperties.offsetY
            }
            this.model.rotation.x = Math.PI / 2
            allModelsLoaded()
        }.bind(this), function (xhr) { }, function (error) { });
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
    constructor(name, movement, canMoveInOcean) {
        this.name = name
        this.movement = movement
        this.canMoveInOcean = canMoveInOcean
    }
}

class UnitType {
    constructor(name, unitClass, filename, strength, constitution) {
        this.name = name
        this.unitClass = unitClass
        this.iconSRC = "unitIcons/prod_" + this.name + ".png"
        this.filename = "uniticons/" + filename
        this.texture = new THREE.TextureLoader().load(this.filename)
        this.isUnitType = true
        this.strength = strength
        this.constitution = constitution
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
                case technologyTypes.engineering: elementTypeIcon.src = "yields/production.png"; break;
                case technologyTypes.society: elementTypeIcon.src = "yields/culture.png"; break;
                case technologyTypes.theoretical: elementTypeIcon.src = "yields/science.png"; break;
            }
            elementType.appendChild(elementTypeIcon)
            var elementTypeTitle = document.createElement("SPAN")
            elementTypeTitle.innerHTML = this.type
            elementType.appendChild(elementTypeTitle)
            elementInfo.appendChild(elementType)
        }
        this.element.appendChild(elementInfo)

        var elementTurnsInfo = document.createElement("DIV")
        elementTurnsInfo.className = "science-row-info-turns"
        this.elementTurns = document.createElement("SPAN")
        this.elementTurns.className = "science-row-turns"
        this.elementTurns.innerHTML = 0
        elementTurnsInfo.appendChild(this.elementTurns)
        var elementTurnsIcon = document.createElement("IMG")
        elementTurnsIcon.className = "science-row-turns-icon"
        elementTurnsIcon.src = "clock.png"
        elementTurnsInfo.appendChild(elementTurnsIcon)
        this.element.appendChild(elementTurnsInfo)

        this.element.onclick = function(){
            activePlayer.chooseTechnology(this.getAttribute("indexInPicks"))
        }
    }

    getCost(player){
        return 20;
    }
}

class Building{
    constructor(name, icon, requirements, bldgYields, description, modifiers){
        this.name = name
        this.icon = "buildings/" + icon + ".png"
        this.requirements = requirements
        this.yields = addYields({food: 0, production: 0, commerce: 0, culture: 0, science: 0, capital: 0}, bldgYields)
        this.description = htmlToElement("<div>" + description + "</div>")
        this.modifiers = modifiers
        this.isBuildingType = true

        Object.keys(this.yields).forEach(function(y){
            if(this.yields[y] > 0){
                this.description.prepend(yields[y].yieldIMG.cloneNode())
                this.description.prepend(htmlToElement("+" + this.yields[y] + " "))
            }
        }.bind(this))
    }

    getModifier(modifier){
        if(this.modifiers.some(x => x.type == modifier)){
            return this.modifiers.filter(x => x.type == modifier)[0]
        } else {
            return false
        }
    }
}

class Troop{
    constructor(type, unit){
        this.type = type
        this.constitution = type.constitution
        this.unit = unit
    }

    takeDamage(damage){
        this.constitution -= damage
        this.unit.updateInfo()
        if(this.constitution <= 0){
            this.die()
        }
    }

    die(){
        this.unit.troops.splice(this.unit.troops.indexOf(this), 1)
        this.unit.die()
    }

    get strength(){
        return this.type.strength
    }
}