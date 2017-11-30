var x = 0;
var y = 1;
var framer = 10;
var ps = 1000 / framer;

var g = -.1;

function m(e){
    return document.getElementById(e);
};

function sign(e) {
    return e / Math.abs(e);
}

function Thing(elem, doG, dim) {
    this.p = [0, 0];
    this.v = [0, 0];
    this.a = [0, 0];

    if (doG)
        this.a[y] = g;

    this.docElement = elem;

    this.width = dim[x];
    this.height = dim[y];

    this.update = function () {

        this.v[x] += this.a[x] / ps;
        this.v[y] += this.a[y] / ps;        
        
        if (Math.abs(this.v[x]) < .01) this.v[x] = 0;
        if (Math.abs(this.v[y]) < .01) this.v[y] = 0;
        
        this.p[x] += this.v[x] / ps;
        this.p[y] += this.v[y] / ps;

        var collide = this.collide();
        
        if (collide[y]) {
            this.p[y] -= this.v[y];
        }

        if (collide[x] || collide[x + 2]) {
            this.v[x] *= -.1;
            this.friction(y);
        }
        
        if (collide[y] || collide[y+2]) {
            this.v[y] *= -.1
            this.friction(x);
        }



        this.docElement.style.left = this.p[x] + "px";
        this.docElement.style.bottom = this.p[y] + "px";
    }

    this.collide = function () {
        return [this.p[x] < 0, this.p[y] < 15, this.p[x] > window.innerWidth - this.width, this.p[y] > window.innerHeight - this.height ];
    }

    this.friction = function (e) {
        this.a[e] = sign(this.v[e]) * -1 * .003;
        if (this.v[x] < .01) this.v[x] = 0;
        if (this.v[y] < .01) this.v[y] = 0;
    }
}

var man = new Thing(m("man"), true, [20, 20]);
man.v = [5 * Math.random(), 15 * Math.random()];
man.p = [15, 15];
var dude = new Thing(m("dude"), true, [20, 20]);
dude.v = [7 * Math.random(), 17 * Math.random()];
dude.p = [15, 16];

function repeat() {
    man.update();
    dude.update();
    setInterval(repeat, framer);
}

repeat();
