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