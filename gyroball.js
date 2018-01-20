var maxXHex = 35;
var maxYHex = 41;
var testRed = [7,5];

var notMapMess = true;
var treasuresCollected = [];
var treasuresCol = [];
var treasures = [];
var cols = [];

var itemSlots = 3;
var itemCols = 10;

var allSeen = false;

var messages = [];
var messageClosed = false;
var messageSkip = false;
messages.push("Welcome to Cybercrawl/This is a Roguelike game made by Lennongrad/Start/1");
messages.push("How To Play/Click on green hexagons to move. For now, just collect Treasure/OK/1");
var messageX = "50px";

var invOn = true;

var scale = 1;
document.getElementById("hexTable").style.transform = "scale(" + scale + ", " + scale + ")";


window.onload = function() {

	var sq = {};
	sq.e = document.getElementById("hexTable");
	if (sq.e.naturalWidth) {
		sq.nw = sq.e.naturalWidth;
	}
	sq.zoom = 30;
	
	if (sq.e.addEventListener) {
		sq.e.addEventListener("mousewheel", MouseWheelHandler, false);
		sq.e.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	else sq.e.attachEvent("onmousewheel", MouseWheelHandler);
	
	function MouseWheelHandler(e) {
		// cross-browser wheel delta
		var e = window.event || e;
        scale += -1 * (e.deltaY/ 6000);
        document.getElementById("hexTable").style.transform = "scale(" + scale + ", " + scale + ")";

		return false;
	}

}

var curYPos, curXPos, curDown, down, downTr, notDownFor;
down = "";
downTr = 0;
notDownFor = 0;

window.addEventListener('mousemove', function (e) {
    if (curDown) {
        notDownFor = Math.min(notDownFor, 10);
        notDownFor--;
        switch(down){
            case "trea": document.getElementById("treasures" + downTr).style.left = e.clientX - 25 + "px"; document.getElementById("treasures" + downTr).style.top = e.clientY - 25 + "px"; break;
            case "msg": document.getElementById("boxholder").style.left = e.clientX - 150 + "px"; document.getElementById("boxholder").style.top = e.clientY - 8 + "px"; break;
            case "inv": document.getElementById("inventory").style.left = e.clientX - 150 + "px"; document.getElementById("inventory").style.top = e.clientY - 8 + "px"; break;
            case "scrn": window.scrollTo(scrollX - e.movementX, scrollY - e.movementY); break;
            default: break;
        }
    } else {
        notDownFor++;
    }

    if(down != "trea"){
        for(var i = 0; i < treasuresCollected.length; i++){
            if(treasuresCol[treasuresCollected[i]] < firstItemSlot){
                document.getElementById("treasures" + treasuresCollected[i]).style.left = $("#col" + treasuresCol[treasuresCollected[i]]).position().left + $("#inventory").position().left + "px"; 
                document.getElementById("treasures" + treasuresCollected[i]).style.top = $("#col" + treasuresCol[treasuresCollected[i]]).position().top + $("#inventory").position().top + "px";
            } else {
                document.getElementById("treasures" + treasuresCollected[i]).style.left = $("#col" + treasuresCol[treasuresCollected[i]]).position().left + "px"; 
                document.getElementById("treasures" + treasuresCollected[i]).style.top = $("#col" + treasuresCol[treasuresCollected[i]]).position().top + "px";
            }
        }
    }
});

window.addEventListener('mouseup', function (e) {
    down = "";

    if(downTr != 0){
        for(var i = 0; i < cols.length; i++){
            if(collision($("#col" + i),$("#treasures" + downTr)) && cols[i] == 0){
                cols[treasuresCol[downTr]] = 0;
                treasuresCol[downTr] = i;
                cols[i] = downTr;
            }
        }
    }

    units[0][0].getAtk();
    units[0][0].getDef();
    units[0][0].getSpd();
    units[0][0].getSec();
})

window.addEventListener('mousedown', function (e) {
    curYPos = e.screenY;
    curXPos = e.screenX;
    curDown = true;
    
    if(down != "trea") down = "scrn";
});

document.getElementById("boxholder").addEventListener('mouseover', function (e) {
    down = "msg";
});

document.getElementById("inventory").addEventListener('mouseover', function (e) {
    down = "inv";
});

window.addEventListener('mouseup', function (e) {
    curDown = false;
});

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 13) {
        closeBox();
    } else   if (event.keyCode == 17) {
        allSeen = !allSeen;
    }
})

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

var setMessage = function(){
    if(messages.length == 0) return;
    var message = messages.shift();
    message = message.split("/");
    
    document.getElementById("boxTop").innerHTML = message[0];
    document.getElementById("boxText").innerHTML = message[1];
    document.getElementById("boxOK").innerHTML = message[2];

    messageSkip = ("1" == message[3]);

    document.getElementById("boxholder").style.left = messageX;
}

var closeBox = function(){
    if(!(document.getElementById("boxholder").style.left == "-500px")) messageX = document.getElementById("boxholder").style.left;
    document.getElementById("boxholder").style.left = "-500px";

    if(messages.length > 0){
        setMessage();
    } else {
        messageClosed = true;
    }
}

setMessage();

var invSet = function(toBe){
    if(toBe == 'toggle'){
        invOn = !invOn;
    } else {
        invOn = toBe;
    }

    if(invOn){
        document.getElementById("inventory").style.display = "block";
        for(var i = 0; i < firstItemSlot; i++){
            document.getElementById("treasures" + cols[i]).style.display = "block";
        }
    } else {
        document.getElementById("inventory").style.display = "none";
        for(var i = 0; i < firstItemSlot; i++){
            document.getElementById("treasures" + cols[i]).style.display = "none";
        }
    }
}

invSet(true);

var firstItemSlot = document.getElementsByClassName("col").length;

for(var i = 0; i < firstItemSlot; i++){
    cols[i] = 0;
}

for(var i = 0; i < itemSlots; i++){
    itemCols++;
    cols[firstItemSlot + i] = 0;

    var iC = document.createElement("div");
    iC.className = "col";
    iC.id = "col" + (firstItemSlot + i);
    iC.style.left = (20 + 70 * i) + "px";
    iC.style.bottom = "10px";

    document.body.appendChild(iC);
}

function Unit(pos, spr, ide){

    // positioning
    this.position = [];
    this.position[0] = pos[0];
    this.position[1] = pos[1];
    this.sprite = spr;
    this.target = 0;
    this.spd = 2;
    this.id = ide;

    // battle
    this.maxHP = 10;
    this.HP = this.maxHP;
    this.baseAtk = Math.ceil(Math.random() * 3);
    this.baseDef = Math.ceil(Math.random() * 3);
    this.baseSpd = Math.ceil(Math.random() * 3);
    this.baseSec = Math.ceil(Math.random() * 3);

    this.getPos = function(){
        return [21 +  ((this.position[1] % 2 * -50) + (this.position[0] * 52 * 2)), 23 +  (this.position[1] * 88)];
    }

    this.mov = function(){
        var p = this.position;
        var hX = units[0][this.target].position[0] > p[0];
        var hY = units[0][this.target].position[1] > p[1];
        var moved = 0;
        var newPos = [];

        if(Math.random() > .9) hX = !hX;
        if(Math.random() > .9) hY = !hY;

        if(p[1] % 2 == 0){
            if(hY && hX && moved >= 0 && coordinates[p[0]+1][p[1]+1].type != 1){newPos = [p[0]+1, p[1]+1]; moved--}   ;
            if(hX && !hY && moved >= 0 && coordinates[p[0]+1][p[1]-1].type != 1){newPos = [p[0]+1,p[1]-1]; moved--} ;
            if(hY && moved >= 0 && coordinates[p[0]][p[1]+1].type != 1){newPos = [p[0],p[1]+1]; moved--}   ;
            if(!hY && moved >= 0 && coordinates[p[0]][p[1]-1].type != 1){newPos = [p[0],p[1]-1]; moved--} ;
        } else {
            if(!hX && !hY && moved >= 0 && coordinates[p[0]-1][p[1]-1].type != 1){newPos = [p[0]-1,p[1]-1]; moved--} ;
            if(!hX && hY && moved >= 0 && coordinates[p[0]-1][p[1]+1].type != 1){newPos = [p[0]-1,p[1]+1]; moved--}   ;
            if(hY && moved >= 0 && coordinates[p[0]][p[1]+1].type != 1){newPos = [p[0],p[1]+1]; moved--}   ;
            if(!hY && moved >= 0 && coordinates[p[0]][p[1]-1].type != 1){newPos = [p[0],p[1]-1]; moved--} ;
        }
        if(hX && moved >= 0 && coordinates[p[0]+1][p[1]].type != 1){newPos = [p[0]+1,p[1]]; moved--}   ;
        if(hY && moved >= 0 && coordinates[p[0]-1][p[1]].type != 1){newPos = [p[0]-1,p[1]]; moved--}   ;

        if(newPos[0] <= 0 || newPos[0] >= maxXHex || newPos[1] >= maxYHex || newPos[1] <= 0){
            return;
        }

        if(coordinates[newPos[0]][newPos[1]] === undefined){
            return
        }
        
        if(coordinates[newPos[0]][newPos[1]].unitOn){
            this.battle([coordinates[newPos[0]][newPos[1]].unit[0],coordinates[newPos[0]][newPos[1]].unit[1]]);
        } else {
            this.position = newPos;
        }
    }

    this.battle = function(targ){
        var first = targ[0];
        var second = targ[1];
        var receive = Math.min(this.getDef() - units[first][second].getAtk(), 0);
        var give = Math.min(units[first][second].getDef() - this.getAtk(), 0);

        units[first][second].HP += give;
        this.HP += receive;

        if(units[first][second].HP < 1){
            units[first][second] = new Unit([20,20], "enemyFighter.gif", [first,second])
        }
    }

    this.getAtk = function(){
        this.addedAtk = 0;
        if(this.id[0] == 0 && this.id[1] == 0){
            var numbEq = 0;
            if(cols[0] != 0) numbEq = 1;
            this.addedAtk = (String(cols[0]).match(/1/g) || []).length + (numbEq * 1);
            document.getElementById("atkBonus").innerHTML = this.addedAtk;
            document.getElementById("atkSet").innerHTML = this.baseAtk + this.addedAtk;
        }
        return this.baseAtk + this.addedAtk;
    }

    this.getDef = function(){
        this.addedDef = 0;
        if(this.id[0] == 0 && this.id[1] == 0){
            var numbEq = 0;
            if(cols[1] != 0) numbEq = 1;
            this.addedDef = (String(cols[1]).match(/2/g) || []).length + (numbEq * 1);
            document.getElementById("defBonus").innerHTML = this.addedDef;
            document.getElementById("defSet").innerHTML = this.baseDef + this.addedDef;
        }
        return this.baseDef + this.addedDef;
    }

    this.getSpd = function(){
        this.addedSpd = 0;
        if(this.id[0] == 0 && this.id[1] == 0){
            var numbEq = 0;
            if(cols[2] != 0) numbEq = 1;
            this.addedSpd = (String(cols[2]).match(/3/g) || []).length + (numbEq * 1);
            document.getElementById("spdBonus").innerHTML = this.addedSpd;
            document.getElementById("spdSet").innerHTML = this.baseSpd + this.addedSpd;
        }
        return this.baseSpd + this.addedSpd;
    }

    this.getSec = function(){
        this.addedSec = 0;
        if(this.id[0] == 0 && this.id[1] == 0){
            var numbEq = 0;
            if(cols[3] != 0) numbEq = 1;
            this.addedSec = (String(cols[3]).match(/4/g) || []).length + (numbEq * 1);
            document.getElementById("secBonus").innerHTML = this.addedSec;
            document.getElementById("secSet").innerHTML = this.baseSec + this.addedSec;
        }
        return this.baseSec + this.addedSec;
    }
}

var units = [];
units[0] = [];
units[1] = [];
units[0][0] = new Unit([7,5], "beanFighter.gif", [0,0])
units[1][0] = new Unit([11,5], "enemyFighter.gif", [1,0])

function Tile(pos, ide){
    this.position = [];
    this.id = ide;
    this.position[0] = pos[0];
    this.position[1] = pos[1];
    this.uncovered = false;
    this.seen = false;
    this.type = 0;
    this.unitOn = false;
    this.unit = [0,0];
    this.sprite = "beanFighter.gif";
    this.passable = true;
    this.canStep = false;
    this.treasure = 0;
    this.hasNotified = false;
    this.isEnemy = false;
    this.attackable = false;

    this.update = function(){
        if(this.seen) this.uncovered = true;
        this.seen = false;
        this.canStep = false;
        this.unitOn = false;
        this.isEnemy = false;
        this.passable = true;
        this.sprite = "";
        this.attackable = false;

        if(this.treasure != 0){
            this.sprite = "treasures\\" + 0 + ".png";
        }

        var tempIDE = [0,0];

        for(var i = 0; i < units[0].length; i++){
            if(parseInt(units[0][i].position[0]) == parseInt(this.position[0]) && parseInt(units[0][i].position[1]) == parseInt(this.position[1])){
                this.unitOn = true;
                this.unit = [0,i];
                this.uncovered = true;
                this.type = 0;
                this.sprite = units[0][i].sprite;  
                tempIDE = [0,i];
            }
        }

        for(var i = 0; i < units[1].length; i++){
            if(parseInt(units[1][i].position[0]) == parseInt(this.position[0]) && parseInt(units[1][i].position[1]) == parseInt(this.position[1])){
                this.unitOn = true;
                this.unit = [1,i];
                this.type = 0;
                this.isEnemy = true;
                this.sprite = units[1][i].sprite;  
                tempIDE = [1,i];
            }
        }

        if(this.type != 0) {
            this.passable = false;
            this.treasure = 0;
        }

        if(this.unitOn || this.treasure != 0){
            var uni = document.createElement("IMG");
            uni.className = "unit";
            uni.style.left = 21 +  ((this.position[1] % 2 * -50) + (this.position[0] * 52 * 2)) + "px";
            uni.style.top = 13 +  (this.position[1] * 88) + "px";
            uni.draggable = false;
            uni.src = this.sprite;    
            uni.id = "unit" + this.id;
            uni.style.display = "none";

            var bar = document.createElement("div");
            bar.className = "bar";
            bar.style.left = 21 +  ((this.position[1] % 2 * -50) + (this.position[0] * 52 * 2)) + "px";
            bar.style.top = 85 +  (this.position[1] * 88) + "px";
            bar.draggable = false;
            bar.id = "bar" + this.id;
            bar.style.width = ((units[tempIDE[0]][tempIDE[1]].HP / units[tempIDE[0]][tempIDE[1]].maxHP) * 64) + "px";
            bar.style.display = "none";
            document.getElementById("hexTable").appendChild(bar);
            
            document.getElementById("hexTable").appendChild(uni);
        }

        if(this.isEnemy) this.passable = false;
    }
}

var coordinates = [];
var rep = 0;
for (var x = 0; x < maxXHex; x++){
    coordinates[x] = [];
    for (var y = 0; y < maxYHex; y++){
        coordinates[x][y] = new Tile([x,y], rep);
        rep++;
        if(Math.random() > .9){
            coordinates[x][y].type = 1;
        } 
    }
}

for(var x = 0; x < maxXHex; x++){
    for(var y = 0; y < maxYHex; y++){
        var hex = document.createElement("IMG");
        hex.className = "hex";
        hex.style.marginLeft = ((y % 2 * -50) + (x * 52 * 2)) + "px";
        hex.style.marginTop = (y * 88) + "px";
        hex.draggable = false;
        hex.id = "hex" + x + "_" + y;
        hex.src = "hexGrey.png"    
        
        var hexback = document.createElement("IMG");
        hexback.className = "hexback";
        hexback.style.marginLeft = ((y % 2 * -50) + (x * 52 * 2)) + "px";
        hexback.style.marginTop = (y * 88) + "px";
        hexback.draggable = false;
        hexback.src = "frontBlack.png"   
        hexback.id = "hexback" + x + "_" + y; 
        
        hex.onclick = function () {
            var coordHere = this.id.substring(3).split("_");
            if(coordinates[parseInt(coordHere[0])][parseInt(coordHere[1])].canStep && !(notDownFor <= 2)){
                units[0][0].position[0] = parseInt(coordHere[0]);
                units[0][0].position[1] = parseInt(coordHere[1]);
                coordinates[units[0][0].position[0]][units[0][0].position[1]].unitOn = true;
                coordinates[units[0][0].position[0]][units[0][0].position[1]].unit = [0,0];
                doMov();
                coordinates[units[0][0].position[0]][units[0][0].position[1]].update();
            } else if(!(notDownFor <= 2) && coordinates[coordHere[0]][coordHere[1]].attackable){
                units[0][0].battle([coordinates[parseInt(coordHere[0])][parseInt(coordHere[1])].unit[0],coordinates[parseInt(coordHere[0])][parseInt(coordHere[1])].unit[1]]);
                doMov();
            }
        }
        document.getElementById("hexTable").appendChild(hex);
        document.getElementById("hexTable").appendChild(hexback);
    }
}

//directions = dr, dl, ur, ul, r, l
var getHex = function(hewwo, direction){
    var newxy = hewwo;

    switch(direction){
        case "dr": newxy[0]++; newxy[1]--; break;
        case "dl":  newxy[1]--; break;
        case "ur": newxy[0]++; newxy[1]++; break;
        case "ul":  newxy[1]++; break;
        case "r": newxy[0]++; break;
        case "l": newxy[0]--;
    }

    if(newxy[0] < 0){ newxy[0] = 0};
    if(newxy[1] < 0){ newxy[1] = 0};
    
    return newxy;
}

var getSur = function(pos){
    var p = pos;
    var tot = 0;

    if(p[1] % 2 == 0){
        if(coordinates[p[0]][p[1]-1].type == 1) tot++;
        if(coordinates[p[0]+1][p[1]+1].type == 1)   tot++;
        if(coordinates[p[0]+1][p[1]-1].type == 1) tot++;
        if(coordinates[p[0]][p[1]+1].type == 1)   tot++;
    } else {
        if(coordinates[p[0]-1][p[1]-1].type == 1) tot++;
        if(coordinates[p[0]][p[1]+1].type == 1)   tot++;
        if(coordinates[p[0]][p[1]-1].type == 1) tot++;
        if(coordinates[p[0]-1][p[1]+1].type == 1)   tot++;
    }
    if(coordinates[p[0]+1][p[1]].type == 1)   tot++;
    if(coordinates[p[0]-1][p[1]].type == 1)   tot++;

    return tot;
}

var getSticky = function(pos){
    var p = pos;
    var tot = 0;

    if(p[1] % 2 == 0){
        if(coordinates[p[0]][p[1]-1].isEnemy) tot++;
        if(coordinates[p[0]+1][p[1]+1].isEnemy)   tot++;
        if(coordinates[p[0]+1][p[1]-1].isEnemy) tot++;
        if(coordinates[p[0]][p[1]+1].isEnemy)   tot++;
    } else {
        if(coordinates[p[0]-1][p[1]-1].isEnemy) tot++;
        if(coordinates[p[0]][p[1]+1].isEnemy)   tot++;
        if(coordinates[p[0]][p[1]-1].isEnemy) tot++;
        if(coordinates[p[0]-1][p[1]+1].isEnemy)   tot++;
    }
    if(coordinates[p[0]+1][p[1]].isEnemy)   tot++;
    if(coordinates[p[0]-1][p[1]].isEnemy)   tot++;

    return tot;
}


var getMov = function(current, rec, type, first){
    if(rec == -1) return;

    var goXY = [];
    goXY[0] = current[0];
    goXY[1] = current[1];
    
    switch(type){
        case 0: coordinates[goXY[0]][goXY[1]].seen = true; break;
        case 1: coordinates[goXY[0]][goXY[1]].canStep = true; break;
    }

    rec--;
    if(getSticky(goXY) > 0 && type == 1 && !first){
        rec = -1;
    }

    if(goXY[1] % 2 == 0){
        if(coordinates[goXY[0]][goXY[1] - 1].passable){getMov([goXY[0],goXY[1] - 1], rec, type, false )} else {coordinates[goXY[0]][goXY[1] - 1].seen = true};
        if(coordinates[goXY[0] + 1][goXY[1] + 1].passable){getMov([goXY[0] + 1,goXY[1] + 1], rec, type, false)} else {coordinates[goXY[0] + 1][goXY[1] + 1].seen = true};
        if(coordinates[goXY[0] + 1][goXY[1] - 1].passable){getMov([goXY[0] + 1,goXY[1] - 1], rec, type, false)} else {coordinates[goXY[0] + 1][goXY[1] - 1].seen = true};
        if(coordinates[goXY[0]][goXY[1] + 1].passable){getMov([goXY[0],goXY[1] + 1], rec, type, false)} else {coordinates[goXY[0]][goXY[1] + 1].seen = true};
    } else {
        if(coordinates[goXY[0] - 1][goXY[1] - 1].passable){getMov([goXY[0] - 1,goXY[1] - 1], rec, type, false )} else {coordinates[goXY[0] - 1][goXY[1] - 1].seen = true};
        if(coordinates[goXY[0]][goXY[1] + 1].passable){getMov([goXY[0],goXY[1] + 1], rec, type, false)} else {coordinates[goXY[0]][goXY[1] + 1].seen = true};
        if(coordinates[goXY[0]][goXY[1] - 1].passable){getMov([goXY[0],goXY[1] - 1], rec, type, false)} else {coordinates[goXY[0]][goXY[1] - 1].seen = true};
        if(coordinates[goXY[0] - 1][goXY[1] + 1].passable){getMov([goXY[0] - 1,goXY[1] + 1], rec, type, false)} else {coordinates[goXY[0] - 1][goXY[1] + 1].seen = true};
    }

    if(coordinates[goXY[0] + 1][goXY[1]].passable){getMov([goXY[0] + 1,goXY[1]], rec, type, false)} else {coordinates[goXY[0] + 1][goXY[1]].seen = true};
    if(coordinates[goXY[0] - 1][goXY[1]].passable){getMov([goXY[0] - 1,goXY[1]], rec, type, false)} else {coordinates[goXY[0] - 1][goXY[1]].seen = true};
}


var getRange = function(current, rec){
    if(rec == -1) return;

    var goXY = [];
    goXY[0] = current[0];
    goXY[1] = current[1];
    
    if(coordinates[goXY[0]][goXY[1]].isEnemy){
        coordinates[goXY[0]][goXY[1]].attackable = true;
    }

    rec--;

    if(goXY[1] % 2 == 0){
        if(coordinates[goXY[0]][goXY[1] - 1].type != 1){getRange([goXY[0],goXY[1] - 1], rec  )}
        if(coordinates[goXY[0] + 1][goXY[1] + 1].type != 1){getRange([goXY[0] + 1,goXY[1] + 1], rec )}
        if(coordinates[goXY[0] + 1][goXY[1] - 1].type != 1){getRange([goXY[0] + 1,goXY[1] - 1], rec )} 
        if(coordinates[goXY[0]][goXY[1] + 1].type != 1){getRange([goXY[0],goXY[1] + 1], rec )} 
    } else {
        if(coordinates[goXY[0] - 1][goXY[1] - 1].type != 1){getRange([goXY[0] - 1,goXY[1] - 1], rec  )} 
        if(coordinates[goXY[0]][goXY[1] + 1].type != 1){getRange([goXY[0],goXY[1] + 1], rec )}
        if(coordinates[goXY[0]][goXY[1] - 1].type != 1){getRange([goXY[0],goXY[1] - 1], rec )} 
        if(coordinates[goXY[0] - 1][goXY[1] + 1].type != 1){getRange([goXY[0] - 1,goXY[1] + 1], rec )} 
    }

    if(coordinates[goXY[0] + 1][goXY[1]].type != 1){getRange([goXY[0] + 1,goXY[1]], rec )} 
    if(coordinates[goXY[0] - 1][goXY[1]].type != 1){getRange([goXY[0] - 1,goXY[1]], rec )} 
}

var genMove = function(pos){
    var curPos = [];
    curPos[0] = pos[0];
    curPos[1] = pos[1];

    coordinates[curPos[0]][curPos[1]].type = 1;

    if(curPos[0] == 0 || curPos[1] == 0 || curPos[0] == maxXHex - 1 || curPos[1] == maxYHex - 1){ return;}

    if(curPos[1] % 2 == 0){
        if(coordinates[curPos[0]][curPos[1] - 1].passable && Math.random() > .98){genMove([curPos[0],curPos[1] - 1])}
        if(coordinates[curPos[0] + 1][curPos[1] + 1].passable && Math.random() > .98){genMove([curPos[0] + 1,curPos[1] + 1])}
        if(coordinates[curPos[0] + 1][curPos[1] - 1].passable && Math.random() > .98){genMove([curPos[0] + 1,curPos[1] - 1])}
        if(coordinates[curPos[0]][curPos[1] + 1].passable && Math.random() > .98){genMove([curPos[0],curPos[1] + 1])}
    } else {
        if(coordinates[curPos[0] - 1][curPos[1] - 1].passable && Math.random() > .98){genMove([curPos[0] - 1,curPos[1] - 1] )}
        if(coordinates[curPos[0]][curPos[1] + 1].passable && Math.random() > .98){genMove([curPos[0],curPos[1] + 1])}
        if(coordinates[curPos[0]][curPos[1] - 1].passable && Math.random() > .98){genMove([curPos[0],curPos[1] - 1])}
        if(coordinates[curPos[0] - 1][curPos[1] + 1].passable && Math.random() > .98){genMove([curPos[0] - 1,curPos[1] + 1])}
    }

    if(coordinates[curPos[0] + 1][curPos[1]].passable && Math.random() > .98){genMove([curPos[0] + 1,curPos[1]])}
    if(coordinates[curPos[0] - 1][curPos[1]].passable && Math.random() > .98){genMove([curPos[0] - 1,curPos[1]])}
}

var goToMain = function(){
    scrollTo(units[0][0].getPos()[0], units[0][0].getPos()[1] + 300)
}

coordinates[6][6].type = 1;
coordinates[7][6].type = 1;
coordinates[6][5].type = 1;
coordinates[6][4].type = 1;
coordinates[7][4].type = 1;
for(var x = 0; x < maxXHex; x++){
    for(var y = 0; y < maxYHex; y++){
        if(x == maxXHex - 1 || y == maxYHex - 1 || x == 0 || y == 0){
            coordinates[x][y].type = 1;
            coordinates[x][y].uncovered = true;
        }
        if(Math.random() > .9){
            genMove([x,y])
        }
    }
}

for (var x = 0; x < maxXHex; x++){
    for (var y = 0; y < maxYHex; y++){
        if(Math.random() > .99){
            do{var tempTr = Math.ceil(Math.random() * 94)}while(treasures.includes(tempTr));
            treasures.push(tempTr);
            coordinates[x][y].treasure = tempTr;
        }
    }
}

var treaCol = function(trc){
    messages.push("New Item/You've collected a new Item! (" + trc + ")/OK/1")

    var trea = document.createElement("IMG");
    trea.draggable = false;
    trea.src = "treasures\\" + trc + ".png";
    trea.className = "treasure";
    trea.id = "treasures" + trc;

    trea.style.bottom =  "20px";
    trea.style.left =  "20px";

    trea.addEventListener('mouseover', function (e) {
        var idec = this.src.substring(69);
        idec = parseInt(idec.split(".")[0]);

        downTr = idec;
        down = "trea";
    });

    var cont = true;
    for(var i = firstItemSlot; cont && i < firstItemSlot + itemSlots; i++){
        if(cols[i] == 0){
            cols[i] = trc;
            treasuresCol[trc] = i;
            cont = false;
        }
    }
    
    document.body.appendChild(trea);

    treasuresCollected.push(trc);
    treasuresCol.push(trc);

    $("#treasures" + trc).dblclick(function (e) {
        var idec = this.src.substring(69);
        idec = parseInt(idec.split(".")[0]);

        var tC = treasuresCol[idec];
        var cont = true;
        var adder = 0;
        if(tC < firstItemSlot) adder = firstItemSlot;

        for(var i = adder; i < cols.length && cont; i++){
            if(cols[i] == 0){
                cols[i] = idec;
                treasuresCol[idec] = i;
                cols[tC] = 0;
                cont = false;
            }
        }
        units[0][0].getAtk();
        units[0][0].getDef();
        units[0][0].getSpd();
        units[0][0].getSec();
        down = "";
    });
}

treaCol(11);
treaCol(22);
treaCol(33);
units[0][0].getAtk();
units[0][0].getDef();
units[0][0].getSpd();
units[0][0].getSec();

/*coordinates[testRed[0]][testRed[1]] = 1;
coordinates[getHex([testRed[0], testRed[1]], "dr")[0]][getHex([testRed[0], testRed[1]], "dr")[1]] = 2; 
coordinates[getHex([testRed[0], testRed[1]], "dl")[0]][getHex([testRed[0], testRed[1]], "dl")[1]] = 2;
coordinates[getHex([testRed[0], testRed[1]], "ur")[0]][getHex([testRed[0], testRed[1]], "ur")[1]] = 2;
coordinates[getHex([testRed[0], testRed[1]], "ul")[0]][getHex([testRed[0], testRed[1]], "ul")[1]] = 2;
coordinates[getHex([testRed[0], testRed[1]], "r")[0]][getHex([testRed[0], testRed[1]], "r")[1]] = 2;
coordinates[getHex([testRed[0], testRed[1]], "l")[0]][getHex([testRed[0], testRed[1]], "l")[1]] = 2;*/

var turnCount = 0;

var doMov = function(){
    turnCount++;
    document.getElementById("turnCount").innerHTML = turnCount;

    if(getSur(units[0][0].position) == 6){
        coordinates[units[0][0].position[0] + 1][units[0][0].position[1]].type = 0;
    }

    $(".unit").remove();
    $(".bar").remove();
    
    var isEmpty = false;
    for(var i = firstItemSlot; i < firstItemSlot + itemSlots; i++){
        if(cols[i] == 0){
            isEmpty = true;
        }
    }

    if(coordinates[units[0][0].position[0]][units[0][0].position[1]].treasure != 0 && isEmpty){
        var trCol = coordinates[units[0][0].position[0]][units[0][0].position[1]].treasure;
        coordinates[units[0][0].position[0]][units[0][0].position[1]].treasure = 0;
        treaCol(trCol);
    } else if(coordinates[units[0][0].position[0]][units[0][0].position[1]].treasure != 0){
        messages.push("Oops!/You're out of empty slots!!/Oh/1")
    }
    for(var i = 0; i < units[1].length; i++){
        units[1][i].mov();
    }

    for(var x = 0; x < maxXHex; x++){
        for(var y = 0; y < maxYHex; y++){
            coordinates[x][y].update();
        }
    }
    

    getMov([units[0][0].position[0], units[0][0].position[1]], 2, 1, true);
    getMov([units[0][0].position[0], units[0][0].position[1]], 4, 0, true);
    getMov([units[0][0].position[0], units[0][0].position[1]], 4, 0, true);
    getRange([units[0][0].position[0], units[0][0].position[1]], 1);

    
    rep = 0;
    var uncTotal = 0;

    for(var x = 0; x < maxXHex; x++){
        for(var y = 0; y < maxYHex; y++){
            if(allSeen) coordinates[x][y].uncovered = true;
            document.getElementById("hex" + x + "_" + y).src = "backWall.png";
            if(coordinates[x][y].uncovered){
                uncTotal++;
                document.getElementById("hex" + x + "_" + y).src = "backUncovered.png";
                if(coordinates[x][y].treasure != 0 || (coordinates[x][y].unitOn && (coordinates[x][y].seen || !coordinates[x][y].isEnemy))){
                    document.getElementById("unit" + rep).style.display = "block";
                }
                if((coordinates[x][y].unitOn && (coordinates[x][y].seen || !coordinates[x][y].isEnemy))){
                    document.getElementById("bar" + rep).style.display = "block";
                }
            }
            if(coordinates[x][y].type == 1 && coordinates[x][y].uncovered){
                document.getElementById("hex" + x + "_" + y).src = "backBlack.png";
            }
            if(coordinates[x][y].seen && coordinates[x][y].type == 0){
                document.getElementById("hex" + x + "_" + y).src = "backSeen.png";
            }
            if(coordinates[x][y].canStep){
                document.getElementById("hex" + x + "_" + y).src = "backBlue.png";
            }
            if(coordinates[x][y].isEnemy && coordinates[x][y].seen){
                document.getElementById("hex" + x + "_" + y).src = "hexRed.png";
            }
            if(coordinates[x][y].attackable){
                document.getElementById("hexback" + x + "_" + y).src = "frontRed.png";
                document.getElementById("hexback" + x + "_" + y).style.zIndex = 3;
            } else {
                document.getElementById("hexback" + x + "_" + y).src = "frontBlack.png";
                document.getElementById("hexback" + x + "_" + y).style.zIndex = 2;
            }
            rep++;
        }
    }

    if(uncTotal / rep > .98 && notMapMess){notMapMess = false; messages.push("Congratulations/You've uncovered most of the map! Probably!/Fine/1")};

    if(document.getElementById("boxholder").style.left == "-500px") messageClosed = true;
    if(messageClosed) setMessage();
}
doMov();
doMov();
turnCount--;
goToMain();