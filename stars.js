var x = 0;
var y = 1;


var mouseX = null;
var mouseY = null;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

var playingField = document.body;

var pfw = window.innerWidth;
var pfh = window.innerHeight;

var numberStars = 2350;

var globalCluster = 25 * Math.random();
var globalHover = 10 * Math.random();
var globalGlitch = (.09 * Math.random()) + .9;

var king = Math.floor(numberStars * Math.random());

var colors = ["Red", "Blue", "Green"];
function getRandColor() { return colors[Math.floor(colors.length * Math.random())] };

var globalPos = [400, 400];

var units = [];

var occupiedX = [];
var occupiedY = [];

var gravity = Math.floor(5 * Math.random());
var gravityMod = 15 * Math.random();

var offscreen = true;

function getUnit(id) {
    return document.getElementById("UNIT" + id);
}

function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

function halfside(e) {
    return (-1 * e) + (2 * e * Math.random());
};

function dethrone(e) {
    units[king].behaviour = "follower";
    king = e;
}

function Unit(unitIDe) {
    this.color = getRandColor();
    this.pos = [(pfw * Math.random()), (pfh * Math.random())];
    this.goal = [0, 0];
    this.unitID = unitIDe;
    this.cluster = globalCluster;
    this.hover = globalHover;
    this.glitch = globalGlitch;

    this.speed = [];
    this.speed[x] = Math.random() + .2;
    this.speed[y] = Math.random() + .2;
    this.speedmod = [];
    this.speedmod[x] = 1;
    this.speedmod[y] = 1;

    this.behaviour = "follower";

    var newUnit = document.createElement("div");
    newUnit.className = "unit";
    newUnit.id = "UNIT" + i;

    newUnit.style.left = 0 + "px";
    newUnit.style.top = 0 + "px";

    newUnit.onclick = new Function("dethrone(" + this.unitID + ")");

    playingField.appendChild(newUnit);

    this.setPos = function () {
        document.getElementById("UNIT" + this.unitID).style.left = this.pos[x] + "px";
        document.getElementById("UNIT" + this.unitID).style.top = this.pos[y]+ "px";
        
        occupiedX[Math.floor(this.pos[x])]++;
        occupiedY[Math.floor(this.pos[y])]++;
    }

    this.move = function (direction, amt) {
        var mistake = Math.random();
        if (mistake > this.glitch) {
            amt *= -1;
        }
        if (direction == 0) {
            if (occupiedX[Math.floor(this.pos[direction] + amt)] < this.cluster) {
                this.pos[direction] += amt;
            }
        } else {
            if (occupiedY[Math.floor(this.pos[direction] + amt)] < this.cluster) {
                this.pos[direction] += amt;
            }
        }    
    }

    this.behave = function () {
        this.goal = globalPos;
        this.cluster = globalCluster;
        this.hover = globalHover;
        switch (this.behaviour) {
            case "follower":
                getUnit(this.unitID).style.backgroundColor = "white";
                getUnit(this.unitID).style.width = "1px";
                getUnit(this.unitID).style.height = "1px";
                break;
            case "king":
                getUnit(this.unitID).style.backgroundColor = "blue";
                getUnit(this.unitID).style.width = "6px";
                getUnit(this.unitID).style.height = "6px";
                break;
            case "jester":
                this.goal = units[king].pos;
                this.cluster = globalCluster / 5;
                this.hover = globalHover / 5;
                getUnit(this.unitID).style.backgroundColor = "red";
                getUnit(this.unitID).style.width = "1px";
                getUnit(this.unitID).style.height = "1px";
                break;
            case "randomer":
                this.goal = [Math.random() * pfw, Math.random() * pfh];
                getUnit(this.unitID).style.backgroundColor = "yellow";
                break;
            default: break;
        }

        switch (gravity) {
            case 0: this.speedmod[x] = 1; this.speedmod[y] = 1; break;
            case 1: this.goal[y] = pfh; this.speedmod[y] = gravityMod; break;
            case 2: this.goal[y] = 0; this.speedmod[y] = gravityMod; break;
            case 3: this.goal[x] = pfw; this.speedmod[x] = gravityMod; break;
            case 4: this.goal[x] = 0; this.speedmod[x] = gravityMod; break;
            default: break;
        }
        
    }

    this.goto = function () {
        var currentMove = Math.floor(2 * Math.random());
        if (currentMove == x && this.goal[x] + halfside(this.hover) > this.pos[x]) { this.move(x, this.speed[x] * this.speedmod[x])}
        if (currentMove == x && this.goal[x] + halfside(this.hover) < this.pos[x]) { this.move(x, -1 * this.speed[x] * this.speedmod[x]); }
        if (currentMove == y && this.goal[y] + halfside(this.hover) > this.pos[y]) { this.move(y, this.speed[y] * this.speedmod[y]);      }
        if (currentMove == y && this.goal[y] + halfside(this.hover) < this.pos[y]) { this.move(y, -1 * this.speed[y] * this.speedmod[y]); }

        if (offscreen && this.pos[x] < 10) { this.pos[x] = pfw - 11}
        if (offscreen && this.pos[x] > pfw - 10) { this.pos[x] = 1 };
        if (offscreen && this.pos[y] < 4) { this.pos[y] = pfh - 21}
        if (offscreen && this.pos[y] > pfh - 20) { this.pos[y] = 5 };
    }

    this.moment = function () {
        this.behave();
        this.goto();
        this.setPos();
    }
}

for (i = 0; i < pfw; i++){
    occupiedX[i] = 0;
}

for (i = 0; i < pfh; i++){
    occupiedY[i] = 0;
}

for (i = 0; i < numberStars; i++){
    units[i] = new Unit(i);
    if (Math.random() > .85) {
        units[i].behaviour = "jester";
    }
    if (Math.random() > .85) {
        units[i].behaviour = "randomer";
    }
}


function repeat() {
    for (i = 0; i < units.length; i++) {
        if (i == king) {units[i].behaviour = "king" }
        units[i].moment();
    }
    
    for (i = 0; i < pfw; i++) {
        occupiedX[i] = false;
    }

    for (i = 0; i < pfh; i++) {
        occupiedY[i] = 0;
    }

    globalPos = [mouseX, mouseY];

    
    setTimeout(repeat, 1);
}

repeat();