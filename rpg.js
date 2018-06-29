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
var animating = false

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
    if (event.keyCode > 48 && event.keyCode < 53) {
        var x = event.keyCode - 49
        if(party[active].moves.length > x){
            party[active].attack(x)
        }
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

var spawnWarning = function(reset){
    $("#warning").stop(true,true)
    if(reset){
        document.getElementById("warning").style.opacity = "0"
    } else {
        document.getElementById("warning").style.opacity = "1"
        $("#warning").animate({
            'opacity': "0"
         }, 7500)
    }
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
var styles = {straight: "straight", straight_pierce: "straight_pierce", all_opponents: "all_opponents", all_same: "all_same", self: "self"}

class Move{
    constructor(name_, description_, power_, tech_, speed_, style_, element_){
        this.name = name_
        this.description = description_
        this.power = power_
        this.tech = tech_
        this.speed = speed_
        this.element = element_
        this.style = style_

        this.dataElem = document.getElementById("move_data_temp").content.cloneNode(true).querySelector("div")
        this.updateData()
    }
    
    updateData(){
        this.dataElem.getElementsByClassName("move_name")[0].innerHTML = this.name
        this.dataElem.getElementsByClassName("move_description")[0].innerHTML = this.description
        this.dataElem.getElementsByClassName("move_icon")[0].getElementsByTagName("img")[0].src = "rpg/" + this.style + ".png"
        this.dataElem.getElementsByClassName("move_power")[0].getElementsByTagName("span")[0].innerHTML = this.power
        this.dataElem.getElementsByClassName("move_tech")[0].getElementsByTagName("span")[0].innerHTML = this.tech
        this.dataElem.getElementsByClassName("move_speed")[0].getElementsByTagName("span")[0].innerHTML = this.speed
        this.dataElem.getElementsByClassName("move_element")[0].getElementsByTagName("img")[0].src = "rpg/move_element_" + this.element + ".png"

        if(party != undefined && party[active] != undefined){
            var position = party[active].moves.map(a => a.move).indexOf(this)
            this.dataElem.onclick = function(){
                party[active].attack(position)
            }
        }
        return this.dataElem
    }

    target(unit){
        var final = [];
        var badMult = 1;
        if(!unit.alignment){
            badMult = -1
        }
        switch(this.style){
            case styles.straight:
            var exit = false
            for(var i = unit.coords.x; i < board.length && i > -1 && !exit; i += (1 * badMult)){
                if(getBoard(i, unit.coords.y) != undefined && getBoard(i, unit.coords.y).alignment != unit.alignment){
                    final.push({x: i, y: unit.coords.y})
                    exit = true
                }
            } 
            break;
            
            case styles.straight_pierce:
            for(var i = unit.coords.x; i < board.length && i > -1; i += (1 * badMult)){
                if(getBoard(i, unit.coords.y) != undefined && getBoard(i, unit.coords.y).alignment != unit.alignment){
                    final.push({x: i, y: unit.coords.y})
                }
            } 
            break;
            
            case styles.all_opponents:
            if(unit.alignment){
                for(var i = 0; i < enemy_group.length; i++){
                    final.push(enemy_group[i].coords)
                }
            } else {
                for(var i = 0; i < party.length; i++){
                    final.push(party[i].coords)
                }
            }
            break;

            case styles.all_same:
            if(unit.alignment){
                for(var i = 0; i < party.length; i++){
                    final.push(party[i].coords)
                }
            } else {
                for(var i = 0; i < enemy_group.length; i++){
                    final.push(enemy_group[i].coords)
                }
            }
            break;

            case styles.self:
            final.push(unit.coords)
            break;
        }
        return final
    }

    attack(unit){
        var targets = this.target(unit)
        for(var i = 0; i < targets.length; i++){
            var target = getBoard(targets[i].x, targets[i].y)
            this.hit(unit, target)
        }
    }

    hit(unit, target){
        var damage = this.power
        if(unit.alignment){
            damage += unit.classes[unit.activeClass].level
        } else {
            damage /= 5
        }
        var bullet = document.createElement("DIV")
        bullet.className = "bullet"
        bullet.style.left = unit.spriteElem.getBoundingClientRect().left + 55 + "px"
        bullet.style.top = unit.spriteElem.getBoundingClientRect().top + 45 + "px"
        document.body.appendChild(bullet)
        $(bullet).animate({
           'left': target.spriteElem.getBoundingClientRect().left + "px"
        }, 250, function(){
            target.health -= damage
            target.hitAnimation()
            $(this).remove()
        })
        target.updateCondition()
        updateData()
        updateBoard()
    }
}

var moves = {
    shot: new Move("Shot", "Damage 1 ahead", 30, 0, 30, styles.straight, "Neutral"),
    beam: new Move("Multi-Shot", "Damage all ahead", 10, 5, 30, styles.straight_pierce, "Neutral")
}

class Unit{
    constructor(name_, alignment_, class_, moves_){
        this.name = name_
        this.alignment = alignment_;

        this.experience = Math.random() * 100;
        this.inspiration = Math.random() * 100;
        
        this.stats = {
            maxHealth: Math.random() * 100 + 100,
            maxTech: Math.random() * 100 + 100
        }

        this.moves = []
        for(var i = 0; i < moves_.length; i++){
            this.moves.push({move: moves_[i], level: 1, position: i, preview: false})
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
                this.classes.push({class: class_[i], level: Math.ceil(Math.random() * 10)})
            }
            this.activeClass = Math.floor(Math.random() * this.classes.length);
            //this.spriteElem.src = "rpg/ally_sprite_" + name + ".gif"
            this.spriteElem.src = "rpg/ally_sprite_" + "bean" + ".gif"
        } else {
            this.dataElem = document.getElementById("unit_data_temp_enemy").content.cloneNode(true).querySelector("div")
            this.spriteElem.src = "rpg/enemy_sprite_" + toFile(this.name) + ".gif"
            this.speed = 30 * Math.random();
        }
        this.dataElem.onclick = function(){
            var temp = party.map(function(a){return a.dataElem}).indexOf(this)
            if(temp != undefined){
                active = temp
                party.forEach(function(a,b){if(b != active){a.dataElem.style.transform = "translateX(0)"}})
                party[active].dataElem.style.transform = "translateX(20px)"
            }
            updateBoard()
        }
        this.spriteElem.onclick = function(){
            var temp = party.map(function(a){return a.spriteElem}).indexOf(this)
            if(temp != undefined){
                active = temp
                party.forEach(function(a,b){if(b != active){a.dataElem.style.transform = "translateX(0)"}})
                party[active].dataElem.style.transform = "translateX(20px)"
            }
        }
        
        this.updateCondition()
        this.updateData()
    }

    updateData(){
        this.updateCondition()
        var partyPosition = party.indexOf(this)
        if(this.alignment && partyPosition > -1){
            this.spriteElem.src = "rpg/ally_sprite_" + "bean" + "_" + partyPosition + ".gif"
        }

        this.dataElem.getElementsByClassName("unit_health_bar")[0].getElementsByTagName("div")[0].style.width = (this.health / this.stats.maxHealth * 100) + "%"
        this.dataElem.getElementsByClassName("unit_health_number")[0].innerHTML = Math.ceil(this.health) + " / " + Math.ceil(this.stats.maxHealth)

        if(this.alignment){
            this.dataElem.getElementsByClassName("unit_tech_bar")[0].getElementsByTagName("div")[0].style.width = (this.tech / this.stats.maxTech * 100) + "%"
            this.dataElem.getElementsByClassName("unit_tech_number")[0].innerHTML = Math.ceil(this.tech) + " / " + Math.ceil(this.stats.maxTech)
            this.dataElem.getElementsByClassName("unit_speed_bar")[0].getElementsByTagName("div")[0].style.width = (this.speed) + "%"
            this.dataElem.getElementsByClassName("unit_speed_number")[0].innerHTML = Math.ceil(this.speed)
        }
        
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
        return this.dataElem
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
        if(this.health <= 0){
            this.health = 0
        }
        if(this.tech <= 0){
            this.tech = 0
        }
        if(this.speed <= 0){
            this.speed = 0
        }
        if(this.health > this.stats.maxHealth){
            this.health = this.stats.maxHealth
        }
        if(this.tech > this.stats.maxTech){
            this.tech = this.stats.maxTech
        }
    }

    copy(){
        var final = copyInstance(this)
        final.dataElem = this.dataElem.cloneNode(true)
        final.spriteElem = this.spriteElem.cloneNode(true)
        return final
    }

    deathCheck(){
        if(this.health < 1){
            genExplosion(this.spriteElem.getBoundingClientRect().left + 50, this.spriteElem.getBoundingClientRect().top + 50)
            if(this.alignment){
                party.splice(party.indexOf(this),1)
            } else {
                enemy_group.splice(enemy_group.indexOf(this),1)
            }
            updateBoard()
        }
    }

    hitAnimation(){
        animating = true;
        this.spriteElem.removeAttribute("hit")
        if(this.alignment){
            this.spriteElem.setAttribute("hit", "left")
        } else{
            this.spriteElem.setAttribute("hit", "right")
        }
        var temp = this
        setTimeout(function(){
            animating = false
            clearAnimation()
            temp.deathCheck()
        }, 800)
    }

    attack(move){
        if(this.tech >= this.moves[move].move.tech && this.speed >= this.moves[move].move.speed){
            if(this.alignment){
                spawnWarning(true)
            }
        } else {
            if(this.alignment){
                spawnWarning(false)
            }
            this.moves[move].preview = false
            return;
        }
        if(!animating && (!this.alignment || this.moves[move].preview)){
            this.tech -= this.moves[move].move.tech
            this.speed -= this.moves[move].move.speed
            this.moves[move].move.attack(this)
            this.moves[move].preview = false
            spawnWarning(true)
        } else if(!animating){
            for(var i = 0; i < this.moves.length; i++){
                this.moves[i].preview = false
            }
            this.moves[move].preview = true;
            preview(this.moves[move].move.target(this))
        }
    }
}

var allies = {
    jasper: new Unit("Jasper", true,   ["Artist", "Writer", "Admin"]                               ,[moves.shot, moves.beam]),
    tucker: new Unit("Tucker", true,   ["Artist", "Writer", "Animator", "Voice Actor", "Fortniter"],[moves.shot, moves.beam]),
    mason: new Unit("Mason", true,     ["Artist", "Writer", "Student", "Teacher", "Fortniter"]     ,[moves.shot, moves.beam]),
    sam: new Unit("Sam", true,         ["Artist", "Baller"]                                        ,[moves.shot, moves.beam]),
    bean: new Unit("Bean", true,       ["Artist", "Programmer", "Spriter"]                         ,[moves.beam, moves.shot]),
    hayden: new Unit("Hayden", true,   ["Artist", "Student", "Pro Smasher"]                        ,[moves.shot, moves.beam]),
    lorenzo: new Unit("Lorenzo", true, ["Artist", "Programmer", "Animator", "Spriter", "Musician"] ,[moves.shot, moves.beam]),
    nick: new Unit("Nick", true,       ["Artist", "Spriter", "Musician", "Programmer"]             ,[moves.shot, moves.beam]),
    rick: new Unit("Rick", true,       ["Artist", "Spriter"]                                       ,[moves.shot, moves.beam]),
    paige: new Unit("Paige", true,     ["Artist", "Spriter", "Programmer"]                         ,[moves.shot, moves.beam])
}

var enemies = {
    met: new Unit("Met", false,[],[moves.shot]),
    meta: new Unit("Met Alpha", false,[],[moves.shot]),
    metb: new Unit("Met Beta", false,[],[moves.shot])
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
    document.getElementById("ally_data_holder").appendChild(y.dataElem)
    party.push(y)
    updateData()
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
                party[active].coords = {x: Number(tC.x), y: Number(tC.y)};
                party[active].moves.forEach(a => a.preview = false)
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
            board[i][e].innerHTML = ""
        }
    }
    for(var i = 0; i < party.length; i++){
        var tC = party[i].coords
        if(tC.x != undefined && tC.y != undefined){
            board[tC.x][tC.y].innerHTML = ""
            board[tC.x][tC.y].appendChild(party[i].spriteElem)
        }
        party[i].spriteElem.style.filter = ""
    }
    for(var i = 0; i < enemy_group.length; i++){
        var tC = enemy_group[i].coords
        if(tC.x != undefined && tC.y != undefined){
            board[tC.x][tC.y].innerHTML = ""
            board[tC.x][tC.y].appendChild(enemy_group[i].spriteElem)
        }
    }
    document.getElementById("move_data_holder").innerHTML = ""
    for(var i = 0; i < party[active].moves.length; i++){
        document.getElementById("move_data_holder").appendChild(party[active].moves[i].move.updateData())
     }
    party[active].spriteElem.style.filter += " drop-shadow(0px 0px 5px white) drop-shadow(0px 0px 5px white)"
    updateData()
}

var updateData = function(){
    document.getElementById("ally_data_holder").innerHTML = ""
    document.getElementById("enemy_data_holder").innerHTML = ""
    for(var i = 0; i < party.length; i++){
        document.getElementById("ally_data_holder").appendChild(party[i].updateData())
    }
    for(var i = 0; i < enemy_group.length; i++){
        document.getElementById("enemy_data_holder").appendChild(enemy_group[i].updateData())
    }
}

var getBoard = function(x,y){
    for(var i = 0; i < party.length; i++){
        if(party[i].coords.x == x && party[i].coords.y == y){
            return party[i]
        }
    }
    for(var i = 0; i < enemy_group.length; i++){
        if(enemy_group[i].coords.x == x && enemy_group[i].coords.y == y){
            return enemy_group[i]
        }
    }
    return undefined
}

var preview = function(target){
    updateBoard()
    var hit = board.map(a => a.filter(b => target.some(c => c.x == b.getAttribute("x") && c.y == b.getAttribute("y"))))
    hit.forEach(a => a.forEach(b => b.setAttribute("move", "true")))
}

var clearAnimation = function(){
    for(var i = 0; i < party.length; i++){
        party[i].spriteElem.removeAttribute("hit")
    }
    for(var i = 0; i < enemy_group.length; i++){
        enemy_group[i].spriteElem.removeAttribute("hit")
    }
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


var bArray = [];
var sArray = [2,3]
$(document).ready(function($){
    for (var i = sArray.sort().reverse()[0] - 1; i < 11 - sArray.sort().reverse()[0]; i++) {
        bArray.push(i);
    }
})

setInterval(function(){
    var size = randomValue(sArray)
    $('.unit_experience_bar').append('<div class="individual-bubble" style="bottom:0%; left: ' + randomValue(bArray) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');
    $('.unit_inspiration_bar').append('<div class="individual-bubble" style="bottom:0%; left: ' + randomValue(bArray) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');
    $('.individual-bubble').animate({
       'bottom': '97%',
        'opacity' : '-=0.9'
    }, 4000, function(){
        $(this).remove()
    });
}, 450)

setInterval(function(){
    for(var i = 0; i < party.length; i++){
        party[i].speed += .08
        if(party[i].speed > 100){
            party[i].speed = 100
            party[i].tech += .02
            if(party[i].tech > party[i].stats.maxTech){
                party[i].tech = party[i].stats.maxTech
            }
        }
    }
    for(var i = 0; i < enemy_group.length; i++){
        enemy_group[i].speed += .02 + (.05 * Math.random())
        enemy_group[i].attack(Math.floor(Math.random() * enemy_group[i].moves.length))
        if(enemy_group[i].speed > 100){
            enemy_group[i].speed = 100
            enemy_group[i].tech += .1
            if(enemy_group[i].tech > enemy_group[i].stats.maxTech){
                enemy_group[i].tech = enemy_group[i].stats.maxTech
            }
        }
    }
    updateData()
}, 10)

// https://codepen.io/alexlyul/pen/ZoxdpR?page=1&
let flakes = [], curTime = 0;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    clear()
  curTime++;
  for(let i = 0; i < flakes.length; i++) {
    flakes[i].pos.add(flakes[i].vel);
    flakes[i].size--;
    if(flakes[i].size > 0) {
      stroke(flakes[i].color);
      strokeWeight(flakes[i].size);
      point(flakes[i].pos.x, flakes[i].pos.y);
    } else {
      flakes.splice(i, 1);
    }
  }
}

function genExplosion(x, y) {
  let i = 25;
  while(i--) {
    flakes.push({
      color: color(color('hsl(' + floor(random(349)) + ', 100%, 50%)')),
      pos: createVector(x, y),
      vel: p5.Vector.fromAngle(random(2*PI)).mult(random(10)),
      size: random(50)
    });
  }
}