String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + 1);
}

function removeElement(element) {
    element.parentNode.removeChild(element);
}

var strings
var input
var baseString = ".,?!; 0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"

var nextString
var chanceToJumble = .15
var attemptsPerRound = 35

var displayBlocks = []

function checkInput(input){
    if(input == ""){
        return false
    }
    for(var i = 0; i < input.length; i++){
        if(!baseString.includes(input.substring(i, i + 1))){
            return false
        }
    }
    setInput(input)
    return true
}

function setInput(input){
    inputString = input
    for(var i = inputString.length - 1; i >= 0; i--){
        if(!baseString.includes(inputString.substring(i, i+1))){
            inputString = inputString.replaceAt(i, "")
        }
    }

    document.getElementById("base").innerHTML = inputString

    nextString = ""
    for(var e = 0; e < inputString.length; e++){
        nextString += getRandomChar()
    }

    jumbleStrings()
}

function getRandomChar(){
    index = Math.floor(baseString.length * Math.random())
    return baseString.substring(index, index + 1)
}

function jumbleStrings(){
    strings = []
    for(var i = 0; i < attemptsPerRound; i++){
        strings.push(nextString)

        for(var e = 0; e < nextString.length; e++){
            if(Math.random() < chanceToJumble){
                strings[i] = strings[i].replaceAt(e, getRandomChar())
            }
        }
    }

    var displayBlock = document.createElement("DIV")
    var topMatch = 0
    var topMatches = -1
    strings.forEach(function(i){
        var matches = 0
        for(var e = 0; e < i.length; e++){
            if(i.substring(e, e+1) == inputString.substring(e, e+1)){
                matches++
                displayBlock.innerHTML += "<span class='match'>" + i.substring(e, e+1) + "</span>"
            } else {
                displayBlock.innerHTML +=  i.substring(e, e+1)
            }
        }
        displayBlock.innerHTML += "<br>";
        if(matches > topMatches){
            topMatches = matches
            topMatch = i
        }
    })
    document.getElementById("holder").appendChild(displayBlock)
    var currentString = document.createElement("P")
    currentString.innerHTML = nextString
    displayBlock.appendChild(currentString)

    //displayBlocks.push(displayBlock)
    if(displayBlocks.length > 20){
        removeElement(displayBlocks.shift())
    }

    nextString = topMatch
}

setInput("HELLO GRE%ECE")