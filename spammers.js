var x = 0;
var y = 1;

var mouseX = null;
var mouseY = null;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

var playingField = document.body;

var pfw = window.innerWidth;
var pfh = window.innerHeight;

function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

function halfside(e) {
    return (-1 * e)
}

function Unit(unitIDe) {
    this.color = getRandColor();
    this.pos = [(pfw * Math.random()), (pfh * Math.random())];
    this.goal = [0, 0];
    this.unitID = unitIDe;
    this.speed = Math.random() + .2;

    this.behaviour = "follower";

    var newUnit = document.createElement("div");
    newUnit.className = "unit";
    newUnit.id = "UNIT" + i;

    newUnit.style.left = 0 + "px";
    newUnit.style.top = 0 + "px";

    playingField.appendChild(newUnit);

    this.setPos = function () {
        document.getElementById("UNIT" + this.unitID).style.left = this.pos[x] + "px";
        document.getElementById("UNIT" + this.unitID).style.top = this.pos[y]+ "px";
        
        occupiedX[Math.floor(this.pos[x])] = true;
        occupiedY[Math.floor(this.pos[y])] = true;
    }

    this.move = function (direction, amt) {
        var mistake = 2 * Math.random();
        if (mistake > 1.99) {
            amt *= -1;
        }
        if (direction == 0) {
            if (!occupiedX[Math.floor(this.pos[direction] + amt)]) {
                this.pos[direction] += amt;
            }
        } else {
            if (!occupiedY[Math.floor(this.pos[direction] + amt)]) {
                this.pos[direction] += amt;
            }
        }    
    }

    this.behave = function () {
        switch (this.behaviour) {
            case "follower": this.goal = globalPos;
            default: break;
        }
    }

    this.goto = function () {
        var currentMove = Math.floor(2 * Math.random());
        if (currentMove == x && this.goal[x] > this.pos[x]) { this.move(x, this.speed);      }
        if (currentMove == x && this.goal[x] < this.pos[x]) { this.move(x, -1 * this.speed); }
        if (currentMove == y && this.goal[y] > this.pos[y]) { this.move(y, this.speed);      }
        if (currentMove == y && this.goal[y] < this.pos[y]) { this.move(y, -1 * this.speed); }
    }

    this.moment = function () {
        this.behave();
        this.goto();
        this.setPos();
    }
}

var colors = ["Red", "Blue", "Green"];
function getRandColor() { return colors[Math.floor(colors.length * Math.random())] };

var globalPos = [400, 400];

var units = [];

var occupiedX = [];
var occupiedY = [];

for (i = 0; i < pfw; i++){
    occupiedX[i] = false;
}

for (i = 0; i < pfh; i++){
    occupiedY[i] = false;
}

for (i = 0; i < 500; i++){
    units[i] = new Unit(i);
}

function repeat() {
    for (i = 0; i < units.length; i++) {
        units[i].moment();
    }
    
    for (i = 0; i < pfw; i++) {
        occupiedX[i] = false;
    }

    for (i = 0; i < pfh; i++) {
        occupiedY[i] = false;
    }

    globalPos = [mouseX, mouseY];

    document.getElementById("dot").style.left = globalPos[x] + "px";
    document.getElementById("dot").style.top = globalPos[y] + "px";
    
    setTimeout(repeat, 1);
}

repeat();