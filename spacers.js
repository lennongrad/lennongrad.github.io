
var curYPos, curXPos, curDown;
var returner = 10;
var daycount = 10;
var currentmessage = 1;
var onTraveller = false;
var activeTraveller = 0;

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



var findNearest = function (id1) {
    var lowest = 100000;
    var lowestID = new Array(20).fill(0);
    for (o = 0; o < planets.length; o++) {
        var he = Math.sqrt(Math.pow(Math.abs(planets[id1].rx - planets[o].rx), 2) + Math.pow(Math.abs(planets[id1].ry - planets[o].ry), 2));
        if (he < lowest && o != id1) {
            lowest = he;
            lowestID[0] = o;
            for (t = lowestID.length - 1; t > 0; t--) {
                lowestID[t] = lowestID[t - 1];
            }
        }
    }
    return lowestID;
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

var planetnumb = 100;

function affiliation(color) {
    this.color = color;
}

function planet(type, id, affiliation) {
    this.rx = (1200 + (Math.random() * .90 * height));
    this.ry = (1200 + (Math.random() * .90 * width));
    this.type = type;
    this.id = id;
    this.addedC = 0;
    this.score = 0;
    this.done = false;
    this.aff = affiliation;
    this.maxc = 0;

    this.connections = new Array(3).fill(0);

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

    this.getLX = function () {
            return this.rx + "px";
    }

    this.getLY = function () {
            return this.ry + "px";
    }

    this.randX = function () {
        this.rx = (1200 + (Math.random() * .90 * width));
    }

    this.randY = function () {
        this.ry = (1200 + (Math.random() * .90 * height));
    }


    this.connect = function () {
        var strang = this.type + " ";
        for(r = 0; r < this.connections.length; r++){
            strang += this.connections[r] + "(" + planets[this.connections[r]].type + "),";
        }
        return strang;
    }
    
    this.clicker = function () {
        active = id;
        onTraveller = false;
        returner = 10;
    }

    this.goto = function () {
        var x = this.rx - (window.innerWidth / 2) ;
        var y = this.ry - (window.innerHeight / 2) ;
        if(x > width){
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
    lines.className = "polypoints";
    document.getElementById('liners').appendChild(lines);

    document.getElementById("traveller" + id).style.left = planets[this.home].getLX(true);
    document.getElementById("traveller" + id).style.top = planets[this.home].getLY(true);
    $("#traveller" + this.id).animate({ "left": (9 + Math.ceil(((planets[this.destination].rx)))), "top": (9 + Math.ceil(((planets[this.destination].ry)))) }, 9);

    this.fly = function () {
        this.moving = $("#traveller" + this.id).is(':animated');
        if (this.moving) {
            return;
        } 

        newMsg("Trader #" + this.id + " has arrived at Planet SR" + this.destination, 0)
            this.refresher();

        planets[this.home].score--;
        planets[this.destination].score += 1.25;
        newMsg("Trader #" + this.id + " has departed from Planet SR" + this.home, 0)

        this.moving = true;
        $("#traveller" + this.id).animate({ "left": (9 + Math.ceil(((planets[this.destination].rx)))), "top": (9 + Math.ceil(((planets[this.destination].ry)))) }, 60000);
    }
}


var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth,
                       html.clientWidth, html.scrollWidth, html.offsetWidth);

var conf = new Array(10);
conf[0] = new affiliation("transparent");
conf[1] = new affiliation("green");
conf[2] = new affiliation("blue");
conf[3] = new affiliation("orange");
conf[4] = new affiliation("red");
conf[5] = new affiliation("grey");
conf[6] = new affiliation("lightgrey");
conf[7] = new affiliation("darkgrey");
conf[8] = new affiliation("darkcyan");
conf[9] = new affiliation("pink");

var planets = new Array(400);


var rotation = 1;

var day = 0;

for (i = 1; i < planets.length; i++) {
    planets[i] = new planet(rotation, i, 0);
    if (i % 80 == 0) {
        rotation++;
    }
}

for (i = 1; i < conf.length; i++) {
    var r = Math.ceil(Math.random() * planets.length);
    while (planets[r].aff != 0) {
        r = Math.ceil(Math.random() * conf.length);
    }
    planets[r].aff = i;
}

planets[0] = new planet(0, 0);


 /*  while (i != e && ((Math.abs(planets[i].rx - planets[e].rx) < 90 * (width / planets.length)) || Math.abs(planets[i].ry - planets[e].ry) < 90 * (height / planets.length))) {
        planets[i].rx += (Math.random() * 20) - 20;
        planets[i].ry += (Math.random() * 20) - 20;
    }*/

for (i = 1; i < planets.length; i++) {
    image = document.createElement("img");
    image.src = "planet" + planets[i].type + ".png";
    image.className = "planet";

    image.setAttribute('data-param', i);
    image.onclick = function () {
        planets[this.id.substring(6)].clicker();
   //   planets[this.id.substring(6)].goto();
    }

    image.id = "planet" + i;

    document.body.appendChild(image);

    document.getElementById("planet" + i).style.left = (((planets[i].rx))) + "px";
    document.getElementById("planet" + i).style.top = (((planets[i].ry))) + "px";

    var closest = findNearest(i);
    for (r = 0; r < closest.length; r++) {
        if (planets[closest[r]].aff == 0) {
            planets[closest[r]].aff = planets[i].aff;
        }
    }
}

for (i = 1; i < planets.length; i++) {
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
}

for (i = 1; i < planets.length; i++) {
    var added = new Array(planets.length).fill(false)
    while (planets[i].addedC < planets[i].connections.length) {
        var current = 0;
        while (added[current] || planets[current].addedC >= 4 || i == current) {
            current = 1 + Math.ceil(Math.random() * (planets.length - 2));
        } ;


        planets[i].connections[planets[i].addedC] = current;
        added[current] = true;
        planets[current].connections[planets[current].addedC] = i;
        planets[current].addedC++;
            planets[i].addedC++;
    }
}


var travellers = new Array(planets.length / 10);
for (i = 0; i < travellers.length; i++) {
    travellers[i] = new traveller(i);
}

var linesstring = new Array(planets.length);
linesstring[0] = "";
var active = 1;
var smallactive = 1;

var toDate = function (time) {
    var stringer = "";
    stringer = time % 1000;
    stringer = Math.floor((time / 1000) % 100) + '.' + stringer;
    stringer = Math.floor((time / 100000)) + '.' + stringer;
    return stringer;
}

document.getElementById("lactive").style.height = 2400 + height;
document.getElementById("liners").style.height = 2400 + height;
document.getElementById("lactive").style.width = 2400 + width;
document.getElementById("liners").style.width = 2400 + width

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

function repeat() {
    
    returner--;
    if (returner < 0) {
        returner = 0;
    }

    document.getElementById("daytime").innerHTML = "> " + toDate(day);

    daycount+= 10;
    if (daycount > 10000) {
        day++;
        daycount = 0;
    }

    document.getElementById("planetname").innerHTML = "Planet SR" + active;
    document.getElementById("planetscore").innerHTML = "> " + planets[active].score + " points";

    var finalstring = "";
    var activestring = "";
    var roter = false;

    for (y = 0; y < travellers.length; y++) {
        if (travellers[y].id == activeTraveller && onTraveller) {
           document.getElementById('traveller' + y).style.backgroundColor = "yellow";
            window.scrollTo(document.getElementById('traveller' + y).x , document.getElementById('traveller' + y).y);
        } else {
            document.getElementById('traveller' + y).style.backgroundColor = "purple";
        }
    }

    for (y = 0; y < travellers.length; y++) {
        for (i = 1; i < planets.length; i++) {
            for (e = 1; e < planets.length; e++) {
                if (travellers[y].destination == e && travellers[y].home == i && travellers[y].destination != i && travellers[y].home != e) {
                    document.getElementById('polypoints' + y).setAttribute("points", (9 + Math.ceil((((planets[i].rx))))) + "," + (9 + Math.ceil(((planets[i].ry)))) + " " + Math.ceil(9 + (((planets[e].rx)))) + "," + (9 + Math.ceil(((planets[e].ry)))) + "   ");
                }
            }
        }
    };
        
        for (e = 1; e < planets.length; e++) {
            if (e == active) {
                document.getElementById("planet" + e).style.background = "radial-gradient(yellow 60%, red 15%, transparent 25%)";
                for (i = 0; i < planets[e].connections.length; i++) {
                    activestring += "" + (9 + Math.ceil((((planets[planets[e].connections[i]].rx))))) + "," + (9 + Math.ceil(((planets[planets[e].connections[i]].ry)))) + " " + Math.ceil(9 + (((planets[e].rx)))) + "," + (9 + Math.ceil(((planets[e].ry)))) + " ";
                }
            } else {
                document.getElementById("planet" + e).style.background = "radial-gradient(" + conf[planets[e].aff].color + " 60%, red 15%, transparent 25%)";
            }
        }

    for (y = 0; y < travellers.length; y++) {
        travellers[y].fly();
    }

  //  document.getElementById("polypoints").setAttribute("points", finalstring);

   document.getElementById("pactive").setAttribute("points", activestring);

   document.getElementById("title").innerHTML = "Spacers (" + Math.ceil(day) + ")";


  /* for (e = 1; e < conf.length; e++) {
       var poly = "";
       for (i = 1; i < planets.length; i++) {
           if (planets[i].aff == e) {
               poly += Math.ceil(planets[i].rx) + "," + Math.ceil(planets[i].ry) + " ";
           }
       }

      document.getElementById('borders' + e).setAttribute("points", poly)
   }*/

    setTimeout(repeat, 1);
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        $(".ui").toggle();
    } else if (event.keyCode == 66) {
        $("#borders").toggle();
    } else if (event.keyCode == 13) {
        active = prompt();
        onTraveller = false;
        planets[active].goto();
    }
})

$(".ui").toggle();
$("#borders").toggle();

$("#headerbox").click(function () {
    if (active != 0) {
        planets[active].goto();
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

$('.planet').mousedown(function (event) {
    if (event.which == 3) {
        // alert(this.id + "  " + planets[this.id.substring(6)].connect());
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

newMsg("Initial Ownership:", 0);
for (e = 1; e < conf.length; e++) {
    var strang = "";
    var poly = "";
    for (i = 1; i < planets.length; i++) {
        if(planets[i].aff == e){
            strang += ", SR" + i;
            if (Math.random() > .35) {
                poly += Math.ceil(planets[i].rx) + "," + Math.ceil(planets[i].ry) + " ";
            }
        }
    }
    var holder = poly.split(" ");
    newMsg(conf[e].color + ": {" + strang.substring(2) + "}", 1);

    var line;
    line = document.createElementNS('http://www.w3.org/2000/svg', "polyline");
    line.id = "borders" + e;
    line.setAttributeNS(null, "points", poly + holder[0]);
    line.className = "borders";
    line.style.fill = conf[e].color;
    document.getElementById('borders').appendChild(line);
}

repeat();

