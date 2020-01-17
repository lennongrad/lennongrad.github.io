Array.prototype.last = function () {
    return this[this.length - 1];
};

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
    document.getElementById("tooltip").style.top = elem.getBoundingClientRect().top - window.innerHeight / 22 + "px"
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

var horizontalDisplacement = 0
var mouseDown = false

document.getElementById("playfield").onmousedown = function(){
    mouseDown = true
}

document.body.onmouseup = function(){
    mouseDown = false
}

document.body.onmousemove = function(event){
    if(mouseDown)
    horizontalDisplacement += event.movementX * .1
}

setInterval(function(){
    document.getElementById("bg1").style.backgroundPositionX = horizontalDisplacement * 12 + "px"
    document.getElementById("bg2").style.backgroundPositionX = horizontalDisplacement * 6 + "px"
    document.getElementById("bg3").style.backgroundPositionX = horizontalDisplacement * 3 + "px"
    document.getElementById("bg4").style.backgroundPositionX = horizontalDisplacement * 1 + "px"
}, 1)