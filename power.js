var version = "A0";
document.getElementById("version").innerHTML = "Version " + version;

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

$(window).resize(function(){
})

var mouseDown = false;
document.onmousedown = function(e) { 
    if(e.which == 1){
        mouseDown = true;
        points.push(new Point(mouse, pointTypes.conductor))
        drawPoints()
    }
    if(e.which == 3){
        var final = getRandomColour()
        while(final.hsl().s > .9){
            final = getRandomColour()
        }
        points.push(new Point(mouse, pointTypes.power,final))
        drawPoints()
    }
}
document.onmouseup = function() {
    mouseDown = false;
}     

var holdCtrl = false;
var holdShift = false;
var holdSpace = false;
var holdAlt = false;
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 17) {
        holdCtrl = true;
        points = []
        document.getElementById("whole").innerHTML = ""
    }
    if (event.keyCode == 16) {
        holdShift = true;
        genRandomPoint()
        drawPoints()
    }
    if (event.keyCode == 32) {
        holdSpace = true;
    }
    if (event.keyCode == 66) {
        holdAlt = true;
    }
    if (event.keyCode == 13) {
        points = points.map(function(a){var b = a; b.colour.val = {r: 255, g: 255, b: 255}; return b})
    }
});
document.addEventListener('keyup', function (event) {
    holdCtrl = false;
    holdShift = false;
    holdAlt = false;
    holdSpace = false;
});

var distance = function(p1, p2){
    return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2))
}

class Colour{
    constructor(r_,g_,b_){
        this.val = {r: r_, g: g_, b: b_}
    }

    value(){
        return "rgb(" + this.val.r + "," + this.val.g + "," + this.val.b + ")"
    }

    hsl(){
        var adj = {r: this.val.r / 255, g: this.val.g / 255, b: this.val.b / 255}
        var max = Math.max(adj.r, adj.g, adj.b)
        var min = Math.min(adj.r, adj.g, adj.b)
        var h, s, l = (max + min) / 2;
      
        if (max == min) {
          h = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
          switch (max) {
            case adj.r: h = (adj.g - adj.b) / d + (adj.g < adj.b ? 6 : 0); break;
            case adj.g: h = (adj.b - adj.r) / d + 2; break;
            case adj.b: h = (adj.r - adj.g) / d + 4; break;
          }
      
          h /= 6;
        }
      
        return {h: h, s: s, l: l};
    }
}

var add = function(x,y,b1,b2){
    x = x.val
    y = y.val
    if(b1 == undefined || b2 == undefined){
        return new Colour((x.r + y.r) / 2,(x.g + y.g) / 2,(x.b + y.b) / 2)
    } else {
        b1 = Math.max(0, b1)
        b2 = Math.max(0, b2)
        if(holdSpace){
            if(b1 > b2){
                b1 /= 20
            } else {
                b2 /= 20
            }
        }
        return new Colour(
            (b1 * x.r + b2 * y.r) / (b1 + b2),
            (b1 * x.g + b2 * y.g) / (b1 + b2),
            (b1 * x.b + b2 * y.b) / (b1 + b2))
    }
}

var pointTypes = {
    power: 0,
    conductor: 1
}
class Point{
    constructor(p, type, constColour_){
        this.p = p;
        this.type = type
        this.colour = new Colour(255,255,255)
        this.connections = 0
        this.constColour = constColour_
        this.elem = document.createElement("DIV")
        this.elem.className = "point"
        document.getElementById("whole").appendChild(this.elem)
    }

    draw(){
        if(this.constColour != undefined && this.type == pointTypes.power){
            this.colour.val = this.constColour.val
        }
        if(holdAlt){
            this.elem.className = "point glow" 
        } else {
            this.elem.className = "point"
        }
        this.elem.style.left = this.p.x + "px"
        this.elem.style.top = this.p.y + "px"
        this.elem.style.backgroundColor = this.colour.value()
        switch(this.type){
            case pointTypes.power: this.elem.style.transform = "scale(2)"; break;
            default: break;
        }
    }
}

var drawPoints = function(){
    points = points.map(function(a){var b = a; b.connections = 0; return b})
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for(var i = 0; i < points.length; i++){
        for(var e = i + 1; e < points.length; e++){
            if(distance(points[e].p, points[i].p) < 300){
                points[e].connections++
                points[i].connections++
                points[e].colour = add(points[e].colour, points[i].colour,distance(points[e].p, points[i].p) * 4 * Math.log(80 * points[i].connections),1)
                points[i].colour = add(points[e].colour, points[i].colour,1,distance(points[e].p, points[i].p) * 4 * Math.log(80 * points[e].connections))
                ctx.beginPath();
                ctx.moveTo(points[e].p.x + 5,points[e].p.y + 5);
                ctx.lineTo(points[i].p.x + 5,points[i].p.y + 5);
                ctx.strokeStyle = add(points[e].colour, points[i].colour).value()
                ctx.stroke();
            }
        }
        points[i].draw()
    }
}

var canvas = document.getElementById("canvas")
canvas.width = $(window).width()
canvas.height = $(window).height()
var ctx = canvas.getContext("2d")
ctx.lineWidth = "2"

var getRandomColour = function(){
    return new Colour(Math.random() * 255,Math.random() * 255,Math.random() * 255)
}

var genRandomPoint = function(type,amt,constColour){
    var e = 1;
    var r = pointTypes.conductor
    if(amt != undefined){
        e = amt
    }
    if(type != undefined){
        r = type
    }
    for(var i = 0; i < e; i++){
        if(constColour != undefined){
            var final = getRandomColour()
            while(final.hsl().s > .9){
                final = getRandomColour()
            }
            constColour = final 
        }
        points.push(new Point({x: 10 + Math.random() * ($(window).width() - 20), y: 10 + Math.random() * ($(window).height() - 20)}, type, constColour))
    }
}

var points = []
genRandomPoint(pointTypes.power,2,true)
drawPoints()

setInterval(function(){
    drawPoints()
},1)