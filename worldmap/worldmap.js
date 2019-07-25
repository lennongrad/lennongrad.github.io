var versionNumber = "0.0"
var versionTitle = "Initial"
//document.getElementById("version-number").innerHTML = versionNumber + " (" + versionTitle + " Update)"

$(document).ready(function () {
})

var debug = false;
var cursor = {x: 0, y: 0, active: false};

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

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
            g("main").style.left = g("main").getBoundingClientRect().x + 64 + "px"
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
            g("main").style.top = g("main").getBoundingClientRect().y + 64 + "px"
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
            g("main").style.left = g("main").getBoundingClientRect().x - 64 + "px"
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
            g("main").style.top = g("main").getBoundingClientRect().y - 64 + "px"
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

function toggleLevelInfo(){
    if(g("levelinfo").style.opacity == "0"){
        g("levelinfo").style.opacity = "1"
    } else {
        g("levelinfo").style.opacity = "0"
    }
}

function marioUpdate(){
    if(activeWorld.items[marioPosition.x][marioPosition.y].includes("switch")){
        switchStyle(activeWorld.items[marioPosition.x][marioPosition.y].substring(7))
    }
    g("main").style.left = "calc(30% + " + (marioPosition.y * -64) + "px)"
    g("main").style.top = "calc(50% + " + (marioPosition.x * -64) + "px)"

    var viableLevel = activeWorld.levels.filter(x => x.x == marioPosition.x && x.y == marioPosition.y && x.style == activeStyle)
    if(viableLevel.length != 0){
        if( window.mobilecheck() ){
            g("levelinfo-toggle").style.opacity = ".95"
        } else {
            g("levelinfo").style.right = "40px"
            g("levelinfo").style.opacity = "1"
        }
        viableLevel = viableLevel[0]
        g("levelinfo-name").innerHTML = viableLevel.name
        g("levelinfo-style").src = viableLevel.style + "/logo.png"
        g("levelinfo-thumb").src = "levelicons/" + viableLevel.image + ".png"
        g("levelinfo-descr").innerHTML = viableLevel.descr
        g("levelinfo-record-text").innerHTML = viableLevel.record
        g("levelinfo-record-holder").innerHTML = viableLevel.holder
        g("levelinfo-code-code").innerHTML = viableLevel.id
    } else {
        if( window.mobilecheck() ){
            g("levelinfo-toggle").style.opacity = "0"
            g("levelinfo").style.opacity = "0"
        } else {
            g("levelinfo").style.right = "-400px"
        }
    }
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
    constructor(background, items, levels){
        this.background = background
        this.items = items
        this.cells = []
        this.levels = levels
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
    ["level", "horizontalpath", "horizontalpath", "horizontalpath", "trjunction"],
    ["verticalpath", "", "", "", "verticalpath"],
    ["verticalpath", "", "level", "horizontalpath", "switch_smw"],
    ["verticalpath", "", "verticalpath", "", "verticalpath"],
    ["bljunction", "horizontalpath","junction","horizontalpath", "brjunction"],
    ["","","verticalpath","","", "", ""],
    ["horizontalpath","horizontalpath","brjunction","",""]
    ], [
        {name: "Spiny Desert Plumbing", x: 0, y: 0, image: "1", descr: "The desert pipes have been clogged with Spinies and Thwomps!", record: "01'27''110", holder: "VGMelodies", id: "TN7-4X6-6QF", style: "smb3"},
        {name: "Magmafrost Land", x: 0, y: 0, image: "2", descr: "Travel between mirror dimensions, one hot and the other cold.", record: "02'31''046", holder: "Awein", id: "RNF-FTM-NDG", style: "smw"},
        {name: "sample", x: 2, y: 2, image: "3", descr: "sample", record: "01'69''420", holder: "Boris Johnson", id: "CBT-CBT-CBT", style: "smb3"}
    ]))
var activeWorld = worlds[0]


var marioPosition = {x: 6, y: 0}
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