class Player{
    constructor(map){
        this.worldMap = map
        this.units = [] 
        this.color = "#" + decimalToHexString(Math.ceil(16777215 * Math.random())) 
        this.seen = []
    }

    get threeColor(){
        return new THREE.Color(this.color)
    }
    
    updateNotifications(){
        this.notificationsRemaining = []
        document.getElementById("notifications").innerHTML = ""
        notifications.forEach(function(notification){
            if(notification.criteria(this)){
                this.notificationsRemaining.push(notification)
                if(this == players[0]){
                    if(this.notificationsRemaining.length == 1){
                        document.getElementById("nextturn-cover").src = notification.iconIMG.src
                    } else {
                        document.getElementById("notifications").appendChild(notification.icon)
                    }
                }
            }
        }.bind(this))

        if(this == players[0]){
            if(this.notificationsRemaining.length == 0){
                document.getElementById("nextturn-cover").src = "nextturn-back.png"
            } else {
                document.getElementById("nextturn").style.backgroundImage = ""
            }

            if(this.notificationsRemaining.length <= 1){
                document.getElementById("notifications").style.right = "-500px"
            } else {
                document.getElementById("notifications").style.right = ""
            }
        }
    }

    beginTurn(){
        this.updateNotifications()
        if(this != players[0]){
            this.ai()
        }
        this.units.forEach(x => x.tile.unitIconHolderDIV.appendChild(x.iconDIV))
    }

    ai(){
        // temporary to model delayed response of long ai function
        setTimeout(() => { this.endTurn() }, 500);
    }

    endTurn(){
        this.units.forEach(x => x.resetTurn())

        selectedUnits = []
        document.getElementById("unitactions").style.left = "-500px"
        hideReachable()

        if(this == players[0]){
            document.getElementById("nextturn").style.backgroundImage = ""
            document.getElementById("nextturn-cover").style.display = ""
            document.getElementById("nextturn-cover").src = "waitingarrow.png"
        }
        activePlayer = players[(players.indexOf(activePlayer) + 1) % players.length]
        activePlayer.beginTurn()
    }

    detectSeen(){
        this.seen = []
        this.units.forEach(function(unit){
            unit.detectSeen()
        }.bind(this))
    }
}