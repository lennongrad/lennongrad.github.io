var maxXHex = 12;
var maxYHex = 18;

var leftColumn = 0;
var bottomRow = 0;

var xCoords = [];
var yCoords = [];

var holderTop = 113;
var holderBottom = 888;
var holderLeft = 120;
var holderRight = 610;

var colours = ["red", "green", "purple", "blue", "orange"];
var topColours = ["red", "red"];
var leftColours = ["green", "green"];

var a = function(name){
    return document.getElementById(name);
}

var curXPos = 0;
var curYPos = 0;

window.addEventListener('mousemove', function (e) {
    curYPos = e.clientY;
    curXPos = e.clientX;

    repeat();
});

window.addEventListener('mousedown',function(event) {
    switch (event.which) {
        case 1:
            leftClick();
            break;
        case 2:
            middleClick();
            break;
        case 3:
            rightClick();
            break;
        default:
    }
});

function Tile(pos){
    this.position = pos;

    this.marked = false;

    this.xGraphic = (48 * pos[0]);
    this.yGraphic = (48 * pos[1]);

    this.atom = "none";

    var tileGraphic = document.createElement("div");
    tileGraphic.className = "tile";
    tileGraphic.id = "tile" + pos[0] + " " + pos[1];
    tileGraphic.style.left = this.xGraphic + "px";
    tileGraphic.style.top = this.yGraphic + "px";

    if(pos[1] == 0)xCoords.push(100 + this.xGraphic);
    if(pos[0] == 0)yCoords.push(75 + this.yGraphic);

    a("tileHolder").appendChild(tileGraphic);
}

var coordinates = [];
var rep = 0;
for (var x = 0; x < maxXHex; x++){
    coordinates[x] = [];
    for (var y = 0; y < maxYHex; y++){
        coordinates[x][y] = new Tile([x,y]);
    }
}

var refresh = function(){
    for(var x = 0; x < xCoords.length; x++){
        for(var y = 0; y < yCoords.length; y++){
            coordinates[x][y].marked = false;
        }
    }
}

var marker = function(pos, colour){
   if(colour == "none") return 0;

    var counter = 1;
    
    coordinates[pos[0]][pos[1]].marked = true;

    if(pos[0] - 1 >= 0){
        if(coordinates[pos[0] - 1][pos[1]].atom == colour && !coordinates[pos[0] - 1][pos[1]].marked){
            counter += marker([pos[0] - 1, pos[1]], colour);
        }
    }

    if(pos[1] + 1 < maxXHex){
        if(coordinates[pos[0] + 1][pos[1]].atom == colour && !coordinates[pos[0] + 1][pos[1]].marked){
            counter += marker([pos[0] + 1, pos[1]], colour);
        }
    }
    
    if(pos[1] - 1 >= 0){
        if(coordinates[pos[0]][pos[1] - 1].atom == colour && !coordinates[pos[0]][pos[1 - 1]].marked){
            counter += marker([pos[0], pos[1] - 1], colour);
        }
    }

    if(pos[1] + 1 < maxYHex){
        if(coordinates[pos[0]][pos[1] + 1].atom == colour && !coordinates[pos[0]][pos[1] + 1].marked){
            counter += marker([pos[0], pos[1] + 1], colour);
        }
    }
    
    return counter;
}

var leftClick = function(){
    var iteration = 0;
    for (var x = leftColumn; x < leftColumn + 2; x++){
        var recentY = 0;
        var stopLoop = false;
        for (var y = 0; y < maxYHex && !stopLoop; y++){
            if(coordinates[x][y].atom != "none"){
                stopLoop = true;
            } else {
                recentY = y;
            }
        }
        coordinates[x][recentY].atom = topColours[iteration];
        iteration++;
    }

    topColours = [colours[Math.floor(colours.length * Math.random())], colours[Math.floor(colours.length * Math.random())]];
    repeat();
}

var rightClick = function(){
    var iteration = 0;
    for (var y = bottomRow; y < bottomRow + 2; y++){
        var recentX = 0;
        var stopLoop = false;
        for (var x = 0; x < maxXHex && !stopLoop; x++){
            if(coordinates[x][y].atom != "none"){
                stopLoop = true;
            } else {
                recentX = x;
            }
        }
        coordinates[recentX][y].atom = leftColours[iteration];
        iteration++;
    }
    leftColours = [colours[Math.floor(colours.length * Math.random())], colours[Math.floor(colours.length * Math.random())]];
    repeat();
}

var middleClick = function(){
}

var repeat = function(){
    for(var x = 0; x < xCoords.length - 1; x++){
        if(curXPos > xCoords[x] && curXPos < xCoords[x + 1]){
            leftColumn = x;
        }
    }

    for(var y = 0; y < yCoords.length - 1; y++){
        if(curYPos > yCoords[y] && curYPos < yCoords[y + 1]){
            bottomRow = y;
        }
    }

    if(curYPos > holderTop && curYPos < holderBottom){
        a("cannon1").style.top = (-50 + curYPos) + "px";
        a("cannon2").style.top = (-10 + curYPos) + "px";
    } else if(curYPos < holderTop){
        a("cannon1").style.top = holderTop - 50 + "px";
        a("cannon2").style.top = holderTop - 10 + "px";
    } else if(curYPos > holderBottom){
        a("cannon1").style.top = holderBottom - 50 + "px";
        a("cannon2").style.top = holderBottom - 10 + "px";
    }

    if(curXPos > holderLeft && curXPos < holderRight){
        a("cannon3").style.left = (-40 + curXPos) + "px";
        a("cannon4").style.left = (-00 + curXPos) + "px";
    } else if(curXPos < holderLeft){
        a("cannon3").style.left = holderLeft - 40 + "px";
        a("cannon4").style.left = holderLeft + "px";
    } else if(curXPos > holderRight){
        a("cannon3").style.left = holderRight - 40 + "px";
        a("cannon4").style.left = holderRight + "px";
    }

    a("cannon1").style.backgroundColor = leftColours[0];
    a("cannon2").style.backgroundColor = leftColours[1];
    a("cannon3").style.backgroundColor = topColours[0];
    a("cannon4").style.backgroundColor = topColours[1];

    for (var x = 0; x < maxXHex; x++){
        for (var y = 0; y < maxYHex; y++){
            if(marker([x,y], coordinates[x][y].atom) > 3){
                for (var xe = 0; xe < maxXHex; xe++){
                    for (var ye = 0; ye < maxYHex; ye++){
                        if(coordinates[xe][ye].marked) {
                            coordinates[xe][ye].toDestroy = true;
                        }
                    }
                }
            }
            refresh();
            if(x == leftColumn || x == leftColumn + 1 || y == bottomRow || y == bottomRow + 1){
                a("tile" + x + " " + y).style.backgroundColor = "#515151";
            } else {
                a("tile" + x + " " + y).style.backgroundColor = "#313131";
            }

            if(coordinates[x][y].atom != "none" && !coordinates[x][y].toDestroy){
                a("tile" + x + " " + y).style.backgroundColor = coordinates[x][y].atom;
            }
        }
    }

    for (var x = 0; x < maxXHex; x++){
        for (var y = 0; y < maxYHex; y++){
            if(coordinates[x][y].toDestroy){
                coordinates[x][y].atom = "none";
                coordinates[x][y].toDestroy = false;
            }
        }
    }
}

repeat();
//setInterval(repeat, 1000);