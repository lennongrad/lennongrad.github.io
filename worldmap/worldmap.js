var versionNumber = "0.0"
var versionTitle = "Initial"
//document.getElementById("version-number").innerHTML = versionNumber + " (" + versionTitle + " Update)"

$(document).ready(function () {
})

var debug = false;
var cursor = {x: 0, y: 0, active: false};

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];

var keys = {
    37: {keydown: function(skip){//left
        if(marioPosition.y > 0 && activeWorld.items[marioPosition.x][marioPosition.y - 1] != "" && (skip || !marioCurrentlyMoving)){
            marioUpdate()
            marioCurrentlyMoving = true
            if(activeWorld.items[marioPosition.x][marioPosition.y - 1].includes("switch") 
            || activeWorld.items[marioPosition.x][marioPosition.y - 1].includes("path")
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("switch") 
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("path")){
                setTimeout(function(){marioCurrentlyMoving = false; keys[37].keydown(true);}, 100)
            }
            marioPosition.y--
        } else if(!marioCurrentlyMoving){
            mario.style.left = mario.getBoundingClientRect().x - 64 + "px"
            setTimeout(marioUpdate, 100)
        }
    }, keyup: function(){}, active: false}, 
    38: {keydown: function(skip){//up
        if(marioPosition.x > 0 && activeWorld.items[marioPosition.x - 1][marioPosition.y] != "" && (skip || !marioCurrentlyMoving)){
            marioUpdate()
            marioCurrentlyMoving = true
            if(activeWorld.items[marioPosition.x - 1][marioPosition.y].includes("switch") 
            || activeWorld.items[marioPosition.x - 1][marioPosition.y].includes("path")
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("switch") 
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("path")){
                setTimeout(function(){marioCurrentlyMoving = false; keys[38].keydown(true);}, 100)
            }
            marioPosition.x--
        } else if(!marioCurrentlyMoving){
            mario.style.top = mario.getBoundingClientRect().y - 64 + "px"
            setTimeout(marioUpdate, 100)
        }
    }, keyup: function(){}, active: false}, 
    39: {keydown: function(skip){//right
        if(marioPosition.y < activeWorld.items[0].length - 1 && activeWorld.items[marioPosition.x][marioPosition.y + 1] != "" && (skip || !marioCurrentlyMoving)){
            marioUpdate()
            marioCurrentlyMoving = true
            if(activeWorld.items[marioPosition.x][marioPosition.y + 1].includes("switch") 
            || activeWorld.items[marioPosition.x][marioPosition.y + 1].includes("path")
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("switch") 
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("path")){
                setTimeout(function(){marioCurrentlyMoving = false; keys[39].keydown(true);}, 100)
            }
            marioPosition.y++
        } else if(!marioCurrentlyMoving){
            mario.style.left = mario.getBoundingClientRect().x + 64 + "px"
            setTimeout(marioUpdate, 100)
        }
    }, keyup: function(){}, active: false}, 
    40: {keydown: function(skip){ //down
        if(marioPosition.x < activeWorld.items.length - 1 && activeWorld.items[marioPosition.x + 1][marioPosition.y] != "" && (skip || !marioCurrentlyMoving)){
            marioUpdate()
            marioCurrentlyMoving = true
            if(activeWorld.items[marioPosition.x + 1][marioPosition.y].includes("switch") 
            || activeWorld.items[marioPosition.x + 1][marioPosition.y].includes("path")
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("switch") 
            || activeWorld.items[marioPosition.x][marioPosition.y].includes("path")){
                setTimeout(function(){marioCurrentlyMoving = false; keys[40].keydown(true);}, 100)
            }
            marioPosition.x++
        } else if(!marioCurrentlyMoving){
            mario.style.top = mario.getBoundingClientRect().y + 64 + "px"
            setTimeout(marioUpdate, 100)
        }
    }, keyup: function(){}, active: false}
}

window.addEventListener('mousemove', function (e) {
    cursor.y = e.pageY;
    cursor.x = e.pageX - 80;/*
    if (curDown && !MouseScroller) {
        document.getElementById('page1').scrollTo(document.getElementById('page1').scrollLeft - e.movementX, document.getElementById('page1').scrollTop - e.movementY);
    }*/
});

window.addEventListener('mousedown', function (e) {
    cursor.active = true;
});

window.addEventListener('mouseup', function (e) {
    cursor.active = false;
});

document.addEventListener('keydown', function (event) {
    if (keys[event.keyCode] == undefined) {
        return
    }
    keys[event.keyCode].keydown()
    keys[event.keyCode].active = true
});

document.addEventListener('keyup', function (event) {
    if (keys[event.keyCode] == undefined) {
        return
    }
    keys[event.keyCode].keyup()
    keys[event.keyCode].active = false
});

function log(value, base) {
    return Math.log(value) / Math.log(base)
}

function removeElement(element) {
    element.parentNode.removeChild(element);
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

function randomIndex(arr) {
    return Math.floor(arr.length * Math.random())
}

function randomValue(arr) {
    return arr[randomIndex(arr)]
}

function adjustBrightness(col, amt) {
    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var R = parseInt(col.substring(0, 2), 16);
    var G = parseInt(col.substring(2, 4), 16);
    var B = parseInt(col.substring(4, 6), 16);

    R = R + amt;
    G = G + amt;
    B = B + amt;

    if (R > 255) R = 255;
    else if (R < 0) R = 0;

    if (G > 255) G = 255;
    else if (G < 0) G = 0;

    if (B > 255) B = 255;
    else if (B < 0) B = 0;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return (usePound ? "#" : "") + RR + GG + BB;

}

function numberExtension(number, sigFig) {
    number = number.toString();
    while(sigFig > number.length) {
        number = number + "0";
    }
    return number;
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

function small_int(e) {
    var size = Math.floor(Math.log10(Math.abs(e))) + 1;
    var suffix = "";

    if (size < 4) {
        return e.toString().substring(0, 3);
    } else {
        e = e.toExponential(9);
        e = e.substring(0, 4 + size % 3 + 4);
    }
    if (size >= 4) {
        switch (size % 3) {
            case 0: e = e.substring(0, 1) + e.substring(2, 4) + "." + e.substring(4); e = e.substring(0, 7); break;
            case 1: e = e.substring(0, 5); break;
            case 2: e = e.substring(0, 1) + e.substring(2, 3) + "." + e.substring(3); e = e.substring(0, 6); break;
        }
        suffix = suffixes[Math.floor((size - 1) / 3)]
    }
    if ((Math.floor((size - 1) / 3)) < suffixes.length) {
        return e + suffix;
    } else {
        return e + "e" + (size - 3);
    }
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            e.code === 22 ||                               // everything except Firefox
            e.code === 1014 ||                             //test name field too, because code might not be present everything except Firefox
            e.name === 'QuotaExceededError' ||             // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;                          // acknowledge QuotaExceededError only if there's something already stored
    }
}

function capitalize(str) {
    return str[0].toUpperCase() + str.substring(1);
}

function exportStr() {
    var data = [versionNumber]

    return JSON.stringify(data)
}

function importString(str) {
    if (!isJSON(str)) {
        return false
    }
    var data = JSON.parse(str)
    if (data.length != 1 || data[0] != versionNumber) {
        alert("This data is incompatible.")

        return false
    }
    return true
}

function saveData() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem("save", exportStr())
    }
}

function resetData() {
    if (storageAvailable('localStorage')) {
        localStorage.removeItem("save")
        location.reload()
    }
}

function loadData(str) {
    if (storageAvailable('localStorage')) {
        localStorage.setItem("save", str)
        location.reload()
    } else {
        importString(str)
    }
}

function copyToClipboard(str) {
    const tempElement = document.createElement('textarea');  // Create a <textarea> element
    tempElement.value = str;                                 // Set its value to the string that you want copied
    tempElement.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    tempElement.style.position = 'absolute';
    tempElement.style.left = '150vw';                        // Move outside the screen to make it invisible
    document.body.appendChild(tempElement);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0               // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)          // Store selection if found
            : false;                                         // Mark as false to know no selection existed before
    tempElement.select();                                    // Select the <textarea> content
    document.execCommand('copy');                            // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(tempElement);                  // Remove the <textarea> element
    if (selected) {                                          // If a selection existed before copying
        document.getSelection().removeAllRanges();           // Unselect everything on the HTML document
        document.getSelection().addRange(selected);          // Restore the original selection
    }
};

var pages = [document.getElementById("page-1"), document.getElementById("page-2")]
var activePage = pages[0];

function switchPage(to) {
    if(pages[to] == undefined) {
        return
    }
    activePage = pages[to]
    for(var i = 0; i < pages.length; i++){
        pages[i].style.display = "none"
    }
    activePage.style.display = ""
}

// Audio
//var snd = new Audio("click.wav");
// snd.play();

function showTooltip(elem) {
    document.getElementById("tooltip").innerHTML = elem.getAttribute("message")
    document.getElementById("tooltip").style.left = elem.getBoundingClientRect().left + elem.getBoundingClientRect().width / 2 + "px"
    document.getElementById("tooltip").style.top = elem.getBoundingClientRect().top - window.innerHeight / 22 + "px"
    document.getElementById("tooltip").style.opacity = .92
}

function hideTooltip() {
    document.getElementById("tooltip").style.opacity = 0
}

function g(a){
    return document.getElementById(a)
}

if (storageAvailable('localStorage')) {
    if (localStorage.getItem("save") != undefined) {
        if (!importString(localStorage.getItem("save"))) {
            localStorage.removeItem("save")
            location.reload()
        }
    }
}

function marioUpdate(){
    if(activeWorld.items[marioPosition.x][marioPosition.y].includes("switch")){
        switchStyle(activeWorld.items[marioPosition.x][marioPosition.y].substring(7))
    }
    mario.style.left = activeWorld.cells[marioPosition.x][marioPosition.y].getBoundingClientRect().x + "px"
    mario.style.top = activeWorld.cells[marioPosition.x][marioPosition.y].getBoundingClientRect().y + "px"
}

hideTooltip()
switchPage(0);

var activeStyle = "smb3"

function switchStyle(style){
    for(var i = 0; i < activeWorld.items.length; i++){
        for(var e = 0; e < activeWorld.items[i].length; e++){
            if(activeWorld.items[i][e] == "switch_" + style){
                activeWorld.items[i][e] = "switch_" + activeStyle
            }
        }
    }

    activeStyle = style
    mario.src = activeStyle + "/mario.gif"
    mario.className = activeStyle

    g("main").className = "flash"
    setTimeout(function(){
        activeWorld.update()
    }, 200)

    setTimeout(function(){
        g("main").className = ""
    }, 400)
}

class World{
    constructor(background, items){
        this.background = background
        this.items = items
        this.cells = []
    }

    update(){
        document.body.style.background = "url('" + activeStyle + "/" + this.background + ".png')"

        g("main").innerHTML = ""
        
        this.cells = []
        for(var i = 0; i < this.items.length; i++){
            var tr = document.createElement("TR")
            this.cells.push([])
            for(var e = 0; e < this.items[i].length; e++){
                var td = document.createElement("TD")
                if(this.items[i][e] != ""){
                    var img = document.createElement("IMG")
                    img.src = activeStyle + "/" + this.items[i][e] + ".png"
                    td.appendChild(img)
                }
                this.cells[i].push(td)
                tr.appendChild(td)
            }
            g("main").appendChild(tr)
        }
    }
}

var worlds = []

worlds.push(new World("grass", [
    ["level", "horizontalpath", "horizontalpath", "horizontalpath", "trjunction", "", ""],
    ["verticalpath", "", "", "", "verticalpath", "", ""],
    ["switch_SMW", "", "", "", "verticalpath", "", ""],
    ["verticalpath", "", "", "", "verticalpath", "", ""],
    ["level", "horizontalpath","horizontalpath","horizontalpath", "junction", "horizontalpath",  "trjunction"],
    ["","","","","verticalpath", "", "verticalpath"],
    ["","","","","bljunction", "horizontalpath", "level"]
]))
var activeWorld = worlds[0]


var marioPosition = {x: 0, y: 0}
var mario = document.createElement("IMG")
mario.id = "mario"
document.body.appendChild(mario)
var marioMovement = ""
var marioCurrentlyMoving = false

switchStyle("smb3")
activeWorld.update()
marioUpdate()

setInterval(function () {
}, 1)