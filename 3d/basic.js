Array.prototype.last = function () {
    return this[this.length - 1];
};

document.oncontextmenu = cancelContextMenu = function (e) {
    if (e && e.stopPropagation)
        e.stopPropagation();

    return false;
}

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
    element.parentNode.removeChild(element);
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

/**
 * Returns a random value from the input object.
 * @param {object} obj 
 * @returns
 */
function randomValueObj(obj) {
    return obj[randomValue(Object.keys(obj))]
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
