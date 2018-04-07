

    var catched = 0;
    var coins = 100;

    var COMMON = 0;
    var ULTRA = 1;

    function Inventory(size){
        this.size = size;
        this.limit = size * size;

        this.contains = [];

        this.add = function(pokemon){
            this.contains.push(pokemon)
            console.log(this.contains);
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

    var holder = new Inventory(4);
    var shakeOn = false;

    function shake(image){
        shakeOn = true;

        var newShake = document.createElement("IMG");
        newShake.id = "shake";
        newShake.src = image;

        document.body.appendChild(newShake);

        $(document).ready(function(){
            $('#shake').animate({width:"256px",height:"256px"},1500, function() {
            $('#shake').animate({width:"64px",height:"64px"},1500, function() {
            $('#shake').animate({width:"128px",height:"128px"},1500)}) 
            });
            });
    }

    function catchMon(ball){
        if(!holder.willAllowAdd(1)){
            alert("You are full!");
            return;
        }

        var cost = 0;

        switch(ball){
            case 0: cost = 20; shake("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/poke-ball.png"); break;
            case 1: cost = 50; shake("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/great-ball.png"); break;
        }

        if(coins - cost < 0){
            alert("You don't have enough Coins!");
            return;
        }

        coins -= cost;
        updateCoins();

        var newMon = document.createElement("IMG");
        newMon.className = "pokemonSprite";
        newMon.id = "POKE" + catched;
        catched++;

        var caught = Math.ceil(801 * Math.random());
        newMon.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + caught + ".png";

        holder.add(caught);

    
        document.getElementById("pokeHolder").appendChild(newMon);


         
    }