
var curYPos, curXPos, curDown;
var returner = 10;
var daycount = 10;
var currentmessage = 1;
var onTraveller = false;
var activeTraveller = 0
var planetsperciv = 6;
var MouseScroller = false;
var lagger = 10;

var dayscale = 75;
var supermod = 10;
var repetir = 99;
var rep_max = 100;
var contour = 0;
var planetCount = 100;
var gridsize = 25;

function getPlanet(e) { return document.getElementById("planet" + e) };


function sortNumber(a,b) {
    return a - b;
}

function caster(numb, tobe) {
    var numbo = numb.toString();
    while (tobe > numbo.length) {
        numbo = "0" + numbo;
    }
    return numbo;
}

window.addEventListener('mousemove', function (e) {
    if (curDown) {
        window.scrollTo(scrollX - e.movementX, scrollY - e.movementY);
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

var setScroll = function (quit) {
    MouseScroller = true;
    if (quit !== true) {
        timer = setTimeout(setScroll, 100);
    }
    else {
        clearTimeout(timer);
    }
};

$('.ui').bind('mouseenter', setScroll).bind('mouseleave', function () { setScroll(true); });

document.body.onwheel = function () { if (!MouseScroller) { return false; } }

var pyth = function (id1, id2) {
    return Math.sqrt(Math.pow(Math.abs(id1), 2) + Math.pow(Math.abs(id2), 2));
}

var findNearest = function (id1, id2) {
    var lowest = 100000;
    var lowestID = new Array(planets.length).fill(0);
    for (o = 0; o < planets.length; o++) {
       var he = pyth((planets[id1].rx - planets[o].rx), (planets[id1].ry - planets[o].ry));
        if (he < lowest && o != id1) {
            lowest = he;
            lowestID[0] = o;
            for (t = lowestID.length - 1; t > 0; t--) {
                lowestID[t] = lowestID[t - 1];
            }
        }
        if (he > 100000) {
            alert(he);
        }
    }
    return lowestID[id2];
}

var setnone = function () {
    if (returner == 0) {
        active = 0;
        onTraveller = false;
        $("#detailedinfo").animate({ "left": "-57%" }, "fast").queue(function () {
            $("#detailedinfo").addClass('visible');
            $("#detailedinfo").stop(true);
        });
    }
}

var planetnumb = 50;

function resource(name, daily) {
    this.name = name;
    this.daily = daily;
}

var res = new Array();
res[0] = new resource("Food", true);
res[1] = new resource("Population", false);
res[2] = new resource("Higher Class", false);
res[3] = new resource("Middle Class", false);
res[4] = new resource("Lower Class", false);

for(var r= 0; r < res.length; r++){
    var rs = document.createElement("span");
    rs.className = "msg";
    rs.id = "planet" + r + "ps";

    document.getElementById('detailedinfo').appendChild(rs);

    var ys = document.createElement("span");
    ys.id = "planet" + r + "amt";
    document.getElementById('detailedinfo').appendChild(ys);

}

function affiliation(color) {
    this.color = color;
    this.applied = false;
    this.amt = new Array(res.length).fill(0);
    this.terr = 0;
}

function planet(type, id, affiliation) {
    this.rx = (200 + (Math.random() * .90 * height));
    this.ry = (200 + (Math.random() * .90 * width));
    this.rx -= this.rx % gridsize;
    this.ry -= this.ry % gridsize;
    this.type = type;
    this.id = id;
    this.addedC = 0;
    this.credit = 0;
    this.done = false;
    this.aff = affiliation;
    this.maxc = 0;

    this.rotation = Math.random() * 360;
    this.rotationSpeed = -2 + Math.random() * 4;

    this.connections = new Array(3).fill(0);

    this.ps = new Array(res.length).fill(0);
    this.baseps = new Array(res.length).fill(0);
    this.amt = new Array(res.length).fill(0);

    this.highper = .1;
    this.midper = .4;

    this.adjP = [];
    
    
    var continuir = true;
    this.listPlanets = []

    while (continuir) {
        this.listPlanets = [];
        if (id > 2) {
            for (var p = 1; p < planets.length - 1; p++) {
                var mult = 1;
                this.listPlanets[p] = {
                    name: planets[p].id, distance: pyth(
                        Math.abs(planets[p].rx - this.rx)
                        , Math.abs(planets[p].ry - this.ry)
                    )
                }
            }

            this.listPlanets.sort(function (a, b) {
                return a.distance - b.distance;
            })

            if (this.listPlanets[0].distance < 150 || this.listPlanets[0].distance > 375) {
                this.rx = (200 + (Math.random() * .90 * height));
                this.ry = (200 + (Math.random() * .90 * width));
                this.rx -= this.rx % gridsize;
                this.ry -= this.ry % gridsize;
            } else {
                continuir = false;
            }
        } else {
            continuir = false;
        }
    }


    /*var cont = true;
    while (cont) {
        cont = false;
        for (f = 0; f < this.connections.length + 1; f++) {
            if (this.connections[f % this.connections.length] == this.connections[(f + 1) % this.connections.length]) {
                cont = true;
            }
            this.connections[f % this.connections.length] = Math.ceil(Math.random() * planetnumb);
        }
    }*/


    this.addAff = function (e) {
        this.aff = e;
        this.amt[1] = Math.floor(this.amt[1] * 1.8)
        doBorders();
    }
    
    this.getLX = function () {
        return this.rx + "px";
    }

    this.getLY = function () {
        return this.ry + "px";
    }

    this.randX = function () {
        this.rx = (200 + (Math.random() * .90 * width));
    }

    this.randY = function () {
        this.ry = (200 + (Math.random() * .90 * height));
    }

    this.radius = function () {
        if (this.amt[1] == 0) return 0;
        return 65 * Math.min(Math.pow(this.amt[1], .05), 10) + 15;
    }


    this.connect = function () {
        var strang = this.type + " ";
        for (c = 0; c < this.connections.length; c++) {
            strang += this.connections[c] + "(" + planets[this.connections[c]].type + "),";
        }
        return strang;
    }
    
    this.clicker = function () {
        active = id;
        onTraveller = false;
        returner = 10;
    }

    this.goto = function () {
        var x = this.rx - (window.innerWidth / 2);
        var y = this.ry - (window.innerHeight / 2);
        if (x > width) {
            x = width;
        }
        if (y > height) {
            y = height;
        }
        window.scrollTo(x, y);
    }

    this.isC = function (id) {
        for (gt = 0; gt < this.connections.length; gt++) {
            if (this.connections[gt] == id || id == 1) {
                return true;
            }
        }
        return false;
    }

    this.fix = function (todo) {
        var unique = this.adjP.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        })
    
        this.adjP = unique;
    }
}

function traveller(id) {
    this.home = 1 + Math.ceil(Math.random() * (planets.length - 2));
    this.destination = 1 + Math.ceil(Math.random() * (planets.length - 2));

    this.refresher = function () {
        this.home = this.destination;
        do {
            this.destination = 1 + Math.ceil(Math.random() * (planets.length - 2));
        } while (!planets[this.destination].isC(this.home));
    }

    this.refresher();

    this.id = id;
    this.moving = false;

    image = document.createElement("img");
    image.src = "none.png";
    image.className = "traveller";

    image.id = "traveller" + id;

    image.setAttribute('data-param', i);
    image.onclick = function () {
        onTraveller = true;
        active = 0;
        activeTraveller = this.id.substring(9);
        $("#detailedinfo").animate({ "left": "-57%" }, "fast").queue(function () {
            $("#detailedinfo").addClass('visible');
            $("#detailedinfo").stop(true);
        });
    }
    document.body.appendChild(image);

    lines = document.createElementNS('http://www.w3.org/2000/svg', "polyline");
    lines.id = "polypoints" + id;
    lines.setAttributeNS(null, "points", "200,200 300,300");
    lines.setAttribute("class", "polypoints");
    document.getElementById('liners').appendChild(lines);


    document.getElementById("traveller" + id).style.left = planets[this.home].getLX(true);
    document.getElementById("traveller" + id).style.top = planets[this.home].getLY(true);
    $("#traveller" + this.id).animate({ "left": (9 + Math.ceil(((planets[this.destination].rx)))), "top": (9 + Math.ceil(((planets[this.destination].ry)))) }, 9)

    this.fly = function () {
        this.moving = $("#traveller" + this.id).is(':animated');
        if (this.moving) {
            return;
        }

        //newMsg("Trader #" + this.id + " has arrived at Planet SR" + caster(this.destination,3), 0)
        this.refresher();
        //newMsg("Trader #" + this.id + " has departed from Planet SR" + caster(this.home,3), 0)

        this.moving = true;
        $("#traveller" + this.id).stop(true);
        $("#traveller" + this.id).animate(
            {
                "left": ((gridsize / 2) + Math.ceil(((planets[this.destination].rx)))),
                "top": ((gridsize / 2) + Math.ceil(((planets[this.destination].ry))))
            },
            (500 * (pyth((planets[this.destination].rx - planets[this.home].rx),(planets[this.destination].ry - planets[this.home].ry)))) / (.333 * dayscale));
    }
}


var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth,
                       html.clientWidth, html.scrollWidth, html.offsetWidth);

var conf = new Array();
conf[0] = new affiliation("transparent");
conf[1] = new affiliation("green");
conf[2] = new affiliation("blue");
conf[3] = new affiliation("orange");
conf[4] = new affiliation("red");
conf[5] = new affiliation("grey");
//conf[6] = new affiliation("lightgrey");
//conf[7] = new affiliation("darkgrey");
//conf[8] = new affiliation("darkcyan");
//conf[9] = new affiliation("pink");

var planets = [];

var rotation = 1;

var day = 0;

var typeamount = 5;

for (i = 1; i < planetCount; i++) {
    planets[i] = new planet(rotation, i, 0);
    if (i % (planetCount / typeamount) == 0) {
        rotation++;
    }
}

for (i = 1; i < conf.length; i++) {
    var c = Math.ceil(Math.random() * planets.length);
    while (planets[c].aff != 0 && planets[c].listPlanets.length > 0) {
        c = Math.ceil(Math.random() * conf.length);
    }
    planets[c].aff = i;
}

planets[0] = new planet(0, 0, 0);



for (i = 1; i < planets.length; i++) {
    image = document.createElement("img");
    image.src = "planet" + planets[i].type + ".png";
    image.className = "planet";

    image.setAttribute('data-param', i);
    image.setAttribute('draggable', 'none');
    image.onclick = function () {
        planets[this.id.substring(6)].clicker();
        planets[this.id.substring(6)].addAff(1);
   //   planets[this.id.substring(6)].goto();
    }

    image.id = "planet" + i;

    image.style.width = gridsize * 2 + "px";
    image.style.height = gridsize * 2 + "px";

    document.body.appendChild(image);

    document.getElementById("planet" + i).style.left = (((planets[i].rx)) + (5)) + "px";
    document.getElementById("planet" + i).style.top = (((planets[i].ry)) + 5) + "px";

    /*var closest = findNearest(i);
    for (r = 0; r < closest.length; r++) {
        if (planets[closest[r]].aff == 0) {
            planets[closest[r]].aff = planets[i].aff;
        }
    }*/

    for (var r = 0; r < res.length; r++) {
        planets[i].ps[r] = Math.ceil(Math.random() * 10000);
    }
    planets[i].amt[1] = Math.ceil(Math.random() * 10000);
    if (Math.random() < .03) {
        planets[i].amt[1] = 0;
    }
    planets[i].highper = Math.random() * .02;
    planets[i].midper = planets[i].highper + (Math.random() * .4);
    planets[i].baseps[0] = Math.ceil(((planets[i].type) + .5) * (1 + (Math.random())));

    if(planets[i].aff != 0 && !conf[planets[i].aff].done){
        for (r = 0; r < planetsperciv - 1 && r < planets[i].listPlanets.length - 1; r++) {
            planets[planets[i].listPlanets[r].name].aff = planets[i].aff;
        }
        conf[planets[i].aff].done = true;
    }
}

/*for (i = 1; i < planets.length; i++) {
    var closest = findNearest(i);
    for (r = 0; r < closest.length; r++) {
        if (planets[closest[r]].maxc <= planets[closest[r]].connections.length - 1 && planets[i].maxc <= planets[i].connections.length - 1 && closest[r] < i) {
            planets[closest[r]].connections[planets[closest[r]].maxc] = i;
            planets[i].connections[planets[i].maxc] = r;
            planets[closest[r]].maxc++;
            planets[i].maxc++;
        }
    }
    for (r = 0; r < planets[i].connections.length; r++) {
        if (planets[i].connections[r] == 0) {
            planets[i].connections[r] = 1;
        }
    }
}*/

lagger = 75;

function doPlanetCount() {
    var tempar = new Array();
    var temstr = " ";
    for (i = 1; i < planets.length; i++){
        tempar[i] = planets[i].amt[1];
    }
    tempar.sort(sortNumber);

    for (t = 1; t < planets.length; t++){
        for (i = 1; i < planets.length; i++){
            if (planets[i].amt[1] == tempar[t]) {
                temstr += "SR" + caster(i,3);
                temstr += "  " + planets[i].amt[1] + " ";
                temstr += caster(planets[i].baseps[0],2) + "  ";
                temstr += caster(planets[i].ps[0],6) + "  ";
                temstr += planets[i].type + "<br>";
                resum = false;
            }
        }
    }
    document.getElementById('popscore').innerHTML = temstr;
    
        for (var r = 0; r < res.length; r++) {
            if (res[r].daily) {
                for (var i = 0; i < planets.length; i++) {
                    planets[i].amt[r] += planets[i].ps[r];
                }
            }
        }
        //Population
        for (var i = 0; i < planets.length; i++){
            planets[i].amt[2] = Math.floor(planets[i].amt[1] * planets[i].highper);
            planets[i].amt[3] = Math.floor(planets[i].amt[1] * planets[i].midper);
            planets[i].amt[4] = planets[i].amt[1] - (planets[i].amt[3] + planets[i].amt[2]);
        }
}

function doPop() {
    doPS();
    for (var i = 0; i < planets.length; i++){
        var needed = planets[i].amt[1];
        planets[i].amt[0] -= needed;
        if (planets[i].amt[0] < 0) {
            planets[i].amt[0] = 0;
            planets[i].amt[1] = Math.ceil(planets[i].amt[1] * .99);
        } else {
            planets[i].amt[1] = Math.ceil(planets[i].amt[1] * (1 + (Math.random() * .01)));
        }
    }
}

function doPS() {
    for (var i = 0; i < planets.length; i++){
        planets[i].ps[0] = Math.ceil((planets[i].credit + planets[i].baseps[0]) * Math.pow(planets[i].amt[3] + planets[i].amt[4], (.7 + (.1))));
    }
}
    doPS();

for (i = 1; i < planets.length; i++) {
    var added = new Array(planets.length).fill(false)
    while (planets[i].addedC < planets[i].connections.length) {
        var current = 0;
        var inter = 0;
        var ready = true;
        while (added[current] || planets[current].addedC >= 4 || i == current) {
            ready = false;
            current = findNearest(i, inter)//1 + Math.ceil(Math.random() * (planets.length - 2));
            inter++;
            if (inter >= lagger) {
                current = 1 + Math.ceil(Math.random() * (planets.length - 2));
                inter = 0;
            }
            for (e = 1; e < planets[i].connections.length; e++) {
                if (planets[i].connections[e] == current) {
                    ready = true;
                }
            }
            for (e = 1; e < planets[current].connections.length; e++) {
                if (planets[current].connections[e] == i) {
                    ready = true;
                }
            }
        } ;

        planets[i].connections[planets[i].addedC] = current;
        added[current] = true;
        planets[current].connections[planets[current].addedC] = i;
        planets[current].addedC++;
        planets[i].addedC++;
    }
}



var travellers = new Array(Math.ceil(planets.length / 10));
for (i = 0; i < travellers.length; i++) {
    travellers[i] = new traveller(i);
}

var linesstring = new Array(planets.length);
linesstring[0] = "";
var active = 1;
var smallactive = 1;

var toDate = function (time) {
    var stringer = "";
    stringer = caster(time % 100,2);
    stringer = caster(Math.floor((time / 100) % 10),2) + '.' + stringer;
    stringer = Math.floor((time / 1000)) + '.' + stringer;
    return stringer;
}

document.getElementById("lactive").style.height = 400 + height;
document.getElementById("liners").style.height = 400 + height;
document.getElementById("lactive").style.width = 400 + width;
document.getElementById("liners").style.width = 400 + width

var msg;
function newMsg(message, indent){
    msg = document.createElement("span");
    msg.className = "msg";
    msg.id = "msg" + currentmessage;

    var strango = "<br>> ";
    for (y = 0; y < indent; y++) {
        strango += '> ';
    }
    msg.innerHTML = strango + message; 

    document.getElementById('headerbox').appendChild(msg);

    currentmessage++;
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        $(".ui").toggle();
        $("#lactive").toggle();
    } else if (event.keyCode == 66) {
        $("#borderbox").toggle();
    } else if (event.keyCode == 80) {
        $(".planet").toggle();
    } else if (event.keyCode == 78) {
        $(".name").toggle();
    } else if (event.keyCode == 78) {
    } else if (event.keyCode == 76) {
        $(".traveller").toggle();
        $(".polypoints").toggle();
    } else if (event.keyCode == 13) {
        active = prompt();
        onTraveller = false;
        planets[active].goto();
    }
})

$(".ui").toggle();
$("#borderbox").toggle();
$('#daybox').click(function () {
    
    if (active != 0) {
        planets[active].goto();
    }
})

$("#headerbox").click(function () {
    if ($("#ledger").hasClass('visible')) {
        $("#ledger").animate({ "right": "10px" }, "fast").removeClass('visible');
    } else {
        $("#ledger").animate({ "right": "-57%" }, "fast").queue(function () {
            $("#ledger").addClass('visible');
            $("#ledger").stop(true);
        });
    }
})

$("#headerbar").hover(function () {
    $("#headerbar-under").slideToggle(100);
});

$("#detailedinfo").click(function () {
    if ($("#detailedinfo").hasClass('visible')) {
        $("#detailedinfo").animate({ "left": "2%" }, "fast").removeClass('visible');
    } else {
        $("#detailedinfo").animate({ "left": "-57%" }, "fast").queue(function () {
            $("#detailedinfo").addClass('visible');
            $("#detailedinfo").stop(true);
        });
    }
});

$("#ledger").click(function () {
    if ($("#ledger").hasClass('visible')) {
        $("#ledger").animate({ "right": "0%" }, "fast").removeClass('visible');
    } else {
        $("#ledger").animate({ "right": "-57%" }, "fast").queue(function () {
            $("#ledger").addClass('visible');
            $("#ledger").stop(true);
        });
    }
});

planets[1].connections.shift();
var visible = new Array(planets.length).fill(true);

$('.planet').mousedown(function (event) {
    if (event.which == 3) {
        if ($("#detailedinfo").hasClass('visible')) {
            $("#detailedinfo").animate({ "left": "2%" }, "fast").removeClass('visible');
        }
        planets[this.id.substring(6)].goto();
        planets[this.id.substring(6)].clicker();
    }
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

$(document).ready(function () {
    planets[active].goto();
});

var righttime = function () {
    dayscale += 5;
}

newMsg("Initial Ownership:", 0);
for (e = 1; e < conf.length; e++) {
    var strang = "";

    var affplanets = [];

    for (i = 1; i < planets.length; i++) {
        if (planets[i].aff == e) {
            strang += ", SR" + caster(i, 3);
        }
    }
    newMsg(conf[e].color + ": {" + strang.substring(2) + "}", 1);
}


for (i = 1; i < planets.length; i++) {

    var test = document.createElement("div");
    test.id = "name" + i; 
    test.innerHTML = "SR" + caster(i,3);
    test.className += " name";
    test.style.position = "absolute";
    body.appendChild(test);

    document.getElementById('name' + i).style.top = (planets[i].ry - 60) + "px";
    document.getElementById('name' + i).style.left = (planets[i].rx - 10) + "px";
}

var concluir = 0;

doPlanetCount();

/*circle('layer-1');

            function circle(id) {

                var el = document.getElementById(id);

                var elDisplay = el.children[0];
                var elInteraction = el.children[1];

                var offsetRad = null;
                var targetRad = 0;
                var previousRad;


                try {
                    elInteraction.addEventListener('mousedown', down);
                }
                catch (err) {
                    console.log("Interaction not found");
                }

                function down(event) {
                    offsetRad = getRotation(event);
                    previousRad = offsetRad;
                    window.addEventListener('mousemove', move);
                    window.addEventListener('mouseup', up);
                }

                function move(event) {

                    var newRad = getRotation(event);
                    targetRad += (newRad - previousRad);
                    previousRad = newRad;
                    elDisplay.style.transform = 'rotate(' + (targetRad / Math.PI * 180) + 'deg)';
                }

                function up() {
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', up);
                }

                function getRotation(event) {
                    var pos = mousePos(event, elInteraction);
                    var x = pos.x - elInteraction.clientWidth * .5;
                    var y = pos.y - elInteraction.clientHeight * .5;
                    return Math.atan2(y, x);
                }

                function mousePos(event, currentElement) {
                    var totalOffsetX = 0;
                    var totalOffsetY = 0;
                    var canvasX = 0;
                    var canvasY = 0;

                    do {
                        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
                    }
                    while (currentElement = currentElement.offsetParent)

                    canvasX = event.pageX - totalOffsetX;
                    canvasY = event.pageY - totalOffsetY;

                    return {
                        x: canvasX,
                        y: canvasY
                    };
                }
}*/

var x = 0;
var y = 1;

var playingField = document.body;

var numberStars = 500;
var globalGlitch = (.09 * Math.random()) + .9;

var colors = ["Red", "Blue", "Green", "White", "Yellow", "Pink", "White", "White"];
function getRandColor() { return colors[Math.floor(colors.length * Math.random())] };

var units = [];

var gravity = Math.floor(2 * Math.random()) + 1;
var gravityMod = 4 * Math.random() + 3;

var offscreen = true;

function getUnit(id) {
    return document.getElementById("UNIT" + id);
}

function halfside(e) {
    return (-1 * e) + (2 * e * Math.random());
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


    playingField.appendChild(newUnit);

    this.setPos = function () {
        document.getElementById("UNIT" + this.unitID).style.left = this.pos[x] + "px";
        document.getElementById("UNIT" + this.unitID).style.top = this.pos[y] + "px";
    }

    this.move = function (direction, amt) {
        this.pos[0] += amt;
    }

    this.goto = function () {
        if (offscreen && this.pos[x] < 20) { this.pos[x] = screen.width - 20 }
        if (offscreen && this.pos[x] > screen.width - 5) { this.pos[x] = 25 };
        if (offscreen && this.pos[y] < 4) { this.pos[y] = height - 21 }
        if (offscreen && this.pos[y] > screen.height - 20) { this.pos[y] = 5 };

        switch (gravity) {
            case 1: this.move(x, this.speed[x] * gravityMod); break;
            case 2: this.move(x, -1 * this.speed[x] * gravityMod); break;
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

var coordinates = [];
for (i = 0; i < (400 + width) / gridsize; i++){
    coordinates[i] = new Array(400 + height);
    for (e = 0; e < (400 + height) / gridsize; e++){
        coordinates[i][e] = 0;
    }
}

var squares = [];
for (i = 0; i < (400 + width) / gridsize; i++){
    squares[i] = new Array(400 + height);
    for (e = 0; e < (400 + height) / gridsize; e++){
        squares[i][e] = [0];
    }
}

var rendercol = true;

for (i = 0; i < (400 + height) / gridsize; i++) {
    if (rendercol) var newrow = document.createElement('TR');

    for (e = 0; e < (400 + width) / gridsize; e++) {
        if (rendercol) {
            var newcol = document.createElement('TD');
            newcol.style.border = "1px solid blue";
        }

        var listPlanets = []

        for (var p = 0; p < planets.length; p++) {
            var mult = 1;
            listPlanets[p] = {
                name: planets[p].id, distance: pyth(
                    mult * Math.abs(planets[p].rx - (gridsize * e))
                    , mult * Math.abs(planets[p].ry - (gridsize * i))
                )
            }
        }
 
        listPlanets.sort(function (a, b) {
            return a.distance - b.distance;
        })
        
        if (pyth(
            Math.abs(planets[listPlanets[0].name].rx - (gridsize * (e - .5)))
            , Math.abs(planets[listPlanets[0].name].ry - (gridsize * (i - .5 )))
        ) < planets[listPlanets[0].name].radius() + 80) {
            coordinates[e][i] = listPlanets[0].name;
            if (rendercol) newcol.style.backgroundColor = conf[planets[listPlanets[0].name].aff].color;
            if (rendercol && planets[listPlanets[0].name].aff != 0) newcol.style.border = "1px solid " + conf[planets[listPlanets[0].name].aff].color;
        }

        if (rendercol) {
            newcol.style.paddingTop = gridsize - 2 + "px";
            newcol.style.paddingLeft = gridsize - 2 + "px";
            newcol.id = "grid" + i + "-" + e;
             newrow.appendChild(newcol);
        }
            squares[e][i] = listPlanets;
    }

    if (rendercol) document.getElementById('grid').appendChild(newrow);
}

function doBorders() {
    for (i = 0; i < conf.length; i++) {
        conf[i].terr = 0;
    }

    for (i = 0; i < (400 + height) / gridsize; i++) {
        for (e = 0; e < (400 + width) / gridsize; e++) {
            var listPlanets = squares[e][i];
        
            if (pyth(
                Math.abs(planets[listPlanets[0].name].rx - (gridsize * (e - .5)))
                , Math.abs(planets[listPlanets[0].name].ry - (gridsize * (i - .5)))
            ) < planets[listPlanets[0].name].radius()) {
                coordinates[e][i] = listPlanets[0].name;
                if (rendercol) document.getElementById("grid" + i + "-" + e).style.backgroundColor = conf[planets[listPlanets[0].name].aff].color;
                if (rendercol && planets[listPlanets[0].name].aff != 0) document.getElementById("grid" + i + "-" + e).style.border = "1px solid " + conf[planets[listPlanets[0].name].aff].color;
                conf[planets[listPlanets[0].name].aff].terr++;
            } else {
                coordinates[e][i] = 0;
                if (rendercol) document.getElementById("grid" + i + "-" + e).style.backgroundColor = "#000000";
                if (rendercol && planets[listPlanets[0].name].aff != 0) document.getElementById("grid" + i + "-" + e).style.border = "1px solid transparent"
                if (rendercol && planets[listPlanets[0].name].aff == 0) document.getElementById("grid" + i + "-" + e).style.border = "1px solid transparent"
            }
        }
    }

    for (i = 1; i < (400 + height) / gridsize - 1; i++) {
        for (e = 1; e < (400 + width) / gridsize - 1; e++) {
            var the = coordinates[e][i];
            var curff = planets[coordinates[e][i]].aff;
            if (planets[coordinates[e - 1][i]].aff != curff) {
                if (rendercol) document.getElementById("grid" + i + "-" + (e - 1)).style.borderRight = "1px solid #FFFFFF"; 
            }
            if (planets[coordinates[e + 1][i]].aff != curff) {
                if (rendercol) document.getElementById("grid" + i + "-" + e).style.borderRight = "1px solid #FFFFFF"; 
            }
            if (planets[coordinates[e][i - 1]].aff != curff) {
                if (rendercol) document.getElementById("grid" + (i - 1) + "-" + e).style.borderBottom = "1px solid #FFFFFF"; 
            }
            if (planets[coordinates[e][i + 1]].aff != curff) {
                if (rendercol) document.getElementById("grid" + i + "-" + e).style.borderBottom = "1px solid #FFFFFF"; 
            }
                
            if (coordinates[e - 1][i] != the) {
                planets[the].adjP.push(coordinates[e - 1][i]);
                if (rendercol) document.getElementById("grid" + i + "-" + (e - 1)).style.borderRight = "1px solid #FFFFFF"; 
            }
            if (coordinates[e + 1][i] != the) {
                planets[the].adjP.push(coordinates[e + 1][i]);
                if (rendercol) document.getElementById("grid" + i + "-" + e).style.borderRight = "1px solid #FFFFFF"; 
            }
            if (coordinates[e][i - 1] != the) {
                planets[the].adjP.push(coordinates[e][i - 1]);
                if (rendercol) document.getElementById("grid" + (i - 1) + "-" + e).style.borderBottom = "1px solid #FFFFFF"; 
            }
            if (coordinates[e][i + 1] != the) {
                planets[the].adjP.push(coordinates[e][i + 1]);
                if (rendercol) document.getElementById("grid" + i + "-" + e).style.borderBottom = "1px solid #FFFFFF"; 
            }
        }
    }

    for (i = 1; i < planets.length; i++){
        planets[i].fix(true);
    }
}
        doPop();
        doPlanetCount();
doBorders();

function repeat() {

    for (var i = 0; i < travellers.length; i++) {
        var cox = document.getElementById("traveller" + i).style.left;
        var coy = document.getElementById("traveller" + i).style.top;
        cox = cox.substring(0, cox.length - 2);
        coy = coy.substring(0, coy.length - 2);
        cox -= (cox % gridsize);
        coy -= (coy % gridsize);
        cox /= gridsize;
        coy /= gridsize;
        
        if (coordinates[cox][coy] != 0 && planets[coordinates[cox][coy]].aff != 0) {
            document.getElementById("traveller" + i).style.backgroundColor = conf[planets[coordinates[cox][coy]].aff].color;
        } else {
            document.getElementById("traveller" + i).style.backgroundColor = "purple"
        }
            planets[coordinates[cox][coy]].credit = (Math.floor(planets[coordinates[cox][coy]].credit * 100) / 100 ) + .1;
    }



    for (i = 0; i < units.length; i++) {
        units[i].moment();
    }

    returner--;
    if (returner < 0) {
        returner = 0;
    }

    document.getElementById("superbox").innerHTML = toDate(day);

    daycount += dayscale;
    repetir = daycount;
    rep_max = 5000;

    if (Math.floor(daycount % 10) == 0) {
        for (var a = 1; a < conf.length; a++) {
            for (var r = 0; r < res.length; r++) {
                conf[a].amt[r] = 0;
                for (var i = 0; i < planets.length; i++) {
                    if (planets[i].aff == a) {
                        conf[a].amt[r] += planets[i].amt[r];
                    }
                }
            }
        }  
        if (planets[active].aff != 0) {
            document.getElementById('blanker').innerHTML = "POP: " + conf[planets[active].aff].amt[1] + " TERR: " + conf[planets[active].aff].terr;
        } else {
            document.getElementById('blanker').innerHTML = " ";
        }    
    }

    if (daycount > 5000) {
        day++;
        daycount = 0;
        doPop();
        doPlanetCount();
        doBorders();

        for (y = 0; y < travellers.length; y++) {
            travellers[y].fly();
        }
        if (day % 10 == 0) {
            $.fx.off = true;
            $.fx.off = false;
        }
    }


    if (repetir > rep_max) {
        repetir = 0;
        rep_max = Math.ceil(rep_max * 1.1);
    }

    planets[1].ps[0] = 10;

    for (var r = 0; r < res.length; r++) {
        document.getElementById("planet" + r + "amt").innerHTML = "<br>> " + planets[active].amt[r] + " " + res[r].name;
        if (res[r].daily) {
            document.getElementById("planet" + r + "ps").innerHTML = "<br>> " + planets[active].ps[r] + " " + res[r].name + " Per Day";
        }    
    }

    document.getElementById("planetname").innerHTML = '<img src="planet' + planets[active].type + '.png" style="width:' + (gridsize * 2) + 'px; height: ' + (gridsize * 2) + 'px">Planet SR' + caster(active,3);
    document.getElementById("planetscore").innerHTML = "> " + Math.floor(planets[active].credit) + " points";
    document.getElementById("planetname").style.border = '3px solid ' + conf[planets[active].aff].color;
    if (planets[active].aff == 0) {
        document.getElementById("planetname").style.border = '3px solid white';
    }

    var finalstring = "";
    var activestring = "";
    var roter = false;

    for (y = 0; y < travellers.length; y++) {
        if (travellers[y].id == activeTraveller && onTraveller) {
            window.scrollTo(document.getElementById('traveller' + y).x, document.getElementById('traveller' + y).y - 400);
        } else {
            //document.getElementById('traveller' + y).style.backgroundColor = "purple";
        }
    }

    for (y = 0; y < travellers.length; y++) {
        for (i = 1; i < planets.length; i++) {
            for (e = 1; e < planets.length; e++) {
                if (travellers[y].destination == e && travellers[y].home == i && travellers[y].destination != i && travellers[y].home != e) {
                    document.getElementById('polypoints' + y).setAttribute("points", ((gridsize / 2) + Math.ceil((((planets[i].rx))))) + "," + ((gridsize / 2) + Math.ceil(((planets[i].ry)))) + " " + Math.ceil((gridsize / 2) + (((planets[e].rx)))) + "," + ((gridsize / 2) + Math.ceil(((planets[e].ry)))) + "   ");
                }
            }
        }
    };
    
    for (e = 1; e < planets.length; e++) {
        if (planets[e].amt[1] == 0) { planets[e].aff = 0 };
        planets[e].rotation += planets[e].rotationSpeed;
        //document.getElementById("planet" + e).style.transform = "rotate("  + planets[e].rotation + "deg)";
        if (false || e == active) {
            document.getElementById("planet" + e).style.background = "radial-gradient(#33ff66 35%, transparent 75%)";
            for (i = 0; i < planets[e].connections.length; i++) {
                activestring += "" + (9 + Math.ceil((((planets[planets[e].connections[i]].rx))))) + "," + (9 + Math.ceil(((planets[planets[e].connections[i]].ry)))) + " " + Math.ceil(9 + (((planets[e].rx)))) + "," + (9 + Math.ceil(((planets[e].ry)))) + " ";
            }
        }         else {
            document.getElementById("planet" + e).style.background = "radial-gradient(" + conf[planets[e].aff].color + " 35%, transparent 75%)";
        }
        
        if (planets[active].adjP.includes(e) && active != 0) {
            document.getElementById("planet" + e).style.background = "radial-gradient(#33ff66 35%, transparent 75%)";
        }
    }
    

    //  document.getElementById("polypoints").setAttribute("points", finalstring);

    document.getElementById("pactive").setAttribute("points", activestring);

    /* for (e = 1; e < conf.length; e++) {
         var poly = "";
         for (i = 1; i < planets.length; i++) {
             if (planets[i].aff == e) {
                 poly += Math.ceil(planets[i].rx) + "," + Math.ceil(planets[i].ry) + " ";
             }
         }
  
        document.getElementById('borders' + e).setAttribute("points", poly)
     }*/
    
    concluir++;
    if (concluir >= 5) {
        for (i = 1; i < planets.length; i++) {
            if (i != active) {
                $('#name' + i).animate({ 'opacity': '.2' }, 160)
            } else {
                $('#name' + i).animate({ 'opacity': '1' }, 160)
            }
        }
        concluir = 0;
        MouseScroller = false;
    }

    document.getElementById('super').style.width = ((repetir / rep_max) * 200) + "px";

    setTimeout(repeat, .1);
}

repeat();
