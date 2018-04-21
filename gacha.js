    var coins = 500;

    var RIGHT = 1;
    var LEFT = 0;

    var version = "B";
    
    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    if(window.mobilecheck()){
        document.getElementById("foreground").style.display = 'flex';
    }

    $(window).resize(function(){
        fixItems();
    })

    var fixItems = function(){
        for(var i = 0; i < $(".item").length; i++){
            document.getElementById("item" + i).style.height = document.getElementById("item" + i).offsetWidth + "px";
        }
    }
    fixItems();

    var toBool = function(take){
        switch(take){
            case "false": return false;
            case "0": return false;
            case 0: return false;
            case false: return false;
        }
        return true;
    }

    var currentField = 0;
    var newField = function(catchable){
        currentField++;
        var newF = document.createElement("DIV");
        newF.className = "pInv battle " + catchable[0].toLowerCase();
        newF.id = "battle" + currentField;
        newF.style.display = "none";

        levelBase = 1;
        for(var i = (currentField * 3) - 2; i < 1 + (currentField * 3); i++){
            var wrapper = document.createElement("DIV");
            wrapper.className = "wrapper";
            wrapper.innerHTML = Handlebars.compile(document.getElementById("wrap").innerHTML)({ 1: toPlace((i * 2) - 1,2), 2: toPlace(i * 2,2), 3: i, 4: catchable[0]});
            wrapper.id = "wrap" + i;
            wrapper.style.display = "none";
            newF.appendChild(wrapper);
            fighting.push(new Inventory(1, 1, "F" + toPlace(((i * 2) - 1),2), "F" + toPlace(((i * 2) - 1),2), RIGHT, levelBase + (i * 2), catchable), 
            new Inventory(1, 1, "F" + toPlace(i * 2,2), "F" + toPlace(i * 2,2), LEFT, levelBase + (i * 2), catchable))
        }
        document.getElementById("main").appendChild(newF);
    }

    var toPlace = function(conv, place){
        var final = String(conv);
        while(final.length < place){
            final = "0" + final;
        }
        return final;
    }

    var holder = new Inventory(10, 1, "pokeHolder", "H", LEFT, 1, []);
    var box = [];
    box.push(new Inventory(3, 3, "pokeBox", "0", RIGHT, 1, []));
    var fighting = [];
    newField(["Grass", "Bug"]);
    newField(["Normal", "Psychic"]);
    newField(["Water", "Dragon"]);
    newField(["Rock", "Ghost"]);

    unlockedField = 0;
    var unlockField = function(){
        document.getElementById("buyField").innerHTML = "Buy a new field: " + curCost;
        unlockedField++;
        document.getElementById("battle" + Math.ceil((unlockedField) / 3)).style.display = "inline-block";
        document.getElementById("wrap" + unlockedField).style.display = "inline-block";
    }
    var curCost = 15;
    unlockField();

    var buyField = function(){
        if(unlockedField > 1 + fighting.length / 2){
            return;
        }
        console.log(coins);
        if(coins >= curCost){
            coins -= curCost;
            curCost = Math.floor(curCost * 1.5);
            unlockField();
        }
        updateCoins();
    }

    var active = 0;
    var selected = "";
    var lastSelected = "";
    var hover = "";
    var isMoving = false;

    var statNames = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"]

    var PID = [];

    //alert("POKEH 0".substring(4).split(" "))
    function remove(id) {
        var elem = document.getElementById(id);
        return elem.parentNode.removeChild(elem);
    }

    var pokemonFromString = function(inputs){
        var tempArray = inputs.split(",");
        var outArray = [];
        for(var i = 0; i < tempArray.length; i++){
            var holdDat = tempArray[i].split(";");
            outArray.push(new Pokemon(holdDat[0],holdDat[1],toBool(holdDat[2]),holdDat[3]))
        }
        return outArray;
    };

    var fixName = function(name, lower){
        var newName;
        switch(name){
            case "Nidoran♀": newName = "Nidoran-m"; break;
            case "Nidoran♂": newName = "Nidoran-f"; break;
            case "Mr. Mime": newName = "Nidoran-f"; break;
            case "Farfetch'd": newName = "Farfetchd"; break;
            default: newName =  name;
        }
        if(lower){
            return newName.toLowerCase();
        }
        return newName;
    }

    var blankPokemon = pokemonFromString("")[0];

    function Pokemon(nick, id, shinys, level){
        if(nick != ""){
            this.nick = nick;
        } else if(id != undefined){
            this.nick = pD[id].name;
        }
        this.id = id;
        this.level = level;
        this.exp = 0;
        this.find = "";

        this.shiny = shinys;
        
        if(id != undefined){
            this.stats = pD[id].stats.map(x => x * 1);
            this.hp = this.stats[0];
        } 

        this.deadness = 1;

        this.dead = function(){
            if(this.hp <= 0 && this.deadness > 0){
                this.deadness -= .01;
            } else if(this.hp > 0 && this.deadness < 1) {
                this.deadness += .01;
            }
            return 1 - this.deadness;
        }

        this.attack = function(opponent){
            var modifier = 1;
            modifier *= 1; //targets
            modifier *= 1; //weather
            modifier *= 1; //badge
            modifier *= 1.15 - (.3 * Math.random()); //random
            var crit = (.9 < Math.random());
            modifier *= 1 + (1.5 * crit); //critical
            modifier *= 1; //STAB
            modifier *= 1; //type
            modifier *= 1; //status
            modifier *= 1; //other
            var power = 20 + (1 - pD[this.id].rarity) * 100;

            var use = 1;
            if(this.stats[1] > this.stats[3]){
                use = 3;
            }

            var damage = (2 + (((this.level * 2 / 5) + 2) * power * (this.stats[use] / opponent.stats[use + 1])) / 50) * modifier;
            return [damage, crit, use == 3];
        }

        this.defend = function(damage){
            this.hp -= damage;
            if(this.hp < 0 || damage < 0){
                this.hp = 0;
            }
            return damage;
        }

        this.levelUp = function(added){
            this.exp += added;
            if(this.exp >= Math.min(10, Math.floor(1 + 2 * Math.log(this.level)))){
                this.level++;
                this.hp += Math.max(0, ((this.stats[0] - this.hp) * .8))
                for(var i = 0; i < this.stats.length; i++){
                    this.stats[i] += 10;
                }
                this.exp = 0;
            }
        }

        this.toString = function(){
            return this.nick + ";" + this.id + ";" + this.shiny + ";" + this.level;
        }
    }

    if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem("version") != version){
            localStorage.clear();
            localStorage.setItem("version", version);
            window.location.reload();
        }
        if(!isNaN(localStorage.getItem("saveUnlocks") - 1)){
            for(var i = 0; i < localStorage.getItem("saveUnlocks") - 1; i++){
                unlockField();
            }
        }
        if(localStorage.getItem("saveCost") != null){
            curCost = localStorage.getItem("saveCost") - 0;
            document.getElementById("buyField").innerHTML = "Buy a new field: " + curCost;
        }
        if(localStorage.getItem("saveCoins") != null){
            coins = localStorage.getItem("saveCoins");
        }
        if(localStorage.getItem("saveHolder") != null){
            holder.contains = pokemonFromString(localStorage.getItem("saveHolder"));
        }
        if(localStorage.getItem("saveBoxes") != null){
            var saveString = localStorage.getItem("saveBoxes").split(" ");
            for(var i = 0; i < saveString.length; i++){
                box[i].contains = pokemonFromString(saveString[i]);
            }
        }
        if(localStorage.getItem("saveFighting") != null){
            var saveString = localStorage.getItem("saveFighting").split(" ");
            for(var i = 0; i < saveString.length; i++){
                fighting[i].contains = pokemonFromString(saveString[i]);
            }
        }
    } else {
    }
    
    var saveGame = function() {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("saveCoins", coins);
            localStorage.setItem("saveCost", curCost);
            localStorage.setItem("saveUnlocks", unlockedField);
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

    var renderAll = function(){
        
        document.getElementById("TEMP").innerHTML = "";
        if(true || !shakeOn){
            holder.renderMon();
        }
        for(var i = 0; i < box.length; i++){
            box[i].renderMon();
        }
        for(var i = 0; i < fighting.length; i++){
            fighting[i].renderMon();
        }

        if(lastSelected != "" && returnFromSelect(lastSelected) != undefined){
            document.getElementById("nickShow").innerHTML = returnFromSelect(lastSelected).nick;
            document.getElementById("statsShow").innerHTML = "HP: " + returnFromSelect(lastSelected).stats.reduce((z,y,f) => String(z) + "<br>" + statNames[f] + ": " + String(y));
        }
    }

    var returnFromSelect = function(select){            
        switch(select.substring(4).split(" ")[0].substring(0,1)){
            case "H": return holder.contains[select.substring(4).split(" ")[1] - 1]; break;
            case "F": return fighting[select.substring(5,7) - 1].contains[0]; break;
            default : return box[select.substring(4,5)].contains[select.substring(4).split(" ")[1] - 1];
        }
    }

    renderAll();

    function Inventory(width, height, place, prefix, direction, levelBase, catchable){
        this.width = width;
        this.height = height;
        this.limit = this.width * this.height;
        this.prefix = prefix;
        this.direction = direction;
        this.place = place;

        this.levelBase = levelBase;
        this.catchable = catchable;

        if(catchable == undefined){
            this.catchable = ["",""]
        }

        this.allowHover = true;

        this.dmg = 0;
        this.dmgFly = 100;
        this.colour = "white";
        
        this.bouncey = 0;
        if(prefix.substring(0,1) == "F"){
            this.bouncey = 50 * ((prefix.substring(1) - 1) % 2);
        }

        this.contains = [];

        this.add = function(pokemon){
            this.contains.push(pokemon)
            //console.log(this.contains);
            this.renderMon();
        }

        this.remove = function(toGo){
            this.contains.splice(toGo,1);
            this.renderMon();
        }

        this.renderMon = function(){
            for(var i = 0; i < this.contains.length; i++){
                if(this.contains[i].id === undefined){
                    this.contains.splice(i,1);
                }
            }

            var limit = 0;
            if(this.prefix == "H"){
                limit = Math.floor(document.getElementById(this.place).offsetWidth / 64);
            }

            for(var i = 1; i <= this.contains.length - (shakeOn && this.prefix == "H"); i++){  
                if(limit != 0 && i > limit){
                    //continue;
                }
                var contain = document.createElement("div");
                contain.id = "POKE" + this.prefix + " " + i;
                contain.className = "POKEC";

                var leftS = document.getElementById(this.place).getBoundingClientRect().left + 10 + ((i - 1) % (this.width)) * 48;
                var topS = document.getElementById(this.place).getBoundingClientRect().top + 10 + ((i - 1) - ((i - 1) % this.width)) / this.height * 64;

                if(this.allowHover){
                    contain.onmouseover = new Function("if(selected == ''){selected = " + '"' + contain.id + '";}');
                }
                 
                var newMon = document.createElement("IMG");
                newMon.className = "pokemonSprite";
                newMon.setAttribute("draggable",false);
                if(this.direction == RIGHT){
                    newMon.style.transform = "scale(-1,1)"
                }

                var ext = "regular";
                if(this.contains[i - 1].shiny){
                    ext = "shiny";
                    contain.className = "POKEC shiny";
                }
                newMon.src = "pokesprite-master/icons/pokemon/" + ext + "/" + fixName(pD[this.contains[i - 1].id].name, true) + ".png";

                if(this.prefix.substring(0,1) == "F"){
                    newMon.className = "battleSprite";

                    ext = "";
                    if(this.contains[i - 1].shiny){
                        ext = "/shiny"
                    }
                    newMon.src = "pokemon" + ext + "/" + this.contains[i - 1].id + ".png";
                    leftS = document.getElementById(this.place).getBoundingClientRect().left + 5 + ((i - 1) % (this.width)) * 64;
                    topS = document.getElementById(this.place).getBoundingClientRect().top + 15 + ((i - 1) - ((i - 1) % this.width)) / this.height * 64;

                    this.dmgFly++;
                    var newNumber = document.createElement("DIV");
                    newNumber.style.setProperty("--backColour", this.colour)
                    newNumber.className = "number";
                    newNumber.innerHTML = "-" + Math.ceil(this.dmg);
                    newNumber.style.bottom = 30 + this.dmgFly + "px";
                    newNumber.style.right = (75 - (75 * this.direction)) + "px";
                    newNumber.style.opacity = 1 - (this.dmgFly / 40)
                    contain.appendChild(newNumber);

                    if(!(topS > $(window).height() * .02 && topS < $(window).height() - (60 + 108))){
                        newMon.style.display = "none";
                    }
                }

                this.contains[i - 1].find = contain.id;
                
                contain.style.left = leftS + "px";
                contain.style.top = topS + "px";
                contain.appendChild(newMon)

                //newMon.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + this.contains[i - 1] + ".png";
                document.getElementById("TEMP").appendChild(contain);
            }
        }

        this.willAllowAdd = function(toAdd){
            if(this.limit < this.contains.length + toAdd){
                return false;
            }
            return true
        }
    }

    function deleteHolder(){
        if(confirm("Are you sure you want to delete the Pokémon in the Holder Bar?")){
            holder.contains = [];
        }
        saveGame();
    }

    function updateCoins(){
        if(coins > 9999){
            coins = 9999;
        }
        document.getElementById("coinsCount").innerHTML = coins;
    }
    updateCoins();
    
    var dexTab = document.createElement("TABLE");
    dexTab.id = "dexTab";
    dexTab.setAttribute("cellSpacing", 0);
    var source = document.getElementById("dexRow").innerHTML;
    var template = Handlebars.compile(source);

    for(var i = 1; i < pD.length / 2; i++){
        var newRow = document.createElement("TR");
        var context = { name: pD[i].name, rarity: pD[i].rarity * 100 + "%" };
        newRow.innerHTML = template(context);
        dexTab.appendChild(newRow);
    }

    //document.getElementById("main").appendChild(dexTab);

    var shakeOn = false;

    var setPair = function(numb){
        if(numb % 2 == 0){
            return [numb, numb + 1]
        }
        return [numb - 1, numb];
    }

    var getPair = function(numb, which){
        var temp = setPair(numb);
        if((temp[0] == numb && which) || (temp[1] == numb && !which)){
            return temp[0];
        }
        return temp[1];
    }

    $(document).mouseup(function(){
        if(selected != "" && hover != ""){
            document.getElementById("TEMP").innerHTML = "";
            var toMove = 0;
            
            switch(selected.substring(4).split(" ")[0].substring(0,1)){
                case "H": toMove = holder.contains[selected.substring(4).split(" ")[1] - 1]; break;
                case "F": toMove = fighting[selected.substring(5,7) - 1].contains[0]; break;
                default : toMove = box[selected.substring(4,5)].contains[selected.substring(4).split(" ")[1] - 1];
            }
            
            if(hover == "H" && holder.willAllowAdd(1)){
                holder.add(toMove);
            } else if(hover == "H" && !holder.willAllowAdd(1)){
                return;
            }

            if(hover.substring(0,1) == "F" && fighting[hover.substring(1) - 1].willAllowAdd(1)){
                fighting[hover.substring(1) - 1].add(toMove);
                fighting[setPair(hover.substring(1) - 1)[0]].bouncey = 0; fighting[setPair(hover.substring(1) - 1)[1]].bouncey = 50; 
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

            switch(selected.substring(4).split(" ")[0].substring(0,1)){
                case "H": holder.remove(selected.substring(4).split(" ")[1] - 1);  holder.renderMon(); break;
                case "F": fighting[selected.substring(5,7) - 1].remove(selected.substring(4).split(" ")[1] - 1); fighting[selected.substring(5,7) - 1].renderMon(); break;
                default: box[selected.substring(4).split(" ")[0]].remove(selected.substring(4).split(" ")[1] - 1); box[selected.substring(4).split(" ")[0]].renderMon(); 
            }

            selected = "";
        }

        saveGame();
    })

    var moveCount = 0;
    setInterval(function(){
        moveCount++;
        if(moveCount > 50){
            moveCount = 0;
            hover = "";
        } 
    }, 1)
    
    var caught = 0;
        
    for(var i = 1; i < fighting.length; i += 2){
        if(fighting[i].contains.length < 1){
            caught = Math.ceil((pD.length - 1) * Math.random());
            while(pD[caught].evolution != 0 || !(pD[caught].hasType(fighting[i].catchable[0]) || pD[caught].hasType(fighting[i].catchable[1]))){
                caught = Math.ceil((pD.length - 1) * Math.random());
            }
            fighting[i].contains.push(new Pokemon("", caught, false, fighting[i].levelBase + Math.floor(Math.random() * 4)))
        }
    }

    setInterval(function(){
        if(selected != ""){
            lastSelected = selected;
        }

        if(!mouseDown){
            selected = "";
            renderAll();
        }

        for(var i = 0; i < fighting.length; i++){
            if(i % 2 == 1){
                fighting[i].allowHover = false;
            }
            if(fighting[setPair(i)[0]].contains.length == 1 && fighting[setPair(i)[1]].contains.length == 1 && fighting[setPair(i)[0]].contains[0].hp > 0){
                fighting[i].bouncey++;
                if(fighting[i].bouncey > 100){
                    fighting[i].bouncey = 0;
                }
                if(fighting[i].bouncey > 90){
                    document.getElementById("POKE" + fighting[i].prefix + " 1").childNodes[1].style.transform += "translate(0, " + (Math.cos(fighting[i].bouncey * 1.5) * 6) + "px)";
                } else if (fighting[i].bouncey > 35 && fighting[i].bouncey < 45){
                    document.getElementById("POKE" + fighting[i].prefix + " 1").childNodes[1].style.transform += "translate(" + (Math.cos(fighting[i].bouncey * 1.5) * 3) + "px, 0)"

                    if(fighting[i].bouncey == 40){
                        var damaged = fighting[getPair(i, true)].contains[0].attack(fighting[getPair(i, false)].contains[0]);
                        fighting[getPair(i, false)].dmg = fighting[getPair(i, false)].contains[0].defend(damaged[0]);
                        fighting[getPair(i, false)].dmgFly = 0;
                        fighting[getPair(i, false)].colour = "white";
                        if(damaged[2]){
                            fighting[getPair(i, false)].colour = "green";
                        }
                        if(damaged[1]){
                            fighting[getPair(i, false)].colour = "red";
                        }

                        if(fighting[setPair(i)[1]].contains[0].hp <= 0){
                            coins -= -10;
                            updateCoins();
                            saveGame();
                            fighting[getPair(i, true)].contains[0].levelUp(fighting[getPair(i, true)].contains[0].level < fighting[getPair(i, false)].contains[0].level + 3);
                            fighting[getPair(i, true)].dmgFly = 0;
                            fighting[getPair(i, true)].dmg = "10";
                            fighting[getPair(i, true)].colour = "yellow";
                            fighting[setPair(i)[1]].contains.splice(0,1);
                            var caught = Math.ceil((pD.length - 1) * Math.random());
            
                            while(pD[caught].evolution != 0 || !pD[caught].hasType(fighting[setPair(i)[1]].catchable[0], fighting[setPair(i)[1]].catchable[1])){
                                caught = Math.ceil((pD.length - 1) * Math.random());
                            }
                            fighting[setPair(i)[1]].contains.push(new Pokemon("", caught, false, fighting[setPair(i)[1]].levelBase + Math.floor(Math.random() * 4)))
                        }
                    }

                } else {
                    //document.getElementById("POKE" + fighting[i].prefix + " 1").childNodes[1].style.transform += "translate(0, 0)";
                }
            } else if (fighting[setPair(i)[1]].contains.length == 1){
                document.getElementById("POKE" + fighting[setPair(i)[1]].prefix + " 1").childNodes[1].style.opacity = ".5";
            }

            if(fighting[setPair(i)[0]].contains.length == 1 && fighting[setPair(i)[1]].contains.length == 1){
                document.getElementById("dead" + Math.ceil((i + 1) / 2)).style.opacity = fighting[setPair(i)[0]].contains[0].dead() - .2;
                if(fighting[setPair(i)[0]].contains[0].hp <= 0){
                    document.getElementById("dead" + Math.ceil((i + 1) / 2)).style.pointerEvents = "auto";
                    document.getElementById("POKE" + fighting[setPair(i)[0]].prefix + " 1").childNodes[1].style.transform = "scale(1,-1)";
                } else {
                    document.getElementById("dead" + Math.ceil((i + 1) / 2)).style.pointerEvents = "none"
                }
            }
            
            if(typeof(fighting[i].contains[0]) == "object" && fighting[i].contains[0].id != undefined){
                document.getElementById("H" + fighting[i].prefix).style.width = Math.max(70 * (fighting[i].contains[0].hp / fighting[i].contains[0].stats[0]), 0) + "px";
                document.getElementById("H" + fighting[i].prefix).style.borderTopRightRadius = Math.min(3, Math.max(0, 2 * (fighting[i].contains[0].hp - (.9 * fighting[i].contains[0].stats[0])))) + "px";

                document.getElementById("nick" + toPlace(i + 1,2)).innerHTML = fighting[i].contains[0].nick;
                document.getElementById("level" + toPlace(i + 1,2)).innerHTML = " LVL. " + fighting[i].contains[0].level;
            }
        }
    }, 30)

    var revive = function(reviving){
        fighting[setPair(reviving)[0]].contains[0].hp = fighting[setPair(reviving)[0]].contains[0].stats[0] * .8;
    }

    var shake = function(image){
        document.getElementById("POKE" + "H " + holder.contains.length).style.display = "none";

        shakeOn = true;
        scale = 20;
        var leftBall = ($(document).width() * Math.random() * .6 + 200);
        var topBall = ($(document).height() * Math.random() * .6 + 200);

        document.getElementById("shake").src = image;
        document.getElementById("shakeBehind").src = "pokemon/other-sprites/official-artwork/" + holder.contains[holder.contains.length - 1].id + ".png";

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

        $('#shakeBehind').css('transform', 'scale(' + (.15 + Math.abs(.5 - (scale / 100))) / 1.35 + ')')
        document.getElementById("shakeBehind").style.opacity = 3 - (scale / 100);

        if(scale > 301){
            document.getElementById("shake").style.display = "none";
            shakeOn = false;
            if((document.getElementById("POKE" + "H " + (holder.contains.length))) != null){
                document.getElementById("POKE" + "H " + (holder.contains.length)).style.display = "inline";
            }
            document.getElementById("shakeBehind").style.display = "none";
        }
    }, 9)

        var mouseDown = false;
        document.onmousedown = function() { 
            mouseDown = true;
        }
        document.onmouseup = function() {
            mouseDown = false;
        }       

        $(this).mousemove(function(event){
            moveCount = 0;
            if(selected != "" && mouseDown > 0){
                document.getElementById(selected).style.position = "fixed";
                document.getElementById(selected).style.pointerEvents = "none";
                document.getElementById(selected).style.left = event.clientX - 30 + "px";
                document.getElementById(selected).style.top = event.clientY - 30 + "px";
            }
        })

    var rand5 = function(){
        return (Math.random() + Math.random()) / 2
    }

    function catchMon(ball, set){
        if(shakeOn){
            return;
        }

        if(!holder.willAllowAdd(1)){
            alert("You are full!");
            return;
        }

        var cost = 0;
        var bonus = 0;
        var ballImage = "";

        switch(ball){
            case 0: cost = 20; bonus = 1; ballImage = "items/dream-world/poke-ball.png"; break;
            case 1: cost = 30; bonus = .8; ballImage = "items/dream-world/great-ball.png"; break;
        }

        if(coins - cost < 0){
            alert("You don't have enough Coins!");
            return;
        }

        coins -= cost;
        updateCoins();

        var caught = Math.ceil((pD.length - 1) * Math.random());
        
        while(pD[caught].evolution != 0 || pD[caught].rarity < (rand5() * bonus)){//|| (!pD[caught].hasType(focus)  && (Math.random() < focusStrength))){
            caught = Math.ceil((pD.length - 1) * Math.random());
        }

        if(set != 0){
            caught = set;
        }

        holder.add(new Pokemon(pD[caught].name, caught, (Math.random() < .05), 1));    
        holder.renderMon();

        saveGame();
        shake(ballImage);
    }
