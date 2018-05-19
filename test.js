var x = 0;
var y = 1;
var dim = [$(window).width(),$(window).height()];
var mouse = [x,y]

document.onmousemove = function(event){
    mouse = [event.clientX,event.clientY];
}

var mouseDown = false;
var rightDown = false;
document.onmousedown = function(e) { 
    if(e.which == 1){
        mouseDown = true;
    } else {
        rightDown = true;
    }
}
document.onmouseup = function(e) {
    if(e.which == 1){
        mouseDown = false;
    } else {
        rightDown = false;
    }
}   

var remove = function(id) {
    var elem = document.getElementById(id);
    if(elem != null){
        return elem.parentNode.removeChild(elem);
    }
}

function halfside(e) {
    return (1 * e) + (2 * e * Math.random());
};

function isCollide(a, b) {
    var aRect = a.getBoundingClientRect()
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

hasDied = false;
var die = function(){
    document.getElementById("death").style.display = "flex";
    document.getElementById("kills").innerHTML = killed;
    hasDied = true;
}

var numberStars = 100;

var colors = ["Red", "Blue", "White"];
function getRandColor() { return colors[Math.floor(colors.length * Math.random())] };

var types = {BEE: "bee", CRAB: "crab", NAMCO: "namco", FLYER: "flyer", FLYERHURT: "flyerHurt"}
function getRandType() {
    switch(Math.floor(4 * Math.random())){
        case 0: return types.BEE;
        case 1: return types.CRAB;
        case 2: return types.NAMCO;
        case 3: return types.FLYER;
    }
}

var G = {RIGHT: 0, UP: 1, LEFT: 2, DOWN: 3}
var gravity = G.UP;
var gravityMod = 4 * Math.random() + 3;

var killed = 0;

function Star(starID) {
    this.color = getRandColor();
    this.pos = [dim[x] * Math.random(), dim[y] * Math.random()];
    this.id = starID;
    this.speed = [Math.random() + .2, Math.random() + .2];

    var newStar = document.createElement("DIV");
    newStar.className = "star";
    newStar.id = "STAR" + starID;
    newStar.style.backgroundColor = this.color;
    document.body.appendChild(newStar);

    this.moment = function () {
        switch(gravity){
            case G.RIGHT: this.pos[x] += this.speed[x] * gravityMod; break;
            case G.UP: this.pos[y] -= this.speed[y] * gravityMod; break;
            case G.LEFT: this.pos[x] -= this.speed[x] * gravityMod; break;
            case G.DOWN: this.pos[y] += this.speed[y] * gravityMod;  break;
        }

        if(this.pos[x] > dim[x]){ this.pos[x] = 0}
        if(this.pos[y] > dim[y]){ this.pos[x] = 0}
        if(this.pos[x] < 0){ this.pos[x] = dim[x]}
        if(this.pos[y] < 0){ this.pos[y] = dim[y]}

        document.getElementById("STAR" + this.id).style.left = this.pos[x] + "px";
        document.getElementById("STAR" + this.id).style.top = this.pos[y] + "px";
    }
}

function Bullet(id){
    this.x = -50;
    this.y = -50;
    this.xv = 0;
    this.yv = 0;
    this.id = id;
    this.angle = 0;
    this.dep = false;

    this.elem = document.createElement("DIV");
    this.elem.className = "bullet";
    this.elem.id = this.id;
    this.elem.setAttribute("draggable",false)
    document.body.appendChild(this.elem);

    this.set = function(a,b,c){
        this.dep = false;
        this.x = a;
        this.y = b;
        this.xv = -30 * Math.cos(c);
        this.yv = -30 * Math.sin(c);
        this.angle = c;
    }

    this.move = function(){
        if(this.dep){
            document.getElementById(this.id).style.display = "none";
            return;
        }
        if(this.x > $(window).width() || this.x < -10 || this.y > $(window).height() || this.y < -10){
            this.dep = true;
        } else {
            document.getElementById(this.id).style.display = "block";
            this.x += this.xv;
            this.y += this.yv;
            document.getElementById(this.id).style.left = this.x + "px";
            document.getElementById(this.id).style.top = this.y + "px";
            document.getElementById(this.id).style.transform = "rotate(" + (this.angle + Math.PI / -2) + "rad)";
        }
    }
}

function Ship(a,b,c){
    this.pos = [a,b]
    this.v = [0,0]
    this.elem = c;
    this.angle = 0;
    this.bullets = [];

    for(var i = 0; i < 6; i++){
        this.bullets.push(new Bullet(i));
    }

    this.move = function(){
        this.pos[x] += this.v[x];
        this.pos[y] += this.v[y];

        if(this.pos[x] > dim[x] - 50 || this.pos[x] < 20){ this.v[x] *= -.9}
        if(this.pos[y] > dim[y] - 50 || this.pos[y] < 50){ this.v[y] *= -.9}

        this.pos[x] = Math.min(Math.max(20, this.pos[x]), dim[x] - 50)
        this.pos[y] = Math.min(Math.max(50, this.pos[y]), dim[y] - 50)
        
        this.angle = Math.atan((mouse[y] - this.pos[y]) / (mouse[x] - this.pos[x]));
        if(Math.sign(mouse[x] - this.pos[0]) == -1){
            this.angle += Math.PI;
        }
        this.angle += Math.PI;

        this.elem.style.left = this.pos[x] - 10 + "px";
        this.elem.style.top = this.pos[y] - 10 + "px";

        for(var i = 0; i < this.bullets.length; i++){
            this.bullets[i].move()
        }
    }

    this.shoot = function(){
        this.elem.style.transform = "scale(2) rotate(" + (this.angle + Math.PI / -2) + "rad)";
        if(this.bullets.filter(x => x.dep).length == 0){
            return;
        }
        this.v[x] += 1 * Math.cos(this.angle)
        this.v[y] += 1 * Math.sin(this.angle)
        var current = 0;
        current = this.bullets.filter(x => x.dep)[0].id
        this.bullets[current].set(this.pos[0] - 7, this.pos[1] - 13, this.angle);
    }

    this.boost = function(){
        this.elem.style.transform = "scale(2) rotate(" + (this.angle + Math.PI / -2) + "rad)";
        this.v[x] -= 1 * Math.cos(this.angle)
        this.v[y] -= 1 * Math.sin(this.angle)
    }
}

function Enemy(a,b,c){
    this.pos = [a * Math.cos(b) + ship.pos[x],a * Math.sin(b) + ship.pos[y]]
    this.v = [-10 * Math.cos(b),-10 * Math.sin(b)]
    this.angle = b;
    this.type = getRandType().toLowerCase();
    this.dead = false;
    this.counter = 0;

    this.elem = document.createElement("img");
    this.elem.className = "enemy";
    this.elem.id = "enemy" + c;
    this.elem.setAttribute("draggable",false)
    document.body.appendChild(this.elem);

    this.move = function(){
        this.pos[x] += this.v[x];
        this.pos[y] += this.v[y];
        
        if(this.elem != undefined && !this.dead){
            this.elem.src = this.type + ".png";
            this.elem.style.left = this.pos[x] - 10 + "px";
            this.elem.style.top = this.pos[y] - 10 + "px";
            this.elem.style.transform = "scale(3) rotate(" + (this.angle + Math.PI / -2) + "rad)";

            for(var i = 0; i < ship.bullets.length; i++){
                if(isCollide(ship.bullets[i].elem, this.elem)){
                    this.dead = true;
                    this.elem.style.transform = "scale(6)"
                    this.elem.src = "explosion.gif"
                    killed++;
                    ship.bullets[i].dep = true;
                }
            }
            if(isCollide(ship.elem, this.elem)){
                die();
            }
        } else if(this.elem != undefined){
            this.counter++;
            if(this.counter == 30){
                this.elem.src = "";
            }
        }

    }
}

var ship = new Ship(dim[x] / 2, dim[y] / 2, document.getElementById("ship"))

var stars = [];
for (i = 0; i < numberStars; i++){
    stars[i] = new Star(i);
}

var enemies = [];

var summon = function(){
    var tempAngle = Math.random() * 2 * Math.PI;
    while(Math.random() > .5){
        enemies.push(new Enemy(Math.max(dim[x],dim[y]) * .8, tempAngle, enemies.length))
        if(enemies.length > 50){
            remove(enemies[0].elem.id)
            enemies.shift();
        }
        tempAngle += Math.PI / 3;
    }
}

var repeater = 0;
setInterval(function(){
    if(hasDied) return
    repeater++;
    if(mouseDown && repeater % 2 == 0){
        ship.shoot();
    }

    if(rightDown){
        ship.boost();
    }

    ship.move();
    
    for (i = 0; i < stars.length; i++) {
        stars[i].moment();
    }

    for (i = 0; i < enemies.length; i++) {
        enemies[i].move();
    }

    if(repeater % 20 == 0 || (repeater % 5 == 0 && Math.random() < Math.max(.2, Math.tanh(killed / 100)))){
        summon()
    }
},35)