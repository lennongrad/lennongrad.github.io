//because im an idiot sometimes
var yes = true;
var no = false;

var debug = false;

var workers_cost_base = 20;
var workers_cost_mult = 1.6;
var worker_cost = workers_cost_base;
var total_workers = 3;
var av_workers = 3;

function Resource(name, click, unlocked, color, base) {
    this.name = name;
    this.ps = 0;
    this.amt = base;
    this.click = click;
    this.mult = 1;
    this.unlocked = unlocked;
    this.color = color;

    this.rates = new Array();
    this.auto = new Array();

    this.toClick = function () {
        this.amt = this.amt + this.click;
        clicker[reconback.get(this.name)] = 0;
        repetir += this.click;
        last_click = reconback.get(this.name);
    }
}

function Building(name, resource, cost_base, cost_mult, efficiency, unlocked) {
    this.resource = resource;
    this.cost_base = cost_base;
    this.cost_mult = cost_mult;
    this.efficiency = efficiency;
    this.unlocked = unlocked;
    this.name = name;

    this.fps = 0;
    this.cost = cost_base;
    this.amt = 0;
    this.working = 0;

    this.costfind = function() {
        this.cost = (this.cost_base * this.cost_mult * (Math.pow(1.10, (this.amt + 1)) - Math.pow(1.10, this.amt))) / 0.15;
    }

     this.buy = function() {
        if (!(res[5].amt >= this.cost)) {
            return;
        }
        do {
            res[5].amt -= this.cost;
            ++this.amt;
            this.costfind();
            if (av_workers > 0) {
                --av_workers;
                ++this.working;
            }
            findPS();
        } while (res[5].amt >= this.cost & all);
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
}

var recon = new Map();
var reconback = new Map();

var res = new Array();
res[0] = new Resource("food", 1, true, "#b7ffa3", 0);
res[1] = new Resource("gold", 1, true, "#ebff9e", 0);
res[2] = new Resource("science", 1, true, "#9ea7ff", 1561);
res[3] = new Resource("mineral", 1, false, "#c4c4c4", 0);
res[4] = new Resource("culture", 1, false, "#d19eff", 0);
res[5] = new Resource("cash", 1, true, "#d19eff", 0);

for (i = 0; i < res.length; i++) {
    recon.set(i, res[i].name);
    reconback.set(res[i].name, i);
    for (e = 0; e < res.length; e++) {
        res[i].rates[e] = 1;
        res[i].auto[e] = false;
    }
}


// name, resource, cost_base, cost_mult, efficiency, unlocked
var bldg = new Array();
bldg[0] = new Building("Farm", 0, 25, 1.6, .15, true); // farms
bldg[1] = new Building("Silo", 0, 700, 1.8, 2.5, false); // silos
bldg[2] = new Building("Plantation", 0, 3450, 2, 40, false); // plantations
bldg[3] = new Building("Mine", 1, 25, 1.65, .25, false); // mines
bldg[4] = new Building("Bank", 1, 750, 2.1, 8, false); // banks
bldg[5] = new Building("Mint", 1, 3500, 2.7, 40, false); // mints
bldg[6] = new Building("Lab", 2, 200, 2.5, 2, false); // labs
bldg[7] = new Building("School", 2, 20000, 2.95, 45, false); // school
bldg[8] = new Building("Collider", 2, 20000, 2.95, 45, false); // collider (n/a)
bldg[9] = new Building("Quarry", 3, 20000, 2.95, 45, false); // collider (n/a)
bldg[10] = new Building("Driller", 3, 20000, 2.95, 45, false); // collider (n/a)
bldg[11] = new Building("Fracker", 3, 20000, 2.95, 45, false); // collider (n/a)
bldg[12] = new Building("Theatre", 4, 20000, 2.95, 45, false); // collider (n/a)
bldg[13] = new Building("Auditorium", 4, 20000, 2.95, 45, false); // collider (n/a)
bldg[14] = new Building("Museum", 4, 20000, 2.95, 45, false); // collider (n/a)

var bldgtxt = new Map();
var builds = new Map();

for (i = 0; i < bldg.length; i++) {
    bldgtxt.set(i, bldg[i].name.toLowerCase());
    builds.set(bldg[i].name.toLowerCase(), i);
}

var tech_level = 0;
var tech_unlocked = new Array();
var tech_level_active;

var techs_cost_base = 20;
var techs_cost_mult = 5;
var tech_cost = techs_cost_base;
var tech_name = 0;
var tech_descr = 0;

for (i = 0; i < 12; i++) {
    tech_unlocked[i] = false;
}

var framer = 10;

var all = false;

var repetir = 0;
var rep_max = 100;
var last_click;
var supermod = 18;
document.getElementById('superback').style.height = (rep_max * 2) + 2 + "px";

var active_colour = "#1a1c1b";
var inactive_colour = "#7e8c85";

var flasher = 0;
var flasher_interval = 70;

var flash_tech = false;
var flash_worker = false;

// Audio
var snd = new Audio("click.wav");
// snd.play();

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

var clicker = [0, 0, 0, 0, 0, 0];

function moveClick() {
    for (i = 0; i < clicker.length - 1; i++) {
        clicker[i] += 5;
        document.getElementById(recon.get(i) + 'appear').style.transform = "translateY(" + (clicker[i] / 3) * -1 + "px)";
        document.getElementById(recon.get(i) + 'appear').style.opacity = 1 - (clicker[i] / 100);
    }

    clicker[clicker.length - 1] += .5;
    document.getElementById("superappear").style.transform = "translateY(" + (clicker[i] / 3) * -1 + "px)";
    document.getElementById('superappear').style.opacity = 1 - (clicker[i] / 100)
}

function doFlasher() {
    flasher++;
    var flasho = document.getElementsByClassName("flashing");
    if (flasher > (flasher_interval / 2)) {
        for (i = 0; i < flasho.length; i++) {
            flasho[i].style.display = "none";
        }
    }
    if (flasher > flasher_interval) {
        flasher = 0;
        for (i = 0; i < flasho.length; i++) {
            flasho[i].style.display = "inline";
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
            document.getElementById(res[i].name + 'details').style.display = "none";
            document.getElementById(res[i].name + '_click').style.display = "none";
            document.getElementById(res[i].name + '-column').style.backgroundColor = "#dbdbdb";
        } else {
            document.getElementById(res[i].name + 'details').style.display = "inline";
            document.getElementById(res[i].name + '_click').style.display = "block";
            document.getElementById(res[i].name + '-column').style.backgroundColor = res[i].color;
        }
   }


    if (debug) {
        for (i = 0; i < bldg.length; i++) {
            bldg[i].unlocked = true;
            if(i < res.length){
             //   res[i].unlocked = true;
            }
        }
    }
    
   for (i = 0; i < bldg.length; i++) {
        if (!bldg[i].unlocked) {
            document.getElementById(bldgtxt.get(i) + '_holder').style.display = "none";
        } else {
            document.getElementById(bldgtxt.get(i) + '_holder').style.display = "table";
        }
   }

   doFlasher();
}

function init() {
    displaytech();

    for(i = 0; i < res.length; i++){
        if (res[i].unlocked && res[i].name != "cash") {
            document.getElementById(res[i].name.substring(0, 1) + 'ps').innerHTML = "(" + small_int((res[i].ps)) + ' /s)';
            document.getElementById(res[i].name).innerHTML = small_int(Math.floor(res[i].amt));
        } else if (res[i].unlocked) {
            document.getElementById(res[i].name).innerHTML = small_int(Math.floor(res[i].amt));
	}
    }
    
    document.getElementById('cash').innerHTML = small_int(Math.floor(res[5].amt));  
    
    document.getElementById('food_to_cash_rate').innerHTML = res[0].rates[5];
    document.getElementById('gold_to_cash_rate').innerHTML = res[1].rates[5];
    document.getElementById('science_to_cash_rate').innerHTML = res[2].rates[5];
    
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

    document.getElementById('tech_level').innerHTML = tech_level_active + 1;
    document.getElementById('tech_cost').innerHTML = small_int(Math.ceil(tech_cost));

    document.getElementById('tech_name').innerHTML = tech_name;
    document.getElementById('tech_descr').innerHTML = tech_descr;
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        all = !all;
    //    alert("[Buy All Buildings] toggled to " + all);
    }
    else if (event.keyCode == 39) {
      //  alert('Right was pressed');
    }
});

function converter(first, second) {
    i = (res[first].amt * res[first].rates[second]);
      if(i > (res[second].amt * .1)){
            i /= 100;
      }
      res[second].amt += i;
      res[first].amt -= i / res[first].rates[second];
}

function auto(first, second){
    res[first].auto[second] = !res[first].auto[second];
      if(res[first].auto[second]){
          document.getElementById(res[first].name + res[second].name + 'convo').innerHTML = '🔳';
      } else {
          document.getElementById(res[first].name + res[second].name + 'convo').innerHTML = '🔲';
      }
}

function buytech() {
    if (res[2].amt >= tech_cost) {
        res[2].amt -= tech_cost;
        ++tech_level;
        techcost();
        unlocktech(tech_level_active);
    }
    init();
}

function techcost() {
    tech_cost = (techs_cost_base * techs_cost_mult * (Math.pow(1.37, (tech_level + 1)) - Math.pow(1.37, tech_level))) / 0.40;
}


function findPS() {
           for (i = 0; i < bldg.length; i++) {
               bldg[i].fps = bldg[i].working * bldg[i].efficiency
           }

           for (u = 0; u < res.length; u++) {
               res[u].ps = 0;
               for (e = 0; e < bldg.length; e++) {
                   if (bldg[e].resource ===u) {
                       res[u].ps += bldg[e].fps;
                   }
               }
               res[u].ps *= res[u].mult;
           }
}

function unlocktech(lvl) {

      switch (lvl){
            case 1: bldg[0].efficiency += .1; break;
            case 2: bldg[6].unlocked = true; break;
            case 3: res[3].unlocked = true; bldg[3].unlocked = true; bldg[9].unlocked = true; break;
            case 4: bldg[4].unlocked = true; break;
            case 5: bldg[1].unlocked = true; bldg[0].efficiency *= 1.5; break;
            case 6: bldg[2].unlocked = true; res[0].rates[5] += .3; break;
            case 7: bldg[5].unlocked = true; bldg[6].efficiency *= 1.25; break;
          case 8: bldg[7].unlocked = true; break;
          case 9: workers_cost_mult *= .8; workercost(); break;
          case 10: res[4].unlocked = true; break;
      }

      tech_unlocked[lvl] = true;

      isUnlocked();
      if(tech_level > tech_unlocked.length){
            res[0].mult += .1;
            res[1].mult += .1;
      }
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
    worker_cost = (workers_cost_base * workers_cost_mult * (Math.pow(1.10, (total_workers - 1)) - Math.pow(1.10, total_workers - 2))) / 0.15;
}
    
function repeat() {
    for (i = 0; i < res.length - 1; i++) {
        res[i].amt += res[i].ps / (1000 / framer);
        res[i].click =1 + tech_level / 4;
        document.getElementById(res[i].name + "appear").innerHTML = "+" + res[i].click;
    }

   if (repetir > rep_max) {
        repetir = 0;
        rep_max = Math.ceil(rep_max * 1.01);
        if (last_click != 1) {
            document.getElementById("superappear").innerHTML = "+" + Math.ceil((res[last_click].amt * (rep_max / (res[last_click].click * supermod)) - res[last_click].amt));
            res[last_click].amt = res[last_click].amt * (rep_max / (res[last_click].click * supermod));
        } else {
            document.getElementById("superappear").innerHTML = "+" + Math.ceil((res[5].amt * (rep_max / (res[last_click].click * supermod))));
            res[5].amt *= rep_max / (res[last_click].click * supermod);
        }
        document.getElementById('superback').style.height = (rep_max * 2) + 2 + "px";
        clicker[5] = 0;
   }
    document.getElementById('super').style.transform = "scaleY(" + (repetir * 4) + ")";
    document.getElementById('superbox').innerHTML = repetir + " / " + rep_max;
    findPS();
    workercost();
   isUnlocked();
    
   moveClick();
    
   tech_level_active = tech_level + 1;

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
        if (res[5].amt >= bldg[i].cost) {
            document.getElementById(bldgtxt.get(i) + "_cost").style.color = active_colour;
        } else {
            document.getElementById(bldgtxt.get(i) + "_cost").style.color = inactive_colour;
        }
    }

   if(res[0].amt >= worker_cost){
       document.getElementById("worker_cost").style.color = active_colour;
       flash_worker = true;
   } else {
       document.getElementById("worker_cost").style.color = inactive_colour;
       flash_worker = false;
   }

   if(res[2].amt >= tech_cost){
       document.getElementById("tech_cost").style.color = active_colour;
       flash_tech = true;
   } else {
       document.getElementById("tech_cost").style.color = inactive_colour;
       flash_tech = false;
   }

   init();
   
  setTimeout(repeat, framer);
}

auto(0, 5);
auto(0, 5);
auto(1, 5);
auto(2, 5);
auto(2, 5);
init();
repeat();