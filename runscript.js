//because im an idiot sometimes
var yes = true;
var no = false;

var debug = false;

var workers_cost_base = 20;
var workers_cost_mult = 1.6;
var worker_cost = workers_cost_base;
var total_workers = 3;
var av_workers = 3;

var curYPos, curXPos, curDown;

var colorRand = [
    "Red",
    "Blue",
    "Yellow",
    "Purple",
    "Grey",
    "Green"
]

var currColor = colorRand[Math.floor(colorRand.length * Math.random())];

var baseChanceSpinner = .998;

window.addEventListener('mousemove', function (e) {
    if (curDown && !MouseScroller) {
        document.getElementById('page1').scrollTo(document.getElementById('page1').scrollLeft - e.movementX, document.getElementById('page1').scrollTop - e.movementY);
    }
});

window.addEventListener('mousedown', function (e) {
    curYPos = e.pageY;
    curXPos = e.pageX;
    curDown = true;
});

window.addEventListener('mouseup', function (e) {
    curDown = false;
});

var MouseScroller = false;

var setScroll = function () {
    MouseScroller = true;
};


function Resource(name, unlocked, color, base, limit) {
    this.name = name;
    this.ps = 0;
    this.amt = base;
    this.click = 1;
    this.mult = 1;
    this.unlocked = unlocked;
    this.color = color;
    this.baselimit = limit;
    this.limit = limit;

    this.onDebug = false;

    this.rates = new Array();
    this.auto = new Array();

    this.toClick = function () {
        this.amt = this.amt + this.click;
        clicker[reconback.get(this.name)] = 0;
        rowclicker[reconback.get(this.name)] = 0;
        repetir += this.click;
        last_click = reconback.get(this.name);
    }

    this.unlocker = function () {
        this.unlocked = true;
        this.onDebug = false;
        rowclicker[reconback.get(this.name)] = 0;
    }
}

function Building(name, resource, cost_base, cost_mult, efficiency, unlocked, costs) {
    this.resource = resource;
    this.unlocked = unlocked;
    this.name = name;

    this.costers = new Array();

    switch (costs) {
        case 0:
            this.costers = [res.length - 1];
            this.cost_base = 50;
            this.cost_mult = 1.5;
            this.efficiency = .15;
            break;
        case 1:
            this.costers = [res.length - 1, 5];
            this.cost_base = 500;
            this.cost_mult = 2.1;
            this.efficiency = 1.6;
            break;
        case 2:
            this.costers = [res.length - 1, 5];
            this.cost_base = 5000;
            this.cost_mult = 3;
            this.efficiency = 15.6;
            break;
        case 3:
            this.costers = [res.length - 1, 6];
            this.cost_base = 50000;
            this.cost_mult = 4.3;
            this.efficiency = 98.5;
            break;
        case 4:
            this.costers = [res.length - 1, 7];
            this.cost_base = 500000;
            this.cost_mult = 6.2;
            this.efficiency = 567.34;
            break;
    }

    if (cost_base != 0) {
        this.cost_base = cost_base;
    }
    
    if (cost_mult != 0) {
        this.cost_mult = cost_mult;
    }
    
    if (efficiency != 0) {
        this.efficiency = efficiency;
    }    
    
    this.onDebug = false;

    this.fps = 0;
    this.cost = cost_base;
    this.amt = 0;
    this.working = 0;

    this.costfind = function() {
        this.cost = (this.cost_base * this.cost_mult * (Math.pow(1.10, (this.amt + 1)) - Math.pow(1.10, this.amt))) / 0.15;
    }

    this.buy = function () {
        var lesser = this.costers[0];
        var least = 0;
        for (i = 0; i < this.costers.length; i++) {
            if (!(res[this.costers[i]].amt >= this.cost)) {
                return;
            }
            if (res[this.costers[i]].amt < lesser) {
                lesser = res[this.costers[i]].amt;
                least = i;
            }
        }
        do {
            for (i = 0; i < this.costers.length; i++) {
                res[this.costers[i]].amt -= this.cost;
            }
            ++this.amt;
            this.costfind();
            if (av_workers > 0) {
                --av_workers;
                ++this.working;
            }
            findPS();
        } while (res[least].amt >= this.cost & all);
        init();
    }

    this.right = function() {
        if (this.working < this.amt && av_workers > 0) {
            ++this.working;
            --av_workers;
        }
        findPS();
        init();
    }

    this.left = function() {
        if (this.working > 0) {
            --this.working;
            ++av_workers;
        }
        findPS();
        init();
    }

    this.unlocker = function () {
        this.unlocked = true;
        this.onDebug = false;
    }
}

var recon = new Map();
var reconback = new Map();

var res = new Array();
res[0] = new Resource("food", true, "#b6ff9e", 0);
res[1] = new Resource("housing", false, "#b6ff9e", 0);
res[2] = new Resource("gold", true, "#fff69e", 90000);
res[3] = new Resource("jewel", false, "#fff69e", 90000);
res[4] = new Resource("science", true, "#9ea7ff", 10000);
res[5] = new Resource("mineral", false, "#d8c2a4", 0);
res[6] = new Resource("oil", false, "#d8c2a4", 0);
res[7] = new Resource("uranium", false, "#d8c2a4", 0);
res[8] = new Resource("culture", false, "#d19eff", 0);
res[9] = new Resource("political", false, "#d19eff", 0);
res[10] = new Resource("energy", false, "#9effd9", 10000);
res[11] = new Resource("tradition", false, "#ff8b82", 0);
res[12] = new Resource("equipment", false, "#ff8b82", 0);
res[13] = new Resource("cash", true, "#d19eff", 0);

for (i = 0; i < res.length; i++) {
    recon.set(i, res[i].name);
    reconback.set(res[i].name, i);
    for (e = 0; e < res.length; e++) {
        res[i].rates[e] = 0;
        res[i].auto[e] = false;
    }
}

res[0].rates[res.length - 1] =   .5;
res[2].rates[res.length - 1] = 1.3;
res[5].rates[res.length - 1] = 1.1;
res[4].rates[res.length - 1] = 1.05;
res[3].rates[res.length - 1] = 1.5;
res[6].rates[res.length - 1] = 1.2;
res[7].rates[res.length - 1] = 1.45;
res[11].rates[9] = 1;


// name, resource, cost_base, cost_mult, efficiency, unlocked
var a = res.length - 1;

var bldg = new Array();
bldg[0] = new Building("Farm",           reconback.get('food'), 0, 0, 0, true, 0); // farms
bldg[1] = new Building("Silo",              reconback.get('food'), 0, 0,0 , false, 1); // silos
bldg[2] = new Building("Plantation",     reconback.get('food'), 0, 0, 0, false, 2); // plantations
bldg[3] = new Building("b1", reconback.get('food'), 0, 0, 0, false, 3); // plantations
bldg[52] = new Building("b14", reconback.get('food'), 0,0, 0, false, 4); 

bldg[36] = new Building("a1", reconback.get('housing'), 0, 0, 0, false, 0); 
bldg[37] = new Building("a2", reconback.get('housing'), 0, 0, 45, false, 1); 
bldg[38] = new Building("a3", reconback.get('housing'), 0, 0, 0, false, 2); 
bldg[39] = new Building("b10", reconback.get('housing'), 0, 0, 0, false, 3); 
bldg[53] = new Building("b15", reconback.get('housing'), 0, 0, 0, false, 4);

bldg[4] = new Building("Mine",             reconback.get('gold'), 0,  0, 0, false, 0); // mines
bldg[5] = new Building("Bank",            reconback.get('gold'), 0,  0, 0, false, 1); // banks
bldg[6] = new Building("Mint",              reconback.get('gold'), 0, 0,  0, false, 2); // mints
bldg[7] = new Building("b2", reconback.get('gold'), 0,0,0, false, 3); // mints
bldg[54] = new Building("b16", reconback.get('gold'), 0, 0, 0, false, 4); 

bldg[40] = new Building("a4", reconback.get('jewel'), 0, 0, 0, false, 0); 
bldg[41] = new Building("a5", reconback.get('jewel'), 0, 0, 0, false, 1); 
bldg[42] = new Building("a6", reconback.get('jewel'), 0, 0, 0, false, 2); 
bldg[43] = new Building("b11", reconback.get('jewel'), 0, 0, 0, false, 3); 
bldg[55] = new Building("b17", reconback.get('jewel'), 0, 0, 0, false, 4); 

bldg[8] = new Building("Lab",               reconback.get('science'), 0,   0,      0, false, 0); // labs
bldg[9] = new Building("School",          reconback.get('science'), 0, 0,  0, false, 1); // school
bldg[10] = new Building("Collider",        reconback.get('science'), 0,  0,    0, false, 2); 
bldg[11] = new Building("b3", reconback.get('science'), 0, 0, 0, false, 3); 
bldg[56] = new Building("b18", reconback.get('science'), 0, 0, 0, false, 4); 

bldg[12] = new Building("Quarry",          reconback.get('mineral'), 0,  0,  0, false, 0); 
bldg[13] = new Building("Storehouse", reconback.get('mineral'), 0, 0,    0, false, 1); 
bldg[14] = new Building("Fracker",       reconback.get('mineral'), 0, 0,   0, false, 2);
bldg[15] = new Building("b4", reconback.get('mineral'), 0, 0, 0, false, 3); 
bldg[57] = new Building("b19", reconback.get('mineral'), 0, 0, 0, false, 4); 

bldg[24] = new Building("4", reconback.get('oil'), 0, 0, 0, false, 0); 
bldg[25] = new Building("5", reconback.get('oil'), 0, 0, 0, false, 1); 
bldg[26] = new Building("6", reconback.get('oil'), 0, 0, 0, false, 2); 
bldg[27] = new Building("b7", reconback.get('oil'), 0, 0, 0, false, 3); 
bldg[58] = new Building("b20", reconback.get('oil'), 0, 0, 0, false, 4); 

bldg[28] = new Building("1", reconback.get('uranium'), 0, 0, 0, false, 0); 
bldg[29] = new Building("2", reconback.get('uranium'), 0, 0, 0, false, 1); 
bldg[30] = new Building("3", reconback.get('uranium'), 0, 0, 0, false, 2); 
bldg[31] = new Building("b8", reconback.get('uranium'), 0, 0, 0, false, 3); 
bldg[59] = new Building("b21", reconback.get('uranium'), 0, 0, 0, false, 4); 

bldg[16] = new Building("Theatre",       reconback.get('culture'), 0,0, 0, false, 0); 
bldg[17] = new Building("Museum", reconback.get('culture'), 0, 0, 0, false, 1); 
bldg[18] = new Building("Auditorium", reconback.get('culture'), 0, 0, 0, false, 2); 
bldg[19] = new Building("b5", reconback.get('culture'), 0, 0, 0, false, 3); 
bldg[60] = new Building("b22", reconback.get('culture'), 0, 0, 0, false, 4); 

bldg[44] = new Building("a7", reconback.get('political'), 0, 0, 0, false, 0);
bldg[45] = new Building("a8", reconback.get('political'), 0, 0, 0, false, 1);
bldg[46] = new Building("a9", reconback.get('political'), 0, 0, 0, false, 2);
bldg[47] = new Building("b12", reconback.get('political'), 0, 0, 0, false, 3);
bldg[61] = new Building("b23", reconback.get('political'), 0, 0, 0, false, 4); 

bldg[20] = new Building("Generator", reconback.get('energy'), 0, 0, 0, false, 0); 
bldg[21] = new Building("Accumulator", reconback.get('energy'), 0, 0, 0, false, 1); 
bldg[22] = new Building("Powerplant", reconback.get('energy'), 0, 0, 0, false, 2); 
bldg[23] = new Building("b6", reconback.get('energy'), 0, 0, 0, false, 3); 
bldg[62] = new Building("b24", reconback.get('energy'), 0, 0, 0, false, 4); 

bldg[32] = new Building("7", reconback.get('tradition'), 0, 0, 0, false, 0); 
bldg[33] = new Building("8", reconback.get('tradition'), 0, 0, 0, false, 1); 
bldg[34] = new Building("9", reconback.get('tradition'), 0, 0, 0, false, 2); 
bldg[35] = new Building("b9", reconback.get('tradition'), 0, 0, 0, false, 3); 
bldg[63] = new Building("b25", reconback.get('tradition'), 0, 0, 0, false, 4); 

bldg[48] = new Building("a0", reconback.get('equipment'), 0, 0, 0, false, 0); 
bldg[49] = new Building("a11", reconback.get('equipment'), 0, 0, 0, false, 1); 
bldg[50] = new Building("a12", reconback.get('equipment'), 0, 0, 0, false, 2); 
bldg[51] = new Building("b13", reconback.get('equipment'), 0, 0, 0, false, 3); 
bldg[64] = new Building("b26", reconback.get('equipment'), 0, 0, 0, false, 4); 

var bldgtxt = new Map();
var builds = new Map();

for (i = 0; i < bldg.length; i++) {
    bldgtxt.set(i, bldg[i].name.toLowerCase());
    builds.set(bldg[i].name.toLowerCase(), i);
}

var clicker = new Array();
var rowclicker = new Array();

var supclick = 1000;

var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

for (var i = 0; i < res.length - 1; i++) {
    clicker[i] = 1000;
    rowclicker[i] = 1000;

    var newcol = document.createElement("TR");
    newcol.id = res[i].name.toLowerCase() + "-column";
    document.getElementById('mainbody').appendChild(newcol);

    source = document.getElementById("entry-template").innerHTML;
    template = Handlebars.compile(source);

    var context = { type: res[i].name, abr: res[i].name.substring(0, 2) };
    var html = template(context);

    var owos = document.createElement("TR");
    owos.innerHTML = html;
    owos.className = 'row' + res[i].name;
    document.getElementById('ledgerbody').appendChild(owos);
    
    var newrow = document.createElement("TD");
    newrow.id = "col" + (i + 1);
    newrow.className = "topalign";

    source = document.getElementById("appear-template").innerHTML;
    template = Handlebars.compile(source);
    
    var newappear = document.createElement("TD");
    context = { name: res[i].name.toLowerCase(), ide: i };
    html = template(context);
    newappear.innerHTML = html;
    newappear.className = 'clicktd';
    document.getElementById(res[i].name.toLowerCase() + "-column").appendChild(newappear);
    document.getElementById(res[i].name.toLowerCase() + "-column").appendChild(newrow);
}

    $('.clicktd').on('mouseenter', setScroll);
    $('.clicktd').on('mouseleave', function () { MouseScroller = false });


var into = 0;

for (var i = 0; i < res.length; i++) {
    for (var e = 0; e < res.length; e++) {
        if (res[i].rates[e] != 0) {
            var owos = document.createElement("TR");

            source = document.getElementById("conv-template").innerHTML;
            template = Handlebars.compile(source);

            var context = { name1: res[i].name, name2: res[e].name, ide1: i, ide2: e };
            var html = template(context);

            owos.innerHTML = html;

            if ((into % 2) == 1) {
                owos.className = 'row-even';
            } else {
                owos.className = 'row-odd';
            }
            into++;
            document.getElementById('conver').insertBefore(owos, document.getElementById('convanchor'));
        }
    }
}



source = document.getElementById("bldg-template").innerHTML;
template = Handlebars.compile(source);

for (var i = 0; i < bldg.length; i++) {
    var context = { bldg: bldg[i].name.toLowerCase(), name: bldg[i].name, ide: i };
    var html = template(context);

    var owos = document.createElement("table");
    owos.innerHTML = html;
    owos.className = 'boxholder';
    owos.id = bldg[i].name.toLowerCase() + "_holder";
    document.getElementById('col' + (bldg[i].resource + 1)).appendChild(owos);
 
    if (bldg[i].costers.length > 1) {
        for (var e = 1; e < bldg[i].costers.length; e++) {
            var newcost = document.createElement("img");
            newcost.setAttribute("src", res[bldg[i].costers[e]].name + ".png");
            newcost.className = "food-icon cashicon";
            document.getElementById(i + "cost").appendChild(newcost);
        }
    }
}  

chargeamt = 3;


source = document.getElementById("charge-template").innerHTML;
template = Handlebars.compile(source);

for (var i = 0; i < chargeamt; i++) {
    var context = { chargename: "doogus", chargeid: i};
    var html = template(context);

    var owos = document.createElement("TR");
    owos.innerHTML = html;
    document.getElementById('chargeanchor').appendChild(owos);
}  


var tech_level = 0;
var tech_unlocked = new Array();
var tech_possible = new Array();
var earliest_tech = 1;
var tech_level_active;

var techs_cost_base = 20;
var techs_cost_mult = 5;
var tech_cost = techs_cost_base;
var tech_name = 0;
var tech_descr = 0;

for (i = 0; i < 12; i++) {
    tech_unlocked[i] = false;
    tech_possible[i] = false;
}

var idea_level = 0;
var idea_unlocked = new Array();
var idea_possible = new Array();
var earliest_idea = 1;
var idea_level_active;

var ideas_cost_base = 20;
var ideas_cost_mult = 5;
var idea_cost = ideas_cost_base;
var idea_name = 0;
var idea_descr = 0;

for (i = 0; i < 12; i++) {
    idea_unlocked[i] = false;
    idea_possible[i] = false;
}


function techleft() {
    techpossible();
    if (tech_possible[tech_level_active - 1]) {
        --tech_level_active;
    } else {
        tech_level_active = earliest_tech;
    }
}

function techright(go) {
    techpossible();
    if (go > tech_level_active * 2) {
        tech_level_active = earliest;
    }
    if (tech_possible[tech_level_active + go]) {
        tech_level_active += go;
    } else {
        techright(go + 1);
    }
}

function techpossible() {
    e = false;
    holt = tech_possible.length + 1;
    for(i = 0; i < holt; i++){
        if (i > 0 && i < tech_level + 4 && !tech_unlocked[i]) {
            tech_possible[i] = true;
            if (!e) {
                earliest_tech = i;
                e = true;
            }
    } else {
        tech_possible[i] = false;
}
}
}


function idealeft() {
    ideapossible();
    if (idea_possible[idea_level_active - 1]) {
        --idea_level_active;
    } else {
        idea_level_active = earliest_idea;
    }
}

function idearight(go) {
    ideapossible();
    if (go > idea_level_active * 2) {
        idea_level_active = earliest;
    }
    if (idea_possible[idea_level_active + go]) {
        idea_level_active += go;
    } else {
        idearight(go + 1);
    }
}

function ideapossible() {
    e = false;
    holt = idea_possible.length + 1;
    for(i = 0; i < holt; i++){
        if (i > 0 && i < idea_level + 4 && !idea_unlocked[i]) {
            idea_possible[i] = true;
            if (!e) {
                earliest_idea = i;
                e = true;
            }
    } else {
        idea_possible[i] = false;
}
}
}

var framer = 1;

var all = false;

function Matrix() {
  this.a = 1; // identity matrix
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.e = 0;
  this.f = 0;
}

Matrix.prototype = {

    applyToPoint: function(p) {
      return {
        x: p.x * this.a + p.y * this.c + this.e + 15,
        y: p.x * this.b + p.y * this.d + this.f + 15
      }
    },

    transform: function(a2, b2, c2, d2, e2, f2) {

      var a1 = this.a,
          b1 = this.b,
          c1 = this.c,
          d1 = this.d,
          e1 = this.e,
          f1 = this.f;

      /* matrix order (canvas compatible):
       * ace
       * bdf
       * 001
       */
      this.a = a1 * a2 + c1 * b2;
      this.b = b1 * a2 + d1 * b2;
      this.c = a1 * c2 + c1 * d2;
      this.d = b1 * c2 + d1 * d2;
      this.e = a1 * e2 + c1 * f2 + e1;
      this.f = b1 * e2 + d1 * f2 + f1;
    },

    rotate: function(angle) {
      var cos = Math.cos(angle),
          sin = Math.sin(angle);
      this.transform(cos, sin, -sin, cos, 0, 0);
    },

    scale: function(sx, sy) {
      this.transform(sx, 0, 0, sy, 0, 0);
    },

    translate: function(tx, ty) {
      this.transform(1, 0, 0, 1, tx, ty);
    },

    reset: function () {
        this.a = 1; // identity matrix
        this.b = 1;
        this.c = 1;
        this.d = 1;
        this.e = 1;
        this.f = 1;
    }
};

// apply some transformation:
var m = new Matrix();     // our manual transformation-matrix
m.translate(50, 50);      // center of box
m.rotate(.25 * Math.PI);            // some angle in radians
m.translate(-50, -50);    // translate back

var points = [
      {x: 0, y: 0},       // upper-left
      {x: 40, y:  0},     // upper-right
      {x: 40, y: 40},   // bottom-right
      {x: 0, y: 40}      // bottom-left
    ],
    result = [], i = 0, p;

// transform points
while(p = points[i++]) result.push(m.applyToPoint(p));

// draw boxes to canvas:
var canvas = document.querySelector("canvas");
var ctx = document.querySelector("canvas").getContext("2d");
ctx.translate(30, 30);    // give some room for rotation for this demo

drawPolygon(result, "blue");
 
//drawCoord(points[0]);     // plot old point
//drawCoord(result[0]);     // plot resulting point


// plot result:
function drawPolygon(pts, color) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(pts[0].x, pts[0].y);
  for(var i = 1, p; p = pts[i++];) ctx.lineTo(p.x, p.y);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = currColor;
  ctx.fill();
}

function drawCoord(p) {
  ctx.fillText('!');
}

var repetir = 99;
var rep_max = 100;
var last_click;
var supermod = 10;

var active_colour = "#1a1c1b";
var inactive_colour = "#7e8c85";

var flasher = 0;
var flasher_interval = 70;

var flash_tech = false;
var flash_idea = false;
var flash_worker = false;

var active_page = 2;
var pages = 4;

function switchPage(inter) {
    if (inter < pages + 1) {
        active_page = inter;
    }
    activatePage();

}  

function activatePage() {
    for (r = 1; r < pages + 1; r++) {
        if (active_page == r) {
            document.getElementById('page' + r).style.display = "block";
            document.getElementById(r + 'pageclick').style.background = "#d8d6d6";
            document.getElementById(r + 'pageclick').style.transform = "scale(1.1,1.1)";
        } else {
            document.getElementById('page' + r).style.display = "none";
            document.getElementById(r + 'pageclick').style.background = "white";
            document.getElementById(r + 'pageclick').style.transform = "scale(.965,.965)";
        }
    }
}

activatePage();

// Audio
var snd = new Audio("click.wav");
// snd.play();

//document.getElementById('ledgerbody').appendChild( document.getElementsByClassName('rowfood')[0].cloneNode(true) );

function small_int(e){
      var size = Math.floor(Math.log10(Math.abs(e))) + 1;
      var suffix = "";

      if(size < 4){
            return e.toString().substring(0, 3);
      } else {
           e = e.toExponential(9);
         e = e.substring(0,4 + size%3 + 4);
      }
      switch(size){
          case 5: e = e.substring(0, 1) + e.substring(2, 3) + "." + e.substring(3); e = e.substring(0, 6); suffix = "k"; break;
          case 6: e = e.substring(0, 1) + e.substring(2, 4) + "." + e.substring(4); e = e.substring(0, 7); suffix = "k"; break;
          case 4: e = e.substring(0, 5);suffix = "k"; break;
          case 8: e = e.substring(0, 1) + e.substring(2, 3) + "." + e.substring(3); e = e.substring(0, 6); suffix = "m"; break;
          case 9: e = e.substring(0, 1) + e.substring(2, 4) + "." + e.substring(4); e = e.substring(0, 7); suffix = "m"; break;
          case 7: e = e.substring(0, 5); suffix = "m"; break;
          case 11: e = e.substring(0, 1) + e.substring(2, 3) + "." + e.substring(3); e = e.substring(0, 6); suffix = "b"; break;
          case 12: e = e.substring(0, 1) + e.substring(2, 4) + "." + e.substring(4); e = e.substring(0, 7); suffix = "b"; break;
          case 10: e = e.substring(0, 5); suffix = "b"; break;
      }
      return e + suffix;
}


function moveClick() {
    for (i = 0; i < clicker.length; i++) {
        clicker[i] += 5;
        document.getElementById(recon.get(i) + 'appear').style.transform = "translateY(" + (clicker[i] / 3) * -1 + "px)";
        document.getElementById(recon.get(i) + 'appear').style.opacity = 1 - (clicker[i] / 100);
    }

    for (i = 0; i < rowclicker.length; i++) {
        if (rowclicker[i] > 296) {
            rowclicker[i] = 296;
        }
        rowclicker[i] += 3;
    }

    clicker[clicker.length - 1] += .5;
    document.getElementById("superappear").style.transform = "translateY(" + (supclick / 3) * -1 + "px)";
    document.getElementById('superappear').style.opacity = 1 - (supclick / 100)
}

function doFlasher() {
    flasher += .8;
    var flasho = document.getElementsByClassName("flashing");
    if (flasher > (flasher_interval / 2)) {
        for (i = 0; i < flasho.length; i++) {
            flasho[i].style.display = "none";
        }
    }
    if (flasher > flasher_interval) {
        flasher = 0;
        for (i = 0; i < flasho.length; i++) {
            flasho[i].style.display = "block";
        }
    }
    if (!flash_tech) {
        document.getElementById('near_tech').style.display = "none";
    }
    if (!flash_idea) {
        document.getElementById('near_idea').style.display = "none";
    }
    if (!flash_worker) {
        document.getElementById('near_worker').style.display = "none";
    }
}

function isUnlocked() {
   for (i = 0; i < res.length; i++) {
       if (!res[i].unlocked) {
           document.getElementById(res[i].name).style.display = "none";
           document.getElementById(res[i].name.substring(0, 2) + "ps").style.display = "none";
           document.getElementById(res[i].name + '_click').style.display = "none";
           document.getElementById(res[i].name + '-column').style.backgroundColor = "#dbdbdb";
            document.getElementsByClassName('row' + res[i].name)[0].style.display = "none";

            var lister = document.getElementsByClassName(res[i].name + "icon");
            for (r = 0; r < lister.length; r++) {
                lister[r].src = "empty.png";
            }

       } else if(i != res.length - 1){
           document.getElementById(res[i].name).style.display = "inline";
           document.getElementById(res[i].name.substring(0, 2) + "ps").style.display = "inline";
           document.getElementById(res[i].name + '_click').style.display = "block";
           document.getElementById(res[i].name + '-column').style.backgroundColor = res[i].color;
           document.getElementsByClassName('row' + res[i].name)[0].style.backgroundColor = res[i].color;
           document.getElementsByClassName('row' + res[i].name)[0].style.display = "table-row";

            var lister = document.getElementsByClassName(res[i].name + "icon");
            for (r = 0; r < lister.length; r++) {
                lister[r].src = res[i].name + ".png";
            }
        }
    }



   if (debug) {
       spinnerChance = 0;
        for (i = 0; i < bldg.length; i++) {
            if (!bldg[i].unlocked) {
                bldg[i].unlocked = true;
                bldg[i].onDebug = true;
            }
            if(i < res.length && !res[i].unlocked){
                res[i].unlocked = true;
                res[i].onDebug = true;
            }
        }
        
   } else {
       spinnerChance = baseChanceSpinner;
        for (i = 0; i < bldg.length; i++) {
            if (bldg[i].onDebug) {
                bldg[i].unlocked = false;
                bldg[i].onDebug = false;
            }
            if (i < res.length && res[i].onDebug) {
                res[i].unlocked = false;
                res[i].onDebug = false;
            }
        }
    }
    
   for (i = 0; i < bldg.length; i++) {
        if (!bldg[i].unlocked) {
            document.getElementById(bldgtxt.get(i) + '_holder').style.display = "none";
            bldg[i].amt = 0;
            bldg[i].working = 0;
        } else {
            document.getElementById(bldgtxt.get(i) + '_holder').style.display = "inline-table";
        }
   }

   doFlasher();
}

function init() {
    displaytech();
    displayidea();

    for(i = 0; i < res.length - 1; i++){
        if (res[i].unlocked) {
            document.getElementById(res[i].name.substring(0, 2) + 'ps').innerHTML = "(" + small_int((res[i].ps)) + ' /s)';
            document.getElementById(res[i].name).innerHTML = small_int(Math.floor(res[i].amt));
        }
    }
    
    document.getElementById('cash').innerHTML = small_int(Math.floor(res[res.length - 1].amt));  
    
    for (var i = 0; i < res.length; i++) {
        for (var e = 0; e < res.length; e++){
            if (res[i].rates[e] != 0) {
                document.getElementById(res[i].name + "_to_" + res[e].name + "_rate").innerHTML = res[i].rates[e];
            }
        }
    }
    
    document.getElementById('workers_number').innerHTML = av_workers + " / " + total_workers;
    document.getElementById('worker_cost').innerHTML = small_int(Math.ceil(worker_cost));

    for (i = 0; i < bldg.length; i++) {
        if (bldg[i].unlocked) {
            document.getElementById(bldgtxt.get(i) + 's_number').innerHTML = bldg[i].amt;
            document.getElementById(bldgtxt.get(i) + 's_fps').innerHTML = "(" + small_int(bldg[i].fps) + ' /s)';
            document.getElementById(bldgtxt.get(i) + '_cost').innerHTML = small_int(Math.ceil(bldg[i].cost));
            document.getElementById(bldgtxt.get(i) + '_working').innerHTML = bldg[i].working + " / " + bldg[i].amt;
        }
    }

    document.getElementById('tech_level').innerHTML = tech_level_active;
    document.getElementById('tech_cost').innerHTML = small_int(Math.ceil(tech_cost));

    document.getElementById('tech_name').innerHTML = tech_name;
    document.getElementById('tech_descr').innerHTML = tech_descr;

    document.getElementById('idea_level').innerHTML = idea_level_active;
    document.getElementById('idea_cost').innerHTML = small_int(Math.ceil(idea_cost));

    document.getElementById('idea_name').innerHTML = idea_name;
    document.getElementById('idea_descr').innerHTML = idea_descr;
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        all = !all;
       alert("[Buy All Buildings] toggled to " + all);
    }
    else if (event.keyCode == 38) {
        debug = !debug;
    }

    if (event.keyCode == 83) {
        techleft();
    } else if (event.keyCode == 68) {
        techright(1);
    }
    else if (event.keyCode > 48 && event.keyCode <= 49 + res.length ){
        res[event.keyCode - 49].amt *= 100;
    }
});

function auto(first, second) {
    res[first].auto[second] = !res[first].auto[second];
      if(res[first].auto[second]){
          document.getElementById(res[first].name + res[second].name + 'convo').innerHTML = '☑';
      } else {
          document.getElementById(res[first].name + res[second].name + 'convo').innerHTML = ' ☐';
      }
}

function converter(first, second) {
    i = (res[first].amt * res[first].rates[second]);
    if (i > (res[second].amt * .1)) {
        i /= 100;
    }
    res[second].amt += i;
    res[first].amt -= i / res[first].rates[second];
}

var check_cost = new Array(chargeamt);

for (i = 0; i < check_cost.length; i++){
    check_cost[i] = 10 * (1 + i);
    document.getElementById('charge_cost' + i).innerHTML = check_cost[i];
}

function chargecost(typer){
    check_cost[typer] = Math.floor(check_cost[typer] *= 1.1) + 10;
    document.getElementById('charge_cost' + typer).innerHTML = check_cost[typer];
}

function buy_charge(type) {
    if (res[10].amt >= check_cost[type]) {
        res[10].amt -= check_cost[type];
        chargecost(type);
        var sel = Math.floor(res.length * Math.random());
        var times = (5 + Math.ceil(3 * Math.random()));

        switch (type) {
            case 0: res[sel].amt *= times; break;
        }
    }
}

function buytech() {
    if (res[4].amt >= tech_cost) {
        res[4].amt -= tech_cost;
        ++tech_level;
        techcost();
        unlocktech();

        techpossible();
        tech_level_active = earliest_tech;
    }
    init();
}

function techcost() {
    tech_cost = (techs_cost_base * techs_cost_mult * (Math.pow(1.37, (tech_level + 1)) - Math.pow(1.37, tech_level))) / 0.40;
}

function buyidea() {
    if (res[8].amt >= idea_cost) {
        res[8].amt -= idea_cost;
        ++idea_level;
        ideacost();
        unlockidea();

        ideapossible();
        idea_level_active = earliest_idea;
    }
    init();
}

function ideacost() {
    idea_cost = (ideas_cost_base * ideas_cost_mult * (Math.pow(1.37, (idea_level + 1)) - Math.pow(1.37, idea_level))) / 0.40;
}


function findPS() {
           for (i = 0; i < bldg.length; i++) {
               bldg[i].fps = bldg[i].working * bldg[i].efficiency * res[bldg[i].resource].mult;
           }

           for (u = 0; u < res.length; u++) {
               res[u].ps = 0;
               res[u].limit = res[u].baselimit;
               for (e = 0; e < bldg.length; e++) {
                   if (bldg[e].resource == u) {
                       res[u].ps += bldg[e].fps;
                   } 
               }
           }
}

function decimalToHexString(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }

    number = number.toString(16).toUpperCase();
   for (y = 0; y < 7 - number.toString().length; y++) {
        number = "0" + number;
   }

    return number;
}

function unlocktech() {

      switch (tech_level_active){
            case 1: bldg[0].efficiency += .1; break;
            case 2: bldg[6].unlocker(); break;
            case 3: res[5].unlocker(); bldg[3].unlocker(); bldg[9].unlocker(); break;
            case 4: bldg[4].unlocker(); break;
            case 5: bldg[1].unlocker(); bldg[0].efficiency *= 1.5; break;
            case 6: bldg[2].unlocker(); res[0].rates[res.length-1] += .3; break;
            case 7: bldg[5].unlocker(); bldg[6].efficiency *= 1.25; break;
          case 8: bldg[7].unlocker(); break;
          case 9: workers_cost_mult *= .8; workercost(); break;
          case 10: res[5].unlocker(); break;
      }

      if (tech_level + 1> tech_unlocked.length) {
          res[0].mult += .1;
          res[1].mult += .1;
      }

      tech_unlocked[tech_level_active] = true;

      isUnlocked();

}

function displaytech(){
      switch (tech_level_active){
            case 1: tech_name = "Agriculture";
                    tech_descr ="Farms become more efficient";
                    break;
            case 2: tech_name = "Philosophy";
                    tech_descr ="Allows automated production of Science through Labs";
                    break;
                case 3: tech_name = "Mining";
                    tech_descr = "Unlocks the Quarry and the Mine";
                    break;
                case 4: tech_name = "Trade";
                    tech_descr = "Unlocks the Trading Post";
                    break;
            case 5: tech_name = "Agriculture+";
                    tech_descr ="Unlocks the Silo and makes Farms 50% more efficient";
                    break;
            case 6: tech_name = "Cash Crops";
                    tech_descr ="Unlocks the Plantation and improves the Food ➩ Cash rate";
                    break;
            case 7: tech_name = "Central Bank";
                    tech_descr ="Unlocks the Mint and makes Trading Posts 25% more efficient";
                    break;
            case 8: tech_name = "Public Education";
                    tech_descr ="Unlocks the school to produce more Science";
                    break;
                case 9: tech_name = "Healthcare";
                    tech_descr = "Food Cost to buy Workers reduced by 20%";
                    break;
                case 10: tech_name = "Cultural Revolution";
                    tech_descr = "Culture unlocked";
                    break;
            case 11: tech_name = "Internal Improvements";
                    tech_descr ="GPS and FPS multiplier increased by 10%";
                    break;
      }
}

function unlockidea() {

      switch (idea_level_active){
            case 1: bldg[0].efficiency += .1; break;
            case 2: bldg[6].unlocker(); break;
            case 3: res[5].unlocker(); bldg[3].unlocker(); bldg[9].unlocker(); break;
            case 4: bldg[4].unlocker(); break;
            case 5: bldg[1].unlocker(); bldg[0].efficiency *= 1.5; break;
            case 6: bldg[2].unlocker(); res[0].rates[res.length-1] += .3; break;
            case 7: bldg[5].unlocker(); bldg[6].efficiency *= 1.25; break;
          case 8: bldg[7].unlocker(); break;
          case 9: workers_cost_mult *= .8; workercost(); break;
          case 10: res[4].unlocker(); break;
      }

      if (idea_level + 1> idea_unlocked.length) {
          res[0].mult += .1;
          res[1].mult += .1;
      }

      idea_unlocked[idea_level_active] = true;

      isUnlocked();

}

function displayidea(){
      switch (idea_level_active){
            case 1: idea_name = "Agriculture";
                    idea_descr ="Farms become more efficient";
                    break;
            case 2: idea_name = "Philosophy";
                    idea_descr ="Allows automated production of Science through Labs";
                    break;
                case 3: idea_name = "Mining";
                    idea_descr = "Unlocks the Quarry and the Mine";
                    break;
                case 4: idea_name = "Trade";
                    idea_descr = "Unlocks the Trading Post";
                    break;
            case 5: idea_name = "Agriculture+";
                    idea_descr ="Unlocks the Silo and makes Farms 50% more efficient";
                    break;
            case 6: idea_name = "Cash Crops";
                    idea_descr ="Unlocks the Plantation and improves the Food ➩ Cash rate";
                    break;
            case 7: idea_name = "Central Bank";
                    idea_descr ="Unlocks the Mint and makes Trading Posts 25% more efficient";
                    break;
            case 8: idea_name = "Public Education";
                    idea_descr ="Unlocks the school to produce more Science";
                    break;
                case 9: idea_name = "Healthcare";
                    idea_descr = "Food Cost to buy Workers reduced by 20%";
                    break;
                case 10: idea_name = "Cultural Revolution";
                    idea_descr = "Culture unlocked";
                    break;
            case 11: idea_name = "Internal Improvements";
                    idea_descr ="GPS and FPS multiplier increased by 10%";
                    break;
      }
}

function buyWorker() {
    if (!(res[0].amt >= worker_cost)) {
        return;
    }
    do {
        res[0].amt -= worker_cost;
        ++total_workers;
        ++av_workers;
        workercost();
    } while (res[0].amt >= worker_cost && all);
   init();
}

function workercost(){
    worker_cost = (workers_cost_base * workers_cost_mult * (Math.pow(1.073, (total_workers - 1)) - Math.pow(1.073, total_workers - 2))) / 0.15;
}

tech_level_active = tech_level + 1;
idea_level_active = idea_level + 1;

var spinnerActive = true;

var rotateP = 0;
var rotateV = .075;
var rotateA = .995;
var rotateSize = 60;
var rotatePange = 2;

canvas.width = rotateSize + 30;
canvas.height = rotateSize + 30;

var spinnerChance = baseChanceSpinner;

function resetRotate() {
    rotateSize = Math.ceil(65 + (40 * Math.random()));
    rotateV = .065 + (.05 * Math.random());
    rotateA = .98 + (.017 * Math.random());

    var locX = (window.innerWidth - (rotateSize + 30)) * Math.random();
    var locY = (window.innerHeight - (rotateSize + 30)) * Math.random();

    document.getElementById("spinner").style.left = locX + "px";
    document.getElementById("spinner").style.top = locY + "px";

    canvas.width = rotateSize + 30;
    canvas.height = rotateSize + 30;
    currColor = colorRand[Math.floor(colorRand.length * Math.random())]

}

resetRotate();

function showSpinner() {
    if (spinnerActive) {
        document.getElementById("spinner").style.display = "block";
    } else {
        document.getElementById("spinner").style.display = "none";
    }
}

    var resnow = res.length - 1;

function clickSpinner() {
    spinnerActive = !spinnerActive;
    resetRotate();

    res[resnow].amt *= 1 + (rotateSize / 500);

    switch (currColor) {
        case "Blue": resnow = 5; break;
        case "Red": resnow = 11; break;
        case "Purple": resnow = 9; break;
        case "Grey": resnow = 5; break;
        case "Yellow": resnow = res.length - 1;break;
        case "Green": resnow = 0;
    }
}
    
function repeat() {
    showSpinner();

    if (rotateP > rotatePange) {
        rotateP = 0;
    }
    rotateP += rotateV;

    if (!(rotateV < .005)) {
        rotateV *= rotateA;
    }

    if (Math.random() > spinnerChance) {
        spinnerActive = true;
    }
    
    for (i = 0; i < res.length - 1; i++) {
        if (res[i].amt + res[i].ps / (126 / framer) > -1) {
            res[i].amt += res[i].ps / (126 / framer);
        }
        res[i].click = 1 + tech_level / 4;
        document.getElementById(res[i].name + "appear").innerHTML = "+" + res[i].click;
    }

   if (repetir > rep_max) {
        repetir = 0;
        rep_max = Math.ceil(rep_max * 1.1);
        if (last_click == 1) { last_click = 5 };
        supclick = 0;

        var rec = (res[last_click].amt * ((res[last_click].click* 20 / rep_max) + 1) - res[last_click].amt);
         document.getElementById("superappear").innerHTML = "+" + Math.ceil(rec);
         res[last_click].amt += rec;

        clicker[5] = 0;
   }
   document.getElementById('super').style.width = ((repetir / rep_max) * 200) + "px";
   document.getElementById('superbox').innerHTML = repetir + " / " + rep_max;
   supclick++;
    findPS();
    workercost();
    isUnlocked();
    
   moveClick();

    for (y = 0; y < res.length; y++) {
        for (e = 0; e < res.length; e++) {
            if (res[y].auto[e]) {
                converter(y, e);
            }
        }
    }

    for (u = 0; u < bldg.length; u++) {
        bldg[u].costfind();
    }

    //rotateP = 0;
    //spinnerActive = true;
    
// apply some transformation: 
var g = new Matrix();     // our manual transformation-matrix
g.translate(rotateSize / 2, rotateSize / 2);      // center of box
g.rotate(((rotateP)) * Math.PI);            // some angle in radians
g.translate(-rotateSize / 2, -rotateSize / 2);    // translate back

var pointsa = [
      {x: 10, y: 0},       // upper-left
      {x: 0, y: 10},       // upper-left
      {x: 0, y: rotateSize - 10},      // bottom-left
      {x: 10, y: rotateSize},      // bottom-left
      {x: rotateSize - 10, y: rotateSize},      // bottom-right
      {x: rotateSize, y: rotateSize - 10},      // bottom-right
      {x: rotateSize , y: 10},      // upper-right
      {x: rotateSize - 10, y: 0},      // upper-right
    ],
    result = [], e = 0, o;


// transform points
while(o = pointsa[e++]) result.push(g.applyToPoint(o));
    ctx.clearRect (-200, -200, 500, 500);
    drawPolygon(result, "blue");   
    ctx.font = "50px Georgia";
    ctx.fillStyle = "white";
    ctx.fillText("!", 7.5 + (rotateSize / 2), 31 + (rotateSize / 2)); 
    
    

    for (i = 0; i < bldg.length; i++) {
        for (e = 0; e < bldg[i].costers.length; e++) {
            if (res[bldg[i].costers[e]].amt >= bldg[i].cost) {
                document.getElementById(bldgtxt.get(i) + "_cost").style.color = active_colour;
            } else {
                document.getElementById(bldgtxt.get(i) + "_cost").style.color = inactive_colour;
                break;
            }
        }
    }

   if(res[0].amt >= worker_cost){
       document.getElementById("worker_cost").style.color = active_colour;
       flash_worker = true;
   } else {
       document.getElementById("worker_cost").style.color = inactive_colour;
       flash_worker = false;
   }

   if(res[4].amt >= tech_cost){
       document.getElementById("tech_cost").style.color = active_colour;
       flash_tech = true;
   } else {
       document.getElementById("tech_cost").style.color = inactive_colour;
       flash_tech = false;
   }

   if(res[8].amt >= idea_cost){
       document.getElementById("idea_cost").style.color = active_colour;
       flash_idea = true;
   } else {
       document.getElementById("idea_cost").style.color = inactive_colour;
       flash_idea = false;
   }

   init();
   setTimeout(repeat, framer);
}

for (r = 1; r < pages + 1; r++) {
    document.getElementById("page" + r).style.width = screen.width - (310 * 2) + "px";
}

//var setter = prompt("hi", "hi");
//alert(res[2].amt.toString(36) + "ȧ");
//alert(parseInt(setter, 36));
//alert(setter);

    var exporter = "";
function exporto() {
alert(doc.dayscale)
    exporter = "";
    for (i = 0; i < bldg.length; i++) {
        exporter += bldg[i].amt + "ȧ";
        exporter += bldg[i].working + "ȧ";
        exporter += (bldg[i].efficiency * 1000) + "ȧ";
        exporter += bldg[i].unlocked + "ȧ";
        exporter += bldg[i].onDebug + "ȧ";
    }
    document.getElementById('exp').innerHTML = exporter;
}

function importo() {
    var owo = exporter.split("ȧ");

    for (i = 0; i < bldg.length; i++) {
        bldg[i].amt = owo[(i * 5)];
        bldg[i].working = owo[(i * 5) + 1];
        bldg[i].efficiency = owo[(i * 5) + 2] / 1000;
        bldg[i].unlocked = owo[(i * 5) + 3];
        bldg[i].onDebug = owo[(i * 5) + 4];
    }


    /*var stranger = "";
    for (i = 0; i < owo.length; i++) {
        if (owo[i] != true && owo[i] != false) {
            stranger += parseInt(owo[i], 36) + "<br>";
        } else {
            stranger += owo[i] + "<br>";
        }
    }
    document.getElementById('imp').innerHTML = stranger;*/
}


switchPage(1);
auto(0, res.length - 1);
auto(0, res.length - 1);
auto(2, res.length - 1);
auto(4, res.length - 1);
auto(4, res.length - 1);
auto(5, res.length - 1);
auto(5, res.length - 1);
init();
repeat();
