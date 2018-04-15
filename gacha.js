   
    var coins = 1800;

    var RIGHT = 1;
    var LEFT = 0;

    var holder = new Inventory(8, 1, "pokeHolder", "H", LEFT);
    var box = [];
    box.push(new Inventory(3, 3, "pokeBox", "0", RIGHT));
    var fighting = [];
    fighting.push(new Inventory(1, 1, "F1", "F1", RIGHT), new Inventory(1, 1, "F2", "F2", LEFT));

    var active = 0;
    var selected = "";
    var hover = "";

    var PID = [];

    //alert("POKEH 0".substring(4).split(" "))
    function remove(id) {
        var elem = document.getElementById(id);
        return elem.parentNode.removeChild(elem);
    }

    if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem("saveCoins") != null){
            coins = localStorage.getItem("saveCoins");
        }
        if(localStorage.getItem("saveHolder") != null){
            holder.contains = localStorage.getItem("saveHolder").split(",");
        }
        if(localStorage.getItem("saveBoxes") != null){
            var saveString = localStorage.getItem("saveBoxes").split(" ");
            for(var i = 0; i < saveString.length; i++){
                box[i].contains = saveString[i].split(",");
            }
        }
        if(localStorage.getItem("saveFighting") != null){
            var saveString = localStorage.getItem("saveFighting").split(" ");
            for(var i = 0; i < saveString.length; i++){
                fighting[i].contains = saveString[i].split(",");
            }
        }
    } else {
    }
    
    var clearMem = function(){
        if (typeof(Storage) !== "undefined") {
            localStorage.removeItem("saveCoins");
            localStorage.removeItem("saveHolder");
            localStorage.removeItem("saveFighting");
            localStorage.removeItem("saveBoxes");
            window.location.reload();
        } else {
        }
    }
    
    var saveGame = function() {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("saveCoins", coins);
            localStorage.setItem("saveHolder", holder.contains)
            var setString = "";
            for(var i = 0; i < box.length; i++){
                setString += box[i].contains;
                if(i != box.length - 1){
                    setString += " ";
                }
            }
            localStorage.setItem("saveBoxes", setString);
            setString = "";
            for(var i = 0; i < fighting.length; i++){
                setString += fighting[i].contains;
                if(i != fighting.length - 1){
                    setString += " ";
                }
            }
            localStorage.setItem("saveFighting", setString);
        } else {
        }
    }

    holder.renderMon();
    for(var i = 0; i < box.length; i++){
        box[i].renderMon();
    }
    for(var i = 0; i < fighting.length; i++){
        fighting[i].renderMon();
    }

    function Pokemon(nick, id){
        this.nick = nick;
        this.id = id;
    }

    function Inventory(width, height, place, prefix, direction){
        this.width = width;
        this.height = height;
        this.limit = this.width * this.height;
        this.prefix = prefix;
        this.direction = direction;
        
        this.bouncey = 0;
        if(prefix.substring(0,1) == "F"){
            this.bouncey = 50 * prefix.substring(1,2) - 1;
        }

        this.contains = [];

        this.add = function(pokemon){
            this.contains.push(pokemon)
            console.log(this.contains);
            this.renderMon();
        }

        this.remove = function(toGo){
            this.contains.splice(toGo,1);
            this.renderMon();
        }

        this.renderMon = function(){
            document.getElementById(place).innerHTML = "";

            for(var i = 0; i < this.contains.length; i++){
                if(this.contains[i] == ""){
                    this.contains.splice(i,1);
                }
            }

            for(var i = 1; i <= this.contains.length; i++){  
                var contain = document.createElement("div");
                contain.setAttribute("data-tooltip", pD[this.contains[i -1]].name)
                contain.id = "POKE" + this.prefix + " " + i;
                contain.className = "POKEC";
                contain.style.left = 10 + ((i - 1) % (this.width)) * 64 + "px";
                contain.style.top = 10 + ((i - 1) - ((i - 1) % this.width)) / this.height * 64 + "px";

                contain.onclick = new Function("selected = " + '"' + contain.id + '"; onAClick()');
                 
                var newMon = document.createElement("IMG");
                newMon.className = "pokemonSprite";
                if(this.direction == RIGHT){
                    newMon.style.transform = "scale(-1,1)"
                }
                newMon.src = "https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular/" + pD[this.contains[i - 1]].name.toLowerCase() + ".png";

                contain.appendChild(newMon)
                //newMon.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + this.contains[i - 1] + ".png";
                document.getElementById(place).appendChild(contain);
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

    var onAClick = function(){
        var prep = remove(selected);
        document.getElementById("TEMP").appendChild(prep);
    }

    var shakeOn = false;

    var setPair = function(numb){
        if(numb % 2 == 0){
            return [numb, numb + 1]
        }
        return [numb - 1, numb];
    }

    $(document).mousedown(function(){
        if(selected != ""){
            var toMove = 0;
            
            switch(selected.substring(4).split(" ")[0].substring(0,1)){
                case "H": toMove = holder.contains[selected.substring(4).split(" ")[1] - 1]; break;
                case "F": toMove = fighting[selected.substring(5,6) - 1].contains[0]; break;
                default: toMove = box[selected.substring(4,5)].contains[selected.substring(4).split(" ")[1] - 1];
            }
            
            if(hover == "H" && holder.willAllowAdd(1)){
                holder.add(toMove);
            } else if(hover == "H" && !holder.willAllowAdd(1)){
                return;
            }

            if(hover.substring(0,1) == "F" && fighting[hover.substring(1,2) - 1].willAllowAdd(1)){
                fighting[hover.substring(1,2) - 1].add(toMove);
                fighting[setPair(selected.substring(6,7) - 1)[0]].bouncey = 00; fighting[setPair(selected.substring(6,7) - 1)[1]].bouncey = 50; 
            } else if(hover.substring(0,1) == "F"){
                return;
            }

            if(hover == "0"){
                if(box[hover].willAllowAdd(1)){
                    box[hover].add(toMove);
                } else if(!box[hover].willAllowAdd(1)){
                    return;
                }
            }

            document.getElementById("TEMP").innerHTML = "";

            switch(selected.substring(4).split(" ")[0].substring(0,1)){
                case "H": holder.remove(selected.substring(4).split(" ")[1] - 1);  holder.renderMon(); break;
                case "F": fighting[selected.substring(5,6) - 1].remove(selected.substring(4).split(" ")[1] - 1); fighting[selected.substring(4).split(" ")[1] - 1].renderMon(); break;
                default: box[selected.substring(4).split(" ")[0]].remove(selected.substring(4).split(" ")[1] - 1); box[selected.substring(4).split(" ")[0]].renderMon(); break;
            }
            selected = "";
        }

        if(false && fighting[0].contains.length > 0 && fighting[1].contains.length > 0){
            if(pD[fighting[0].contains[0]].stats[0] > pD[fighting[1].contains[0]].stats[0]){
                fighting[1].remove(0);
                alert(pD[fighting[0].contains[0]].name + " WINS!")
            } else {
                fighting[0].remove(0);
                alert(pD[fighting[1].contains[0]].name + " WINS!")
            }
        }

        saveGame();
    })

    var moveCount = 0;
    setInterval(function(){
        moveCount++;
        if(moveCount > 100){
            moveCount = 0;
            hover = "";
        }
    }, 1)

    setInterval(function(){
        for(var i = 0; i < fighting.length; i++){
            if(fighting[setPair(i)[0]].contains.length == 1 && fighting[setPair(i)[1]].contains.length == 1){
                fighting[i].bouncey++;
                if(fighting[i].bouncey > 100){
                    fighting[i].bouncey = 0;
                }
                if(fighting[i].bouncey > 90){
                    document.getElementById("POKE" + fighting[i].prefix + " 1").style.transform = "translate(0, " + (Math.cos(fighting[i].bouncey * 1.5) * 6) + "px)"
                } else if (fighting[i].bouncey > 35 && fighting[i].bouncey < 45){
                    document.getElementById("POKE" + fighting[i].prefix + " 1").style.transform = "translate(" + (Math.cos(fighting[i].bouncey * 1.5) * 3) + "px, 0)"
                } else {
                    document.getElementById("POKE" + fighting[i].prefix + " 1").style.transform = "translate(0, 0)"
                }
            }
        }
    }, 30)

    function shake(image){
        document.getElementById("POKE" + "H " + holder.contains.length).style.display = "none";

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
            document.getElementById("POKE" + "H " + (holder.contains.length)).style.display = "inline";
            document.getElementById("shakeBehind").style.display = "none";
        }
    }, 9)

    $(document).mousemove(function(event){
        moveCount = 0;
        if(selected != ""){
            document.getElementById(selected).style.position = "fixed";
            document.getElementById(selected).style.pointerEvents = "none";
            document.getElementById(selected).style.left = event.clientX - 30 + "px";
            document.getElementById(selected).style.top = event.clientY - 30 + "px";
        }
    })

    var rotated = 1;
    var active = 1;
    setInterval(function(){
        rotated += 1 * active;
        active *= .9997;
        if(active > 5){
            active = 4;
        }
        if(active < .05){
            active = .05;
        }
        document.getElementById("spinny").style.width = rotated + "px";
        if(rotated > 200){
            rotated = 1;
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
