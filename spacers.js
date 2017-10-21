function planet(type, id) {
    this.rx = Math.random() * .95;
    this.ry = Math.random() * .95;
    this.type = type;
    this.id = id;

    this.clicker = function () {
        active = id;
    }
}

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

    document.getElementById("planet" + i).style.left = (window.innerWidth * ((planets[i].rx))) + "px";
    document.getElementById("planet" + i).style.top = (window.innerHeight * ((planets[i].ry))) + "px";


}


var linesstring = new Array(planets.length);
linesstring[0] = "";
var active = 1;
var smallactive = 1;
document.getElementById("liners").style.height = window.innerHeight;

function repeat() {

for (e = 1; e < planets.length; e++) {
        linesstring[e] = "" + (9 + Math.ceil((window.innerWidth * ((planets[active].rx))))) + "," + (9 + Math.ceil(window.innerHeight * ((planets[active].ry)))) + " " + Math.ceil(9 + (window.innerWidth * ((planets[e].rx)))) + "," + (9 + Math.ceil(window.innerHeight * ((planets[e].ry)))) + " ";
}

var finalstring = "";

for (e = 1; e < planets.length; e++) {
        finalstring += linesstring[e];
}

document.getElementById("polypoints").setAttribute("points", finalstring);


    setTimeout(repeat, 10);
}

repeat();