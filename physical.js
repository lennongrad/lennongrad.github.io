var x = 0;
var y = 1;
var framer = 1000;
var ps = 1000 / framer;

var g = [0, -.1];

var colors = ["Red", "Blue", "Green", "Pink", "Yellow"];

function getRandColor(){
    return colors[Math.floor(colors.length * Math.random())];
}

function m(e){
    return document.getElementById(e);
};

function sign(e) {
    return e / Math.abs(e);
}

var collision = [];

function addCollision(boundsx1, boundsx2, boundsy1, boundsy2) {
    collision[collision.length] = [boundsx1, boundsx2, boundsy1, boundsy2];
    
    var coll = document.createElement('div');
    coll.id = "coll" + collision.length;
    coll.className = "collision";
    coll.style.width = (boundsx2 - boundsx1) + "px";
    coll.style.height = (boundsy2 - boundsy1) + "px";
    coll.style.left = boundsx1 + "px";
    coll.style.bottom = boundsy1 + "px";
    document.body.appendChild(coll);
}

function doCollision(c, dim) {
    var d = collision[dim];
    return (c[x] < d[1] && c[x] > d[0] && c[y] < d[3] && c[y] > d[2])
}

function newFlinger() {
    var flingerCnt = flingers.length;

    var wdth = Math.ceil(40 * Math.random());
    var hht = Math.ceil(40 * Math.random());

    var flinger = document.createElement('div');
    flinger.id = "flinger" + flingerCnt;
    flinger.className = "boy";
    flinger.style.backgroundColor = getRandColor();
    flinger.style.width = wdth + "px";
    flinger.style.height = hht + "px";
    document.body.appendChild(flinger);
    
    flingers[flingerCnt] = new Thing(m("flinger" + flingerCnt), true, [wdth, hht]);
    flingers[flingerCnt].v = [20 * Math.random(), 15 * Math.random()];    
    flingers[flingerCnt].p = [15, 15];
    flingerCnt++;

}

function opp(e) {
    if (e == 0) return 1
    return 0
}

function Thing(elem, doG, dim) {
    this.p = [0, 0];
    this.v = [0, 0];
    this.a = [0, 0];

    this.forces = [];

    if (doG)
        this.forces[0] = g;
    else
        this.forces[0] = [0, 0];
    
    this.forces[1] = [0, 0];
    this.forces[2] = [0, 0];

    this.docElement = elem;

    this.width = dim[x];
    this.height = dim[y];

    this.update = function () { 
        this.a = [0, 0];
        for (i = 0; i < this.forces.length; i++) {
            this.a[x] += this.forces[i][x];
            this.a[y] += this.forces[i][y];
        }    
        
        this.v[x] += this.a[x] / ps;
        this.v[y] += this.a[y] / ps;    
        var collide = this.collide();         
        
        
        for (i = 0; i < y + 2; i++) {
            if (collide[i]) {
                //this.v[i % 2] = 0;
                this.v[i % 2] = 0;
                this.forces[2][opp(i % 2)] = -1 * this.v[opp(i % 2)] * (.04 / ps);
            }
        }    

        if (this.v === [0, 0]) return;
        
        if (Math.abs(this.v[x]) < .0001) this.v[x] = 0;
        if (Math.abs(this.v[y]) < .0001) this.v[y] = 0;
        if (Math.abs(this.p[x]) < .0001) this.p[x] = 0;
        if (Math.abs(this.p[y]) < .0001) this.p[y] = 0;
        if (Math.abs(this.a[x]) < .0001) this.a[x] = 0;
        if (Math.abs(this.a[y]) < .0001) this.a[y] = 0;
        
        this.p[x] += this.v[x] / ps;
        this.p[y] += this.v[y] / ps;

        if (collide[x] || collide[x + 2]) {
            this.v[x] *= -.1;
            //this.friction(y);
        }
        
        if (collide[y] || collide[y+2]) {
            this.v[y] *= -.1
            //this.friction(x);
        }

        this.docElement.style.left = this.p[x] + "px";
        this.docElement.style.bottom = this.p[y] + "px";
    }

    this.collide = function () {
        var toReturn = [false, false, false, false]
        
        for (var r = 0; r < collision.length; r++){
            if (doCollision(this.p, r)) {
                toReturn[x] = true;
                toReturn[y] = true;
            }
        }

        for (var r = 0; r < collision.length; r++){
            if (doCollision([this.p[x] + this.width, this.p[y]], r)) {
                toReturn[x + 2] = true;
                toReturn[y] = true;
            }
        }

        for (var r = 0; r < collision.length; r++){
            if (doCollision([this.p[x], this.p[y] + this.height], r)) {
                toReturn[x] = true;
                toReturn[y + 2] = true;
            }
        }

        for (var r = 0; r < collision.length; r++){
            if (doCollision([this.p[x] + this.width + 1, this.p[y] + this.height + 1], r)) {
                toReturn[x + 2] = true;
                toReturn[y + 2] = true;
                this.rand();
            }
        }
        return toReturn;
    }

    this.rand = function () {
        this.v = [20 * Math.random(), 15 * Math.random()];
    }
}

var flingers = [];
newFlinger();

addCollision(0, window.innerWidth, 0, 15);
addCollision(window.innerWidth - 230, window.innerWidth, 0, window.innerHeight);
addCollision(0, 15, 0, window.innerHeight);
addCollision(640, window.innerWidth, 15, 100);
addCollision(0, window.innerWidth, window.innerHeight - 30, window.innerHeight);

function repeat() {
    flingers[0].update();
}

    setInterval(repeat, .1);