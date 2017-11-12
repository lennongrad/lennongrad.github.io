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

$('#appearrow').bind('mouseenter', setScroll);
$('#appearrow').bind('mouseleave', function () { MouseScroller = false});

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

function Building(name, resource, cost_base, cost_mult, efficiency, unlocked, costs, purpose) {
    this.resource = resource;
    this.cost_base = cost_base;
    this.cost_mult = cost_mult;
    this.efficiency = efficiency;
    this.unlocked = unlocked;
    this.name = name;
    this.purpose = purpose;

    this.costers = new Array();

    for(i = 0; i < costs.length; i++){
        this.costers[i] = costs[i];
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
res[0] = new Resource("food", true, "#b6ff9e", 0, 10000);
res[1] = new Resource("housing", false, "#b6ff9e", 0, 10000);
res[2] = new Resource("gold", true, "#fff69e", 90000, 10000);
res[3] = new Resource("jewel", false, "#fff69e", 90000, 10000);
res[4] = new Resource("science", true, "#9ea7ff", 10000, 10000);
res[5] = new Resource("mineral", false, "#d8c2a4", 0, 10000);
res[6] = new Resource("uranium", false, "#d8c2a4", 0, 100000);
res[7] = new Resource("oil", false, "#d8c2a4", 0, 100000);
res[8] = new Resource("culture", false, "#d19eff", 0, 10000);
res[9] = new Resource("political", false, "#d19eff", 0, 10000);
res[10] = new Resource("energy", false, "#9effd9", 0, 100000);
res[11] = new Resource("tradition", false, "#ff8b82", 0, 100000);
res[12] = new Resource("equipment", false, "#ff8b82", 0, 100000);
res[13] = new Resource("cash", true, "#d19eff", 0, 100000);

for (i = 0; i < res.length; i++) {
    recon.set(i, res[i].name);
    reconback.set(res[i].name, i);
    for (e = 0; e < res.length; e++) {
        res[i].rates[e] = 1;
        res[i].auto[e] = false;
    }
}

res[0].rates[res.length - 1] =   .5;
res[2].rates[res.length - 1] = 1.3;
res[4].rates[res.length - 1] =   .9;
res[5].rates[res.length - 1] = 1.1;


// name, resource, cost_base, cost_mult, efficiency, unlocked
var a = res.length - 1;

var bldg = new Array();
bldg[0] = new Building("Farm",           reconback.get('food'), 25,         1.6,     .15, true, [res.length - 1], 0); // farms
bldg[1] = new Building("Silo",              reconback.get('food'), 200,       1.8,      2.5, false, [res.length - 1,3], 1); // silos
bldg[2] = new Building("Plantation",     reconback.get('food'), 3450,    2,         3.5, false, [res.length - 1], 0); // plantations
bldg[3] = new Building("Mine",             reconback.get('gold'), 25,        1.65,    .25, false, [res.length - 1], 0); // mines
bldg[4] = new Building("Bank",            reconback.get('gold'), 200,      2.1,      8, false, [res.length - 1,3], 1); // banks
bldg[5] = new Building("Mint",              reconback.get('gold'), 3500,   2.7,       3.5, false, [res.length - 1], 0); // mints
bldg[6] = new Building("Lab",               reconback.get('science'), 200,     2.5,      2, false, [res.length - 1], 0); // labs
bldg[7] = new Building("School",          reconback.get('science'), 200, 2.95,    45, false, [res.length - 1,3], 1); // school
bldg[8] = new Building("Collider",        reconback.get('science'), 2000,  2.95,    3.5, false, [res.length - 1], 0); 
bldg[9] = new Building("Quarry",          reconback.get('mineral'), 50,       1.95,    .24, false, [res.length - 1], 0); 
bldg[10] = new Building("Storehouse", reconback.get('mineral'), 200, 2.95,    45, false, [res.length - 1,3], 1); 
bldg[11] = new Building("Fracker",       reconback.get('mineral'), 2000, 2.95,    45, false, [res.length - 1], 0); 
bldg[12] = new Building("Theatre",       reconback.get('culture'), 1500, 2.95,    .25, false, [res.length - 1], 0); 
bldg[13] = new Building("Museum", reconback.get('culture'), 200, 2.95, 45, false, [res.length - 1, 3], 1); 
bldg[14] = new Building("Auditorium", reconback.get('culture'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[15] = new Building("Generator", reconback.get('energy'), 300, 2.95, .25, false, [res.length - 1], 0); 
bldg[16] = new Building("Accumulator", reconback.get('energy'), 200, 2.95, 45, false, [res.length - 1, 3], 1); 
bldg[17] = new Building("Powerplant", reconback.get('energy'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[18] = new Building("1", reconback.get('uranium'), 300, 2.95, .25, false, [res.length - 1], 0); 
bldg[19] = new Building("2", reconback.get('uranium'), 200, 2.95, 45, false, [res.length - 1, 3,6], 1); 
bldg[20] = new Building("3", reconback.get('uranium'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[21] = new Building("4", reconback.get('oil'), 300, 2.95, .25, false, [res.length - 1], 0); 
bldg[22] = new Building("5", reconback.get('oil'), 200, 2.95, 45, false, [res.length - 1, 3], 1); 
bldg[23] = new Building("6", reconback.get('oil'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[24] = new Building("7", reconback.get('tradition'), 300, 2.95, .25, false, [res.length - 1], 0); 
bldg[25] = new Building("8", reconback.get('tradition'), 200, 2.95, 45, false, [res.length - 1, 3], 1); 
bldg[26] = new Building("9", reconback.get('tradition'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[27] = new Building("a1", reconback.get('housing'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[28] = new Building("a2", reconback.get('housing'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[29] = new Building("a3", reconback.get('housing'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[30] = new Building("a4", reconback.get('jewel'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[31] = new Building("a5", reconback.get('jewel'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[32] = new Building("a6", reconback.get('jewel'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[33] = new Building("a7", reconback.get('political'), 2000, 2.95, 45, false, [res.length - 1], 0);
bldg[34] = new Building("a8", reconback.get('political'), 2000, 2.95, 45, false, [res.length - 1], 0);
bldg[35] = new Building("a9", reconback.get('political'), 2000, 2.95, 45, false, [res.length - 1], 0);
bldg[36] = new Building("a0", reconback.get('equipment'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[37] = new Building("a11", reconback.get('equipment'), 2000, 2.95, 45, false, [res.length - 1], 0); 
bldg[38] = new Building("a12", reconback.get('equipment'), 2000, 2.95, 45, false, [res.length - 1], 0); 

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

    source = document.getElementById("entry-template").innerHTML;
    template = Handlebars.compile(source);

    var context = { type: res[i].name, abr: res[i].name.substring(0,2) };
    var html = template(context);

    var owos = document.createElement("TR");
    owos.innerHTML = html;
    owos.className = 'row' + res[i].name;
    document.getElementById('ledgerbody').appendChild(owos);
    
    var newrow = document.createElement("TD");
    newrow.id = "col" + (i + 1);
    newrow.className = "topalign";
    document.getElementById('row').appendChild(newrow);

    source = document.getElementById("appear-template").innerHTML;
    template = Handlebars.compile(source);
    
    var newappear = document.createElement("TD");
    context = { name: res[i].name.toLowerCase(), ide: i };
    html = template(context);
    newappear.innerHTML = html;
    document.getElementById('appearrow').appendChild(newappear);

    var newcol = document.createElement("COL");
    newcol.id = res[i].name.toLowerCase() + "-column";
    document.getElementById('colgr').appendChild(newcol);

    var newbuffer = document.createElement("TD");
    newbuffer.className = "buffer";
    newbuffer.id = "buffer" + res[i].name;
    document.getElementById('bufferrow').appendChild(newbuffer);
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

var framer = 10;

var all = false;

var repetir = 99;
var rep_max = 100;
var last_click;
var supermod = 10;

var active_colour = "#1a1c1b";
var inactive_colour = "#7e8c85";

var flasher = 0;
var flasher_interval = 70;

var flash_tech = false;
var flash_worker = false;

var active_page = 2;
var pages = 3;

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
            document.getElementById('buffer' + res[i].name).style.width = "0px";

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
            document.getElementById('buffer' + res[i].name).style.width = "178px";

            var lister = document.getElementsByClassName(res[i].name + "icon");
            for (r = 0; r < lister.length; r++) {
                lister[r].src = res[i].name + ".png";
            }
        }
    }



    if (debug) {
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
            document.getElementById(bldgtxt.get(i) + '_holder').style.display = "table";
        }
   }

   doFlasher();
}

function init() {
    displaytech();

    for(i = 0; i < res.length - 1; i++){
        if (res[i].unlocked) {
            document.getElementById(res[i].name.substring(0, 2) + 'ps').innerHTML = "(" + small_int((res[i].ps)) + ' /s)';
            document.getElementById(res[i].name).innerHTML = small_int(Math.floor(res[i].amt));
        }
    }
    
    document.getElementById('cash').innerHTML = small_int(Math.floor(res[res.length - 1].amt));  
    
    document.getElementById('food_to_cash_rate').innerHTML = res[0].rates[res.length - 1];
    document.getElementById('gold_to_cash_rate').innerHTML = res[2].rates[res.length - 1];
    document.getElementById('science_to_cash_rate').innerHTML = res[4].rates[res.length - 1];
    document.getElementById('mineral_to_cash_rate').innerHTML = res[5].rates[res.length - 1];
    
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
    else if (event.keyCode == 40) {
        alert(contour[0] + "," + contour[1] + "," + contour[2])
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

function buytech() {
    if (res[4].amt >= tech_cost) {
        for (i = 0; i < contour.length; i++) {
            if (i > 2) {
                contour[i] = contour[i - 3];
            } else {
                contour[i] = Math.floor(Math.random() * 256) - 1;
            }
        }
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


function findPS() {
           for (i = 0; i < bldg.length; i++) {
               bldg[i].fps = bldg[i].working * bldg[i].efficiency * res[bldg[i].resource].mult;
           }

           for (u = 0; u < res.length; u++) {
               res[u].ps = 0;
               res[u].limit = res[u].baselimit;
               for (e = 0; e < bldg.length; e++) {
                   if (bldg[e].resource == u && bldg[e].purpose == 0) {
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
          case 10: res[4].unlocker(); break;
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
var contour = new Array();
for (var i = 0; i < res.length - 1; i++) {
    contour[i] = 10;
}
    
function repeat() {

    for (i = 0; i < contour.length; i++) {
        contour[i] += .01 + ((Math.pow(8,1 + (repetir / (rep_max + 1))) * framer * ((i % 3) * 5)) / 1000);
        if (contour[i] > 256) {
            contour[i] = 0;
        }
    }

    for (i = 0; i < res.length - 1; i++) {
        if (res[i].amt + res[i].ps / (1000 / framer) > -1) {
            res[i].amt += res[i].ps / (1000 / framer);
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
