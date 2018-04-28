
var mouseX = 0;
var mouseY = 0;
$(this).mousemove(function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
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

var remove = function(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

var ship = document.getElementById("ship");

var x = 0;
var y = 1;

var playingField = document.body;

var numberStars = 150;
var globalGlitch = (.09 * Math.random()) + .9;

var colors = ["Red", "Blue", "White"];
function getRandColor() { return colors[Math.floor(colors.length * Math.random())] };

var units = [];

var gravity = 1;
var gravityMod = 4 * Math.random() + 3;

var offscreen = true;

function getUnit(id) {
    return document.getElementById("UNIT" + id);
}

function halfside(e) {
    return (1 * e) + (2 * e * Math.random());
};


function Unit(unitIDe) {
    this.color = getRandColor();
    this.pos = [(screen.width * Math.random()), (screen.height * Math.random())];
    this.goal = [0, 0];
    this.unitID = unitIDe;
    this.glitch = globalGlitch;

    this.speed = [];
    this.speed[x] = Math.random() + .2;
    this.speed[y] = Math.random() + .2;


    var newUnit = document.createElement("div");
    newUnit.className = "unit";
    newUnit.id = "UNIT" + i;
    newUnit.style.backgroundColor = this.color;

    newUnit.style.left = 0 + "px";
    newUnit.style.top = 0 + "px";


    document.body.appendChild(newUnit);

    this.setPos = function () {
        document.getElementById("UNIT" + this.unitID).style.left = this.pos[x] + "px";
        document.getElementById("UNIT" + this.unitID).style.top = this.pos[y] + "px";
    }

    this.move = function (direction, amt) {
        this.pos[direction] += amt;
    }

    this.goto = function () {
        if (offscreen && this.pos[x] < 20) { this.pos[x] = $(window).width() - 20 }
        if (offscreen && this.pos[x] > $(window).width() - 5) { this.pos[x] = 25 };
        if (offscreen && this.pos[y] < 4) { this.pos[y] = $(window).height() - 21 }
        if (offscreen && this.pos[y] > $(window).height() - 20) { this.pos[y] = 5 };

        switch (gravity) {
            case 1: this.move(y, this.speed[y] * gravityMod); break;
            case 2: this.move(y, -1 * this.speed[y] * gravityMod); break;
            default: break;
        }
    }

    this.moment = function () {
        this.goto();
        this.setPos();
    }
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

var c = document.getElementById("main");
var ctx = c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;

function Bullet(x, y, xv, yv, id){
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.id = id;

    var bul = document.createElement("DIV");
    bul.className = "bullet";
    bul.id = this.id;
    bul.setAttribute("draggable",false)
    document.body.appendChild(bul);

    this.die = function(){
        buls.splice(this.id, 1);
    }

    this.move = function(){
        if(this.x > $(window).width() || this.x < -10 || this.y > $(window).height() || this.y < -10){
            document.getElementById(this.id).style.display = "none";
        } else {
            document.getElementById(this.id).style.display = "block";
            this.x += this.xv;
            this.y += this.yv;
            document.getElementById(this.id).style.left = this.x + "px";
            document.getElementById(this.id).style.top = this.y + "px";
        }
    }
}

var buls = [];
for(var i = 0; i < 30; i++){
    buls.push(new Bullet(-11,-11,0,0,i));
}
var switcher = 0;

var angle = 0;
var posX = 0;
var posY = 0;
ctx.strokeStyle = "white";

setInterval(function(){
    posX = mouseX - $(window).width() / 2;
    posY = mouseY - $(window).height() / 2;
    angle = Math.atan(posY / posX);
    if(Math.sign(posX) == -1){
        angle += Math.PI;
    }
    angle += Math.PI;
    posX = 400 * Math.cos(angle);
    posY = 400 * Math.sin(angle);

    ctx.clearRect(0,0,c.width,c.height);
    ctx.beginPath();
    ctx.moveTo((-40 * posX) + $(window).width() / 2,(-40 * posY) + $(window).height() / 2);
    ctx.lineTo(posX + $(window).width() / 2,posY + $(window).height() / 2);
    //ctx.stroke();

    posX += $(window).width() / 2;
    posY += $(window).height() / 2;
    
    for(var i = 0; i < buls.length; i++){
         buls[i].move()
    }

    ship.style.left = posX - 10 + "px";
    ship.style.top = posY - 10 + "px";
    ship.style.transform = "scale(2) rotate(" + (angle + Math.PI / -2) + "rad)";
})

setInterval(function(){
    if(mouseDown){
        switcher++;
        if(switcher >= buls.length){
            switcher = 0;
        }
        buls[switcher].x = posX;
        buls[switcher].y = posY;
        buls[switcher].xv = -7 * Math.cos(angle);
        buls[switcher].yv = -7 * Math.sin(angle);
    }
}, 150)

setInterval(function(){
    for (i = 0; i < units.length; i++) {
        units[i].moment();
    }
}, 35)