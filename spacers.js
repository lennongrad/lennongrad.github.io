
var curYPos, curXPos, curDown;
var returner = 10;

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

var setnone = function () {
    if (returner == 0) {
        active = 0;
        $("#detailedinfo").animate({ "left": "-57%" }, "fast").queue(function () {
            $("#detailedinfo").addClass('visible');
            $("#detailedinfo").stop(true);
        });
    }
}

var planetnumb = 100;

function planet(type, id) {
    this.rx = (1200 + (Math.random() * .90 * height));
    this.ry = (1200 + (Math.random() * .90 * width));
    this.type = type;
    this.id = id;
    this.addedC = 0;
    this.score = 0;

    this.connections = new Array(3).fill(0);

    var cont = true;
    while (cont) {
        cont = false;
        for (f = 0; f < this.connections.length + 1; f++) {
            if (this.connections[f % this.connections.length] == this.connections[(f + 1) % this.connections.length]) {
                cont = true;
            }
            this.connections[f % this.connections.length] = Math.ceil(Math.random() * planetnumb);
        }
    }

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
        returner = 10;
    }

    this.goto = function () {
        var x = this.rx - (window.innerWidth / 2);
        var y = this.ry - (window.innerHeight / 2);
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
            if (this.connections[gt] == id) {
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
        travellers[this.id.substring(9)].fly();
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
        } else {

            this.refresher();
        }

        day +=(1 / travellers.length);
        planets[this.home].score--;
        planets[this.destination].score += 1.25;

        this.moving = true;
        $("#traveller" + this.id).animate({ "left": (9 + Math.ceil(((planets[this.destination].rx)))), "top": (9 + Math.ceil(((planets[this.destination].ry)))) }, ((.3 + Math.random()) * (9000)));
    }
}


var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth,
                       html.clientWidth, html.scrollWidth, html.offsetWidth);

var planets = new Array(400);


var rotation = 1;

var day = 0;

for (i = 1; i < planets.length; i++) {
    planets[i] = new planet(rotation, i);
    if (i % 80 == 0) {
        rotation++;
    }
}

planets[0] = new planet(0, 0);

for (to = 0; to < 40; to++) {
    for (i = 1; i < planets.length; i++) {
        for (e = 1; e < planets.length; e++) {
            while (i != e && ((Math.abs(planets[i].rx - planets[e].rx) < 10 * (width / planets.length)) || Math.abs(planets[i].ry - planets[e].ry) < 10 * (height / planets.length))) {
                planets[i].randX();
                planets[i].randY();
            }
        }
    }
}



for (i = 1; i < planets.length; i++) {
    image = document.createElement("img");
    image.src = "planet" + planets[i].type + ".png";
    image.className = "planet";

    image.setAttribute('data-param', i);
    image.onclick = function () {
        planets[this.id.substring(6)].clicker();
   //     planets[this.id.substring(6)].goto();
    }

    image.id = "planet" + i;

    document.body.appendChild(image);

    document.getElementById("planet" + i).style.left = (((planets[i].rx))) + "px";
    document.getElementById("planet" + i).style.top = (((planets[i].ry))) + "px";
}

for (i = 1; i < planets.length; i++) {
    var added = new Array(planets.length).fill(false)
    while (planets[i].addedC < planets[i].connections.length) {
        var current = 0;
        do {
            current = 1 + Math.ceil(Math.random() * (planets.length - 2));
        } while (added[current] || planets[current].addedC >= 4 || i == current);


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

document.getElementById("lactive").style.height = 2400 + height;
document.getElementById("liners").style.height = 2400 + height;
document.getElementById("lactive").style.width = 2400 + width;
document.getElementById("liners").style.width = 2400 + width

function repeat() {
    
    returner--;
    if (returner < 0) {
        returner = 0;
    }

    document.getElementById("planetname").innerHTML = "Planet SR" + active;
    document.getElementById("planetscore").innerHTML = planets[active].score + " points";

    var finalstring = "";
    var activestring = "";
    var roter = false;

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
                        activestring += "" + (9 + Math.ceil((((planets[planets[e].connections[i]].rx))))) + "," + (9 + Math.ceil(((planets[planets[e].connections[i]].ry)))) + " " + Math.ceil(9 + (((planets[e].rx)))) + "," + (9+ Math.ceil(((planets[e].ry)))) + " ";
                }
            } else if (planets[e].type == planets[active].type) {
                document.getElementById("planet" + e).style.background = "radial-gradient(purple 60%, red 15%, transparent 25%)";
            }else {
                document.getElementById("planet" + e).style.background = "none";
            }
        }

    for (y = 0; y < travellers.length; y++) {
        travellers[y].fly();
    }

  //  document.getElementById("polypoints").setAttribute("points", finalstring);

   document.getElementById("pactive").setAttribute("points", activestring);

   document.getElementById("headerbox").innerHTML = Math.ceil(day);


    setTimeout(repeat, 10);
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        $(".ui").toggle();
    }
})

$(".ui").toggle();

repeat();

