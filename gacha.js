
var version = "B8";
document.getElementById("version").innerHTML = "Version " + version;
var LEFT = 0;
var RIGHT = 1;
var BERRY = 0;
var BALL = 1;

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

var mouseDown = false;
document.onmousedown = function(e) { 
    if(e.which == 1){
        mouseDown = true;
    }
}
document.onmouseup = function() {
    mouseDown = false;
}     

var mouseX = 0;
var mouseY = 0;
$(this).mousemove(function(event){
    moveCount = 0;
    if(!shakeOn){
        document.getElementById("shake").style.left = event.clientX - 60 + "px";
        document.getElementById("shake").style.top = event.clientY - 60 + "px";
        document.getElementById("shakeBehind").style.left = (event.clientX - 44) + "px";
        document.getElementById("shakeBehind").style.top = (event.clientY - 44) + "px";
    }
    mouseX = event.clientX;
    mouseY = event.clientY;
})

var fixItems = function(){
    for(var i = 0; i < $(".item").length; i++){
        document.getElementById("item" + i).style.height = document.getElementById("item" + i).offsetWidth + "px";
    }
}
fixItems();

var setInfo = function(){
    document.getElementById("info").style.right = -160 + ($(window).width() - mouseX) + "px";
    document.getElementById("info").style.bottom = 50 + ($(window).height() - mouseY) + "px";
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var getMon = function(catchable, levelBase, variation, chance){
    var caught = Math.ceil((pD.length - 1) * Math.random());
    while(pD[caught].rarity < (rand5() * chance) || !pD[caught].hasType(catchable[0], catchable[1])){
        caught = Math.ceil((pD.length - 1) * Math.random());
    }
    var level = levelBase + Math.floor(Math.random() * variation);
    return [caught, level]
}

var remove = function(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

var pokemonFromString = function(inputs){
    var tempArray = inputs.split(",");
    var outArray = [];
    for(var i = 0; i < tempArray.length; i++){
        var holdDat = tempArray[i].split(";");
        outArray.push(new Pokemon(holdDat[0],holdDat[1],toBool(holdDat[2]),holdDat[3], toBool(holdDat[4])))
    }
    return outArray;
};

var fixName = function(name, lower){
    var newName;
    switch(name){
        case "Nidoran♀": newName = "Nidoran-m"; break;
        case "Nidoran♂": newName = "Nidoran-f"; break;
        case "Mr. Mime": newName = "Mr-Mime"; break;
        case "Farfetch'd": newName = "Farfetchd"; break;
        default: newName =  name;
    }
    if(lower){
        return newName.toLowerCase();
    }
    return newName;
}

var rand5 = function(){
    return (Math.random() + Math.random()) / 2
}

var toBool = function(take){
    switch(take){
        case "false": return false;
        case "0": return false;
        case 0: return false;
        case false: return false;
    }
    return true;
}

var returnFromSelect = function(select){            
    switch(select.substring(4).split(" ")[0].substring(0,1)){
        case "H": return holder.contains[select.substring(4).split(" ")[1] - 1]; break;
        case "F": return fighting[select.substring(5,7) - 1].contains[0]; break;
        default : return box[select.substring(4,5)].contains[select.substring(4).split(" ")[1] - 1];
    }
}

var toPlace = function(conv, place){
    var final = String(conv);
    while(final.length < place){
        final = "0" + final;
    }
    return final;
}

var unlockField = function(){
    document.getElementById("buyField").innerHTML = "Buy a new field for " + curCost + " coins";
    unlockedField++;
    document.getElementById("wrap" + unlockedField).style.display = "inline-block";
    document.getElementById("wrap" + unlockedField).childNodes[5].style.display = "inline-block";
    if(unlockedField < fighting.length / 2){
        document.getElementById("wrap" + (unlockedField + 1)).style.display = "inline-block";
        document.getElementById("wrap" + (unlockedField + 1)).childNodes[5].style.display = "inline-block";
    } 
}

var buyField = function(){
    if(unlockedField >= fighting.length / 2){
        return;
    }
    if(coins >= curCost){
        coins -= curCost;
        curCost = Math.floor(curCost * 1.5);
        unlockField();
    }
    saveGame();
}
    

var curCost = 15;
var unlockedField = 0;

var active = 0;
var selected = "";
var hovered = "";
var lastSelected = "";
var hover = "";
var isMoving = false;

var catchMode = false;
var catchBall = 1;
var catchLocation = 0;

var statNames = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"]

var coins = 5000;
var recent = 0;

var PID = [];

var blankPokemon = pokemonFromString("")[0];
var data = [];
for(var i = 0; i < pD.length; i++){
    data.push(0);
}

var newF = document.createElement("DIV");
newF.className = "pInv battle";

var holder = new Box(15, 1, "pokeHolder", "H", LEFT, 1, []);
var box = [];
box.push(new Box(8, 8, "boxes", "0", RIGHT, 1, []));
var fighting = [];

var fieldTypes = ["Grass", "Normal", "Water Dragon", "Bug Fairy", "Rock Ghost", "Ground", "Fire", "Electric", "Flying Steel", "Dark Poison", "Fighting", "Ice Psychic"];

var levelBase = 1;
for(var i = 0; i < fieldTypes.length; i++){
    levelBase += 2;
    var wrapper = document.createElement("DIV");
    wrapper.className = "wrapper";
    wrapper.innerHTML = Handlebars.compile(document.getElementById("wrap").innerHTML)({ 1: toPlace((i * 2) + 1,2), 2: toPlace((i * 2) + 2,2), 3: i + 1, 4: fieldTypes[i].split(" ")[0]});
    wrapper.id = "wrap" + (i + 1);
    wrapper.style.display = "none";
    wrapper.style.backgroundImage = "url(" + fieldTypes[i].split(" ")[0].toLowerCase() + "Battle.png)";
    wrapper.onmouseup = function(){
        if(catchMode){
            catchLocation = this.id.substring(4);
            catchMon();
            catchMode = false;
        }   
    };
    newF.appendChild(wrapper);
    fighting.push(new Box(1, 1, "F" + toPlace((i * 2) + 1,2), "F" + toPlace((i * 2) + 1,2), RIGHT, levelBase + ((i - 1) * 3), fieldTypes[i].split(" ")), 
    new Box(1, 1, "F" + toPlace((i * 2) + 2,2), "F" + toPlace((i * 2) + 2,2), LEFT, levelBase + ((i - 1) * 2), fieldTypes[i].split(" ")))
}
document.getElementById("main0").appendChild(newF);
unlockField();

for(var i = 1; i < fighting.length; i += 2){
    if(fighting[i].contains.length < 1){
        var found = getMon(fighting[i].catchable, fighting[i].levelBase, 0, 1);
        fighting[i].contains.push(new Pokemon("", found[0], false, found[1], false))
    }
}

//alert("POKEH 0".substring(4).split(" "))
function Item(id, amt, render, name, type, cost, first, second){
    this.id = id;
    this.name = capitalize(name);
    this.dream = "items/dream-world/" + this.name.toLowerCase();
    this.sprite = "pokesprite-master/icons/";
    this.amt = amt;
    this.render = render;
    this.cost = cost;

    this.type = type;
    switch(this.type){
        case BERRY: 
            this.specialty = first;
            this.dream += "-berry.png"; 
            this.sprite += "berry/" + this.name.toLowerCase() + ".png"; 
            this.name += " Berry";
            break; 
        case BALL: 
            this.dream += "-ball.png"; 
            this.sprite += "pokeball/" + this.name.toLowerCase() + ".png"; 
            this.bonus = first;
            this.name += " Ball"
            break;
    }

    this.buy = function(){
        if(coins >= this.cost){
            coins -= this.cost;
            this.amt++
        }
    }
}
var items = [new Item(
	0 , 1, false, "sitrus" , BERRY, 20, "HEAL50")  , new Item(
	1 , 1, false, "oran"   , BERRY, 5 , "HEAL10")  , new Item(
	2 , 1, false, "enigma" , BERRY, 40, "SPICY")   , new Item(
	3 , 1, false, "micle"  , BERRY, 40, "DRY")     , new Item(
	4 , 1, false, "custap" , BERRY, 40, "SWEET")   , new Item(
	5 , 1, false, "jaboca" , BERRY, 40, "BITTER")  , new Item(
	6 , 1, false, "rowap"  , BERRY, 40, "SOUR")    , new Item(
	7 , 1, false, "occa"   , BERRY, 40, "Fire")    , new Item(
	8 , 1, false, "passho" , BERRY, 40, "Water")   , new Item(
	9 , 1, false, "wacan"  , BERRY, 40, "Electric"), new Item(
	10, 1, false, "rindo"  , BERRY, 40, "Grass")   , new Item(
	11, 1, false, "yache"  , BERRY, 40, "Ice")     , new Item(
	12, 1, false, "chople" , BERRY, 40, "Fighting"), new Item(
	13, 1, false, "kebia"  , BERRY, 40, "Poison")  , new Item(
	14, 1, false, "shuca"  , BERRY, 40, "Ground")  , new Item(
	15, 1, false, "coba"   , BERRY, 40, "Flying")  , new Item(
	16, 1, false, "payapa" , BERRY, 40, "Psychic") , new Item(
	17, 1, false, "tanga"  , BERRY, 40, "Bug")     , new Item(
	18, 1, false, "charti" , BERRY, 40, "Rock")    , new Item(
	19, 1, false, "kasib"  , BERRY, 40, "Ghost")   , new Item(
	20, 1, false, "haban"  , BERRY, 40, "Dragon")  , new Item(
	21, 1, false, "colbur" , BERRY, 40, "Dark")    , new Item(
	22, 1, false, "babiri" , BERRY, 40, "Steel")   , new Item(
	23, 1, false, "cornn"  , BERRY, 40, "Fairy")   , new Item(
	24, 1, false, "chilan" , BERRY, 40, "Normal")  , new Item(
	25, 5, true , "poke"   , BALL , 20, 1)         , new Item(
	26, 3, true , "great"  , BALL , 30, .8)        , new Item(
	27, 1, true , "ultra"  , BALL , 50, .6)        , new Item(
	28, 1, true , "premier", BALL , 0 , 1)]

var categories = {
    "Berry": 0, 0: "Berry",
    "Ball": 1, 1: "Ball"
}

document.getElementById("itemPlace").innerHTML = "";
for(var i = 0; i < items.length; i++){
    var newItem = document.createElement("DIV");
    newItem.className = "item";
    newItem.id = "item" + i;
    if(items[i].type == BALL){
        newItem.onmousedown = new Function("if(!shakeOn){catchMode = true}; catchBall = " + i);
    }

    var newItemImage = document.createElement("IMG");
    newItemImage.setAttribute("draggable", "false");
    newItemImage.className = "icon";
    newItemImage.src = items[i].dream;

    newItem.appendChild(newItemImage);
    document.getElementById("itemPlace").appendChild(newItem);

    var newTable = document.createElement("TABLE");
    newTable.onmousedown = new Function("items[" + i + "].buy()");
    newTable.innerHTML = Handlebars.compile(document.getElementById("buy").innerHTML)({ cost: items[i].cost, name: items[i].name, dream: items[i].dream });
    document.getElementById("storefront" + items[i].type).appendChild(newTable);
}

function Pokemon(nick, id, shinys, level, player){
    if(nick != ""){
        this.nick = nick;
    } else if(id != undefined){
        this.nick = pD[id].name;
    }
    this.id = id;
    this.level = level;
    this.exp = 0;
    this.find = "";
    this.tCharge = 0;
    this.player = player;

    this.shiny = shinys;
    
    if(id != undefined){
        this.stats = pD[id].stats.map(x => x * 1);
        this.hp = this.stats[0];
    } 

    this.deadness = 1;

    this.dead = function(){
        if(this.hp <= 0 && this.deadness > 0){
            this.deadness -= .02;
        } else if(this.hp > 0 && this.deadness < 1) {
            this.deadness += .02;
        }
        return 1 - this.deadness;
    }

    this.attack = function(opponent){
        var power = 20 + (1 - pD[this.id].rarity) * 100;
        var moveType = pD[this.id].type[0];

        var use = 1;
        if(this.stats[1] < this.stats[3]){
            use = 3;
        }

        var useType = false;
        if(this.tCharge >= 100){
            this.tCharge -= 100;
            useType = true;
        }
        var modifier = 1;
        modifier *= 1; //targets
        modifier *= 1; //weather
        modifier *= 1; //badge
        modifier *= 1.15 - (.3 * Math.random()); //random
        var crit = (.9 < Math.random());
        modifier *= 1 + (1.5 * crit); //critical
        modifier *= 1; //STAB
        if(useType){
            modifier *= types[T[moveType]].against[T[pD[opponent.id].type[0]]] * types[T[moveType]].against[T[pD[opponent.id].type[1]]]; //type
            modifier *= 1.5;
        }
        modifier *= 1; //status
        modifier *= 1; //other
        if(this.player){
            modifier *= 1.3;
        }

        var damage = (2 + (((this.level * 2 / 5) + 2) * power * (this.stats[use] / opponent.stats[use + 1])) / 50) * modifier;
        
        if(!useType){
            this.tCharge += Math.max(25, 25 + this.stats[5] - opponent.stats[5])
        }
        return [damage, crit, use == 3, useType];
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
            this.exp = 0;
            if(this.level % 5 == 0){
                this.evolve();
            }
        }
        this.calcLevel();
    }

    this.calcLevel = function(){
        if(this.stats == undefined){
            return;
        }
        for(var i = 0; i < this.stats.length; i++){
            this.stats[i] = pD[this.id].stats[i] + Math.ceil((1/25) * this.level * pD[this.id].stats[i]);
        }
    }
    this.calcLevel();

    this.evolve = function(){
        var newID = this.id;
        var chances = [];

        for(var i = 1; i < pD.length; i++){
            if(pD[i].evolution == this.id){
                chances.push(i);
            }
        }

        if(chances.length != 0){
            newID = chances[Math.floor(Math.random() * chances.length)];
        }

        if(newID != this.id && this.nick == pD[this.id].name){
            this.nick = pD[newID].name;
        }

        this.id = newID;
        this.calcLevel();

        return chances.length != 0;
    }

    this.toString = function(){
        return this.nick + ";" + this.id + ";" + this.shiny + ";" + this.level + ";" + this.player;
    }
}

function Box(width, height, place, prefix, direction, levelBase, catchable){
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

    this.itemUrl = 0;
    this.itemFly = 100;
    this.itemColour = "white";
    
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

    this.renderNumb = function(){
        this.dmgFly+=1;
        document.getElementById("N" + this.place.substring(1)).style.setProperty("--backColour", this.colour)
        document.getElementById("N" + this.place.substring(1)).innerHTML = Math.ceil(this.dmg);
        document.getElementById("N" + this.place.substring(1)).style.bottom = 30 + this.dmgFly + "px";
        document.getElementById("N" + this.place.substring(1)).style.left = 46 + (-95 * this.direction) + "px";
        document.getElementById("N" + this.place.substring(1)).style.opacity = 1 - (this.dmgFly / 40)

        if(this.itemFly <= 50){
        this.itemFly+=.25;
        }

        if(this.itemFly == 50){
            items[this.itemUrl].amt++;
        }

        document.getElementById("I" + this.place.substring(1)).style.setProperty("--backColour", this.itemColour)
        document.getElementById("I" + this.place.substring(1)).src = items[this.itemUrl].sprite;
        document.getElementById("I" + this.place.substring(1)).style.bottom = 30 + this.itemFly + "px";
        document.getElementById("I" + this.place.substring(1)).style.left = 226 + (-215 * this.direction) + "px";
        document.getElementById("I" + this.place.substring(1)).style.opacity = 1 - (this.itemFly / 40)
    }

    this.renderMon = function(){
        for(var i = 0; i < this.contains.length; i++){
            if(this.contains[i].id === undefined){
                this.contains.splice(i,1);
            }
        }

        for(var e = 1; e <= this.width; e++){  
            for(var y = 0; y < this.height; y++){
                var i = (y * this.width) + e;
                var contain = document.createElement("div");
                contain.className = "POKEC";
    
                var leftS = document.getElementById(this.place).getBoundingClientRect().left + 10 + ((i - 1) % (this.width)) * 52;
                var topS = document.getElementById(this.place).getBoundingClientRect().top + 10 + ((i - 1) - ((i - 1) % this.width)) / this.height * 52;
    

                if(this.contains.length >= i){              
                    contain.id = "POKE" + this.prefix + " " + i;
                    if(this.allowHover){
                        contain.onmousedown = new Function("if(selected == '' && !catchMode){selected = " + '"' + contain.id + '";}');
                    }
                    contain.onmouseover = new Function('hovered = "' + contain.id + '"');
                    contain.oncontextmenu = new Function('lastSelected = "' + contain.id + '"; setInfo(); return false');

                    var newMon = document.createElement("IMG");
                    newMon.className = "pokemonSprite";
                    newMon.setAttribute("draggable",false);
                    if(this.direction == RIGHT){
                        newMon.style.transform = "scale(-1,1)"
                    }

                    if((this.prefix.substring(0,1) != "F" && this.prefix.substring(0,1) != "H") || contain.id == hovered){
                        newMon.className += " inBox"
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
                    }
                    contain.appendChild(newMon);
        
                    if(this.prefix.substring(0,1) != "F" || (document.getElementById(this.place).style.display != "" && document.getElementById(this.place).style.display != "none")){
                        if(this.contains[i - 1].player){
                            data[this.contains[i - 1].id] = 2;
                        } else if(data[this.contains[i - 1].id] != 2){
                            data[this.contains[i - 1].id] = 1;
                        }
                    }
                } 


                 if(this.prefix.substring(0,1) != "F"){
                    contain.className += " unknownSprite";
                }                
                
                contain.style.left = leftS + "px";
                contain.style.top = topS + "px";
    
                if(document.getElementById(this.place).style.display == "" || (!isNaN(Number(this.prefix)) && current != 2) || (this.prefix.substring(0,1) == "F" && current != 0) && document.getElementById(this.place).style.display != "none"){
                    contain.style.display = "none";
                }
    
                document.getElementById("TEMP").appendChild(contain);
            }
        }
    }

    this.willAllowAdd = function(toAdd){
        if(this.limit < this.contains.length + toAdd){
            return false;
        }
        return true
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
        document.getElementById("buyField").innerHTML = "Buy a new field for " + curCost + " coins";
    }
    if(localStorage.getItem("saveCoins") != null){
        coins = localStorage.getItem("saveCoins");
    }
    if(localStorage.getItem("saveData") != null){
        var tempo = localStorage.getItem("saveData").split(",");
        for(var i = 0; i < tempo.length; i++){
            data[i] = tempo[i];
        }
    }
    if(localStorage.getItem("saveItems") != null){
        var saved = localStorage.getItem("saveItems").split(";").map(a => Number(a));
        for(var i = 0; i < saved.length; i++){
            if(items[i] != undefined){
                items[i].amt = saved[i];
            }
        }
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
}

var saveGame = function() {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("saveCoins", coins);
        localStorage.setItem("saveItems", items.reduce((a, b) => a + ";" + b.amt, "").substring(1));
        localStorage.setItem("saveData", String(data));
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

for(var i = 1; i < pD.length; i++){
    var newRow = document.createElement("TR");
    var fakeRow = document.createElement("TR");
    var dumbRow = document.createElement("TR");
    var context = { name: pD[i].name, type1: pD[i].type[0], type2: pD[i].type[1], type1color: types[T[pD[i].type[0]]].color1, type2color: types[T[pD[i].type[1]]].color1, rarity: pD[i].rarity * 100 + "%", src: "pokesprite-master/icons/pokemon/regular/" + fixName(pD[i].name, true) + ".png", 1: pD[i].stats[0], 2: pD[i].stats[1], 3: pD[i].stats[2], 4: pD[i].stats[3], 5: pD[i].stats[4], 6: pD[6].stats[5]};
    newRow.innerHTML = Handlebars.compile(document.getElementById("dexRow" + ((pD[i].type[1] == "None")- 0)).innerHTML)(context);
    fakeRow.innerHTML = Handlebars.compile(document.getElementById("fakeRow").innerHTML)(context);
    dumbRow.innerHTML = Handlebars.compile(document.getElementById("dumbRow").innerHTML)(context);
    newRow.style.display = "none";
    fakeRow.style.display = "none";
    dumbRow.style.display = "table-row";
    newRow.id = "data" + i;
    fakeRow.id = "fake" + i;
    dumbRow.id = "dumb" + i;
    document.getElementById("dexTab").appendChild(newRow);
    document.getElementById("dexTab").appendChild(fakeRow);
    document.getElementById("dexTab").appendChild(dumbRow);
}

var current = 0;
var itemShow = 0;
var amt = 4;

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

var itemSwitch = function(){
    itemShow++;
    if(itemShow > 1){
        itemShow = 0;
    }
    document.getElementById("itemSwitch").innerHTML = categories[(itemShow + 1) % 2];

    for(var i = 0; i < items.length; i++){
        if(items[i].type == itemShow){
            items[i].render = true;
        } else {
            items[i].render = false;
        }
    }
}

$(document).mouseup(function(){
    if(selected != "" && hover != ""){
        if(hover == selected.substring(4,5)){
            return;
        }
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
            fighting[setPair(hover.substring(1) - 1)[0]].contains[0].hp = fighting[setPair(hover.substring(1) - 1)[0]].contains[0].stats[0]; 
            fighting[setPair(hover.substring(1) - 1)[1]].contains[0].hp = fighting[setPair(hover.substring(1) - 1)[1]].contains[0].stats[0]; 
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
    moveCount+=2;
    if(moveCount > 50){
        moveCount = 0;
        hover = "";
        hovered = "";
    } 

    for(var i = 0; i < fighting.length; i++){
        fighting[i].renderNumb();
    }

    if(catchMode){
        $(".battle").css({"cursor":"pointer"})
    } else {
        $(".battle").css({"cursor":"auto"})
    }

    for(var i = 0; i < amt; i++){
        if(current == i){
            if(i == 0 || i == 2){
                document.getElementById("main" + i).style.display = "flex";
            } else {
                document.getElementById("main" + i).style.display = "block";
            }
        } else {
            document.getElementById("main" + i).style.display = "none";
        }
    }
}, 5)

var revive = function(reviving){
    fighting[setPair(reviving)[0]].contains[0].hp = fighting[setPair(reviving)[0]].contains[0].stats[0];
    fighting[setPair(reviving)[1]].contains[0].hp = fighting[setPair(reviving)[1]].contains[0].stats[0];
}

var scale = 1;

var catchMon = function(){
    if(shakeOn){
        return;
    }

    if(!holder.willAllowAdd(1)){
        alert("You are full!");
        return;
    }

    if(coins - items[catchBall].cost < 0 || items[catchBall].amt < 1){
        alert("You don't have enough Coins!");
        return;
    }

    coins -= items[catchBall].cost;
    items[catchBall].amt -= 1;

    var found = getMon(fieldTypes[catchLocation - 1].split(" "), 1, 0, items[catchBall].bonus);

    if(items[catchBall].name == "Premier Ball"){
        found = [Math.floor(Math.random() * 3) * 3 + 1, false];
    }

    recent = new Pokemon(pD[found[0]].name, found[0], (Math.random() < .05), 1, true);    

    saveGame();
    shake();
}

var shake = function(){
    shakeOn = true;
    scale = 20;

    document.getElementById("shake").src = items[catchBall].dream;
    document.getElementById("shakeBehind").src = "pokemon/other-sprites/official-artwork/" + recent.id + ".png";

    $('#shake').css('transform', 'scale(' + (.5 + Math.abs(.5 - (scale / 100))) + ')')
    document.getElementById("shake").style.display = "block";
    document.getElementById("shakeBehind").style.display = "block";
} 

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
/////////////////RENDERALL
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

var renderAll = function(){
    if(coins > 9999){
        coins = 9999;
    }
    document.getElementById("coinsCount").innerHTML = coins;
    
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

    if(selected != ""){
        document.getElementById(selected).childNodes[0].style.position = "fixed";
        document.getElementById(selected).childNodes[0].style.pointerEvents = "none";
        document.getElementById(selected).childNodes[0].style.left = mouseX - 30 + "px";
        document.getElementById(selected).childNodes[0].style.top = mouseY - 30 + "px";
    }

    for(var i = 1; i < pD.length; i++){
        if(data[i] == 2){
            document.getElementById("data" + i).style.display = "table-row";
            document.getElementById("fake" + i).style.display = "none";
            document.getElementById("dumb" + i).style.display = "none";
        } else if(data[i] == 1){
            document.getElementById("data" + i).style.display = "none";
            document.getElementById("fake" + i).style.display = "table-row";
            document.getElementById("dumb" + i).style.display = "none";
        } else if(data[i] == 0){
            document.getElementById("data" + i).style.display = "none";
            document.getElementById("fake" + i).style.display = "none";
            document.getElementById("dumb" + i).style.display = "table-row";
        }
    }

    if(lastSelected != "" && returnFromSelect(lastSelected) != undefined){
        var cur = returnFromSelect(lastSelected);
        document.getElementById("nickShow").innerHTML = cur.nick;
        document.getElementById("statsShow").innerHTML = "Level: " + cur.level + "<br>Types: " + pD[cur.id].type[0];
        if(pD[cur.id].type[1] != "None"){
            document.getElementById("statsShow").innerHTML += ", " + pD[cur.id].type[1];
        }
        document.getElementById("statsShow").innerHTML += "<br>HP: " + cur.stats.reduce((z,y,f) => String(z) + "<br>" + statNames[f] + ": " + String(y) + " (+" + String(y - pD[cur.id].stats[f]) + ")");
        document.getElementById("info").style.display = "block" ;
    } else {
        document.getElementById("nickShow").innerHTML = "";
        document.getElementById("info").style.display = "none" ;
    }

    for(var i = 0; i < items.length; i++){
        if(items[i].amt > 99){
            items[i].amt = 99;
        }
        document.getElementById("item" + i).style.setProperty("--used", String(items[i].amt))
        document.getElementById("buy" + items[i].name).style.setProperty("--used", String(items[i].amt))
        if(items[i].amt == 0 || !items[i].render){
            document.getElementById("item" + i).style.display = "none";
        } else {
            document.getElementById("item" + i).style.display = "flex";
        }
        
    }
    
    if(!mouseDown){
        selected = "";
        catchMode = false;
    }

    //if(lastSelected == "" || false){
        //document.getElementById("info").style.width = "99px";
    //} else {
        //document.getElementById("info").style.width = (.1 * $(window).width()) + "px";
    //}
    fixItems();

    if(!(unlockedField >= fighting.length / 2)){
        document.getElementById("buyField").style.left = document.getElementById("wrap" + (unlockedField + 1)).getBoundingClientRect().left + "px";
        document.getElementById("buyField").style.top = document.getElementById("wrap" + (unlockedField + 1)).getBoundingClientRect().top + "px";
    } 
    
    if(current != 0 || unlockedField >= fighting.length / 2){
        document.getElementById("buyField").style.display = "none";
    } else {
        document.getElementById("buyField").style.display = "block";
    }
    
    if(catchMode){
        document.getElementById("shake").style.display = "block";
        document.getElementById("shake").style.opacity = ".9";
        document.getElementById("shake").style.transform = "scale(.3)";
        document.getElementById("shake").src = items[catchBall].dream;

        
        document.getElementById("item" + catchBall).childNodes[0].style.opacity = "0";
    } else if(!shakeOn){
        document.getElementById("shake").style.opacity = "0";
        document.getElementById("item" + catchBall).childNodes[0].style.opacity = "1";
    }

    for(var i = 0; i < fighting.length; i++){
        if(i % 2 == 1){
            fighting[i].allowHover = false;
        }
        if(fighting[setPair(i)[0]].contains.length == 1 && fighting[setPair(i)[1]].contains.length == 1 && fighting[setPair(i)[0]].contains[0].hp > 0){
            fighting[i].bouncey+=.75;
            if(fighting[i].bouncey > 100){
                fighting[i].bouncey = 0;
            }
            if(fighting[i].bouncey > 90){
                document.getElementById("POKE" + fighting[i].prefix + " 1").childNodes[0].style.transform += "translate(0, " + (Math.cos(fighting[i].bouncey * 1.5) * 6) + "px)";
            } else if (fighting[i].bouncey > 35 && fighting[i].bouncey < 45){
                document.getElementById("POKE" + fighting[i].prefix + " 1").childNodes[0].style.transform += "translate(" + (Math.cos(fighting[i].bouncey * 1.5) * 3) + "px, 0)"

                if(fighting[i].bouncey == 36 + 1.5){
                    var damaged = fighting[getPair(i, true)].contains[0].attack(fighting[getPair(i, false)].contains[0]);
                    fighting[getPair(i, false)].dmg = "-" + fighting[getPair(i, false)].contains[0].defend(damaged[0]);
                    fighting[getPair(i, false)].dmgFly = 0;
                    fighting[getPair(i, false)].colour = "white";
                    if(damaged[2]){
                        fighting[getPair(i, false)].colour = "lawngreen";
                    }
                    if(damaged[3]){
                        fighting[getPair(i, false)].colour = "LightSkyBlue";
                    }
                    if(damaged[1]){
                        fighting[getPair(i, false)].colour = "lightCoral";
                    }
                    if(damaged[1] && damaged[3]){
                        fighting[getPair(i, false)].colour = "plum";
                    }

                    if(fighting[setPair(i)[1]].contains[0].hp <= 0){
                        coins -= -10 * fighting[setPair(i)[1]].contains[0].level;
                        saveGame();
                        fighting[getPair(i, true)].contains[0].levelUp(fighting[getPair(i, true)].contains[0].level < fighting[getPair(i, false)].contains[0].level + 3);
                        fighting[getPair(i, true)].dmgFly = 0;
                        fighting[getPair(i, true)].dmg = String(fighting[setPair(i)[1]].contains[0].level * 10);
                        fighting[getPair(i, true)].colour = "yellow";

                        fighting[getPair(i, true)].itemFly = 0;
                        fighting[getPair(i, true)].itemUrl = Math.floor(items.length * Math.random());
                        fighting[getPair(i, true)].itemColour = "white";
                        fighting[setPair(i)[1]].contains.splice(0,1);
                        
                        var found = getMon(fighting[setPair(i)[1]].catchable, fighting[setPair(i)[1]].levelBase, 1, 1);
                        fighting[setPair(i)[1]].contains.push(new Pokemon("", found[0], (.0001 > Math.random()), found[1], false))
                    }
                }

            } else {
                //document.getElementById("POKE" + fighting[i].prefix + " 1").childNodes[0].style.transform += "translate(0, 0)";
            }
        } else if (fighting[setPair(i)[1]].contains.length == 1){
            if(document.getElementById("POKE" + fighting[setPair(i)[1]].prefix + " 1").childNodes[0] != undefined){
                document.getElementById("POKE" + fighting[setPair(i)[1]].prefix + " 1").childNodes[0].style.opacity = ".5";
                fighting[setPair(i)[1]].contains[0].hp = fighting[setPair(i)[1]].contains[0].stats[0];
                document.getElementById("H" + fighting[setPair(i)[0]].prefix).style.width = "70px";
                document.getElementById("T" + fighting[setPair(i)[0]].prefix).style.width = "00px";
                document.getElementById("H" + fighting[setPair(i)[0]].prefix).style.backgroundColor = "green";
            }
        }

        if(fighting[setPair(i)[0]].contains.length == 1 && fighting[setPair(i)[1]].contains.length == 1){
            document.getElementById("dead" + Math.ceil((i + 1) / 2)).style.opacity = fighting[setPair(i)[0]].contains[0].dead() - .2;
            if(fighting[setPair(i)[0]].contains[0].hp <= 0){
                document.getElementById("dead" + Math.ceil((i + 1) / 2)).style.pointerEvents = "auto";
                document.getElementById("POKE" + fighting[setPair(i)[0]].prefix + " 1").childNodes[0].style.transform = "scale(1,-1)";
            } else {
                document.getElementById("dead" + Math.ceil((i + 1) / 2)).style.pointerEvents = "none"
            }
        }
        
        if(typeof(fighting[i].contains[0]) == "object" && fighting[i].contains[0].id != undefined){
            document.getElementById("H" + fighting[i].prefix).style.width = Math.max(70 * (fighting[i].contains[0].hp / fighting[i].contains[0].stats[0]), 0) + "px";
            document.getElementById("T" + fighting[i].prefix).style.width = Math.max(70 * (Math.min(100, (fighting[i].contains[0].tCharge)) / 100), 0) + "px";
            if(fighting[i].contains[0].hp / fighting[i].contains[0].stats[0] > .5){
                document.getElementById("H" + fighting[i].prefix).style.backgroundColor = "green";
            } else if (fighting[i].contains[0].hp / fighting[i].contains[0].stats[0] > .2){
                document.getElementById("H" + fighting[i].prefix).style.backgroundColor = "yellow";
            } else {
                document.getElementById("H" + fighting[i].prefix).style.backgroundColor = "red";
            }
            document.getElementById("H" + fighting[i].prefix).style.borderTopRightRadius = Math.min(3, Math.max(0, 2 * (fighting[i].contains[0].hp - (.9 * fighting[i].contains[0].stats[0])))) + "px";
            document.getElementById("T" + fighting[i].prefix).style.borderTopLeftRadius = Math.min(3, Math.max(0, 2 * (fighting[i].contains[0].tCharge - (50)))) + "px";

            document.getElementById("nick" + toPlace(i + 1,2)).innerHTML = fighting[i].contains[0].nick;
            document.getElementById("level" + toPlace(i + 1,2)).innerHTML = " LVL. " + fighting[i].contains[0].level;
        }
    }

    if(shakeOn){
        scale = scale + 7;
        $('#shake').css('transform', 'scale(' + (.15 + Math.abs(.5 - (scale / 100))) + ')')
        document.getElementById("shake").style.opacity = 2 - (scale / 100);
    
        $('#shakeBehind').css('transform', 'scale(' + (.15 + Math.abs(.5 - (scale / 100))) / 1.35 + ')')
        document.getElementById("shakeBehind").style.opacity = 3 - (scale / 100);
    
        if(scale > 301){
            document.getElementById("shake").style.display = "none";
            holder.add(recent);
            shakeOn = false;
            if((document.getElementById("POKE" + "H " + (holder.contains.length))) != null){
                document.getElementById("POKE" + "H " + (holder.contains.length)).style.display = "inline";
            }
            document.getElementById("shakeBehind").style.display = "none";
            saveGame();
        }
    }
}

setInterval(function(){
    renderAll();
}, 25)