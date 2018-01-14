var maxXHex = 35;
var maxYHex = 41;
var testRed = [7,5];

var notMapMess = true;
var treasuresCollected = [];
var treasures = [];

var allSeen = false;

var messages = [];
var messageClosed = false;
var messageSkip = false;
messages.push("Welcome to Cybercrawl/This is a Rougelike game made by Lennongrad/Start/1");
messages.push("How To Play/Click on green hexagons to move. For now, just collect Treasure/OK/1");
var messageX = "50px";

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
    if(!document.getElementById("boxholder").style.left == "-500px") messageX = document.getElementById("boxholder").style.left;
    document.getElementById("boxholder").style.left = "-500px";

    if(messages.length > 0){
        setMessage();
    } else {
        messageClosed = true;
    }
}

setMessage();

var curYPos, curXPos, curDown;
window.addEventListener('mousemove', function (e) {
    if (curDown) {
        if($('#boxholder').is(":hover") && !$('#boxOK').is(":hover")){
            document.getElementById("boxholder").style.left = e.clientX - 150 + "px";
            document.getElementById("boxholder").style.top = e.clientY - 50 + "px";
        } else if(!$('#boxOK').is(":hover")){
            window.scrollTo(scrollX - e.movementX, scrollY - e.movementY);
        }
    }
});

window.addEventListener('mousedown', function (e) {
    curYPos = e.screenY;
    curXPos = e.screenX;
    curDown = true;
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

function Unit(pos, spr){
    this.position = [];
    this.position[0] = pos[0];
    this.position[1] = pos[1];
    this.sprite = spr;
    this.target = 0;
    this.spd = 2;

    this.getPos = function(){
        return [21 +  ((this.position[1] % 2 * -50) + (this.position[0] * 52 * 2)), 23 +  (this.position[1] * 88)];
    }

    this.mov = function(){
        if(!coordinates[this.position[0]][this.position[1]].seen){return}
        var p = this.position;
        var hX = units[0][this.target].position[0] > p[0];
        var hY = units[0][this.target].position[1] > p[1];
        var moved = this.spd;

        if(Math.random() > .9) hX = !hX;
        if(Math.random() > .9) hY = !hY;

        if(p[1] % 2 == 0){
            if(hY && hX && moved >= 0 && coordinates[p[0]+1][p[1]+1].type != 1){this.position = [p[0]+1, p[1]+1]; moved--}   ;
            if(hX && !hY && moved >= 0 && coordinates[p[0]+1][p[1]-1].type != 1){this.position = [p[0]+1,p[1]-1]; moved--} ;
            if(hY && moved >= 0 && coordinates[p[0]][p[1]+1].type != 1){this.position = [p[0],p[1]+1]; moved--}   ;
            if(!hY && moved >= 0 && coordinates[p[0]][p[1]-1].type != 1){this.position = [p[0],p[1]-1]; moved--} ;
        } else {
            if(!hX && !hY && moved >= 0 && coordinates[p[0]-1][p[1]-1].type != 1){this.position = [p[0]-1,p[1]-1]; moved--} ;
            if(!hX && hY && moved >= 0 && coordinates[p[0]-1][p[1]+1].type != 1){this.position = [p[0]-1,p[1]+1]; moved--}   ;
            if(hY && moved >= 0 && coordinates[p[0]][p[1]+1].type != 1){this.position = [p[0],p[1]+1]; moved--}   ;
            if(!hY && moved >= 0 && coordinates[p[0]][p[1]-1].type != 1){this.position = [p[0],p[1]-1]; moved--} ;
        }
        if(hX && moved >= 0 && coordinates[p[0]+1][p[1]].type != 1){this.position = [p[0]+1,p[1]]; moved--}   ;
        if(hY && moved >= 0 && coordinates[p[0]-1][p[1]].type != 1){this.position = [p[0]-1,p[1]]; moved--}   ;
    }
}

var units = [];
units[0] = [];
units[1] = [];
units[0][0] = new Unit([7,5], "beanFighter.gif")
units[1][0] = new Unit([13,5], "enemyFighter.gif")

function Tile(pos, ide){
    this.position = [];
    this.id = ide;
    this.position[0] = pos[0];
    this.position[1] = pos[1];
    this.uncovered = false;
    this.seen = false;
    this.type = 0;
    this.unitOn = false;
    this.unit = "beanFighter.gif";
    this.passable = true;
    this.canStep = false;
    this.treasure = 0;
    this.hasNotified = false;
    this.isEnemy = false;

    this.update = function(){
        if(this.seen) this.uncovered = true;
        this.seen = false;
        this.canStep = false;
        this.unitOn = false;
        this.isEnemy = false;
        this.passable = true;

        if(this.treasure != 0){
            this.unitOn = true;
            this.unit = "treasures\\" + 0 + ".png";
        }

        for(var i = 0; i < units[0].length; i++){
            if(parseInt(units[0][i].position[0]) == parseInt(this.position[0]) && parseInt(units[0][i].position[1]) == parseInt(this.position[1])){
                this.unitOn = true;
                this.unit = units[0][i].sprite;
                this.uncovered = true;
                this.type = 0;
            }
        }

        for(var i = 0; i < units[1].length; i++){
            if(parseInt(units[1][i].position[0]) == parseInt(this.position[0]) && parseInt(units[1][i].position[1]) == parseInt(this.position[1])){
                this.unitOn = true;
                this.unit = units[1][i].sprite;
                this.type = 0;
                this.isEnemy = true;
            }
        }

        if(this.type != 0) {
            this.passable = false;
            this.treasure = 0;
        }

        if(this.unitOn){
            var uni = document.createElement("IMG");
            uni.className = "unit";
            uni.style.left = 21 +  ((this.position[1] % 2 * -50) + (this.position[0] * 52 * 2)) + "px";
            uni.style.top = 23 +  (this.position[1] * 88) + "px";
            uni.draggable = false;
            uni.src = this.unit;    
            uni.id = "unit" + this.id;
            uni.style.display = "none";
            
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
        hex.id = "hex" + x + " " + y;
        hex.src = "hexGrey.png"    
        
        var hexback = document.createElement("IMG");
        hexback.className = "hexback";
        hexback.style.marginLeft = ((y % 2 * -50) + (x * 52 * 2)) + "px";
        hexback.style.marginTop = (y * 88) + "px";
        hexback.draggable = false;
        hexback.src = "frontBlack.png"   
        hexback.id = "hexback" + x + " " + y; 
        
        hex.onclick = function () {
            var coordHere = this.id.substring(3).split(" ");
            if(coordinates[coordHere[0]][coordHere[1]].canStep){
                units[0][0].position[0] = parseInt(coordHere[0]);
                units[0][0].position[1] = parseInt(coordHere[1]);
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

    for(var i = 0; i < units[1].length; i++){
        units[1][i].mov();
    }

    $(".unit").remove();

    if(coordinates[units[0][0].position[0]][units[0][0].position[1]].treasure != 0){
        var trCol = coordinates[units[0][0].position[0]][units[0][0].position[1]].treasure;
        coordinates[units[0][0].position[0]][units[0][0].position[1]].treasure = 0;
        messages.push("New Treasure/You've collected a new Treasure! (" + trCol + ")/OK/1")

        var trea = document.createElement("IMG");
        trea.draggable = false;
        trea.src = "treasures\\" + trCol + ".png";
        trea.className = "treasure";
        
        document.getElementById("bookmarks").appendChild(trea);

        treasuresCollected.push(trCol);
    }

    for(var x = 0; x < maxXHex; x++){
        for(var y = 0; y < maxYHex; y++){
            coordinates[x][y].update();
        }
    }
    
    getMov([units[0][0].position[0], units[0][0].position[1]], 4, 0, true);
    getMov([units[0][0].position[0], units[0][0].position[1]], 2, 1, true);
    
    rep = 0;
    var uncTotal = 0;

    for(var x = 0; x < maxXHex; x++){
        for(var y = 0; y < maxYHex; y++){
            if(allSeen) coordinates[x][y].uncovered = true;
            document.getElementById("hex" + x + " " + y).src = "backWall.png";
            if(coordinates[x][y].uncovered){
                uncTotal++;
                document.getElementById("hex" + x + " " + y).src = "backUncovered.png";
                if(coordinates[x][y].unitOn && (coordinates[x][y].seen || !coordinates[x][y].isEnemy)){
                    document.getElementById("unit" + rep).style.display = "block";
                }
            }
            if(coordinates[x][y].type == 1 && coordinates[x][y].uncovered){
                document.getElementById("hex" + x + " " + y).src = "backBlack.png";
            }
            if(coordinates[x][y].seen && coordinates[x][y].type == 0){
                document.getElementById("hex" + x + " " + y).src = "backSeen.png";
            }
            if(coordinates[x][y].canStep){
                document.getElementById("hex" + x + " " + y).src = "backBlue.png";
            }
            if(coordinates[x][y].isEnemy && coordinates[x][y].seen){
                document.getElementById("hexback" + x + " " + y).src = "frontRed.png";
                document.getElementById("hexback" + x + " " + y).style.zIndex = 3;
            } else {
                document.getElementById("hexback" + x + " " + y).src = "frontBlack.png";
                document.getElementById("hexback" + x + " " + y).style.zIndex = 2;
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
