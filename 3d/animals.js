class Animals extends Player{
    ai(){
        this.units.forEach(function(unit){
            var defenderTile = unit.determineReachable().filter(x => x.tile.differentPlayerOnTile(this))[0]
            if(defenderTile != undefined){
                unit.moveToAttack(defenderTile.tile)
                Unit.resolveCombat(unit, defenderTile.tile.units)
            } else {
                var unitMovement = copyAndRandomize(unit.determineReachable())
                for(var i = 5; i > 1; i--){
                    unitMovement = unitMovement.filter(x => nearby(x.tile, i).some(y => y.differentPlayerOnTile(this))).concat(unitMovement)
                }
    
                for(var i = 0; i < unitMovement.length; i++){
                    if(!unitMovement[i].tile.differentPlayerOnTile(this)
                      && !(unitMovement[i].tile == unit.tile)){
                        unit.move(unitMovement[i].tile.position, unitMovement[i].distance)
                        break
                    }
                }
            }
        }.bind(this))

        if(Math.random() < .7){
            for(var i = 0, created = 0; i < 150 && created < 3 && this.units.length < 25; i++){
                var targetTile = randomTile()
                if(!targetTile.differentPlayerOnTile(this)
                && targetTile.terrain.variety == terrainVariety.land){
                    this.units.push(new Unit(unitTypes.warrior, this, targetTile.position))
                    created++
                }
            }
        }

        this.endTurn()
    }
}