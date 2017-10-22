
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
    this.rx = Math.random() * .90;
    this.ry = Math.random() * .90;
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

    this.getLX = function (extension) {
        if (extension) {
            return (1200 + (this.rx * width)) + "px";
        } else {
            return 1200 + (this.rx * width);
        }
    }

    this.getLY = function (extension) {
        if (extension) {
            return (1200 + (this.ry * height)) + "px";
        } else {
            return 1200 + (this.ry * height);
        }
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
        var x = 800 + ((this.rx * width) - (window.innerWidth / 2));
        var y = 1300 + ((this.ry * height) - (window.innerHeight / 2));
        if(x > width){
            x = width;
        }
        if (y > height) {
            y = height;
        }
        window.scrollTo(x, y);
    }
}

function traveller(id) {
    this.home = 1 + Math.ceil(Math.random() * (planets.length - 2));
    do{
        this.destination = 1 + Math.ceil(Math.random() * (planets.length - 2));
    } while (planets[this.home].type != planets[this.destination].type)

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

    document.getElementById("traveller" + id).style.left = planets[this.home].getLX(true);
    document.getElementById("traveller" + id).style.top = planets[this.home].getLY(true);

    this.refresher = function () {
        this.home = this.destination;
        do {
            this.destination = 1 + Math.ceil(Math.random() * (planets.length - 2));
        } while (planets[this.home].type != planets[this.destination].type)
    }

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
        $("#traveller" + this.id).animate({ "left": (1209 + Math.ceil(width * ((planets[this.destination].rx)))), "top": (1209 + Math.ceil(height * ((planets[this.destination].ry)))) }, 9000);
    }
}


var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth,
                       html.clientWidth, html.scrollWidth, html.offsetWidth);

var planets = new Array(100);


var rotation = 1;

var day = 0;

for (i = 1; i < planets.length; i++) {
    planets[i] = new planet(rotation, i);
    if (i % 20 == 0) {
        rotation++;
    }
}

planets[0] = new planet(0, 0);



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

    document.getElementById("planet" + i).style.left = 1200 + (width * ((planets[i].rx))) + "px";
    document.getElementById("planet" + i).style.top = 1200 + (height * ((planets[i].ry))) + "px";
}

for (i = 1; i < planets.length; i++) {
    var added = new Array(planets.length).fill(false)
    while (planets[i].addedC < planets[i].connections.length) {
        var current = 0;
        do {
            current = 1 + Math.ceil(Math.random() * (planets.length - 2));
        } while (added[current] || planets[current].type != planets[i].type || planets[current].addedC >= 4 || i == current);


        planets[i].connections[planets[i].addedC] = current;
        added[current] = true;
        planets[current].connections[planets[current].addedC] = i;
        planets[current].addedC++;
            planets[i].addedC++;
    }
    }

var travellers = new Array(1);
travellers[0] = new traveller(0);
travellers[1] = new traveller(1);
travellers[2] = new traveller(2);
travellers[3] = new traveller(3);
travellers[4] = new traveller(4);
travellers[5] = new traveller(5);
travellers[6] = new traveller(6);
travellers[7] = new traveller(7);
travellers[8] = new traveller(8);
travellers[9] = new traveller(9);
travellers[10] = new traveller(10);
travellers[11]= new traveller(11);
travellers[12] = new traveller(12);

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
                    finalstring += "" + (1209 + Math.ceil((width * ((planets[i].rx))))) + "," + (1209 + Math.ceil(height * ((planets[i].ry)))) + " " + Math.ceil(1209 + (width * ((planets[e].rx)))) + "," + (1209 + Math.ceil(height * ((planets[e].ry)))) + " ";
                }
            }
        }
    }
        
        for (e = 1; e < planets.length; e++) {
            if (e == active) {
                document.getElementById("planet" + e).style.background = "radial-gradient(yellow 60%, red 15%, transparent 25%)";
                for (i = 0; i < planets[e].connections.length; i++) {
                    if (planets[e].type == planets[planets[e].connections[i]].type) {
                        activestring += "" + (1209 + Math.ceil((width * ((planets[planets[e].connections[i]].rx))))) + "," + (1209 + Math.ceil(height * ((planets[planets[e].connections[i]].ry)))) + " " + Math.ceil(1209 + (width * ((planets[e].rx)))) + "," + (1209 + Math.ceil(height * ((planets[e].ry)))) + " ";
                    }
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

   document.getElementById("polypoints").setAttribute("points", finalstring);

   document.getElementById("pactive").setAttribute("points", activestring);

   document.getElementById("headerbox").innerHTML = Math.ceil(day);


    setTimeout(repeat, 10);
}



repeat();

