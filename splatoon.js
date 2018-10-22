mouse = {x: 0, y: 0}

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

document.onmousemove = function(event){
    mouse = {x: event.clientX, y: event.clientY};
}

if(window.mobilecheck()){
}

var resize = function(){
}
resize()
$(window).resize(function(){
    resize()
})

var mouseDown = false;
document.onmousedown = function(e) { 
    if(e.which == 1){
        mouseDown = true;
    }
    if(e.which == 3){
        //
    }
}
document.onmouseup = function() {
    mouseDown = false;
}     

var forEach = function(obj,func){
    Object.entries(obj).map(a => a[1]).forEach(func) 
}

var keys = {
    characterA: 81,
    characterB: 87,
    characterC: 69,
    move1: 49,
    move2: 50,
    move3: 51,
    move4: 52,
    moveUp: 38,
    moveDown: 40,
    moveLeft: 37,
    moveRight: 39
}

document.addEventListener('keydown', function (event) {
    switch(event.keyCode){
        case keys.characterA: break;
    }
});

var distance = function(p1, p2){
    return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2))
}

var randomValue = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

var getAngle = function(a,b){
    var angle = Math.atan((a.y - b.y) / (a.x - b.x));
    if(Math.sign(a.x - b.x) == -1){
        angle += Math.PI;
    }
    angle -= Math.PI;
    return angle
}


var purgeDuplicates = function(arr){
    var final = []
    for(var i = 0; i < arr.length; i++){
        if(final.indexOf(arr[i]) == -1){
            final.push(arr[i])
        }
    }
    return final;
}

var copyInstance = function(original) {
    var copied = Object.assign(
      Object.create(
        Object.getPrototypeOf(original)
      ),
      original
    );
    return copied;
}

var toFile = function(a){
    return a.toLowerCase().replace(/ /g,"_")
}

var toBase = function(a){
    return a.replace(/\+/g,"").replace(/\-/g,"")
}

var addObj = function(a,b,c,d){
    if(JSON.stringify(Object.keys(a).sort()) != JSON.stringify(Object.keys(b).sort())){
        return undefined
    }
    var keys = Object.keys(a)
    var final = {}
    if(c == undefined || d == undefined){
        var c = 1, d = 1;
    }
    for(var i = 0; i < keys.length; i++){
        final[keys[i]] = (a[keys[i]] * c) + (b[keys[i]] * d) 
    }
    return final
}

var teams = {
    neutral: {colour: "white"},
    good: {colour: "red"},
    bad: {colour: "blue"}
}

class Cell{
    constructor(){
        this.elem = document.createElement("TD")
        this.elem.className = "cell"
        this.elem.style.backgroundColor = "white"

        this.colour = "neutral"
    }

    update(){
        this.elem.style.backgroundColor = teams[this.colour].colour
    }
}

var battlefield = document.getElementById("battlefield")
var bF = []

var dim = {width: 90, height: 40}
for(var i = 0; i < dim.height; i++){
    var row = document.createElement("TR")
    battlefield.appendChild(row)
    bF.push([])

    for(var e = 0; e < dim.width; e++){
        bF[i].push(new Cell())
        row.appendChild(bF[i][e].elem)
    }
}

class Bullet{
    
}