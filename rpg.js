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
    }
    if(e.which == 3){
        //
    }
}
document.onmouseup = function() {
    mouseDown = false;
}     

var active = 0
var party = [];
var enemy_group = [];

var holdCtrl = false;
var holdShift = false;
var holdSpace = false;
var holdAlt = false;
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 17) {
        holdCtrl = true;
    }
    if (event.keyCode == 16) {
        holdShift = true;
    }
    if (event.keyCode == 32) {
        holdSpace = true;
    }
    if (event.keyCode == 66) {
        holdAlt = true;
    }
    if (event.keyCode == 13) {
        //
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

var randomValue = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

var statuses = ["Poison", "ATK"]

class Unit{
    constructor(name_, alignment_, class_){
        this.name = name_
        this.alignment = alignment_;

        this.experience = Math.random() * 100;
        this.inspiration = Math.random() * 100;
        
        this.stats = {
            maxHealth: Math.random() * 300,
            maxTech: Math.random() * 300
        }

        this.health = this.stats.maxHealth
        this.tech = this.stats.maxTech
        this.speed = Math.random() * 20 + 40

        this.statuses = []
        while(Math.random() > .15 && this.statuses.length < 4){
            this.statuses.push({
                type: randomValue(statuses),
                modifier: Math.ceil(Math.random() * 15)
            })
        }

        this.recruited = false
        this.coords = {x: undefined, y: undefined}

        this.spriteElem = document.createElement("IMG")
        this.spriteElem.className = "sprite_ally"
        if(alignment_){
            this.dataElem = document.getElementById("unit_data_temp").content.cloneNode(true).querySelector("div")
            this.classes = []
            for(var i in class_){
                this.classes.push({class: class_[i], level: Math.ceil(Math.random() * 100)})
            }
            this.activeClass = Math.floor(Math.random() * this.classes.length);
            //this.spriteElem.src = "rpg/ally_sprite_" + name + ".gif"
            this.spriteElem.src = "rpg/ally_sprite_" + "bean" + ".gif"
        } else {
            this.dataElem = document.getElementById("unit_data_temp_enemy").content.cloneNode(true).querySelector("div")
            this.spriteElem.src = "rpg/enemy_sprite_" + toFile(this.name) + ".gif"
            this.speed = 0;
        }
        this.dataElem.onclick = function(){
            var temp = party.map(function(a){return a.dataElem}).indexOf(this)
            if(temp != undefined){
                active = temp
            }
            updateBoard()
        }
        this.spriteElem.onclick = function(){
            var temp = party.map(function(a){return a.spriteElem}).indexOf(this)
            if(temp != undefined){
                active = temp
            }
        }
        
        this.updateCondition()
        this.updateData()
    }

    updateData(){
        var partyPosition = party.indexOf(this)
        if(this.alignment && partyPosition > -1){
            this.spriteElem.src = "rpg/ally_sprite_" + "bean" + "_" + partyPosition + ".gif"
        }
        this.spriteElem.removeAttribute("hit")

        this.dataElem.getElementsByClassName("unit_health_bar")[0].getElementsByTagName("div")[0].style.width = (this.health / this.stats.maxHealth * 100) + "%"
        this.dataElem.getElementsByClassName("unit_tech_bar")[0].getElementsByTagName("div")[0].style.width = (this.tech / this.stats.maxTech * 100) + "%"
        this.dataElem.getElementsByClassName("unit_speed_bar")[0].getElementsByTagName("div")[0].style.width = (this.speed) + "%"

        this.dataElem.getElementsByClassName("unit_health_number")[0].innerHTML = Math.ceil(this.health) + " / " + Math.ceil(this.stats.maxHealth)
        this.dataElem.getElementsByClassName("unit_tech_number")[0].innerHTML = Math.ceil(this.tech) + " / " + Math.ceil(this.stats.maxTech)
        this.dataElem.getElementsByClassName("unit_speed_number")[0].innerHTML = Math.ceil(this.speed)
        
        this.dataElem.getElementsByClassName("unit_status")[0].innerHTML = ""
        for(var i = 0; i < this.statuses.length; i++){
            var newStatus = document.createElement("div")
            newStatus.className = "status_" + toFile(this.statuses[i].type)
            newStatus.innerHTML = this.statuses[i].type
            if(this.statuses[i].type == "ATK"){
                newStatus.innerHTML += "+" + this.statuses[i].modifier   
            }
            this.dataElem.getElementsByClassName("unit_status")[0].appendChild(newStatus)
        }

        this.dataElem.getElementsByClassName("unit_name")[0].innerHTML = this.name
        if(this.alignment){
            this.dataElem.getElementsByClassName("unit_level")[0].innerHTML = "(Lvl. " + this.classes[this.activeClass].level + " " + this.classes[this.activeClass].class + ")"
            this.dataElem.getElementsByClassName("unit_experience_bar")[0].style.height = this.experience + "%"
            this.dataElem.getElementsByClassName("unit_inspiration_bar")[0].style.height = this.inspiration + "%"
            this.dataElem.getElementsByClassName("unit_portrait")[0].getElementsByTagName("img")[0].src = "rpg/ally_portrait_" + toFile(this.name) + ".png"
        } else {
            this.dataElem.getElementsByClassName("unit_portrait")[0].getElementsByTagName("img")[0].src = "rpg/enemy_portrait_" + toFile(this.name) + ".png"
        }
    }

    updateCondition(){
        for(var i = 0; i < this.statuses.length; i++){
            for(var e = i; e < this.statuses.length; e++){
                if(this.statuses[e] != undefined && this.statuses[e].type == this.statuses[i].type){
                    this.statuses[i].modifier += this.statuses[e].modifier
                    this.statuses.splice(e,1)
                }
            }
        }
    }

    copy(){
        var final = copyInstance(this)
        final.dataElem = this.dataElem.cloneNode(true)
        final.spriteElem = this.spriteElem.cloneNode(true)
        return final
    }
}

var allies = {
    jasper: new Unit("Jasper", true,   ["Artist", "Writer", "Admin"]),
    tucker: new Unit("Tucker", true,   ["Artist", "Writer", "Animator", "Voice Actor", "Fortniter"]),
    mason: new Unit("Mason", true,     ["Artist", "Writer", "Student", "Teacher", "Fortniter"]),
    sam: new Unit("Sam", true,         ["Artist", "Baller"]),
    bean: new Unit("Bean", true,       ["Artist", "Programmer", "Spriter"]),
    hayden: new Unit("Hayden", true,   ["Artist", "Student", "Pro Smasher"]),
    lorenzo: new Unit("Lorenzo", true, ["Artist", "Programmer", "Animator", "Spriter", "Musician"]),
    nick: new Unit("Nick", true,       ["Artist", "Spriter", "Musician", "Programmer"]),
    rick: new Unit("Rick", true,       ["Artist", "Spriter"]),
    paige: new Unit("Paige", true,     ["Artist", "Spriter", "Programmer"])
}

var enemies = {
    met: new Unit("Met", false),
    meta: new Unit("Met Alpha", false),
    metb: new Unit("Met Beta", false)
}

var recruit = function(person){
    var x = Object.keys(allies)
    var y = allies[x[Math.floor(Math.random() * x.length)]]
    var z = 0
    if(person != undefined){
        y = allies[person]
    }
    while(y.recruited && z < 10){
        y = allies[x[Math.floor(Math.random() * x.length)]]
        z++
    }
    if(z > 8){
        return;
    }
    y.recruited = true
    document.body.appendChild(y.dataElem)
    party.push(y)
    y.updateData()
}

var spawn = function(person){
    var x = Object.keys(enemies)
    var y = enemies[x[Math.floor(Math.random() * x.length)]]
    if(person != undefined){
        y = enemies[person]
    }
    enemy_group.push(y.copy())
    document.getElementById("enemy_data_holder").appendChild(enemy_group[enemy_group.length - 1].dataElem)
}

var board = Array(6)
for(var i = 0; i < 6; i++){
     board[i] = []
}
for(var i = 0; i < 3; i++){
    var trow = document.createElement("TR")
    for(var e = 0; e < 6; e++){
        board[e][i] = document.createElement("TD")
        if(e < 3){
            board[e][i].className = "platform_ally"
        } else {
            board[e][i].className = "platform_enemy"
        }
        board[e][i].setAttribute("x", e)
        board[e][i].setAttribute("y", i)
        board[e][i].onclick = function(){
            var tC = {x: this.getAttribute("x"), y: this.getAttribute("y")}
            if(getBoard(tC.x, tC.y) == undefined && tC.x < 3){
                party[active].coords = {x: tC.x, y: tC.y};
            }
            updateBoard()
        }
        trow.appendChild(board[e][i])
    }   
    document.getElementById("battle").appendChild(trow)
}

var updateBoard = function(){
    for(var i = 0; i < board.length; i++){
        for(var e = 0; e < board[i].length; e++){
            board[i][e].setAttribute("move", "false")
        }
    }
    for(var i = 0; i < party.length; i++){
        var tC = party[i].coords
        if(tC.x != undefined && tC.y != undefined){
            board[tC.x][tC.y].innerHTML = ""
            board[tC.x][tC.y].appendChild(party[i].spriteElem)
        }
        party[i].spriteElem.style.filter = ""
        party[i].updateData()
    }
    for(var i = 0; i < enemy_group.length; i++){
        var tC = enemy_group[i].coords
        if(tC.x != undefined && tC.y != undefined){
            board[tC.x][tC.y].innerHTML = ""
            board[tC.x][tC.y].appendChild(enemy_group[i].spriteElem)
        }
        enemy_group[i].updateData()
    }
    party[active].spriteElem.style.filter += " drop-shadow(0px 0px 5px white) drop-shadow(0px 0px 5px white)"
}

var updateData = function(){
    for(var i = 0; i < party.length; i++){
        party[i].updateData()
    }
    for(var i = 0; i < enemy_group.length; i++){
        enemy_group[i].updateData()
    }
}

var getBoard = function(x,y){
    for(var i = 0; i < party.length; i++){
        if(party[i].coords.x == x && party[i].coords.y == y){
            return party[i]
        }
    }
    return undefined
}

var preview = function(){
    board.map(function(a){return a.filter(function(a){return a.getAttribute("x") > party[active].coords.x && a.getAttribute("y") == party[active].coords.y})}).forEach(function(a){a.forEach(function(b){b.setAttribute("move", "true")})})
}

var attack = function(){
    updateBoard()
    board.map(function(a){return a.filter(function(a){return a.getAttribute("x") > party[active].coords.x && a.getAttribute("y") == party[active].coords.y})}).forEach(function(a){a.forEach(function(b){if(b.childNodes[0] != undefined){b.childNodes[0].setAttribute("hit","right")}})})
}


recruit("bean"); recruit(); recruit(); 
party[0].coords = {x: 0, y: 0} 
party[1].coords = {x: 0, y: 1} 
party[2].coords = {x: 0, y: 2}
spawn(); spawn(); spawn(); spawn(); spawn(); spawn();
enemy_group[0].coords = {x: 5, y: 0}
enemy_group[1].coords = {x: 5, y: 1}
enemy_group[2].coords = {x: 5, y: 2}
enemy_group[3].coords = {x: 4, y: 1}
enemy_group[4].coords = {x: 4, y: 2}
enemy_group[5].coords = {x: 3, y: 2}
updateBoard()