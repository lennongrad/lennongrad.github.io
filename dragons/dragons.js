// 10521 ALLEN SCHOLARSHIPS
var versionNumber = "0.0"
var versionTitle = "Initial"
//document.getElementById("version-number").innerHTML = versionNumber + " (" + versionTitle + " Update)"

$(document).ready(function () {
    $('#loadingleft').toggle("slide", { direction: "left" }, 400);
    $('#loadingright').toggle("slide", { direction: "right" }, 400);
})

var cursor = {x: 0, y: 0, active: false};

var settingTypes = {bool: "boolean", percent: "percent", number: "number", key: "key"}
var settingPages = {gameplay: "gameplay", keybindings: "keybindings"}
var activeSettingPage = settingPages.gameplay

var trappingKey, catchingKey

class Setting{
    constructor(name, type, defaultState, page){
        this.name = name
        this.type = type
        this.value = defaultState
        this.page = page
        
        this.elem = document.createElement("div")
        this.elem.innerHTML = this.name + ": " + this.value
        this.elem.className = "button"

        var self = this
        this.elem.onclick = function(){self.change()}
    }

    change(to){
        if(to == undefined){
            if(this.type == settingTypes.bool){
                this.value = !this.value
            } else if(this.type = settingTypes.key){
                catchingKey = this
            }
        } else {
            this.value = to
        }
        if(this.type == settingTypes.key){
            keys[this.name.toLowerCase()].key = this.value
        }
        this.render()
    }
    
    render(){
        this.elem.innerHTML = this.name + ": " + this.value
        return this.elem
    }
}

var settings = {
    enableDragAndDrop: new Setting("Drag and Drop", settingTypes.bool, false, settingPages.gameplay),
    debug: new Setting("Debug", settingTypes.bool, "false", settingPages.gameplay),
    shift: new Setting("Shift", settingTypes.key, 16,  settingPages.keybindings)
}

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];

var keys = {
    shift: {key: 16, keydown: function(){}, keyup: function(){}, active: false}
}

var editIcon = g("edit-icon")

function log(value, base) {
    return Math.log(value) / Math.log(base)
}

function removeElement(element) {
    element.parentNode.removeChild(element);
}

function g(id){
    return document.getElementById(id)
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
            : false;                                         //Now that....  Mark as false to know no selection existed before
    tempElement.select();                                    // Select the <textarea> content
    document.execCommand('copy');                            // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(tempElement);                  // Remove the <textarea> element
    if (selected) {                                          // If a selection existed before copying
        document.getSelection().removeAllRanges();           // Unselect everything on the HTML document
        document.getSelection().addRange(selected);          // Restore the original selection
    }
    $("#copiedMessage").show()
    setTimeout(function(){
        $("#copiedMessage").hide()
    }, 2050)
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

function switchBox(to, down){
    if(down || cursor.active){
        activePen = to
        pens[to].render()
    }
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

function renderAll(){
    g("pen-switch").innerHTML = ""
    for(var i = 0; i < pens.length; i++){
        pens[i].showName()
    }
    activePen.selector.setAttribute("current", "true")
    activePen.render()
    g("pen-egg-count").innerHTML = activePen.match(["stage", 0]).length
    g("pen-dragon-count").innerHTML = activePen.match(["stage", 1]).length
    g("pen-switch").appendChild(editIcon)
    bufferBar.render()
    
    g("settings-list").innerHTML = ""
    for(var i = 0; i < Object.keys(settings).length; i++){
        if(settings[Object.keys(settings)[i]].page == activeSettingPage){
            g("settings-list").appendChild(settings[Object.keys(settings)[i]].render())
        }
    }
}

window.addEventListener('mousemove', function (e) {
    cursor.x = e.pageX;
    cursor.y = e.pageY;
    g("drag").style.left = cursor.x + "px"
    g("drag").style.top = cursor.y + "px"
    /*
    if (curDown && !MouseScroller) {
        document.getElementById('page1').scrollTo(document.getElementById('page1').scrollLeft - e.movementX, document.getElementById('page1').scrollTop - e.movementY);
    }*/
});

window.addEventListener('mousedown', function (e) {
    cursor.active = true;
    catchingKey = undefined
});

window.addEventListener('mouseup', function (e) {
    cursor.active = false;
    if(lastDragged != undefined && settings.enableDragAndDrop.value){
        lastDragged.click()
    }
});

document.addEventListener('keydown', function (event) {
    if(catchingKey == undefined){
        for(var i in Object.keys(keys)){
            if (keys[Object.keys(keys)[i]].key == event.keyCode) {
                keys[Object.keys(keys)[i]].keydown()
                keys[Object.keys(keys)[i]].active = true
            }
        }
    } else {
        catchingKey.change(event.keyCode)
        catchingKey = undefined
    }
});

document.addEventListener('keyup', function (event) {
    for(var i in Object.keys(keys)){
        if (keys[Object.keys(keys)[i]].key == event.keyCode) {
            keys[Object.keys(keys)[i]].keyup()
            keys[Object.keys(keys)[i]].active = false
        }
    }
});

if (storageAvailable('localStorage')) {
    if (localStorage.getItem("save") != undefined) {
        if (!importString(localStorage.getItem("save"))) {
            localStorage.removeItem("save")
            location.reload()
        }
    }
}

var currentlyDragging, lastDragged

class Species{
    constructor(name, stages){
        this.name = name
        this.stages = stages
    }
}

var species = {
    one: new Species("X", [{name: "egg1", image: "1.png"}, {name: "d1", image: "2.png"}]),
    two: new Species("Y", [{name: "egg2", image: "4.png"}, {name: "d2", image: "5.png"}])
}

class Dragon{
    constructor(speciesID, stageID, name){
        this.species = species[speciesID]
        this.speciesID = speciesID
        for(var i in Object.keys(this.species)){
            this[Object.keys(this.species)[i]] = this.species[Object.keys(this.species)[i]]
        }

        this.stage = this.stages[stageID]
        if(name != undefined){
            this.name = name
        }

        this.elem = document.createElement("img")
        this.elem.className = "dragon"
        this.elem.src = this.stage.image
        this.elem.setAttribute("draggable", false)
    }

    stageID(){
        return this.stages.map(y => y.name).indexOf(this.stage.name)
    }

    toString(){
        var final = ""
        final += this.speciesID + ","
        final += this.stageID() + ","
        final += this.name
        return final
    }
}

class Slot{
    constructor(elem, shiftLocation){
        if(elem != undefined){
            this.elem = elem
        } else {
            this.elem = document.createElement("DIV")
            this.elem.className = "dragonSlot"
        }
        var self = this
        this.elem.onmousedown = function(){self.click(false)}
        this.elem.onmouseup = function(){self.click(true)}
        this.dragon = undefined
        this.shiftLocation = shiftLocation
        this.render()
    }

    add(dragon){
        if(this.allowAdd()){
            this.dragon = dragon
            return true
        }
        return false
    }

    allowAdd(){
        return this.dragon == undefined
    }

    allowTake(){
        return this.dragon != undefined
    }

    click(skip){
        if(!settings.enableDragAndDrop.value && skip){
            return
        }
        if(keys.shift.active){
            var location = this.shiftLocation
            if(typeof(this.shiftLocation) == "function"){
                location = this.shiftLocation()
            }
            if(location == undefined){
                console.error("Broken shift location!")
                return
            }
            if(location.add(this.dragon)){
                this.dragon = undefined
            }
        } else{
            if(currentlyDragging == undefined && this.allowTake()){
                currentlyDragging = this.dragon
                this.dragon = undefined
                lastDragged = this
                g("drag").innerHTML = ""
                g("drag").appendChild(currentlyDragging.elem)
            } else if(currentlyDragging != undefined && this.allowTake() && !settings.enableDragAndDrop.value){
                var hold = currentlyDragging
                currentlyDragging = this.dragon
                this.dragon = hold
                lastDragged = this
                g("drag").innerHTML = ""
                g("drag").appendChild(currentlyDragging.elem)
            } else if(currentlyDragging != undefined && this.allowTake() && settings.enableDragAndDrop.value){
                lastDragged.dragon = this.dragon
                this.dragon = currentlyDragging
                lastDragged = undefined
                currentlyDragging = undefined
                g("drag").innerHTML = ""
            } else if(currentlyDragging != undefined && this.allowAdd()){
                this.dragon = currentlyDragging
                lastDragged = undefined
                currentlyDragging = undefined
                g("drag").innerHTML = ""
            } 
        }
        renderAll()
    }

    toString(){
        var final = ""
        if(this.dragon != undefined){
            final += this.dragon.toString()
        }
        return final
    }

    render(){
        this.elem.innerHTML = ""
        if(this.dragon != undefined){
            this.elem.appendChild(this.dragon.elem)
        }
        return this.elem
    }
}

class SlotCollection{
    constructor(elem, size, shiftLocation){
        this.elem = elem
        this.slots = []
        for(var i = 0; i < size; i++){
            this.slots.push(new Slot(undefined, shiftLocation))
        }
        
        this.shiftLocation = shiftLocation
    }

    add(dragon){
        for(var i in this.slots){
            if(this.slots[i].add(dragon)){
                this.render()
                return true
            }
        }
        return false
    }

    sort(criteria){
        var anySwaps = true
        for(var e = 0; e < this.slots.length && anySwaps; e++){
            anySwaps = false
            for(var i = 0; i < this.slots.length - 1; i++){
                var swap = false
                switch(criteria){
                    case "isEmpty": swap = (this.slots[i].dragon == undefined && this.slots[i+1].dragon != undefined); break;
                    default: swap = false;
                }
                if(swap){
                    anySwaps = true
                    var hold = this.slots[i].dragon
                    this.slots[i].dragon = this.slots[i+1].dragon
                    this.slots[i+1].dragon = hold
                }
            }
        }
        this.render()
    }

    match(criteria){
        if(criteria == undefined){
            criteria = []
        }
        var matches = [] 
        for(var i in this.slots){
            var matched
            switch(criteria[0]){
                case "stage": matched = (this.slots[i].dragon != undefined && this.slots[i].dragon.stageID() == criteria[1]); break;
                default: matched = this.slots[i].dragon != undefined;
            }
            if(matched){
                matches.push(this.slots[i])
            }
        }
        return matches
    }

    average(criteria1, criteria2){
        return this.count(criteria1).length / this.count(criteria2).length
    }

    toString(){
        var final = ""
        for(var i in this.slots){
            final += ";" + this.slots[i].toString()
        }
        return final.substring(1)
    }

    render(){
        this.elem.innerHTML = ""
        for(var i in this.slots){
            this.elem.appendChild(this.slots[i].render())
        }
        return this.elem
    }
}

class Pen extends SlotCollection{
    constructor(elem, size, name, starred, frozen){
        super(elem, size, bufferBar)
        
        this.name = name
        this.starred = false
        if(starred != undefined){
            this.starred = starred 
        }
        this.frozen = false
        if(frozen != undefined){
            this.frozen = frozen
        }

        this.selector = document.createElement("DIV")
        this.selector.innerHTML = this.name
        var self = this
        this.selector.onclick = function(){activePen = self; renderAll()}
        this.selector.onmouseover = function(){if(cursor.active){activePen = self; renderAll()}}
    }

    changeName(name){
        if(name != undefined){
            this.name = name
        } else {
            var result = prompt("Input a new name for this pen")
            if(result == null){
                return
            }
            this.name = result.replace(/\||,|;/g, "").substring(0,8)
        }
        renderAll()
    }

    changeFrozen(to){
        if(to == undefined || typeof(to) != "boolean"){
            this.frozen = !this.frozen
        }else{
            this.frozen = to
        }
        renderAll()
    }

    changeStarred(to){
        if(to == undefined || typeof(to) != "boolean"){
            this.starred = !this.starred
        } else {
            this.starred = to
        }
        renderAll()
    }

    showName(){
        this.selector.innerHTML = this.name
        this.selector.setAttribute("current", "false")
        this.selector.style.fontStyle = ""
        if(this.frozen){
            this.selector.style.fontStyle = "italic"
        }
        g("pen-switch").appendChild(this.selector)
    }

    toString(){
        var final = ""
        final += super.toString() + "|"
        final += this.name + "|"
        final += this.starred + "|"
        final += this.frozen
        return final
    }
}

var bufferBar = new SlotCollection(g("bufferBar"), 22, function(){ 
    switch(activePage){
        case g("page-1"): return activePen; 
        default: return;
    }
})

var pens = [], penSize = 176, pensSize = 4, activePen
for(var i = 0; i < pensSize; i++){
    pens.push(new Pen(g("pen"), penSize, "Pen " + (1 + i)))
}
activePen = pens[0]


var x = new Dragon("one", 0)
var y = new Dragon("two", 0, "baby")

renderAll()
hideTooltip()
switchPage(0);

setInterval(function () {
}, 1)