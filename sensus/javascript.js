Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.first = function () {
    return this[0];
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

var elementsToRemove = []
function removeElementArray(){
    removeElement(elementsToRemove.last())
    elementsToRemove.splice(elementsToRemove.length - 1, 1)
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
    playerAttack: {color: "blue", icon: "card_fireball.png", description: "<b>Cast</b>: Deal `X damage to the closest enemy."},
    playerAttackBack: {color: "blue", icon: "card_blueshell.png", description: "<b>Cast</b>: Deal `X damage to the farthest enemy."},
    bulletBill: {color: "red", icon: "card_bulletbill.png", description: "<b>Cast</b>: Deal `X damage to yourself."},
    bullsEyeBill: {color: "red", icon: "card_bullseyebill.png", description: "<b>Cast</b>: Deal `X damage to yourself.<b>Passive</b>: Closest enemy has +`Y strength"},
    enemyHeal: {color: "red", icon: "card_poisonmushroom.png", description: "<b>Cast</b>: Heal the closest enemy for `X damage."},
    playerAttackFreeze: {color: "blue", icon: "card_iceball.png", description: "<b>Cast</b>: Deal `X damage to the closest enemy and lower their attack stat by `Y"},
    powBlock: {color: "blue", icon: "card_powblock.png", description: "<b>Cast</b>: Deal `X damage to all enemies.<br><b>Push</b>: Deal `Y damage to all enemies."},
    snakeBlock: {color: "blue", icon: "card_snakeblock.png", description: "<b>Cast</b>: Summon `X Snake Block`Z."},
    greenShell: {color: "blue", icon: "card_greenshell.png", description: "<b>Cast</b>: Deal `X damage to the closest enemy.<br><b>Push</b>: Increase this block's damage by `Y."},
    redShell: {color: "red", icon: "card_redshell.png", description: "<b>Cast</b>: Deal `X damage to yourself.<br><b>Push</b>: Increase this block's damage by `Y."},
    dizzyVirus: {color: "red", icon: "card_dizzyvirus.png", description: "<b>Passive:</b> While on the board, player has -`X strength"},
    confusedVirus: {color: "red", icon: "card_confusedvirus.png", description: "<b>Passive:</b> While on the board, player has -`X defense"},
    drowsyVirus: {color: "red", icon: "card_drowsyvirus.png", description: "<b>Passive:</b> While on the board, player has -`X stamina"}
}

class Block{
    constructor(details, control, x, y){
        this.width = details.width
        this.height = details.height
        this.placed = false
        this.active = false
        this.details = Object.assign({}, details)
        this.control = control

        this.elem = document.createElement("DIV")
        this.elem.className = "block"
        this.elem.style.width = 50 * this.width + 16 * (this.width - 1) + "px"
        this.elem.style.height = 50 * this.height + 16 * (this.height - 1) + "px"
        document.getElementById("playfield-tiles").appendChild(this.elem)
        this.elem.block = this

        this.filter = document.createElement("DIV")
        this.filter.className = "block-filter"
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
        
        this.icon = document.createElement("IMG")
        this.icon.src = this.details.typing.icon
        this.elem.appendChild(this.icon)

        this.elemValue = document.createElement("DIV")
        this.elemValue.className = "block-value"
        this.elem.appendChild(this.elemValue)

        if(activeBlock() == undefined){
            setActive(this)
        }   
    }

    static getDescription(details){
        return details.width + "x" + details.height + " block<br>" + details.typing.description.replace(/`X/g, details.value).replace(/`Y/g, details.valueY).replace(/`Z/g, (details.value != 1) ? "s" : "")
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
        this.elem.style.animation = "2s disintegrate"

        switch(this.details.typing){
            case typings.redShell:
            case typings.bullsEyeBill:
            case typings.bulletBill: if(combatants[1] != undefined) combatants[0].damage(this.details.value, combatants[1], false); break;
            case typings.enemyHeal: if(combatants[1] != undefined) combatants[1].heal(this.details.value); break;
            case typings.powBlock:  if(combatants[1] != undefined) combatants.slice(1).forEach(x => x.damage(this.details.value, player, false)); break;
            case typings.snakeBlock: blocks.push(new Block({typing: typings.snakeBlock, width: 1, height: 1}, this)); break;
            case typings.greenShell:
            case typings.playerAttack: if(combatants[1] != undefined) combatants[1].damage(this.details.value, player, false); break;
            case typings.playerAttackBack: combatants.last().damage(this.details.value); break;
            case typings.playerAttackFreeze: if(combatants[1] != undefined){
                combatants[1].attack -= 1;
                combatants[1].damage(this.details.value, player, false)
             }; break;
        }

        elementsToRemove.push(this.elem)
        setTimeout(function(){removeElementArray()}, 200)

        updateDisplay()
    }

    remove(){
        blocks.splice(blocks.indexOf(this), 1)
        elementsToRemove.push(this.elem)
        setTimeout(function(){removeElementArray()}, 200)
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

            switch(this.details.typing){
                case typings.powBlock: if(combatants[1] != undefined) combatants.slice(1).forEach(x => x.damage(this.details.value, player, false)); break;
                case typings.redShell:
                case typings.greenShell: this.details.value += this.details.valueY; break;
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
        updateDisplay()
    }
}

var intentions = {
    directAttack: {image: "attack.png", message: "Intends to directly attack you this turn."},
    directHeal: {image: "card_poisonmushroom.png", message: "Intends to directly heal itself."},
    bulletBill: {image: "card_bulletbill.png", message: "Intends to insert a damaging Bullet Bill block this turn, taking 1 recoil damage as a result.", blockType: {typing: typings.bulletBill, width: 1, height: 1}},
    bullsEyeBill: {image: "card_bullseyebill.png", message: "Intends to insert a damaging Bulls-Eye Bill block this turn, taking 1 recoil damage as a result.", blockType: {typing: typings.bullsEyeBill, width: 1, height: 1}},
    blockHeal: {image: "card_poisonmushroom.png", message: "Intends to insert a healing block this turn.", blockType: {typing: typings.enemyHeal, width: 1, height: 1}},
    increaseDefense: {image: "defend.png", message: "Intends to increase their own defense this turn."},
    dizzyVirus: {image: "card_dizzyvirus.png", message: "Intends to insert a dizzy virus block that saps your strength.", blockType: {typing: typings.dizzyVirus, width: 1, height: 1}},
    confusedVirus: {image: "card_confusedvirus.png", message: "Intends to insert a confused virus block that saps your defense.", blockType: {typing: typings.confusedVirus, width: 1, height: 1}},
    drowsyVirus: {image: "card_drowsyvirus.png", message: "Intends to insert a drowsy virus block that saps your stamina.", blockType: {typing: typings.drowsyVirus, width: 1, height: 1}}
}

var monsterQualities = {
    insertBlockOnDeath: {icon: "skull.png", message: "When defeated, insert:<br>"},
    spiky: {icon: "spiky.png", message: "When damaged, deal `X damage back as recoil"}
}

var monsters = {
    player: {maxHP: 40, image: "mario.png", frames: 9, qualities: []},
    goomba: {maxHP: 6, image: "enemy_goomba.png", frames: 4, qualities: [], intentions: [{intention: intentions.directAttack, value: 3}]},
    gloomba: {maxHP: 8, image: "enemy_gloomba.png", frames: 4, qualities: [], intentions: [{intention: intentions.directAttack, value: 3}, {intention: intentions.blockHeal, value: 3}]},
    greenKoopa: {maxHP: 13, image: "enemy_greenkoopa.png", frames: 7, 
        qualities: [{quality: monsterQualities.insertBlockOnDeath, blockType: {typing: typings.greenShell, width: 1, height: 1, value: 1, valueY: 1}}], 
        intentions: [{intention: intentions.directAttack, value: 3}]},
    redKoopa: {maxHP: 12, image: "enemy_redkoopa.png", frames: 7, 
        qualities: [{quality: monsterQualities.insertBlockOnDeath, blockType: {typing: typings.redShell, width: 1, height: 1, value: 1, valueY: 1}}], 
        intentions: [{intention: intentions.directAttack, value: 3}]},
    bulletBillBlaster: {maxHP: 14, image: "enemy_bulletbillblaster.png", frames: 7, qualities: [], intentions: [{intention: intentions.bulletBill, value: 4}, {intention: intentions.increaseDefense, value: 1}]},
    bullsEyeBillBlaster: {maxHP: 14, image: "enemy_bullseyebillblaster.png", frames: 7, qualities: [], intentions: [{intention: intentions.bullsEyeBill, value: 2, valueY: 1}]},
    dizzyPiranhaPlant: {maxHP: 9, image: "enemy_dizzypiranhaplant.png", frames: 4, qualities: [{quality: monsterQualities.spiky, value: 1}], intentions: [{intention: intentions.dizzyVirus, value: 1}, {intention: intentions.directAttack, value: 3}]},
    confusedPiranhaPlant: {maxHP: 9, image: "enemy_confusedpiranhaplant.png", frames: 4, qualities: [{quality: monsterQualities.spiky, value: 1}], intentions: [{intention: intentions.confusedVirus, value: 1}, {intention: intentions.directAttack, value: 3}]},
    drowsyPiranhaPlant: {maxHP: 9, image: "enemy_drowsypiranhaplant.png", frames: 4, qualities: [{quality: monsterQualities.spiky, value: 1}], intentions: [{intention: intentions.drowsyVirus, value: 1}, {intention: intentions.directAttack, value: 3}]},
    piranhaPlant: {maxHP: 10, image: "enemy_piranhaplant.png", frames: 4, qualities: [{quality: monsterQualities.spiky, value: 1}], intentions: [{intention: intentions.directAttack, value: 5}, {intention: intentions.directAttack, value: 3}]}
}

level1Monsters = [monsters.goomba, monsters.gloomba, monsters.greenKoopa, monsters.redKoopa, monsters.bulletBillBlaster, monsters.bullsEyeBillBlaster, monsters.piranhaPlant, monsters.dizzyPiranhaPlant, monsters.confusedPiranhaPlant, monsters.drowsyPiranhaPlant]

class Combatant{
    constructor(monster){
        this.monster = monster
        this.hp = this.monster.maxHP
        this.attack = 0
        this.defense = 0
        this.stamina = 0
        this.qualities = this.monster.qualities.slice().map(x => Object.assign({}, x))

        this.elem = document.createElement("DIV")
        if(this.monster == monsters.player){
            this.elem.id = "player"
        } else {
            this.elem.className = "enemy"
            this.intentionCounter = 0
        }

        var animationDelay = Math.random() + "s"
        this.image = document.createElement("DIV")
        this.image.className = "combatant-image frames" + this.monster.frames
        this.image.style.backgroundImage = "url(" + this.monster.image + ")"
        this.image.style.animationDelay = animationDelay
        this.elem.appendChild(this.image)
        this.imageShadow = document.createElement("DIV")
        this.imageShadow.className = "combatant-image-shadow frames" + this.monster.frames
        this.imageShadow.style.backgroundImage = "url(" + this.monster.image + ")"
        this.imageShadow.style.animationDelay = animationDelay
        this.elem.appendChild(this.imageShadow)

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
            this.intentionDisplay.style.animationDelay = animationDelay
            this.elem.appendChild(this.intentionDisplay)

            this.intentionValue = document.createElement("DIV")
            this.intentionValue.className = "intention-value"
            this.intentionValue.style.animationDelay = animationDelay
            this.elem.appendChild(this.intentionValue)
        }

        this.debuffDisplay = document.createElement("DIV")
        this.debuffDisplay.className = "debuff-display"
        this.elem.appendChild(this.debuffDisplay)

        this.attackDisplay = document.createElement("DIV")
        this.attackDisplay.className = "attack-display"
        this.attackDisplayImage = document.createElement("IMG")
        this.attackDisplayImage.src = "attack-up.png"
        this.attackDisplayValue = document.createElement("SPAN")
        this.attackDisplay.appendChild(this.attackDisplayImage)
        this.attackDisplay.appendChild(this.attackDisplayValue)
        this.attackDisplay.onmouseover = elementShowTooltip
        this.attackDisplay.onmouseout = hideTooltip
        
        this.defenseDisplay = document.createElement("DIV")
        this.defenseDisplay.className = "defense-display"
        this.defenseDisplayImage = document.createElement("IMG")
        this.defenseDisplayImage.src = "defense-up.png"
        this.defenseDisplayValue = document.createElement("SPAN")
        this.defenseDisplay.appendChild(this.defenseDisplayImage)
        this.defenseDisplay.appendChild(this.defenseDisplayValue)
        this.defenseDisplay.onmouseover = elementShowTooltip
        this.defenseDisplay.onmouseout = hideTooltip
        
        this.staminaDisplay = document.createElement("DIV")
        this.staminaDisplay.className = "stamina-display"
        this.staminaDisplayImage = document.createElement("IMG")
        this.staminaDisplayImage.src = "stamina-up.png"
        this.staminaDisplayValue = document.createElement("SPAN")
        this.staminaDisplay.appendChild(this.staminaDisplayImage)
        this.staminaDisplay.appendChild(this.staminaDisplayValue)
        this.staminaDisplay.onmouseover = elementShowTooltip
        this.staminaDisplay.onmouseout = hideTooltip

        this.qualitiesDisplay = document.createElement("DIV")
        this.qualitiesDisplay.className = "qualities-display"
        this.elem.appendChild(this.qualitiesDisplay)

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
            var tempValue = this.monster.intentions[this.intentionCounter].value + this.getAttack()
            switch(this.monster.intentions[this.intentionCounter].intention){
                case intentions.directAttack: combatants[0].damage(tempValue, this, false); break;
                case intentions.directHeal:  this.heal(tempValue); break;
                case intentions.increaseDefense: this.defense += this.monster.intentions[this.intentionCounter].value; break;
                case intentions.bullsEyeBill:
                case intentions.bulletBill: this.damage(1, this, true, true); break;
            }

            if(this.monster.intentions[this.intentionCounter].intention.blockType != undefined){
                var blockType = Object.assign({}, this.monster.intentions[this.intentionCounter].intention.blockType)
                blockType.value = tempValue
                blockType.valueY = this.monster.intentions[this.intentionCounter].valueY
                blocks.push(new Block(blockType, this)); 
                blocks.last().insert(Math.floor((verticalStageSize + horizontalStageSize) * 2 * Math.random())); 
            }

            this.intentionCounter = (this.intentionCounter + 1) % this.monster.intentions.length
        }

        this.updateDisplay()
    }

    damage(amount, source, isRecoil, bypassDefense){
        var spikeDamage = 0
        if(this.qualities.filter(x => x.quality == monsterQualities.spiky).length != 0){
            spikeDamage += this.qualities.filter(x => x.quality == monsterQualities.spiky).reduce((x,y) => x + y.value, 0)
        }

        if(bypassDefense){
            this.hp -= amount
        } else {
            this.hp -= Math.max(0, amount - this.getDefense())
        }
        if(this.hp <= 0){
            this.die()
        } else if(source != this && !isRecoil && spikeDamage != 0){
            source.damage(spikeDamage, this, true)
        }
        this.updateDisplay()
        this.lightning.style.animation = ""
        this.lightning.offsetWidth;
        this.lightning.style.animation = ".2s lightning linear"
    }

    heal(amount){
        this.hp = Math.min(this.monster.maxHP, this.hp + amount)
    }

    die(){
        combatants.splice(combatants.indexOf(this), 1)

        this.elem.style.opacity = 0
        elementsToRemove.push(this.elem)
        setTimeout(function(){
            removeElementArray()
        }, 500)

        var reward = Math.floor(Math.random() * 3) + 2
        playerCoins += reward

        if(combatants.length == 1){
            combatWon()
        } else {
            this.qualities.forEach(x => {
                switch(x.quality){
                    case monsterQualities.insertBlockOnDeath:
                        var blockType = Object.assign({}, x.blockType)
                        blocks.push(new Block(blockType, this)); 
                        blocks.last().insert(Math.floor((verticalStageSize + horizontalStageSize) * 2 * Math.random())); break;
                }
            })
        }
    }

    getAttack(){
        var finalAttack = this.attack
        if(this == player && blocks != undefined){
            finalAttack -= blocks.filter(x => x.details.typing == typings.dizzyVirus).reduce((x, y) => y.details.value + x, 0) 
        }
        if(combatants != undefined && this == combatants[1] && blocks != undefined){
            finalAttack += blocks.filter(x => x.details.typing == typings.bullsEyeBill).reduce((x, y) => y.details.valueY + x, 0) 
        }
        return finalAttack
    }

    getDefense(){
        var finalDefense = this.defense
        if(this == player && blocks != undefined){
            finalDefense-= blocks.filter(x => x.details.typing == typings.confusedVirus).reduce((x, y) => y.details.value + x, 0) 
        }
        return finalDefense
    }

    getStamina(){
        if(this != player){
            return 0
        }

        var finalStamina = this.stamina
        if(blocks != undefined){
            finalStamina -= blocks.filter(x => x.details.typing == typings.drowsyVirus).reduce((x, y) => y.details.value + x, 0) 
        }
        return finalStamina
    }

    updateDisplay(){
        this.lifebarNumber.innerHTML = this.hp + " / " + this.monster.maxHP
        this.lifebarBar.style.width = this.hp / this.monster.maxHP * 100 + "%"

        if(this.intentionCounter != undefined){
            this.intentionDisplay.src = this.monster.intentions[this.intentionCounter].intention.image
            this.intentionDisplay.setAttribute("message", this.monster.intentions[this.intentionCounter].intention.message)
            if(this.monster.intentions[this.intentionCounter].intention.blockType != undefined){
                this.intentionDisplay.className = "intention intention-block"
            } else {
                this.intentionDisplay.className = "intention"
            }
            this.intentionValue.innerHTML = this.monster.intentions[this.intentionCounter].value + this.getAttack()
        }

        this.qualitiesDisplay.innerHTML = ""
        this.qualities.forEach(x => {
            var qualityElem = document.createElement("IMG")
            qualityElem.src = x.quality.icon
            qualityElem.onmouseover = elementShowTooltip
            qualityElem.onmouseout = hideTooltip
            var tooltip = x.quality.message
            if(x.blockType != undefined){
                tooltip = tooltip + Block.getDescription(x.blockType)
            } else {
                tooltip = tooltip.replace(/`X/g, x.value)
            }
            qualityElem.setAttribute("message", tooltip)
            this.qualitiesDisplay.appendChild(qualityElem)
        })

        this.debuffDisplay.innerHTML = ""
        if(this.getAttack() != 0){
            this.attackDisplayValue.innerHTML = this.getAttack()
            this.debuffDisplay.appendChild(this.attackDisplay)
            this.attackDisplay.setAttribute("message", "<b class='attack-display'>" + this.getAttack() + " Attack</b>: Increases damage dealt by each direct attack, or powers up certain blocks when summoned")
        }

        if(this.getDefense() != 0){
            this.defenseDisplayValue.innerHTML = this.getDefense()
            this.debuffDisplay.appendChild(this.defenseDisplay)
            this.defenseDisplay.setAttribute("message", "<b class='defense-display'>" + this.getDefense() + " Defense</b>: Decreases damage received from all sources")
        }

        if(this.getStamina() != 0){
            this.staminaDisplayValue.innerHTML = this.getStamina()
            this.debuffDisplay.appendChild(this.staminaDisplay)
            this.staminaDisplay.setAttribute("message", "<b class='stamina-display'>" + this.getStamina() + " Stamina</b>: Decreases the cost of each card")
        }
    }
}

class Card{
    constructor(cardType){
        this.cardType = cardType

        this.elem = document.createElement("DIV")
        this.elem.className = "card"
        
        this.cost = document.createElement("DIV")
        this.cost.className = "card-cost"
        this.elem.appendChild(this.cost)
        
        this.name = document.createElement("DIV")
        this.name.innerHTML = this.cardType.name
        this.name.className = "card-name"
        this.elem.appendChild(this.name)
        
        this.icon = document.createElement("div")
        this.icon.className = "card-icon"
        var animationDelay = Math.random() + "s"
        this.iconBackground = document.createElement("DIV")
        this.iconBackground.style.backgroundImage = "url('world11.jpg')"
        this.iconBackground.style.animationDelay = animationDelay
        this.iconImage = document.createElement("IMG")
        this.iconImage.src = this.cardType.icon
        this.iconImage.setAttribute("draggable", "false")
        this.icon.appendChild(this.iconBackground)
        this.icon.appendChild(this.iconImage)
        this.elem.appendChild(this.icon)
        
        this.description = document.createElement("DIV")
        this.description.className = "card-description"
        this.elem.appendChild(this.description)
        this.update()

        this.elem.card = this
        this.elem.onclick = function(){this.card.click()}

        this.thumbnailElem = this.elem.cloneNode(true)
        this.thumbnailElem.card = this
        this.thumbnailElem.onclick = function(){
            if(rewardCards.includes(this.card)){
                document.getElementById("rewards").style.opacity = 0
                document.getElementById("rewards").style.pointerEvents = "none"
                document.getElementById("main").className = ""

                playerDeck.push(this.card)
                backToMap()
            }
        }
    }

    static getDescription(cardType){
        var string = ""
        cardType.effects.forEach(x => {
            var tempValue = x.value + (x.effect.affectedByAttack ? combatants[0].getAttack() : 0)
            string += x.effect.description.replace(/`Y/g, tempValue).replace(/`Z/g, tempValue != 1 ? "s" : "")
            switch(x.effect){
                case cardEffects.summon: var tempBlock = Object.assign({}, x.block); tempBlock.value += ((combatants != undefined) ? combatants[0].getAttack() : 0); string += "Summon a " + Block.getDescription(tempBlock); break;
            }
            string += "<br>"
        })
        return string;
    }

    click(){
        if(playerEnergy >= this.getCost()){
            this.play()
        }
    }

    play(){
        playerEnergy -= this.getCost()

        this.cardType.effects.forEach(x => {
            switch(x.effect){
                case cardEffects.summon: 
                    for(var i = 0; i < x.value; i++){
                        var tempBlock = Object.assign({}, x.block)
                        tempBlock.value += combatants[0].getAttack()
                        blocks.push(new Block(tempBlock, combatants[0]));
                     }; break;
                case cardEffects.cardDraw: drawCards(x.value); break;
                case cardEffects.targetDefenseDown:  if(combatants[1] != undefined) combatants[1].defense -= x.value; break;
                case cardEffects.userAttackUp: combatants[0].attack += x.value; break;
                case cardEffects.userDefenseUp: combatants[0].defense += x.value; break;
                case cardEffects.quakeHammer: combatants.filter(y => y.monster != monsters.player).forEach(y => y.damage(x.value + combatants[0].getAttack(), player, false)); break;
                case cardEffects.spring: if(combatants[1] != undefined) combatants[1].damage(blocks.filter(x => x.control = combatants[0]).length * (combatants[0].getAttack() + x.value), player, false); break;
            }
        })

        this.elem.style.animation = "2s played"
        var elem = this.elem
        setTimeout(function(){removeElement(elem)}, 200)
        playerHand.splice(playerHand.indexOf(this), 1)
        playerDiscard.push(this)

        updateDisplay()
    }

    update(){
        if(combatants != undefined){
            this.description.innerHTML = Card.getDescription(this.cardType)
            this.cost.innerHTML = this.getCost()
        }
    }
    
    getCost(){
        return Math.min(Math.max(this.cardType.cost, playerEnergyMax), this.cardType.cost + -player.getStamina())
    }
}

var cardEffects = {
    summon: {description: "", affectedByAttack: false},
    cardDraw: {description: "Draw `Y card`Z. ", affectedByAttack: false}, 
    userAttackUp: {description: "Increase your attack stat by +`Y permanently. ", affectedByAttack: false},
    userDefenseUp: {description: "Increase your defense stat by +`Y permanently. ", affectedByAttack: false},
    spring: {description: "Deal `Y damage for each block you control on the board. ", affectedByAttack: true},
    targetDefenseDown: {description: "Closest opponent loses `Y defense. ", affectedByAttack: false},
    quakeHammer: {description: "Deal `Y damage to all opponents. ", affectedByAttack: true}
}

var cardTypes = {
    iceball: {cost: 1, name: "Iceball", icon: "card_iceball.png",  effects: [{effect: cardEffects.summon, value: 1, block: {width: 1, height: 1, typing: typings.playerAttackFreeze, value: 2, valueY: 1}}]},
    fireball: {cost: 1, name: "Fireball", icon: "card_fireball.png", effects: [{effect: cardEffects.summon, value: 1, block: {width: 1, height: 1, typing: typings.playerAttack, value: 3}}]},
    fireflower: {cost: 2, exhaust: true, name: "Fire Flower", icon: "card_fireflower.png", 
        effects: [{effect: cardEffects.userAttackUp, value: 1}, {effect: cardEffects.summon, value: 1, block: {width: 1, height: 1, typing: typings.playerAttack, value: 3}}]},
    iceflower: {cost: 2, name: "Ice Flower", icon: "card_iceflower.png", 
        effects: [{effect: cardEffects.userDefenseUp, value: 1}, {effect: cardEffects.summon, value: 1, block: {width: 1, height: 1, typing: typings.playerAttackFreeze, value: 2, valueY: 1}}]},
    blueshell: {cost: 2, name: "Blue Shell", icon: "card_blueshell.png", 
        effects: [{effect: cardEffects.summon, value: 1, block: {width: 1, height: 1, typing: typings.playerAttackBack, value: 4, valueY: 1}}]},
    boomerangflower: {cost: 2, name: "Boomerang Flower", icon: "card_boomerangflower.png", effects: [{effect: cardEffects.userAttackUp, value: 1}, {effect: cardEffects.userDefenseUp, value: 1}]},
    timer: {cost: 1, name: "Timer", icon: "card_timer.png", effects: [{effect: cardEffects.cardDraw, value: 1}, {effect: cardEffects.targetDefenseDown, value: 1}]},
    spring: {cost: 2, name: "Spring", icon: "card_spring.png", effects: [{effect: cardEffects.spring, value: 2}]},
    powblock: {cost: 3, name: "POW Block", icon: "card_powblock.png",  effects: [{effect: cardEffects.summon, value: 1, block: {width: 2, height: 2, typing: typings.powBlock, value: 2, valueY: 1}}]},
    snakeblock: {cost: 1, name: "Snake Block", icon: "card_snakeblock.png",  effects: [{effect: cardEffects.summon, value: 1, block: {width: 1, height: 1, typing: typings.snakeBlock, value: 1}}]},
    quakehammer: {cost: 2, name: "Quake Hammer", icon: "card_hammer.png",  effects: [{effect: cardEffects.quakeHammer, value: 3}]}
}

var playerStartingHand = [new Card(cardTypes.fireball), new Card(cardTypes.fireball), new Card(cardTypes.fireball), new Card(cardTypes.iceball), new Card(cardTypes.iceball), new Card(cardTypes.iceflower), new Card(cardTypes.fireflower), new Card(cardTypes.timer)]

function randomCardType(){
    var tempArray = []
    Object.keys(cardTypes).forEach(key => tempArray.push(cardTypes[key]))
    return shuffleArray(tempArray)
}

class Room{
    constructor(x, y){
        this.x = x
        this.y = y
        this.active = false
        this.playerStart = false
        this.cleared = false
    }

    adj(direction){
        switch(direction){
            case directions[0]: if(this.x < roomSizeX - 1) return rooms[(this.x + 1) * roomSizeY + this.y]; break;
            case directions[1]: if(this.y < roomSizeY - 1) return rooms[this.x * roomSizeY + (this.y + 1)]; break;
            case directions[2]: if(this.x > 0) return rooms[(this.x - 1) * roomSizeY + this.y]; break;
            case directions[3]: if(this.y > 0) return rooms[this.x * roomSizeY + (this.y - 1)]; break;
        }
        return undefined
    }

    initialize(){
        this.active = true

        this.elem = document.createElement("DIV")
        this.elem.className = "room"
        this.elem.style.left = this.x * 64 + 40 + "px"
        this.elem.style.top = this.y * 64 + 40 + "px"

        this.clearIndicator = document.createElement("IMG")
        this.clearIndicator.className = "clearIndicator"

        if(this.playerStart){
            this.cleared = true
        }

        this.elem.id = "room" + (this.x * roomSizeY + this.y)
        this.elem.onclick = function(){
            rooms[Number(this.id.substring(4))].visit()
        }

        this.hider = document.createElement("DIV")
        this.hider.className = "room-hider"
        this.elem.appendChild(this.hider)

        if(this.adj(directions[0]) != undefined && visitedRooms.includes(this.adj(directions[0]))){
            var pipeRight = document.createElement("IMG")
            pipeRight.src = "MapPipeHorizontal.png"
            pipeRight.className = "pipeRight"
            this.elem.appendChild(pipeRight)
        }

        if(this.adj(directions[1]) != undefined && visitedRooms.includes(this.adj(directions[1]))){
            var pipeDown = document.createElement("IMG")
            pipeDown.src = "MapPipe.png"
            pipeDown.className = "pipeDown"
            this.elem.appendChild(pipeDown)
        }

        if(this.adj(directions[2]) != undefined && visitedRooms.includes(this.adj(directions[2]))){
            var pipeLeft = document.createElement("IMG")
            pipeLeft.src = "MapPipeHorizontal.png"
            pipeLeft.className = "pipeLeft"
            this.elem.appendChild(pipeLeft)
        }

        if(this.adj(directions[3]) != undefined && visitedRooms.includes(this.adj(directions[3]))){
            var pipeUp = document.createElement("IMG")
            pipeUp.src = "MapPipe.png"
            pipeUp.className = "pipeUp"
            this.elem.appendChild(pipeUp)
        }

        document.getElementById("rooms").appendChild(this.elem)
    }

    update(){
        this.canBeSeen = this.cleared
        directions.forEach(direction => {
            if(this.adj(direction) != undefined && this.adj(direction).cleared){
                this.canBeSeen = true
            }
        })

        if(this.canBeSeen){
            this.elem.style.filter = ""
            this.elem.style.zIndex = 1
            this.elem.appendChild(this.clearIndicator)
            this.hider.style.display = "none"
        } else {
            this.elem.style.filter = "brightness(.5)"
        }

        if(this.cleared){
            this.clearIndicator.src = "checkmark.png"
        } else {
            this.clearIndicator.src = "skull.png"
        }
    }

    visit(ignoreCleared){
        this.update()

        if(this.canBeSeen && (!this.cleared || ignoreCleared)){
            if(!this.cleared){
                resetCombat()
            }

            playerRoom = this
            this.cleared = true
            visitedRooms.forEach(x => x.update())
        }
    }
}

var playerHandMax = 5
var playerEnergyMax = 3
var playerCoins = 0

var roomSizeX = 6
var roomSizeY = 5
var playerRoom
var playerMapIcon = document.createElement("IMG")
playerMapIcon.src = "playerMapIcon.png"
playerMapIcon.id = "playerMapIcon"
var rooms = []

for(var e = 0; e < roomSizeX; e++){
    for(var i = 0; i < roomSizeY; i++){
        rooms.push(new Room(e, i))
    }
}
document.getElementById("rooms").style.width = roomSizeX * 100 + "px"
document.getElementById("rooms").style.height = roomSizeY * 100 + "px"

var visitedRooms = []
var roomQueue = [randomValue(rooms)]
while(roomQueue.length != 0){
    visitedRooms.push(roomQueue.first())
    directions.forEach(direction => {
        if((Math.random() < .35  || visitedRooms.length < 4) && (visitedRooms.length < 8) && roomQueue.first().adj(direction) != undefined && !visitedRooms.includes(roomQueue.first().adj(direction))){
            roomQueue.push(roomQueue.first().adj(direction))
        }
    })
    roomQueue.splice(0, 1)
} 
visitedRooms = Array.from(new Set(visitedRooms))

randomValue(visitedRooms).playerStart = true
visitedRooms.forEach(x => x.initialize())
visitedRooms.filter(x => x.playerStart)[0].visit(true)

var playerHand = []
var playerDraw = []
var playerDiscard = []
var playerEnergy = 0

var combatants
var player = new Combatant(monsters.player)
var playerDeck = playerStartingHand.slice()

var tiles = []
for(var i = 0; i < horizontalStageSize; i++){
    for(var e = 0; e < verticalStageSize; e++){
        tiles.push(new Tile(i, e))
    }
}

var arrows = []
for(var i = 0; i < verticalStageSize; i++){
    arrows.push(document.createElement("img"));
    arrows.last().style.left = "0px"
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

function showDrawPile(){
    if(playerDraw.length > 0){
        document.getElementById("main").className = "blur"
        document.getElementById("thumbnails").style.opacity = 1
        playerDraw.forEach(x => document.getElementById("thumbnails-hold").appendChild(x.thumbnailElem))
    }
}

function showDiscardPile(){
    if(playerDiscard.length > 0){
        document.getElementById("main").className = "blur"
        document.getElementById("thumbnails").style.opacity = 1
        playerDiscard.forEach(x => document.getElementById("thumbnails-hold").appendChild(x.thumbnailElem))
    }
}

function showDeckPile(){
    document.getElementById("main").className = "blur"
    document.getElementById("thumbnails").style.opacity = 1
    playerDeck.forEach(x => document.getElementById("thumbnails-hold").appendChild(x.thumbnailElem))
}

function hideThumbnails(){
    document.getElementById("main").className = ""
    document.getElementById("thumbnails").style.opacity = 0
    document.getElementById("thumbnails-hold").innerHTML = ""
}

function addCardToHand(card){
    playerHand.push(card)
    document.getElementById("cards").appendChild(playerHand.last().elem)
    playerHand.last().elem.style.animation = ""
}

function drawCards(cardAmount){
    for(var i = 0; i < cardAmount; i++){
        if(playerDraw.length == 0 && playerDiscard.length != 0){
            playerDraw = playerDiscard.slice()
            playerDiscard = []
        } else if(playerDraw.length == 0){
            return
        }

        addCardToHand(playerDraw.splice(randomIndex(playerDraw), 1)[0])
    }
}

function resetCombat(){
    combatants = [player]
    combatants[0].attack = 0
    combatants[0].defense = 0
    combatants[0].stamina = 0

    for(var i = 0; i < 1 || (i < 3 && Math.random() < .5); i++){
        combatants.push(new Combatant(randomValue(level1Monsters)))
    }

    blocks.slice().reverse().forEach(x => x.remove())
    Array.prototype.slice.call(document.getElementsByClassName("block")).slice().reverse().forEach(x => removeElement(x))

    document.getElementById("cards").innerHTML = ""
    playerDraw = playerDeck.slice()
    playerHand = []

    document.getElementById("map").style.opacity = 0
    document.getElementById("map").style.pointerEvents = "none"         
    document.getElementById("map").style.filter = "blur(50px)"
    drawCards(playerHandMax)
    startTurn()
}

function startTurn(){
    if(playerHand.length < playerHandMax){
        drawCards(1)
    }
    playerEnergy = playerEnergyMax
    updateDisplay()
}

function nextTurn(){
    updateDisplay()
    blocks.filter(x => !x.placed).forEach(x => x.remove())
    if(combatants != undefined){
        var tempCombatants = combatants.slice()
        tempCombatants.forEach(x => x.endTurn())
    }

    if(combatants.length == 1){
        combatWon()
    } else {
        startTurn()
    }
}

var rewardCards = []
function combatWon(){
    rewardCards = randomCardType().slice(0, 3).map(x => new Card(x))
    document.getElementById("rewards-hold").innerHTML = " "
    rewardCards.forEach(card => {
        document.getElementById("rewards-hold").appendChild(card.thumbnailElem)
    })

    setTimeout(function(){
        document.getElementById("main").className = "blur"
        document.getElementById("rewards").style.opacity = 1
        document.getElementById("rewards").style.pointerEvents = ""
    }, 500)
}

function backToMap(){
    document.getElementById("map").style.opacity = 1
    document.getElementById("map").style.filter = ""
    document.getElementById("map").style.pointerEvents = ""
    updateDisplay()
}

function updateDisplay(){
    document.getElementById("energy-number").innerHTML = playerEnergy + "/" + playerEnergyMax
    document.getElementById("card-number").innerHTML = playerHand.length + "/" + playerHandMax
    document.getElementById("draw").innerHTML = playerDraw.length
    document.getElementById("discard").innerHTML = playerDiscard.length
    document.getElementById("deck-number").innerHTML = playerDeck.length
    document.getElementById("coins-number").innerHTML = playerCoins
    document.getElementById("energy-name").setAttribute("message", "You start each turn with `Y Energy, and spend it to play cards. You currently have `X Energy left to spend this turn.".replace(/`Y/g, playerEnergyMax).replace(/`X/g, playerEnergy))
    document.getElementById("card-name").setAttribute("message", "You have `X cards left to play. At the start of each turn, you draw 1 card. You can have up to `Y cards in your hand.".replace(/`Y/g, playerHandMax).replace(/`X/g, playerHand.length))
    document.getElementById("draw").setAttribute("message", "There are `X cards left in your draw pile. This is where cards are drawn from at the beginning of your turn.".replace(/`X/g, playerDraw.length))
    document.getElementById("discard").setAttribute("message", "There are `X cards left in your discard pile. This is where cards are put after they are played.".replace(/`X/g, playerDiscard.length))
    document.getElementById("deck-name").setAttribute("message", "There are `X cards in your deck.".replace(/`X/g, playerDeck.length))
    document.getElementById("coins-name").setAttribute("message", "You have `X coins.".replace(/`X/g, playerCoins))

    if(combatants != undefined){
        combatants.forEach(x => x.updateDisplay())
    }

    if(playerHand != undefined){
        playerHand.forEach(x => x.update())
    }

    if(blocks != undefined){
        blocks.forEach(x => {
            x.elem.setAttribute("message", Block.getDescription(x.details))
            x.elemValue.innerHTML = x.details.value
        })
    }
}
updateDisplay()

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

    playerRoom.elem.appendChild(playerMapIcon)
}, 1)