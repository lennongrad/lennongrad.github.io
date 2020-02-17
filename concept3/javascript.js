Array.prototype.last = function () {
    return this[this.length - 1];
};

function elementShowTooltip(){
    showTooltip(this)
}

document.oncontextmenu = cancelContextMenu = function (e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }

    return false;
}

// From https://stackoverflow.com/a/6121234/8815098
Object.defineProperties(Array.prototype, {
    count: {
        value: function (query) {
            var count = 0;
            for (let i = 0; i < this.length; i++)
                if (this[i] == query)
                    count++;
            return count;
        }
    }
});

/** Performs a change of base
 * @param {number} value The number that the logarithm is performed on
 * @param {number} base The base of the logarithm used
 * @returns {number} The final result of the logarithm
 */
function log(value, base) {
    return Math.log(value) / Math.log(base)
}

/** Removes an element from its parent without finding its parent element manually
 * @param {object} element The element being removed
 */
function removeElement(element) {
    if(element.parentNode != undefined){
        element.parentNode.removeChild(element);
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/** Checks whether a specific string can be parsed properly through JSON
 * @param {string} string The string being tested.
 * @returns {boolean} Whether or not the input string can be properly parsed.
 */
function isJSON(string) {
    try {
        return (JSON.parse(string) && !!string);
    } catch (e) {
        return false;
    }
}

/** Returns a random index within the range of the input array 
 * @param {array} array The array intended to be accessed through the random index ID
 * @returns {number} The index to be used on the input array
*/
function randomIndex(array) {
    return Math.floor(array.length * Math.random())
}

/** Returns a random element from within an input array
 * @param {array} array
 * @returns {any} 
 */
function randomValue(array) {
    return array[randomIndex(array)]
}

/** Returns a shuffled version of the array */
function shuffleArray(array) {
    var tempArray = array.slice(0)
    for (let i = tempArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }
    return tempArray
}

/**
 * Returns a random value from the input object.
 * @param {object} obj 
 * @returns
 */
function randomValueObj(obj) {
    return obj[randomValue(Object.keys(obj))]
}

/**
 * Duplicates an array then randomizes the order of elements
 * @param {array} arr 
 */
function copyAndRandomize(arr){
    var newArr = arr.slice()
    var finalArr = []
    while(newArr.length > 0){
        finalArr = finalArr.concat(newArr.splice(randomIndex(newArr) , 1))
    }
    return finalArr
}

/**
 * Uses color math to change the brightness of the input color/
 * @param {string} col The color being adjusted expressed as a hexadecimal, with or without '#'
 * @param {number} amt The amount by which to increase or decrease the brightness
 */
function adjustBrightness(col, amt) {
    // note: this entire function is copied wholesale from a Stack Overflow answer
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

/** Extends a number to a certain number of digits using zeroes.
 * @param {number} number The number being adjusted.
 * @param {number} sigFig The intended number of digits; must be higher than the digits already present to have any effect.
 */
function numberExtension(number, sigFig) {
    number = number.toString();
    while (sigFig > number.length) {
        number = number + "0";
    }
    return number;
}

/**
 * Takes a number and converts it to a hexidecimal string; intended for colours.
 * @param {number} number 
 */
function decimalToHexString(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }

    number = number.toString(16).toUpperCase();
    for (y = 0; y < 6 - number.toString().length; y++) {
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

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
    // note: texture passed by reference, will be updated by the update function.

    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    // how many images does this spritesheet contain?
    //  usually equals tilesHoriz * tilesVert, but not necessarily,
    //  if there at blank tiles at the bottom of the spritesheet. 
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    // how long should each image be displayed?
    this.tileDisplayDuration = tileDispDuration;

    // how long has the current image been displayed?
    this.currentDisplayTime = 0;

    // which image is currently being displayed?
    this.currentTile = 0;

    this.update = function (milliSec) {
        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles)
                this.currentTile = 0;
            var currentColumn = this.currentTile % this.tilesHorizontal;
            texture.offset.x = currentColumn / this.tilesHorizontal;
            var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
            texture.offset.y = currentRow / this.tilesVertical;
        }
    };
}

function capitalize(str) {
    return str[0].toUpperCase() + str.substring(1);
}

function showTooltip(elem) {
    document.getElementById("tooltip").innerHTML = elem.getAttribute("message")
    document.getElementById("tooltip").style.left = elem.getBoundingClientRect().left + elem.getBoundingClientRect().width / 2 + "px"
    document.getElementById("tooltip").style.top = elem.getBoundingClientRect().top + "px"
    document.getElementById("tooltip").style.opacity = .92
}

function hideTooltip() {
    document.getElementById("tooltip").style.opacity = 0
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

/**
* @param {String} HTML representing a single element
* @return {Element}
*/
function htmlToElement(html) {
   var template = document.createElement('template');
   html = html.trim(); // Never return a text node of whitespace as the result
   template.innerHTML = html;
   return template.content.firstChild;
}

/**
* @param {String} HTML representing any number of sibling elements
* @return {NodeList} 
*/
function htmlToElements(html) {
   var template = document.createElement('template');
   template.innerHTML = html;
   return template.content.childNodes;
}

// from https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript priority queu
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;
class PriorityQueue {
    constructor(comparator = (a, b) => a[1] > b[1]) {
        this._heap = [];
        this._comparator = comparator;
    }

    size() {
        return this._heap.length;
    }

    isEmpty() {
        return this.size() == 0;
    }

    peek() {
        return this._heap[0];
    }

    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }

    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > 0) {
            this._swap(0, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    replace(value) {
        const replacedValue = this.peek();
        this._heap[0] = value;
        this._siftDown();
        return replacedValue;
    }

    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > 0 && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }

    _siftDown() {
        let node = 0;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
        ) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

// making my own dictionary class in order to use objects as keys when needed
class Dictionary{
    constructor(){
        this._arr = []
    }

    getValue(key){
        var results = this._arr.filter(x => x.key == key)
        if(results.length == 0){
            return undefined
        }
        return results[0].value
    }

    setValue(key, value){
        if(this.getValue(key) != undefined){
            this._arr.filter(x => x.key == key)[0].value = value
        } else {
            this._push(key, value)
        }
    }

    _push(key, value){
        this._arr.push({key: key, value: value})
    }
}  

function intersects(a,b,c,d,p,q,r,s){
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}

function collides(a,b,c,d){
    var finalValue = false
    collisionSegments.forEach(x => {
        if(intersects(a,b,c,d,x.a,x.b,x.c,x.d)){
            finalValue = true
        }
    })
    return finalValue
}

var horizontalDisplacement = 0
var mouseDownScroll = false
var mouseDownLine = false
var mouseX, mouseY
var scrollLeft = false
var scrollRight = false
var fogTimer = 0

var showLine = false
var lineOrigin = undefined
var lineDestination = undefined

document.body.onmousemove = function(event){
    mouseX = event.clientX
    mouseY = event.clientY
}

var collisionSegments = []

var horizontalStageSize = 3
var verticalStageSize = 3

var directions = ["right", "down", "left", "up"]

class Tile{
    constructor(x, y){
        this.x = x
        this.y = y

        this.elem = document.createElement("DIV")
        this.elem.className = "tile "
        this.elem.style.left = this.x * 65 + "px"
        this.elem.style.top = this.y * 65 + "px"
        document.getElementById("playfield-tiles").appendChild(this.elem)
    }

    adj(direction){
        switch(direction){
            case directions[0]: if(this.x < horizontalStageSize - 1) return tiles[(this.x + 1) * verticalStageSize + this.y]; break;
            case directions[1]: if(this.y < verticalStageSize - 1) return tiles[this.x * verticalStageSize + (this.y + 1)]; break;
            case directions[2]: if(this.x > 0) return tiles[(this.x - 1) * verticalStageSize + this.y]; break;
            case directions[3]: if(this.y > 0) return tiles[this.x * verticalStageSize + (this.y - 1)]; break;
        }
        return undefined
    }

    getBlock(){
        var finalValue = undefined
        blocks.forEach(x => {
            if(x.placed && this.x >= x.x && this.x <= (x.x + x.width - 1) && this.y >= x.y && this.y <= (x.y + x.height - 1)){
                finalValue = x
            }
        })
        return finalValue
    }
}

function setActive(block){
    blocks.forEach(x => {
        x.active = false;
        x.elem.setAttribute("selected", "false")
    })
    block.active = true
    block.elem.setAttribute("selected", "true")
    document.getElementById("arrows").style.opacity = 1
    document.getElementById("arrows").style.pointerEvents = "unset"
}

function unsetActive(){
    blocks.forEach(x => {
        x.active = false;
        x.elem.setAttribute("selected", "false")
    })
    document.getElementById("arrows").style.opacity = ""
    document.getElementById("arrows").style.pointerEvents = ""
}

function activeBlock(){
    return blocks.filter(x => x.active)[0];
}

var typings = {
    playerAttack: {color: "blue", icon: "sword.png", description: "<b>Cast</b>: Deal X damage to the closest enemy"},
    enemyAttack: {color: "red", icon: "skull.png", description: "<b>Cast</b>: Deal X damage to yourself"},
    enemyHeal: {color: "red", icon: "heart.png", description: "<b>Cast</b>: Heal the closest enemy for X damage"}
}

class Block{
    constructor(width, height, details, x, y){
        this.width = width
        this.height = height
        this.placed = false
        this.active = false
        this.details = details

        this.elem = document.createElement("DIV")
        this.elem.className = "block"
        this.elem.style.width = 50 * this.width + 16 * (this.width - 1) + "px"
        this.elem.style.height = 50 * this.height + 16 * (this.height - 1) + "px"
        document.getElementById("playfield-tiles").appendChild(this.elem)
        this.elem.block = this

        this.filter = document.createElement("DIV")
        this.elem.appendChild(this.filter)
        this.filter.style.backgroundColor = this.details.typing.color

        if(x != undefined && y != undefined){
            this.updateXY(x,y)
            this.placed = true
        } else {
            document.getElementById("waitingBlocks").appendChild(this.elem)
            this.elem.onclick = function() {
                if(!this.block.placed){
                    setActive(this.block)
                }
            }
        }

        this.elem.onmouseover = elementShowTooltip
        this.elem.onmouseout = hideTooltip
        this.elem.setAttribute("message", details.typing.description.replace(/X/g, details.value))
        
        this.icon = document.createElement("IMG")
        this.icon.src = this.details.typing.icon
        this.elem.appendChild(this.icon)
    }

    getTiles(){
        var finalValue = []
        tiles.forEach(x => {
            if(x.x >= this.x && x.x <= (this.x + this.width - 1) && x.y >= this.y && x.y <= (this.y + this.height - 1)){
                finalValue.push(x)
            }
        })
        return finalValue
    }

    adj(direction){
        var finalValue = []
        this.getTiles().forEach(x => {
            if(x.adj(direction) != undefined && x.adj(direction).getBlock() != this){
                finalValue.push(x.adj(direction))
            }
        })
        return finalValue
    }

    cast(direction){
        this.nudge(direction)
        blocks.splice(blocks.indexOf(this), 1)
        var elem = this.elem
        this.elem.style.animation = "2s disintegrate"

        switch(this.details.typing){
            case typings.enemyAttack: combatants[0].damage(this.details.value); break;
            case typings.enemyHeal: combatants[1].heal(this.details.value); break;
            case typings.playerAttack: combatants[1].damage(this.details.value); break;
        }

        setTimeout(function(){removeElement(elem)}, 200)
    }

    nudge(direction, func){
        switch(direction){
            case directions[0]: this.elem.style.transform = "translateX(100px)"; break;
            case directions[1]: this.elem.style.transform = "translateY(100px)"; break;
            case directions[2]: this.elem.style.transform = "translateX(-100px)"; break;
            case directions[3]: this.elem.style.transform = "translateY(-100px)"; break;
        }
        setTimeout(x => {
            this.elem.style.transform = ""
        }, 300)
    }

    push(direction){
        if(this.adj(direction).length == 0){
            this.cast(direction)
            return true
        }

        var successfullyPushed = true
        this.adj(direction).forEach(x => {
            if(x.getBlock() != undefined){
                if(!x.getBlock().push(direction)){
                    successfullyPushed = false
                }
            }
        })

        if(successfullyPushed) {
            switch(direction){
                case directions[0]: this.updateXY(this.x + 1, this.y); break;
                case directions[1]: this.updateXY(this.x, this.y + 1); break;
                case directions[2]: this.updateXY(this.x - 1, this.y); break;
                case directions[3]: this.updateXY(this.x, this.y - 1); break;
            }
            return true
        } else {
            return false
        }
    }

    updateXY(x, y){
        if(x != undefined){
            this.x = x
        }
        if(y != undefined){
            this.y = y
        }
        this.elem.style.left = this.x * 65 + 8 + "px"
        this.elem.style.top = this.y * 65 + 8 + "px"
    }

    insert(position){
        var direction
        var pos = Number(position)
        if(position < verticalStageSize){
            direction = directions[0]
            if((pos + this.height) > verticalStageSize){
                pos -= this.height - 1
            }
            this.x = 0
            this.y = pos
        } else if(position < verticalStageSize + horizontalStageSize){
            direction = directions[1]
            pos -= verticalStageSize
            if((pos + this.width) > horizontalStageSize){
                pos -= this.width - 1
            }
            this.x = pos
            this.y = 0
        } else if(position < verticalStageSize * 2 + horizontalStageSize){
            direction = directions[2]
            pos -= verticalStageSize + horizontalStageSize
            if((pos + this.height) > verticalStageSize){
                pos -= this.height - 1
            }
            this.x = horizontalStageSize - this.width
            this.y = pos
        } else {
            direction = directions[3]
            pos -= verticalStageSize * 2 + horizontalStageSize
            if((pos + this.width) > horizontalStageSize){
                pos -= this.width - 1
            }
            this.x = pos
            this.y = verticalStageSize - this.height
        }
        document.getElementById("playfield-tiles").appendChild(this.elem)
        for(var i = 0; i < ((direction == directions[0] || direction == directions[2]) ? this.width : this.height); i++){
            Array.from(new Set(this.getTiles().map(x => x.getBlock()).filter(x => x != this && x != undefined))).forEach(x => x.push(direction))
        }
        this.updateXY()
        this.placed = true
        if(this.active){
            unsetActive()
        }
    }
}

var intentions = {
    attack: {image: "skull.png", message: "This creature intends to insert a damaging block this turn.", blockType: {typing: typings.enemyAttack, value: 3}},
    heal: {image: "heart.png", message: "This creature intends to insert a healing block this turn.", blockType: {typing: typings.enemyHeal, value: 3}}
}

var monsters = {
    player: {maxHP: 40, image: "player_warlock.png"},
    skeleton: {maxHP: 15, image: "enemy_skeleton.png", intentions: [intentions.attack]},
    slime: {maxHP: 15, image: "enemy_slime.png", intentions: [intentions.attack, intentions.heal]}
}

class Combatant{
    constructor(monster){
        this.monster = monster
        this.hp = this.monster.maxHP

        this.elem = document.createElement("DIV")
        if(this.monster == monsters.player){
            this.elem.id = "player"
        } else {
            this.elem.className = "enemy"
            this.intentionCounter = 0
        }

        this.image = document.createElement("IMG")
        this.image.src = this.monster.image
        this.image.setAttribute("draggable", "false")
        this.elem.appendChild(this.image)

        this.elemHex = document.createElement("DIV")
        this.elemHex.className = "hexcircle"
        this.elemHexImage = document.createElement("IMG")
        this.elemHexImage.src = "PNW_Dex1.png"
        this.elemHex.appendChild(this.elemHexImage)
        this.elem.appendChild(this.elemHex)

        this.lifebar = document.createElement("DIV")
        this.lifebar.className = "lifebar"
        this.lifebarBar = document.createElement("DIV")
        this.lifebarBar.className = "lifebar-bar"
        this.lifebarNumber = document.createElement("DIV")
        this.lifebarNumber.className = "lifebar-number"
        this.lifebar.appendChild(this.lifebarBar)
        this.lifebar.appendChild(this.lifebarNumber)
        this.elem.appendChild(this.lifebar)

        if(this.intentionCounter != undefined){
            this.intentionDisplay = document.createElement("IMG")
            this.intentionDisplay.className = "intention"
            this.intentionDisplay.onmouseover = elementShowTooltip
            this.intentionDisplay.onmouseout = hideTooltip
            this.elem.appendChild(this.intentionDisplay)
        }

        this.animations = document.createElement("DIV")
        this.animations.className = "animations"
        this.lightning = document.createElement("IMG")
        this.lightning.src = "lightning.png"
        this.animations.appendChild(this.lightning)
        this.elem.appendChild(this.animations)

        document.getElementById("combatants").appendChild(this.elem)

        this.updateDisplay()
    }

    endTurn(){
        if(this.intentionCounter != undefined){
            blocks.push(new Block(1, 1, this.monster.intentions[this.intentionCounter].blockType))
            blocks.last().insert(Math.floor((verticalStageSize + horizontalStageSize) * 2 * Math.random()))

            this.intentionCounter = (this.intentionCounter + 1) % this.monster.intentions.length
        }

        this.updateDisplay()
    }

    damage(amount){
        this.hp -= amount
        if(this.hp <= 0){
            this.die()
        } else {
            this.updateDisplay()
            this.lightning.style.animation = ""
            this.lightning.offsetWidth;
            this.lightning.style.animation = ".2s lightning linear"
        }
    }

    heal(amount){
        this.hp = Math.min(this.monster.maxHP, this.hp + amount)
    }

    die(){
        removeElement(this.elem)
        combatants.splice(combatants.indexOf(this), 1)
    }

    updateDisplay(){
        this.lifebarNumber.innerHTML = this.hp + " / " + this.monster.maxHP
        this.lifebarBar.style.width = this.hp / this.monster.maxHP * 100 + "%"

        if(this.intentionCounter != undefined){
            this.intentionDisplay.src = this.monster.intentions[this.intentionCounter].image
            this.intentionDisplay.setAttribute("message", this.monster.intentions[this.intentionCounter].message)
        }
    }
}

var combatants = []
combatants.push(new Combatant(monsters.player))
combatants.push(new Combatant(monsters.skeleton))
combatants.push(new Combatant(monsters.slime))

var tiles = []
for(var i = 0; i < horizontalStageSize; i++){
    for(var e = 0; e < verticalStageSize; e++){
        tiles.push(new Tile(i, e))
    }
}

var arrows = []
for(var i = 0; i < verticalStageSize; i++){
    arrows.push(document.createElement("img"));
    arrows.last().style.top = 66 * i + 45 + "px"
    arrows.last().src = "arrow.png"
}
for(var e = 0; e < horizontalStageSize; e++){
    arrows.push(document.createElement("img"));
    arrows.last().style.left = 66 * e + 45 + "px"
    arrows.last().style.top = 0
    arrows.last().src = "arrowDown.png"
}
for(var i = 0; i < verticalStageSize; i++){
    arrows.push(document.createElement("img"));
    arrows.last().style.left = "100%"
    arrows.last().style.top = 66 * i + 45 + "px"
    arrows.last().src = "arrowLeft.png"
}
for(var e = 0; e < horizontalStageSize; e++){
    arrows.push(document.createElement("img"));
    arrows.last().style.top = "100%"
    arrows.last().style.left = 66 * e + 45 + "px"
    arrows.last().src = "arrowUp.png"
}

arrows.forEach((x, y) => {
    x.className = "arrow"
    x.id = y
    document.getElementById("arrows").appendChild(x)
    x.onclick = function(){
        activeBlock().insert(this.id)
    }
})

var blocks = []

document.getElementById("playfield").style.width = horizontalStageSize * 65 - 32 + "px"
document.getElementById("playfield").style.height = verticalStageSize * 65 - 32 + "px"
document.getElementById("waitingBlocks").style.height = verticalStageSize * 65 + "px"

document.getElementById("canvas").width = horizontalStageSize * 66
document.getElementById("canvas").height = verticalStageSize * 66
var canvasContext = document.getElementById("canvas").getContext("2d")
canvasContext.lineWidth = 3

function nextTurn(){
    combatants.forEach(x => x.endTurn())
    startTurn()
}

function startTurn(){
    for(var i = 0; i < 2; i++){
        blocks.push(new Block(Math.ceil(Math.random() * 2), Math.ceil(Math.random() * 2), {typing: typings.playerAttack, value: Math.ceil(Math.random() * 4)}))
    }
}
startTurn()

setInterval(function(){
    if(scrollLeft){
        horizontalDisplacement -= .25
    }
    if(scrollRight){
        horizontalDisplacement += .25
    }
    horizontalDisplacement = Math.min(horizontalDisplacement, 100)
    horizontalDisplacement = Math.max(horizontalDisplacement, 0)

    document.getElementById("bg5").style.backgroundPositionX = (fogTimer += .025) - horizontalDisplacement * 5 + "px"
    document.getElementById("bg6").style.backgroundPositionX = (fogTimer += .025) * -2 - horizontalDisplacement * 5 + "px"
    //document.getElementById("bg1").style.backgroundPositionX = -horizontalDisplacement * 4 + "px"
    //document.getElementById("bg2").style.backgroundPositionX = -horizontalDisplacement * 2 + "px"
    //document.getElementById("bg3").style.backgroundPositionX = -horizontalDisplacement * 1 + "px"
   // document.getElementById("bg4").style.backgroundPositionX = -horizontalDisplacement * .5 + "px"
    document.getElementById("playfield-tiles").style.left = -16 - ((horizontalStageSize * 66 - 690) * horizontalDisplacement / 100) + "px"
    document.getElementById("canvas").style.left = -((horizontalStageSize * 66 - 690) * horizontalDisplacement / 100) + "px"
}, 1)