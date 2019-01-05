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
var itemSort = false

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

var suffixes = ["", "k", "m", "b", "t", "qu", "qi", "sx", "sp"];

var settings = {
    enableDragAndDrop: new Setting("Drag and Drop", settingTypes.bool, false, settingPages.gameplay),
    debug: new Setting("Debug", settingTypes.bool, "false", settingPages.gameplay),
    shift: new Setting("Shift", settingTypes.key, 16,  settingPages.keybindings),
    enter: new Setting("Enter", settingTypes.key, 13,  settingPages.keybindings),
    exit: new Setting("Exit", settingTypes.key, 27,  settingPages.keybindings)
}


var keys = {
    shift: {key: 16, keydown: function(){}, keyup: function(){}, active: false},
    enter: {key: 13, keydown: function(){acceptAllRewards()}, keyup: function(){}, active: false},
    exit: {key: 27, keydown: function(){
            $('#info-cover').hide().css({opacity: 0}); 
            $('#settings-cover').hide().css({opacity: 0}); 
            exitRewards();
        }, keyup: function(){}, active: false}
}

var tickers = [
    "I saw Ryan Gosling at a grocery store in Los Angeles yesterday. I told him how cool it was to meet him in person, but I didnt want to be a douche and bother him and ask him for photos or anything. He said, 'Oh,like youre doing now?' I was taken aback, and all I could say was 'Huh?' but he kept cutting me off and going 'huh? huh? huh?' and closing his hand shut in front of my face"
]

function changeTicker(){
    g("tickerItem").innerHTML = randomValue(tickers)
    g("tickerItem").style.width = g("tickerItem").innerHTML.length * 7 + "px"
    g("tickerItem").style.right = -$("#tickerItem").width() + "px"
    $("#tickerItem").animate({right: $("#tickerItem").width()}, $("#tickerItem").width() * 13, "linear", changeTicker)
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

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
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
        number = "0" + number;
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

function toHour(x){
    return numberExtension(Math.floor(x / 60), 2) + ":" + numberExtension(x % 60, 2)
}

function toPercent(x, place){
    if(place == undefined)[
        place = 2
    ]
    return Math.floor(x * 100 * Math.pow(10, place)) / Math.pow(10, place) + "%"
}

function smallInt(e) {
    e = Number(e)
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


var pages = [
    document.getElementById("page-1"), 
    document.getElementById("page-2"), 
    document.getElementById("page-3"), 
    document.getElementById("page-4"), 
    document.getElementById("page-5"), 
    document.getElementById("page-6"), 
    document.getElementById("page-7"), 
    document.getElementById("page-8")
]
var activePage = pages[0];

function switchPage(to) {
    if(pages[to] == undefined) {
        return
    }
    activePage = pages[to]
    for(var i = 0; i < pages.length; i++){
        pages[i].style.display = "none"
        g("help").childNodes[1 + i * 2].setAttribute("active", "false")
    }
    g("help").childNodes[1 + to * 2].setAttribute("active", "true")

    if(![pages[0]].includes(activePage)){
        g("data").style.width = "98vw"
        g("ticker").style.width = "89.5vw" 
    } else {
        g("data").style.width = "35.5vw"
        g("ticker").style.width = "26vw" 
    }
    activePage.style.display = ""
    renderAll()
}

function switchDict(type, to){
    switchPage(7)
}

// Audio
// var snd = new Audio("click.wav");
// snd.play();

function showTooltip(elem) {
    elem = elem[0]
    var tooltip = elem.getAttribute("tt") + "-tooltip"
    g(tooltip).innerHTML = elem.getAttribute("message")
    g(tooltip).style.left = elem.getBoundingClientRect().left + elem.getBoundingClientRect().width / 2 + "px"
    g(tooltip).style.top = elem.getBoundingClientRect().top - window.innerHeight / 22 + "px"
    g(tooltip).style.opacity = .92
}

function hideTooltip(elem) {
    elem = elem[0]
    var tooltip = elem.getAttribute("tt") + "-tooltip"
    document.getElementById(tooltip).style.opacity = 0
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function changeSellNumber(){
    var result = prompt("Input the number of " + currentItem.name + " that you want to sell")
    if(result == null || result == ""){
        return
    }
    if(result > currentItem.amount){
        result = currentItem.amount
    }
    if(result < 0){
        result = 0
    }
    currentSelling = result
    renderAll()
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
var currentItem
var currentSelling = 0

class Item{
    constructor(name, filename, type, drop, tags){
        this.name = name
        this.type = type
        this.filename = "items/" + filename
        switch(this.type){
            case "gem": this.qualities = ["origin", "strength", "cut"]; break;
            case "ticket": this.qualities = ["origin", "species", "durability"]; break;
            case "compass": this.qualities = ["origin", "location"]; break;
        }
        if(this.qualities == undefined){
            this.amount = 0
        } else {
            this.instances = []
        }
        this.drop = drop
        this.tags = tags.split(",").filter(z => z != "")

        this.elem = document.createElement("DIV")
        this.elem.className = "item-box"
        this.image = document.createElement("IMG")
        this.image.src = this.filename
        this.image.setAttribute("draggable", "false")
        this.elem.appendChild(this.image)
        this.counter = document.createElement("DIV")
        this.elem.appendChild(this.counter)
        this.namebar = document.createElement("DIV")
        this.namebar.className = "item-name"
        this.namebar.onclick = Function("switchDict('item', '" + this.name + "')")
        this.namebar.innerHTML = this.name
        this.elem.appendChild(this.namebar)
        
        var me = this
        this.elem.onclick = function(){
            if(currentItem != me){
                currentSelling = 0
            }
            currentItem = me
            renderAll()
        }
    }

    amt(){
        if(this.qualities == undefined){
            return this.amount
        }
        return this.instances.length
    }

    price(index){
        switch(this.type){
            case "gem": return .2 * this.instances[index].cut * this.instances[index].strength * (this.name != "Neutral Gem" ? 1.2 : 1); 
            case "ticket": return 5 * this.instances[index].durability;
            case "compass": return 100;
        }
        return index * 5;
    }

    smallIcon(text, size){
        if(size == undefined){
            size = "1vw"
        }
        if(text){
            return "<img class='small-icon' style='width: " + size + "; height: " + size + "' src='" + this.filename + "'/>"
        }
        var icon = document.createElement("IMG")
        icon.src = this.filename
        icon.className = "small-icon"
        icon.style.width = size
        icon.style.height = size
        return icon
    }

    add(qualities){
        if(this.qualities == undefined){
            this.amount += qualities
        } else {
            if(arraysEqual(Object.keys(qualities), this.qualities)){
                qualities.checked = false
                this.instances.push(qualities)
            } else {
                console.warn(qualities, this.qualities)
            }
        }
        if(qualities.length != undefined){
            for(var i = 0; i < qualities.length; i++){
                qualities[i].checked = false
                this.instances.push(qualities[i])
            }
        }
        this.render()
    }

    remove(indeces){
        if(this.qualities == undefined){
            this.amount -= indeces
        } else {        
            if(typeof(indeces) != "object"){
                indeces = [indeces]
            }
            indeces = indeces.sort(function(x,y){return y - x})
            for(var i = 0; i < indeces.length; i++){
                this.instances.splice(indeces[i], 1)
            }
        }
    }

    sell(amount){
        if(this.qualities == undefined){
            items[0].add(this.price(Math.min(amount, this.amount)))
            this.remove(Math.min(amount, this.amount))
        } else {
            var toRemove = []
            for(var i = 0; i < this.instances.length; i++){
                if(this.instances[i].checked){
                    items[0].add(this.price(i))
                    toRemove.push(i)
                }
            }
            this.remove(toRemove)
        }
        renderAll()
    }

    use(amount, skip){
        if(this.qualities == undefined){
            this.remove(Math.min(amount, this.amount))
        } else{
            if(amount != undefined && !skip){
                if(amount.length == undefined){
                    amount = [amount]
                }
                amount.forEach(x => this.instances[x].checked = true)
            }
            var toRemove = []
            for(var i = 0; i < this.instances.length; i++){
                if(this.instances[i].checked){
                    var remove = true
                    switch(this.type){
                        case "compass": this.instances[i].location.level += 1; switchPage(1); break;
                        case "gem": items[1].add([this.instances[i]]); break;
                        case "ticket": switch(this.name){
                            case "Wildcard Ticket":
                            case "Egg Ticket": switchPage(5); 
                                remove = (Math.random() > this.instances[i].durability) ? true : nurseryBox.add(new Dragon(this.instances[i].species, 0), "special")
                            break;
                            case "Encounter Ticker": switchPage(2); remove = false; break;
                        }
                    }
                    if(remove){
                        toRemove.push(i)
                    }
                }
            }
            this.remove(toRemove)
        }
        renderAll()
    }

    render(){
        this.counter.innerHTML = smallInt(this.amt())
        return this.elem
    }

    renderEgg(){
        var using = 0
        for(var i = 0; i < this.instances.length; i++){
            var eggElem = document.createElement("DIV")
            eggElem.className = "nursery-box"
            $("<img src='" + this.instances[i].species.stages[0].image + "' draggable=false/>").appendTo(eggElem)
            eggElem.setAttribute("active", String(this.instances[i].checked))
            eggElem.setAttribute("uncovered", this.instances[i].species.uncovered)
            eggElem.setAttribute("item", items.indexOf(this))
            eggElem.setAttribute("instance", i)
            eggElem.setAttribute("tt", "egg")
            eggElem.setAttribute("message", "<b>" + capitalize(this.instances[i].species.title()) + "</b>")
            eggElem.onclick = function(){
                items[this.getAttribute("item")].instances[this.getAttribute("instance")].checked = !items[this.getAttribute("item")].instances[this.getAttribute("instance")].checked
                renderAll()
            }
            g("nursery-hold").appendChild(eggElem)
            if(this.instances[i].checked){
                using++
            }
        }
        return using
    }
}

var items = [
    new Item("Heart", "heart.png", "currency", 50, ","),
    new Item("Neutral Gem", "neutral_gem.png", "gem", 25, "neutral,"),
    new Item("Passion Gem", "passion_gem.png", "gem", 20, "passion,"),
    new Item("Stability Gem", "stability_gem.png", "gem", 20, "stability,"),
    new Item("Patience Gem", "patience_gem.png", "gem", 20, "patience,"),
    new Item("Encounter Ticket", "encounter_ticket.png", "ticket", 30, "arena,"),
    new Item("Egg Ticket", "egg_ticket.png", "ticket", 40, "nursery,"),
    new Item("Wildcard Ticket", "wildcard_ticket.png", "ticket", 10, "nursery,arena"),
    new Item("Compass", "compass.png", "compass", 10, "exploration,"),
    new Item("Ruby", "ruby.png", "none", 5, ","),
    new Item("Sapphire", "sapphire.png", "none", 5, ","),
    new Item("Emerald", "emerald.png", "none", 5, ","),
    new Item("Diamond", "diamond.png", "none", 5, ","),
    new Item("Crystal", "crystal.png", "none", 5, ","),
]
activeItem = items[0]

var rewardsActive = false
var currentRewards = []

function triggerRewards(rewards){
    if(rewardsActive){
        return false
    }

    rewardsActive = true
    $('#rewards-cover').toggle().css({opacity: 1})
    rewards.forEach(x => x.accepted = false)
    rewards = rewards.sort(function(x,y){return x.item.type.charCodeAt(0) - y.item.type.charCodeAt(0)})
    if(rewards.length == 0){
        rewards = [{count: Math.floor(Math.random() * 10), item: items[0], accepted: false}]
    }
    for(var i = rewards.length - 1; i > 0; i--){
        if(rewards[i].item.qualities == undefined && rewards[i - 1].item.qualities == undefined && rewards[i].item.name == rewards[i].item.name){
            rewards[i - 1].count += rewards[i].count
            rewards.splice(i,1)
        }
    }


    currentRewards = rewards

    g("rewards-box").innerHTML = ""
    for(var i = 0; i < rewards.length; i++){
        var elem = document.createElement("DIV")
        elem.appendChild(rewards[i].item.smallIcon(false, "2vw"))
        elem.className = "button"
        var properties = Object.keys(rewards[i])
        for(var e = 0; e < properties.length; e++){
            if(properties[e] != "origin" && properties[e] != "item" && properties[e] != "accepted"){
                if(e != 1 && e != 0){
                    $("<span class='divider'></span>").appendTo(elem)
                }
                switch(properties[e]){
                    case "species": $("<span><b>" + capitalize(properties[e]) + "</b>: " + capitalize(rewards[i][properties[e]].title()) + "</span>").appendTo(elem); break;
                    case "location": $("<span><b>" + capitalize(properties[e]) + "</b>: " + capitalize(rewards[i][properties[e]].title()) + "</span>").appendTo(elem); break;
                    case "durability": $("<span><b>" + capitalize(properties[e]) + "</b>: " + toPercent(rewards[i][properties[e]]) + "</span>").appendTo(elem); break;
                    default: if(!isNaN(Number(rewards[i][properties[e]]))){
                                $("<span><b>" + capitalize(properties[e]) + "</b>: " + smallInt(rewards[i][properties[e]]) + "</span>").appendTo(elem); 
                            } else {
                                $("<span><b>" + capitalize(properties[e]) + "</b>: " + rewards[i][properties[e]] + "</span>").appendTo(elem); 
                            }
                }
            }
        }

        elem.setAttribute("index", i)
        elem.onclick = function(){
            me = currentRewards[this.getAttribute("index")]
            me.accepted = true

            if(me.count != undefined){
                me.item.add(me.count)
            } else {
                var copy = clone(me)
                delete copy.item
                delete copy.accepted
                delete copy.count
                me.item.add(copy)
            }

            renderAll()
            removeElement(this)
        }
        g("rewards-box").appendChild(elem)
    }

    return true
}

function acceptAllRewards(){
    for(var i = 0; i < currentRewards.length; i++){
        if(!currentRewards[i].accepted){
            me = currentRewards[i]
            me.accepted = true

            if(me.count != undefined){
                me.item.add(me.count)
            } else {
                var copy = clone(me)
                delete copy.item
                delete copy.accepted
                delete copy.count
                me.item.add(copy)
            }
        }
    }
    exitRewards()
}

function exitRewards(){
    if(currentRewards.filter(x => !x.accepted).length != 0){
        if(!confirm("You are about to discard all of your unaccepted rewards!\nDo you wish to continue?")){
            return
        }
    }
    currentRewards = []
    rewadsActive = false
    $('#rewards-cover').hide().css({opacity: 0})
    renderAll()
}

class Zone{
    constructor(name, colours, time, focus, level){
        this.name = name
        this.colours = colours
        this.trueTime = time
        this.time = time
        this.focus = focus
        this.level = level

        this.elapsed = 0
        this.ready = "waiting"

        this.elem = document.createElement("DIV")
        this.elem.className = "explore-zone" 
        this.elem.style.backgroundImage = "linear-gradient(to right, rgba(" + this.colours[0] + ", .4), rgba(" + this.colours[1] + ",1)), url('zone/cave.png')"
        $("<div class='explore-title'>" + this.name + "</div>").appendTo(this.elem)
        $("<div class='explore-lvl'><span>Lvl.</span> " + this.level + "</div>").appendTo(this.elem)
        $('<div class="explore-compass button" message="You do not have an available Compass item to use for this Zone!"><img src="menu/compass-not-available.png"></div>').appendTo(this.elem)
        $("<div class='explore-slots'></div>").appendTo(this.elem)
        $("<div class='explore-rank'>Team Rank: 0</div>").appendTo(this.elem)
        $("<div class='explore-go'><div>Ready</div><div>00:01:23 remains</div></div>").appendTo(this.elem)
        $('<div class="explore-focus"><div>Focus:</div><div>' + this.focus.reduce(function(x,y){return capitalize(x) + "<br>" + capitalize(y)}) + '</div></div').appendTo(this.elem)
        $('<div class="explore-cover"><div class="button">Use a <img src="items/compass.png"/> <b>Compass</b></div></div').appendTo(this.elem)
        this.elem.childNodes[2].setAttribute("tt", "standard")
        var me = this
        this.elem.childNodes[5].onclick = function(){
            me.startExploration()
            renderAll()
        }
        this.rewards = []

        this.slots = new SlotCollection(this.elem.childNodes[3], 4, bufferBar)
    }
    
    title(){
        if(this.level < 1){
            return "???"
        }
        return this.name
    }

    startExploration(){
        this.elapsed = 0
        switch(this.ready){
            case "waiting": this.ready = "active"; return;
            case "active": this.ready = "waiting"; return;
        }
        if(triggerRewards(this.rewards)){
            this.ready = "waiting"
            this.rewards = []
        }
    }

    increment(){
        if(this.ready != "active"){
            return
        }
        this.elapsed += 1
        this.elem.childNodes[5].childNodes[1].innerHTML = toHour(this.time - this.elapsed) + " remains"
        if(this.elapsed == this.time){
            this.finishExploration()
        }
    }

    finishExploration(){
        this.level += .25

        var table = items.map(x => [x.type, x.drop, x.tags])
        var total = 0
        for(var i = 0; i < table.length; i++){
            for(var e = 0; e < this.focus.length; e++){
                table[i][1] *= table[i][2].includes(this.focus[e]) ? 3.5 : 1
                table[i][1] *= table[i][0].includes(this.focus[e]) ? 3.5 : 1
            }
            var temp = table[i][1]
            table[i][1] += total
            total += temp
        }

        var rewards = []
        for(var i = 0; i < this.level * 2 && Math.random() < .95; i+=.25){
            var die = Math.random() * total
            var possible = [Number.MAX_SAFE_INTEGER]
            for(var e = 0; e < table.length; e++){
                if(Math.abs(table[e][1] - die) < possible[0]){
                    possible = [Math.abs(table[e][1] - die), e]
                } else if(Math.abs(table[e][1] - die) == possible[0]){
                    possible.push(e)
                }
            }
            rewards.push(possible[1 + Math.floor((possible.length - 1) * Math.random())])
        }
        
        for(var i = 0; i < rewards.length; i++){
            var quality = {}
            if(items[rewards[i]].qualities != undefined){
                quality.origin = this.name
            } else {
                switch(items[rewards[i]].type){
                    case "none": quality.count = 1; break;
                    case "currency": quality.count = Math.ceil(10 * this.level * Math.random())
                }
            }

            switch(items[rewards[i]].type){
                case "gem": quality.strength = Math.ceil(Math.random() * 10 * this.level); quality.cut = Math.floor(Math.random() * 4); break;
                case "ticket": var sp = randomValue(species); while(this.focus.includes(sp.inclination) && Math.random() < .5){
                                sp = randomValue(species)
                            }; quality.species = sp; quality.durability = Math.min(1, .6 + (Math.random() * .4) + this.level / 100); break;
                case "compass": quality.location = randomValue(zones); break;
            }
            
            quality.item = items[rewards[i]]
            rewards[i] = quality
        }
        this.rewards = rewards

        this.ready = "holding"
        g("page-2-selector").childNodes[0].src = "menu/explore-ready.png"
        renderAll()
    }

    rank(){
        return Math.ceil(this.slots.match().length * 131.45)
    }

    render(){
        this.elem.childNodes[1].childNodes[1].textContent = " " + Math.floor(this.level)
        //compass
        var useCompass = [undefined, undefined, Number.MAX_SAFE_INTEGER]
        for(var i = 0; i < items.length; i++){
            if(items[i].type == "compass"){
                for(var e = 0; e < items[i].instances.length; e++){
                    if(items[i].instances[e].location == this && items[i].price(e) < useCompass[2]){
                        useCompass = [i,e,items[i].price(e)]
                    }
                }
            }
        }
        
        this.elem.childNodes[7].style.display = "none"
        if(useCompass[0] != undefined){
            this.elem.childNodes[2].childNodes[0].src = "menu/compass-available.png"
            this.elem.childNodes[2].setAttribute("message", "Click here to use 1 <b>" + items[useCompass[0]].name + "</b> to raise the level of this Zone by +1")
            this.elem.childNodes[2].onclick = Function("items[" + useCompass[0] + "].use(" + useCompass[1] + ")")
            this.elem.childNodes[7].onclick = Function("items[" + useCompass[0] + "].use(" + useCompass[1] + ")")

            if(!(this.level > 0)){
                this.elem.childNodes[7].style.display = ""
            }
        } else {
            this.elem.childNodes[2].setAttribute("message", "You do not have an available Compass item to use in this Zone!")
            this.elem.childNodes[2].childNodes[0].src = "menu/compass-not-available.png"
            this.elem.childNodes[2].onclick = Function("")
        }

        this.elem.childNodes[4].innerHTML = "Team Rank: " + this.rank()
        this.elem.childNodes[5].childNodes[1].innerHTML = toHour(this.time) + " expected"
        switch(this.ready){
            case "waiting": this.elem.childNodes[5].childNodes[0].innerHTML = "Ready"; break
            case "active": this.elem.childNodes[5].childNodes[0].innerHTML = "Active"; this.elem.childNodes[5].childNodes[1].innerHTML = toHour(this.time - this.elapsed) + " remains"; break
            case "holding": this.elem.childNodes[5].childNodes[0].innerHTML = "Collect Rewards"; break
        }
        if(this.ready == "holding"){
            this.elem.childNodes[5].childNodes[0].style.width = "100%";   
            this.elem.childNodes[5].childNodes[1].style.display = "none";   
        } else{
            this.elem.childNodes[5].childNodes[0].style.width = "";   
            this.elem.childNodes[5].childNodes[1].style.display = "";   
        }
        this.slots.render()

        if(this.level > 0 || useCompass[0] != undefined){
            return this.elem
        }
    }
}

class Species{
    constructor(name, stages, eggLimit){
        this.name = name
        this.stages = stages
        this.uncovered = false
        this.eggLimit = eggLimit
        this.stages = [{name: "egg_" + this.name, image: "dragon/egg_" + this.name + ".png"}]
        for(var i = 1; i < stages; i++){
            this.stages.push({name: "dragon_" + this.name + i, image: "dragon/dragon_" + this.name + i + ".png"})
        }
    }

    title(){
        if(!this.uncovered){
            return "???"
        }
        return this.name
    }
}

var species = [
    new Species("crown", 2, 60),
    new Species("gemini", 2, 60)
]

class Dragon{
    constructor(species_, stageID, name){
        if(typeof(species) == "object"){
            this.species = species_
            this.speciesID = species.indexOf(species_)
        } else {
            this.species = species[species_]
            this.speciesID = species_
        }
        for(var i in Object.keys(this.species)){
            this[Object.keys(this.species)[i]] = this.species[Object.keys(this.species)[i]]
        }

        this.stage = this.stages[stageID]
        if(name != undefined){
            this.name = name
        }

        this.hatchProgress = 0

        this.elem = document.createElement("img")
        this.elem.className = "dragon"
        this.elem.src = this.stage.image
        this.elem.setAttribute("draggable", false)
    }

    stageID(){
        return this.stages.map(y => y.name).indexOf(this.stage.name)
    }

    upgrade(){
        if(this.stageID() + 1 < this.stages.length){
            this.stage = this.stages[this.stageID() + 1]
        }
        renderAll()
    }

    toString(){
        var final = ""
        final += this.speciesID + ","
        final += this.stageID() + ","
        final += this.name
        return final
    }

    render(){
        this.elem.src = this.stage.image
    }
}

class Slot{
    constructor(elem, shiftLocation, locked, type){
        this.type = "normal"
        if(type != undefined){
            this.type = type
        }
        if(elem != undefined){
            this.elem = elem
        } else{
            this.elem = document.createElement("DIV")
            this.elem.className = "dragon-slot"
            if(this.type == "hatching"){
                this.bar = document.createElement("DIV")
                this.bar.className = "dragon-bar"
                $("<div></div>").appendTo(this.bar)
                this.elem.className = "dragon-slot dragon-slot-bar"
            }
        }
        var self = this
        this.elem.onmousedown = function(){self.click(false)}
        this.elem.onmouseup = function(){self.click(true)}
        this.dragon = undefined
        this.shiftLocation = shiftLocation
        this.locked = locked
        this.render()
    }

    add(dragon, condition){
        if(this.allowAdd(condition)){
            this.dragon = dragon
            return true
        }
        return false
    }

    allowAdd(condition){
        return this.dragon == undefined && (lastDragged == this || condition == "special" | (this.locked != "takeOnly" && this.locked != "locked"))
    }

    allowTake(condition){
        return this.dragon != undefined && (lastDragged == this || condition == "special" | (this.locked != "addOnly" && this.locked != "locked"))
    }

    click(skip){
        if((!settings.enableDragAndDrop.value && skip)){
            return
        }
        if(this.dragon != undefined && this.dragon.hatchProgress == this.dragon.eggLimit){
            this.dragon.hatchProgress = 0
            this.dragon.upgrade()
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
            if(currentlyDragging != undefined && this.allowAdd()){
                this.dragon = currentlyDragging
                lastDragged = undefined
                currentlyDragging = undefined
                g("drag").innerHTML = ""
            } else if(currentlyDragging == undefined && this.allowTake()){
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
        if(this.type == "hatching"){
            this.elem.appendChild(this.bar)
        }
        if(this.dragon != undefined){
            this.dragon.render()
            this.dragon.species.uncovered = true
            this.elem.appendChild(this.dragon.elem)
        }
        return this.elem
    }
}

class SlotCollection{
    constructor(elem, size, shiftLocation, locked, autoSort, type){
        this.elem = elem
        this.slots = []
        this.locked = locked
        if(locked == undefined){
            this.locked = "none"
        }
        this.type = "normal"
        if(type != undefined){
            this.type = type
        }
        for(var i = 0; i < size; i++){
            this.slots.push(new Slot(undefined, shiftLocation, this.locked, this.type))
        }
        this.autoSort = autoSort

        this.shiftLocation = shiftLocation
    }

    changeLock(locked){
        this.locked = locked
        this.slots.forEach(x => x.locked = locked)
    }

    add(dragon, condition){
        for(var i in this.slots){
            if(this.slots[i].add(dragon, condition)){
                this.render()
                return true
            }
        }
        return false
    }

    sort(criteria, render){
        var anySwaps = true
        for(var e = 0; e < this.slots.length && anySwaps; e++){
            anySwaps = false
            for(var i = 0; i < this.slots.length - 1; i++){
                var swap = false
                switch(criteria){
                    case "species": swap = (this.slots[i].dragon != undefined && this.slots[i+1].dragon != undefined) && this.slots[i].dragon.speciesID < this.slots[i+1].dragon.speciesID; break;
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
        if(render == undefined || render){
            this.render()
        }
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
        if(this.autoSort){
            this.sort(this.autoSort, false)
        }
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
            var result = prompt("Input a new name for this coop")
            if(result == null || result == ""){
                return
            }
            this.name = result.replace(/\||,|;/g, "").substring(0,12)
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
        case g("page-4"): return incubator; 
        default: return bufferBar;
    }
}, undefined, "isEmpty")
var incubator = new SlotCollection(g("incubator-slots"), 36, bufferBar, undefined, undefined, "hatching")
var nurseryBox = new SlotCollection(g("nursery-box"), 24, bufferBar, "takeOnly", "isEmpty")

var pens = [], penSize = 176, pensSize = 4, activePen
for(var i = 0; i < pensSize; i++){
    pens.push(new Pen(g("pen"), penSize, "Coop " + (1 + i)))
}
activePen = pens[0]

///LEVEL INCREASES WITH A COMPLETED EXPLORATION OR FASTER WITH COMPASS
var zones = [
    new Zone("Magnesium Cave", ["200,100,100", "100,0,0"], 5, ["passion", "gem"], 1),
    new Zone("Helium Cave", ["100,200,100", "0,100,0"], 50, ["patience", "gem"], 1),
    new Zone("Boron Cave", ["100,100,200", "0,0,100"], 50, ["stability", "gem"], 1),
    new Zone("Acid Jungle", ["100,200,100", "0,100,0"], 100, ["patience", "ticket"], 0),
    new Zone("Salt Slick Lake", ["100,100,100", "50,50,50"], 100, ["neutral", "ticket"], 0)
]

var checkAll = document.createElement("DIV")
checkAll.id = "check-all"
checkAll.innerHTML = "&#9745;"
checkAll.onclick = function(){
    if(currentItem != undefined){
        var setting = currentItem.instances.filter(function(x){return x.checked}).length == 0 || currentItem.instances.filter(function(x){return x.checked}).length < currentItem.instances.length
        for(var i = 0; i < currentItem.instances.length; i++){
            currentItem.instances[i].checked = setting
        }
        renderAll()
    }
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
    
    for(var i = 0; i < Object.keys(settingPages).length; i++){
        if(Object.keys(settingPages)[i] != activeSettingPage){
            g("settings-" + Object.keys(settingPages)[i]).setAttribute("active", "false")
        }
    }
    g("settings-" + activeSettingPage).setAttribute("active", "true")

    g("data").childNodes[0].src = activeItem.filename
    g("data").childNodes[1].innerHTML = smallInt(activeItem.amt())

    if(zones.filter(x => x.ready == "holding").length == 0){
        g("page-2-selector").childNodes[0].src = "menu/explore.png"
    }

    if(activePage == pages[1]){
        pages[1].childNodes[0].innerHTML = ""
        for(var i = 0; i < zones.length; i++){
            var elem = zones[i].render()
            if(elem != undefined){
                pages[1].childNodes[0].appendChild(zones[i].render())
            }
        }
    }

    if(activePage == pages[3]){
        incubator.render()

        incubatorCost1 = 2
        incubatorCost2 = 8

        g("incubator-timer").style.width = incubatorTimer / 60 / 60 * 100 + "%"
        g("incubator-time").innerHTML = toHour(incubatorTimer)

        g("incubator-buy-1").innerHTML = "1 Minute " + items[0].smallIcon(true) + " " + incubatorCost1
        g("incubator-buy-2").innerHTML = "10 Minutes " + items[0].smallIcon(true) + " " + incubatorCost2
        g("incubator-buy-1").onclick = function(){
            if(items[0].amt() > incubatorCost1 && incubatorTimer < (60 * 59)){
                items[0].remove(incubatorCost1)
                incubatorTimer += 60
            }
            renderAll()
        }
        g("incubator-buy-2").onclick = function(){
            if(items[0].amt() > incubatorCost2 && incubatorTimer < (60 * 50)){
                items[0].remove(incubatorCost2)
                incubatorTimer += 600
            }
            renderAll()
        }
        for(var i = 0; i < incubator.slots.length; i++){
            incubator.slots[i].bar.childNodes[0].style.backgroundColor = "transparent"
            if(incubator.slots[i].dragon != undefined && incubator.slots[i].dragon.stageID() == 0){
                incubator.slots[i].bar.childNodes[0].style.backgroundColor = (incubator.slots[i].dragon.hatchProgress / incubator.slots[i].dragon.species.eggLimit > .5) ? "yellow" : "red"
            }
        }
    }

    if(activePage == pages[4]){
        g("item-left-holder").innerHTML = ""
        if(itemSort){
            var categories = []
            for(var i = 0; i < items.length; i++){
                if(!categories.includes(items[i].type)){
                    categories.push(items[i].type)
                    $("<div class='item-divider'>" + capitalize(items[i].type) + "</div>").appendTo("#item-left-holder")
                    $("<div id='item-left-" + items[i].type + "'></div>").appendTo("#item-left-holder")
                }
                g("item-left-" + items[i].type).appendChild(items[i].render())
                items[i].elem.setAttribute("active", "false")
            }
        } else{
            for(var i = 0; i < items.length; i++){
                g("item-left-holder").appendChild(items[i].render())
                items[i].elem.setAttribute("active", "false")
            }
        }

        g("item-table").childNodes[0].innerHTML = ""

        
        if(currentItem != undefined){
            currentItem.elem.setAttribute("active", "true")
        }
        if(currentItem != undefined && currentItem.amt() > 0){
            g("item-right").style.display = "block"
            var price
            if(currentItem.qualities != undefined){
                g("item-sell").style.display = "inline-block"
                g("item-sell-edit").style.display = "none"
                g("item-sell").style.marginRight = "5vw"
                currentSelling = currentItem.instances.filter(function(x){return x.checked}).length
                price =  currentItem.instances.map(function(x,y){return x.checked ? currentItem.price(y) : 0}).reduce(function(x,y){return x + y})
            } else if(currentItem.type != "currency") {
                g("item-sell").style.display = "inline-block"
                g("item-sell-edit").style.display = "inline-block"
                g("item-sell").style.marginRight = ".25vw"
                if(currentSelling < 0){
                    currentSelling = currentItem.amount
                } else if(currentSelling > currentItem.amount){
                    currentSelling = 0
                }
                price = currentItem.price(currentSelling)
            } else {
                g("item-sell-edit").style.display = "none"
                g("item-use").style.display = "none"
                g("item-sell").style.display = "none"
            }
            g("item-use").innerHTML = 'Use (' + smallInt(currentSelling) + ')'
            g("item-sell").innerHTML = 'Sell (' + smallInt(currentSelling) + '): <span>+' + smallInt(price) + items[0].smallIcon(true) + '</span>'

            if(currentItem.qualities != undefined){
                var header = document.createElement("TR")
                $("<th></th>").appendTo(header)
                for(var i = 0; i < currentItem.qualities.length; i++){
                    if(currentItem.qualities[i] != "origin" || true){
                        $("<th>" + currentItem.qualities[i].toUpperCase() + "</th>").appendTo(header)
                    }
                }
                if(["gem", "compass", "ticket"].includes(currentItem.type)){
                    header.childNodes[0].appendChild(checkAll)
                }
                $("<th>PRICE</th>").appendTo(header)
                g("item-table").childNodes[0].appendChild(header)
    
                for(var i = 0; i < currentItem.instances.length; i++){
                    var obj = currentItem.instances[i]
                    var elem = document.createElement("TR")
                    elem.innerHTML += "<td>" + (!obj.checked ? "&#9744;" : "&#9745;") + "</td>"
                    for(var e = 0; e < Object.keys(obj).length - 1; e++){
                        switch( Object.keys(obj)[e]){
                            case "species": elem.innerHTML += "<td>" + capitalize(obj[Object.keys(obj)[e]].title()) + "</td>"; break;
                            //case "origin": break;
                            case "durability":  elem.innerHTML += "<td>" + toPercent(obj[Object.keys(obj)[e]]) + "</td>"; break;
                            case "location":  elem.innerHTML += "<td>" + capitalize(obj[Object.keys(obj)[e]].title()) + "</td>"; break;
                            default: elem.innerHTML += "<td>" + obj[Object.keys(obj)[e]] + "</td>"
                        }
                    }
                    $("<td>" + currentItem.price(i) + items[0].smallIcon(true) + "</td>").appendTo(elem)
                    elem.onclick = Function("currentItem.instances[" + i + "].checked = !currentItem.instances[" + i + "].checked; renderAll()")
                    g("item-table").childNodes[0].appendChild(elem)
                }
            }
        } else {
            g("item-right").style.display = "none"
        }
    }

    
    if(activePage == pages[5]){
        if(items.filter(x => x.name == "Egg Ticket" || x.name == "Wildcard Ticket").filter(x => x.amt() > 0).length > 0){
            g("nursery-use").style.display = ""
            g("nursery-all").style.display = ""
            g("nursery-hold").innerHTML = ""
            var using = 0
            for(var i = 0; i < items.length; i++){
                switch(items[i].name){
                    case "Egg Ticket": 
                    case "Wildcard Ticket": using += items[i].renderEgg()
                }
            }
            g("nursery-use").innerHTML = "Adopt Eggs (" + using + ")"
        } else{
            g("nursery-use").style.display = "none"
            g("nursery-all").style.display = "none"
            g("nursery-hold").innerHTML = "Find an <b>Egg Ticket</b> or a <b>Wildcard Ticket</b> to adopt an Egg!"
        }
        nurseryBox.render()
    }

    $("[message]").mouseover(function(){showTooltip($(this))})
    $("[message]").mouseout(function(){hideTooltip($(this))})
}

//// BWAB //////
items[6].add({origin: "Town", species: species[0], durability: 1})
items[6].add({origin: "Town", species: species[1], durability: .9})
items[6].add({origin: "Town", species: species[0], durability: .1})
items[6].add({origin: "Downtown", species: species[0], durability: 0})
items[7].add({origin: "Downtown", species: species[1], durability: .9})
items[7].add({origin: "Uptown", species: species[1], durability: 1})
items[7].add({origin: "Downtown", species: species[1], durability: .8})
items[7].add({origin: "Downtown", species: species[0], durability: .9})
items[8].add({origin: "w",location: zones[4]}); renderAll()
items[0].add(100)
///////////////

g("nursery-use").onclick = function(){
    for(var i = 0; i < items.length; i++){
        switch(items[i].name){
            case "Egg Ticket": 
            case "Wildcard Ticket": items[i].use()
        }
    }
}

g("nursery-all").onclick = function(){
    for(var i = 0; i < items.length; i++){
        switch(items[i].name){
            case "Egg Ticket": 
            case "Wildcard Ticket": items[i].instances.forEach(x => x.checked = true); items[i].use()
        }
    }
}

switchPage(3);
changeTicker()
renderAll()

var incubatorTimer = 0

setInterval(function () {
    for(var i = 0; i < zones.length; i++){
        zones[i].increment()
    }
    incubatorTimer = Math.max(0, incubatorTimer - 1)
    g("incubator-timer").style.width = incubatorTimer / 60 / 60 * 100 + "%"
    g("incubator-time").innerHTML = toHour(incubatorTimer)
    if(incubatorTimer != 0){
        for(var i = 0; i < incubator.slots.length; i++){
            if(incubator.slots[i].dragon != undefined){
                incubator.slots[i].bar.childNodes[0].style.height = incubator.slots[i].dragon.hatchProgress / incubator.slots[i].dragon.species.eggLimit * 100 + "%"
                incubator.slots[i].bar.childNodes[0].style.top = 100 - incubator.slots[i].dragon.hatchProgress / incubator.slots[i].dragon.species.eggLimit * 100 + "%"
                incubator.slots[i].bar.childNodes[0].style.backgroundColor = (incubator.slots[i].dragon.hatchProgress / incubator.slots[i].dragon.species.eggLimit > .5) ? "yellow" : "red"
                if(incubator.slots[i].dragon.hatchProgress == incubator.slots[i].dragon.species.eggLimit){
                    incubator.slots[i].bar.childNodes[0].style.backgroundColor = "green"
                } else {
                    incubator.slots[i].dragon.hatchProgress += 1
                }
            } else {
                incubator.slots[i].bar.childNodes[0].style.backgroundColor = "transparent"
            }
        }
    }
}, 1000)