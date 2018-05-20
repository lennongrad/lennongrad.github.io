var x = 0;
var y = 1;
var dim = [$(window).width(),$(window).height()];
var mouse = [x,y]

document.onmousemove = function(event){
    mouse = [event.clientX,event.clientY];
}

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

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

var remove = function(elem) {
    if(elem != null){
        return elem.parentNode.removeChild(elem);
    }
}

$(document)
        .on('touchstart', function (event) {
            mouseDown = true;
            mouse = [event.originalEvent.touches[0].clientX,event.originalEvent.touches[0].clientY];
        })
        .on('touchmove', function (event) {
            mouse = [event.originalEvent.touches[0].clientX,event.originalEvent.touches[0].clientY];
        })
        .on('touchend', function () {
            mouseDown = false;
        });

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

var numberStars = 100;
var numberEnemies = 50;
var initialBullets = 6;
var timeFrame = 35;

if(window.mobilecheck()){
    numberStars = 30;
    numberEnemies = 10;
    initialBullets = 3;
    timeFrame = 30;
}

var colors = ["Red", "Blue", "White"];
function getRandColor() { return colors[Math.floor(colors.length * Math.random())] };

var types = {BEE: "bee", CRAB: "crab", FLYER: "flyer", FLYERHURT: "flyerhurt"}
var pointValues = {"bee": 100, "crab": 160, "flyer": 200, "flyerhurt": 400}
function getRandType() {
    switch(Math.floor(3 * Math.random())){
        case 0: return types.BEE;
        case 1: return types.CRAB;
        case 2: return types.FLYER;
    }
}

var powerTypes = {BULLET: "bullet", SHIELDED: "shielded"}
function getRandPower(){
    switch(Math.floor(2 * Math.random())){
        case 0: return powerTypes.BULLET
        case 1: return powerTypes.SHIELDED
    }
}

var G = {RIGHT: 0, UP: 1, LEFT: 2, DOWN: 3}
var gravity = G.UP;
var gravityMod = 4 * Math.random() + 3;

var killed = 0;
var points = 0;

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

function Bullet(a){
    this.x = -50;
    this.y = -50;
    this.xv = 0;
    this.yv = 0;
    this.id = a;
    this.angle = 0;
    this.dep = false;

    this.elem = document.createElement("DIV");
    this.elem.className = "bullet";
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
            this.elem.style.display = "none";
            return;
        }
        if(this.x > dim[x] || this.x < -10 || this.y > dim[y] || this.y < -10){
            this.dep = true;
        } else {
            this.elem.style.display = "block";
            this.x += this.xv;
            this.y += this.yv;
            this.elem.style.left = this.x + "px";
            this.elem.style.top = this.y + "px";
            this.elem.style.transform = "rotate(" + (this.angle + Math.PI / -2) + "rad)";
        }
    }
}

function Ship(a,b,c){
    this.pos = [a,b]
    this.v = [0,0]
    this.elem = c;
    this.angle = 0;
    this.bullets = [];
    this.shielded = 1;

    for(var i = 0; i < initialBullets; i++){
        this.bullets.push(new Bullet(i));
    }

    this.move = function(){
        this.pos[x] += this.v[x];
        this.pos[y] += this.v[y];

        if(this.pos[x] > dim[x] - 50 || this.pos[x] < 20){ this.v[x] *= -.9}
        if(this.pos[y] > dim[y] - 50 || this.pos[y] < 50){ this.v[y] *= -.9}

        this.pos[x] = Math.min(Math.max(20, this.pos[x]), dim[x] - 50)
        this.pos[y] = Math.min(Math.max(50, this.pos[y]), dim[y] - 50)

        if(this.shielded > 0){
            this.elem.className = "shielded"
        } else {
            this.elem.className = ""
        }
        
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
        
        for(i in enemies){
            for(e in enemies[i].bullets){
                if(!enemies[i].bullets[e].dep && isCollide(this.elem, enemies[i].bullets[e].elem)){
                    ship.die()
                    enemies[i].bullets[e].dep = true;
                }
            }
        }

        for(i in powers){
            if(isCollide(powers[i].elem, this.elem)){
                switch(powers[i].power){
                    case powerTypes.BULLET: this.bullets.push(new Bullet(this.bullets.length)); break;
                    case powerTypes.SHIELDED: this.shielded++; break;
                }
                remove(powers[i].elem);
                powers.splice(i);
            }
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

    this.die = function(){
        this.shielded--;
        if(this.shielded > -1){
            return;
        }
        document.getElementById("death").style.display = "flex";
        document.getElementById("kills").innerHTML = killed;
        document.getElementById("points").innerHTML = points;
        hasDied = true;
        for(i in enemies){
            if(enemies[i].counter == 0){
                enemies[i].elem.src = "explosion.gif"
            }
        }
    }
}

function Enemy(a,b,c,d){
    this.pos = [a * Math.cos(b) + ship.pos[x],a * Math.sin(b) + ship.pos[y]]
    this.v = [-10 * Math.cos(b),-10 * Math.sin(b)]
    this.angle = b;
    this.type = d;
    this.dead = false;
    this.counter = 0;
    
    this.bullets = [];

    for(var i = 0; i < initialBullets / 3; i++){
        this.bullets.push(new Bullet(i));
    }

    this.elem = document.createElement("img");
    this.elem.className = "enemy";
    this.elem.id = "enemy" + c;
    this.elem.setAttribute("draggable",false)
    document.body.appendChild(this.elem);

    this.move = function(){
        this.pos[x] += this.v[x] * (timeFrame / 35);
        this.pos[y] += this.v[y] * (timeFrame / 35);
        for(var i = 0; i < this.bullets.length; i++){
            this.bullets[i].move()
        }
        
        if(this.elem != undefined && !this.dead){
            if(Math.random() > .98 && this.type == "crab"){
                this.shoot()
            }
            this.elem.src = this.type + ".png";
            this.elem.style.left = this.pos[x] - 10 + "px";
            this.elem.style.top = this.pos[y] - 10 + "px";
            this.elem.style.transform = "scale(3) rotate(" + (this.angle + Math.PI / -2) + "rad)";

            if(this.type == types.BEE){
                this.elem.style.transform =  "scale(3) rotate(" + (this.angle + Math.PI / -2) + "rad) translateX(" + (30 * Math.cos(repeater / 7)) + "px)"
            }

            for(var i = 0; i < ship.bullets.length; i++){
                if(isCollide(ship.bullets[i].elem, this.elem)){
                    ship.bullets[i].dep = true;
                    if(this.type == "flyer"){
                        this.v[x] *= 1.75;
                        this.v[y] *= 1.75;
                        this.type = "flyerhurt";
                        return;
                    }
                    this.die();
                }
            }
            if(isCollide(ship.elem, this.elem)){
                ship.die();
                this.die();
            }
        } else if(this.elem != undefined){
            this.counter+=2;
            if(this.counter == 30){
                this.elem.src = "";
                for(i in this.bullets){
                    remove(this.bullets[i].elem)
                }
                bullets = [];
            }
        }

    }

    this.die = function(){this.dead = true;
        this.elem.style.transform = "scale(6)"
        this.elem.src = "explosion.gif"
        killed++;
        points += pointValues[this.type]
    }

    this.shoot = function(){
        if(this.bullets.filter(x => x.dep).length == 0){
            return;
        }
        var current = 0;
        current = this.bullets.filter(x => x.dep)[0].id
        this.bullets[current].set(this.pos[0] - 7, this.pos[1] - 13, this.angle);
    }
}

function Power(){
    this.pos = [Math.random() * (dim[x] - 200) + 100, Math.random() * (dim[y] - 200) + 100];
    this.color = getRandColor();
    this.power = getRandPower();

    this.elem = document.createElement("DIV");
    this.elem.className = "power";
    this.elem.style.backgroundColor = this.color;
    this.elem.style.left = this.pos[x] + "px"
    this.elem.style.top = this.pos[y] + "px"
    document.body.appendChild(this.elem);

    this.move = function(){
        this.elem.style.transform = "scale(" + (Math.cos(repeater / 10) * 3) + ")"
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
    var tempType = getRandType().toLowerCase();
    while(Math.random() > .5){
        enemies.push(new Enemy(Math.max(dim[x],dim[y]) * .8, tempAngle, enemies.length, tempType))
        if(enemies.length > numberEnemies){
            remove(enemies[0].elem)
            enemies.shift();
        }
        tempAngle += Math.PI / 3;
    }
}

var powers = [];

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

    for (i = 0; i < powers.length; i++) {
        powers[i].move();
    }

    if(repeater % 20 == 0 || (repeater % 5 == 0 && Math.random() < Math.max(.2, Math.tanh(killed / 100)))){
        summon()
    }

    if(repeater % 100 == 0 && Math.random() > .5 && powers.length < 3){
        powers.push(new Power());
    }
},timeFrame)