
var curYPos, curXPos, curDown;

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
var planetnumb = 50;

function planet(type, id) {
    this.rx = Math.random() * .95;
    this.ry = Math.random() * .95;
    this.type = type;
    this.id = id;

    this.connections = new Array();
    this.connections[0] = Math.ceil(Math.random() * planetnumb);
    this.connections[1] = Math.ceil(Math.random() * planetnumb);
    this.connections[2] = Math.ceil(Math.random() * planetnumb);
    this.connections[3] = Math.ceil(Math.random() * planetnumb);
    this.connections[4] = Math.ceil(Math.random() * planetnumb);
    this.connections[5] = Math.ceil(Math.random() * planetnumb);
    this.connections[6] = Math.ceil(Math.random() * planetnumb);
    this.connections[7] = Math.ceil(Math.random() * planetnumb);
    this.connections[8] = Math.ceil(Math.random() * planetnumb);

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



    this.rational = function () {
        var times = 3;
        for (y = 1; y < planets.length; y++) {
            for (o = 0; o < planets[y].connections.length; o++) {
                while (planets[y].connections[o] == this.id && y != this.id) {
                    this.connections[times - 1] = y;
                    times--;
                    break;
                }
            }
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
    }
}

var body = document.body,
    html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight);
var width = Math.max(body.scrollWidth, body.offsetWidth,
                       html.clientWidth, html.scrollWidth, html.offsetWidth);

var planets = new Array();

planets[1] = new planet(1, 1);
planets[2] = new planet(1, 2);
planets[3] = new planet(1, 3);
planets[4] = new planet(1, 4);
planets[5] = new planet(1, 5);
 planets[6] = new planet(1, 6);
planets[7] = new planet(1, 7);
planets[8] = new planet(1, 8);
planets[9] = new planet(1, 9);
planets[10] = new planet(1, 10);
planets[11] = new planet(2, 11);
planets[12] = new planet(2, 12);
planets[13] = new planet(2, 13);
planets[14] = new planet(2, 14);
planets[15] = new planet(2, 15);
planets[16] = new planet(2, 16);
planets[17] = new planet(2, 17);
planets[18] = new planet(2, 18);
planets[19] = new planet(2, 19);
planets[20] = new planet(2, 20);
planets[21] = new planet(3, 21);
planets[22] = new planet(3, 22);
planets[23] = new planet(3, 23);
planets[24] = new planet(3, 24);
planets[25] = new planet(3, 25);
planets[26] = new planet(3, 26);
planets[27] = new planet(3, 27);
planets[28] = new planet(3, 28);
planets[29] = new planet(3, 29);
planets[30] = new planet(3, 30);
planets[31] = new planet(4, 31);
planets[32] = new planet(4, 32);
planets[33] = new planet(4, 33);
planets[34] = new planet(4, 34);
planets[35] = new planet(4, 35);
planets[36] = new planet(4, 36);
planets[37] = new planet(4, 37);
planets[38] = new planet(4, 38);
planets[39] = new planet(4, 39);
planets[40] = new planet(4, 40);
planets[41] = new planet(5, 41);
planets[42] = new planet(5, 42);
planets[43] = new planet(5, 43);
planets[44] = new planet(5, 44);
planets[45] = new planet(5, 45);
planets[46] = new planet(5, 46);
planets[47] = new planet(5, 47);
planets[48] = new planet(5, 48);
planets[49] = new planet(5, 49);
planets[50] = new planet(5, 50);


for (i = 1; i < planets.length; i++) {
    image = document.createElement("img");
    image.src = "planet" + planets[i].type + ".png";
    image.className = "planet";

    image.setAttribute('data-param', i);
    image.onclick = function () {
        planets[this.id.substring(6)].clicker();
    }

    image.id = "planet" + i;

    document.body.appendChild(image);

    document.getElementById("planet" + i).style.left = (width * ((planets[i].rx))) + "px";
    document.getElementById("planet" + i).style.top = (height * ((planets[i].ry))) + "px";

    planets[i].rational();
}


var linesstring = new Array(planets.length);
linesstring[0] = "";
var active = 1;
var smallactive = 1;

document.getElementById("lactive").style.height = height;
document.getElementById("liners").style.height = height;
document.getElementById("lactive").style.width = width;
document.getElementById("liners").style.width = width

function repeat() {
    
    var finalstring = "";
    var activestring = "";

    for (e = 1; e < planets.length; e++) {
        if (planets[e].type == planets[active].type) {
            finalstring += "" + (9 + Math.ceil((width * ((planets[active].rx))))) + "," + (9 + Math.ceil(height * ((planets[active].ry)))) + " " + Math.ceil(9 + (width * ((planets[e].rx)))) + "," + (9 + Math.ceil(height * ((planets[e].ry)))) + " ";
        }


    if (e == active) {
        document.getElementById("planet" + e).style.background = "radial-gradient(yellow 60%, red 15%, transparent 25%)";
        for (i = 0; i < planets[e].connections.length; i++) {
            if (planets[e].type == planets[planets[e].connections[i]].type) {
                activestring += "" + (9 + Math.ceil((width * ((planets[planets[e].connections[i]].rx))))) + "," + (9 + Math.ceil(height * ((planets[planets[e].connections[i]].ry)))) + " " + Math.ceil(9 + (width * ((planets[e].rx)))) + "," + (9 + Math.ceil(height * ((planets[e].ry)))) + " ";
            }
        }
    } else {
        document.getElementById("planet" + e).style.background = "none";
    }
}



   document.getElementById("polypoints").setAttribute("points", finalstring);

    document.getElementById("pactive").setAttribute("points", activestring);


    setTimeout(repeat, 10);
}




repeat();

