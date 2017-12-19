var height = 5000;
var width = 5000;
var gridsize = 7;

var x = 600;
var y = 600;

function a(e) {
    return document.getElementById(e);
}

var pyth = function (id1, id2) {
    return Math.sqrt(Math.pow(Math.abs(id1), 2) + Math.pow(Math.abs(id2), 2));
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

var coordinates = [];
for (i = 0; i <  width / gridsize; i++){
    coordinates[i] = new Array();
    for (e = 0; e < height / gridsize; e++){
        coordinates[i][e] = 0;
    }
}

var v = .005;

function setNow(x, y, e) {
    if (x > coordinates.length - 1 || x < 1) return;
    if (y > coordinates[x].length - 1 || y < 1) return;

    coordinates[x][y] = 1;

    if (e > Math.random() && coordinates[x - 1][y] == 0) {
        setNow(x - 1, y, e - v);
    }

    if (e > Math.random() && coordinates[x + 1][y] == 0) {
        setNow(x + 1, y, e - v);
    }

    if (e > Math.random() && coordinates[x][y - 1] == 0) {
        setNow(x, y - 1, e - v);
    }

    if (e > Math.random() && coordinates[x][y + 1] == 0) {
        setNow(x, y + 1, e - v);
    }
}

for (t = 0; t < 2; t++) {
    setNow((t * 20) + Math.floor(200 * Math.random()), (t * 20) + Math.floor(200 * Math.random()), 1.5);
}    

var u = 0;

function province(x, y, e, r) {
    v = .05;
    if (x > coordinates.length - 1 || x < 1) return;
    if (y > coordinates[x].length - 1 || y < 1) return;

    coordinates[x][y] = r;

    if (e > Math.random() && coordinates[x - 1][y] == 1) {
        province(x - 1, y, e - v, r);
    }

    if (e > Math.random() && coordinates[x + 1][y] == 1) {
        province(x + 1, y, e - v, r);
    }

    if (e > Math.random() && coordinates[x][y - 1] == 1) {
        province(x, y - 1, e - v, r);
    }

    if (e > Math.random() && coordinates[x][y + 1] == 1) {
        province(x, y + 1, e - v, r);
    }
    
    u++;
    console.log(u);
} 

for (t = 0; t < 1; t++) {
    for (x = 1; x < width / gridsize - 1; x++) {
        for (y = 1; y < height / gridsize - 1; y++) {
            if (coordinates[x - 1][y] > 0 && coordinates[x + 1][y] > 0 && coordinates[x][y + 1] > 0 && coordinates[x][y - 1] > 0) {
                coordinates[x][y] = 1;
            } else if (coordinates[x][y] == 1) {
                coordinates[x][y] = 2;
            }
        }
    }
}   

var xe = 0;
var ye = 0;
var te = 160;

for (t = 0; t < te; t++) {
    xe = 0;
    ye = 0;

    while (coordinates[xe][ye] == 0) {
        xe = Math.floor(coordinates.length * Math.random());
        ye = Math.floor(coordinates[xe].length * Math.random());
    }

    province(xe, ye, 1, 3 + t);
}    

for (t = 0; t < 5; t++) {
    for (x = 1; x < width / gridsize - 1; x++) {
        for (y = 1; y < height / gridsize - 1; y++) {
            if (coordinates[x][y] == 1 && coordinates[x - 1][y] > 2) {
                coordinates[x][y] = coordinates[x - 1][y];
            } else if (coordinates[x][y] == 1 && coordinates[x + 1][y] > 2) {
                coordinates[x][y] = coordinates[x + 1][y];
            } else if (coordinates[x][y] == 1 && coordinates[x][y + 1] > 2) {
                coordinates[x][y] = coordinates[x][y + 1];
            } else if (coordinates[x][y] == 1 && coordinates[x + 1][y - 2] > 2) {
                coordinates[x][y] = coordinates[x][y - 1];
            } else if (coordinates[x][y] ==1 && t == 3) {
                coordinates[x][y] = Math.floor(te * Math.random());
            }
        }
    }
}

var o = 1;
for (i = 0; i < height / gridsize; i++) {
    o *= -1;
    var newrow = document.createElement('TR');

    for (e = 0; e < width / gridsize; e++) {
        o *= -1;
        var newcol = document.createElement('TD');
        
        newcol.style.paddingTop = gridsize + "px";
        newcol.style.paddingLeft = gridsize + "px";
        newcol.id = "grid" + i + "-" + e;

            newcol.style.backgroundColor = "#72b3db";

        if (o > 0) {
            newcol.style.backgroundColor = "#67a7ce";
        } 

        if (coordinates[e][i] == 2) {
            newcol.style.backgroundColor = "#599ac1";
        }

        if (coordinates[e][i] > 2) {
            newcol.style.backgroundColor = "#" + ( (coordinates[e][i] - 2)).toString(16) + "55" +  ( te - (coordinates[e][i] - 2)).toString(16);
         }

        newcol.className = "gridcol";
        newrow.appendChild(newcol);
    }

    document.getElementById('grid').appendChild(newrow);
}

var y= 100;
function repeat() {
    a("flasher").style.right = y + "px";
    y *= -1;
}

setInterval(repeat, 1);