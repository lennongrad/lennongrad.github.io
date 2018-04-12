   
    var coins = 18;
    var holder = new Inventory(4);

    if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem("save") != null){
            var saveString = localStorage.getItem("save").split(" ");
            coins = saveString[0];
            holder.contains = saveString[1].split(",");
        }
    } else {
    }
    
    var clearMem = function(){
        if (typeof(Storage) !== "undefined") {
            localStorage.removeItem("save");
            window.location.reload();
        } else {
        }
    }
    
    var saveGame = function() {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("save", coins + " " + holder.contains);
        } else {
        }
    }

    holder.renderMon();

    function Inventory(size){
        this.size = size;
        this.limit = size * size;

        this.contains = [];

        this.add = function(pokemon){
            this.contains.push(pokemon)
            console.log(this.contains);
        }

        this.renderMon = function(){
            document.getElementById("pokeHolder").innerHTML = "";

            for(var i = 1; i <= this.contains.length; i++){       
                var newMon = document.createElement("IMG");
                newMon.className = "pokemonSprite";
                newMon.id = "POKE" + i;
                newMon.src = "https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular/" + pD[this.contains[i - 1]].name.toLowerCase() + ".png";
                //newMon.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + this.contains[i - 1] + ".png";
                document.getElementById("pokeHolder").appendChild(newMon);
            }
        }

        this.willAllowAdd = function(toAdd){
            if(this.limit < this.contains.length + toAdd){
                return false;
            }
            return true
        }
    }

    function updateCoins(){
        document.getElementById("coinsCount").innerHTML = coins;
    }
    updateCoins();


    var shakeOn = false;

    function shake(image){
        document.getElementById("POKE" + holder.contains.length).style.display = "none";

        shakeOn = true;
        scale = 20;
        var leftBall = ($(document).width() * Math.random() * .6 + 200);
        var topBall = ($(document).height() * Math.random() * .6 + 200);

        document.getElementById("shake").src = image;
        document.getElementById("shakeBehind").src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + holder.contains[holder.contains.length - 1] + ".png";

        $('#shake').css('transform', 'scale(' + (.5 + Math.abs(.5 - (scale / 100))) + ')')
        document.getElementById("shake").style.display = "block";

        document.getElementById("shake").style.left = leftBall + "px";
        document.getElementById("shake").style.top = topBall + "px";
        
        document.getElementById("shakeBehind").style.left = (leftBall + 16) + "px";
        document.getElementById("shakeBehind").style.top = (topBall + 16) + "px";
        document.getElementById("shakeBehind").style.display = "block";
} 

    var scale = 1;
    setInterval(function(){
        if(!shakeOn){
            return
        }
        scale = scale + 1;
        $('#shake').css('transform', 'scale(' + (.15 + Math.abs(.5 - (scale / 100))) + ')')
        document.getElementById("shake").style.opacity = 2 - (scale / 100);

        $('#shakeBehind').css('transform', 'scale(' + (.15 + Math.abs(.5 - (scale / 100))) + ')')
        document.getElementById("shakeBehind").style.opacity = 3 - (scale / 100);

        if(scale > 300){
            document.getElementById("shake").style.display = "none";
            shakeOn = false;
            document.getElementById("POKE" + (holder.contains.length)).style.display = "inline";
            document.getElementById("shakeBehind").style.display = "none";
        }
    }, 9)

    var rotated = Math.PI / 2 * 3;
    var active = 1;
    setInterval(function(){
        rotated += (Math.PI / 256) * Math.sqrt(holder.contains.length + 1) * active;
        active *= .9997;
        if(active > 5){
            active = 4;
        }
        document.getElementById("spinny").style.background = "radial-gradient(circle at " + ((Math.cos(rotated) * 70) + 50) + "px " + (50 + (Math.sin(rotated) * 70)) + "px, white 5%, blue 20%, white 25%)";
        if(rotated / Math.PI > 1.5){
            rotated = -Math.PI / 2;
            coins -= -2;
            updateCoins();
        }
    })

    var focus = "";
    var changeFocus = function(){
        focus = document.getElementById("selType").value;

        var newBack = "";

        switch(focus){
            case "Grass": newBack = "https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"; break;
            case "Poison": newBack = "https://res.cloudinary.com/twenty20/private_images/t_low-fit/v1498469853/photosp/4bd7bbb1-fbf1-435c-9cfa-0f0f4d74a18c/4bd7bbb1-fbf1-435c-9cfa-0f0f4d74a18c.jpg"; break;
            default: newBack = "";
        }
        document.body.style.backgroundImage = "url(frontGrad.png), url(" + newBack + ")";
    }

    function catchMon(ball){
        if(shakeOn){
            return;
        }

        if(!holder.willAllowAdd(1)){
            alert("You are full!");
            return;
        }

        var cost = 0;
        var focusStrength = 0;
        var ballImage = "";

        switch(ball){
            case 0: cost = 20; focusStrength = .92; ballImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/poke-ball.png"; break;
            case 1: cost = 50; focusStrength = .98; ballImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/great-ball.png"; break;
        }

        if(coins - cost < 0){
            alert("You don't have enough Coins!");
            return;
        }

        coins -= cost;
        updateCoins();

        var caught = Math.ceil((pD.length - 1) * Math.random());
        
        while(pD[caught].evolution != 0 || (!pD[caught].hasType(focus)  && (Math.random() < focusStrength))){
            caught = Math.ceil((pD.length - 1) * Math.random());
        }

        holder.add(caught);    
        holder.renderMon();

        saveGame();
        shake(ballImage);
    }
