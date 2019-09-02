
class Yield{
    constructor(name){
        this.name = name
        
        this.yieldIcons = []
        for(var i = 0; i < 5; i++){
            this.yieldIcons.push( new THREE.Sprite( 
                new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("yields/" + this.name.toLowerCase() + "_" + (i + 1) + ".png"), 
                                             transparent: true, depthTest: false}) 
            )) 
            this.yieldIcons[i].scale.set(yieldScale, yieldScale, yieldScale)
        }
    }
}

class Terrain{
    constructor(name, texture, variety, yields){
        this.name = name
        this.textureFilename = texture
        this.texture = new THREE.TextureLoader().load(texture)
        this.material = new THREE.MeshLambertMaterial( { alphaMap: hexagonAlpha, transparent: true, depthWrite: false, map: this.texture } )
        this.materialDark = new THREE.MeshLambertMaterial( { alphaMap: hexagonAlpha, color: "#555", transparent: true, depthWrite: false, map: this.texture } )
        this.variety = variety
        this.yields = yields
    }
}

class Development{
    constructor(name, yields){
        this.name = name
        this.yields = yields
    }
}

class Resource{
    constructor(name, development, yields, requirements){
        this.name = name
        this.yields = yields
        this.development = development
        this.requirements = requirements

        this.icon = new THREE.Sprite( 
            new THREE.SpriteMaterial({map: new THREE.TextureLoader().load("resources/" + this.name.toLowerCase() + ".png"), 
                                      transparent: true, depthTest: false}) 
        )
        this.icon.scale.set(.45,.45,.45)
        this.icon.position.y = -.45
    }
}

class Feature{
    constructor(name, filename, modelProperties){
        this.name = name
        this.modelProperties = modelProperties

        var me = this
        loader.load(filename, function ( gltf ) { 
            me.model = gltf.scene; 
            if(modelProperties.scale != undefined){
                me.model.scale.set(modelProperties.scale, modelProperties.scale, modelProperties.scale)
            }
            if(modelProperties.offsetX != undefined){
                me.model.position.x = modelProperties.offsetX
            }
            if(modelProperties.offsetY != undefined){
                me.model.position.y = modelProperties.offsetY
            }
            me.model.rotation.x = Math.PI / 2
            allModelsLoaded()
        }, function ( xhr ) {}, function ( error ) {});
    }
}

class Notification{
    constructor(name, filename, criteria, click){
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

class Action{
    constructor(name, filename, func){
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

class UnitClass{
    constructor(name, canMoveInOcean, actionsUnit){
        this.name = name
        this.actions = actionsUnit
        this.canMoveInOcean = canMoveInOcean

        this.actions.push(actions.wait)
        this.actions.push(actions.move)
        this.actions.push(actions.wakeUp)
        this.actions.push(actions.sleep)
    }
}

class UnitType{
    constructor(name, unitClass, filename){
        this.name = name
        this.unitClass = unitClass
        this.texture = new THREE.TextureLoader().load( 'uniticons/' + filename );
    }
}