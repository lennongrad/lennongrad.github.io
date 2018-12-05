
var doExplosions = true

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
mouse = {x: 0, y: 0}
document.onmousemove = function(event){
    mouse = {x: event.clientX, y: event.clientY};
}

if(window.mobilecheck()){
    doExplosions = false
}

var resize = function(){
    document.getElementById("ally_data_holder").style.transform = ""
    document.getElementById("enemy_data_holder").style.transform = ""
    document.getElementById("move_data_holder").style.transform = ""
    if((document.getElementById("move_data_holder").getBoundingClientRect().height / $(window).height()) > .15){
        document.getElementById("move_data_holder").style.transform = "scale(" + (.15 / (document.getElementById("move_data_holder").getBoundingClientRect().height / $(window).height())) + ")"
    }
    document.getElementById("ally_data_holder").style.transform = "scale(" + (.25 / (document.getElementById("ally_data_holder").getBoundingClientRect().width / $(window).width())) + ")"
    document.getElementById("enemy_data_holder").style.transform = "translateX(50%) scale(" + (.2 / (document.getElementById("enemy_data_holder").getBoundingClientRect().width / $(window).width())) + ")"
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

var active = 0
var enemyActive = -1
var battleActive = false
var cash = 0
var party = [];
var enemy_group = [];
var animating = false

var forEach = function(obj,func){
    Object.entries(obj).map(a => a[1]).forEach(func) 
}

var menuSections = {
    battle_left: document.getElementById("battle_menu_left"),
    battle_right: document.getElementById("battle_menu_right"),
    party_right: document.getElementById("party_menu_right"),
    members_right: document.getElementById("members_menu_right"),
    classes_right: document.getElementById("classes_menu_right"),
    moves_right: document.getElementById("moves_menu_right")
}

var activeLeft  = menuSections.battle_left
var activeRight = menuSections.battle_right

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
    if(party.length < 1){
        return;
    }
    switch(event.keyCode){
        case keys.characterA: active = 0; updateBoard(); updateData(); break;
        case keys.characterB: active = 1; updateBoard(); updateData(); break;
        case keys.characterC: active = 2; updateBoard(); updateData(); break;
        case keys.move1: 
            if(party[active].moves.length > 0){
                party[active].attack(0)
            }; break;
        case keys.move2: 
            if(party[active].moves.length > 1){
                party[active].attack(1)
            }; break;
        case keys.move3: 
        if(party[active].moves.length > 2){
            party[active].attack(2)
        }; break;
        case keys.move4: 
            if(party[active].moves.length > 3){
                party[active].attack(3)
            }; break;
        case keys.moveUp:
            party[active].move({x: party[active].coords.x, y: party[active].coords.y - 1}); break;
        case keys.moveDown:
        party[active].move({x: party[active].coords.x, y: party[active].coords.y + 1}); break;
        case keys.moveLeft:
            party[active].move({x: party[active].coords.x - 1, y: party[active].coords.y}); break;
        case keys.moveRight:
        party[active].move({x: party[active].coords.x + 1, y: party[active].coords.y}); break;
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

var intro = function(){
    animating = true
    document.getElementById("battle_menu_right_start").innerHTML = "CONTINUE"
    $(".sprite_ally").css("opacity", 0)
    $("#battle").css("opacity", 0)
    $("#battle").animate({
        opacity:1
    }, 300)
    $(".sprite_ally").animate({
        opacity: 1
    }, 1500, function(){
        animating = false
        battleActive = true
        clearAnimation()
    })
    for(var i = 0; i < party.length; i++){
        party[i].alive = true
        party[i].speed = 100
        party[i].health = party[i].stats.maxHealth
        var coords = {x: Math.floor(Math.random() * board.length / 2), y: Math.floor(Math.random() * board[0].length) }
        while(getBoard(coords.x, coords.y) != undefined){
            coords = {x: Math.floor(Math.random() * board.length / 2), y: Math.floor(Math.random() * board[0].length) }
        }
        party[i].coords = coords        
    }
    enemy_group.forEach(a => a.speed = 0)
    updateDataReplace()
    updateBoard()
}

var newMessage = function(msg){
    var full = false
    if([].slice.call(document.getElementById("message_holder").childNodes[1].childNodes).filter(a => a.nodeName == "SPAN").length > 40){
        full = true
        $([].slice.call(document.getElementById("message_holder").childNodes[1].childNodes).filter(a => a.nodeName == "SPAN")[0]).remove()
    }
    $(document.getElementById("message_holder").childNodes[1]).append("<span>" + msg + "</span>")
    document.getElementById("message_holder").scrollTop = 600
    return full
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

for(var i = 0; i < 101; i += .75){
    $("#menu").append("<div class='triangle' style='left:" + (i - .5) + "vw'></div>")
}

var statuses = ["Poison", "Burn", "Depressed", "Dizzy", "Shocked", "STR+", "STR-", "VIT+", "VIT-", "STM+", "STM-", "AGI+", "AGI-"]
var styles = {straight: "straight", straight_pierce: "straight_pierce", straight_rows: "straight_rows", all_opponents: "all_opponents", all_same: "all_same", self: "self"}

class Move{
    constructor(name_, description_, power_, tech_, speed_, style_, element_, properties_, animation_, effect_){
        this.name = name_
        this.description = description_
        this.power = power_
        this.tech = tech_
        this.speed = speed_
        this.element = element_
        this.style = style_
        this.properties = properties_
        this.animation = animation_
        this.effect = effect_

        this.dataElem = document.getElementById("move_data_temp").content.cloneNode(true).querySelector("div")
        this.menuElem = document.getElementById("move_menu_temp").content.cloneNode(true).querySelector("tr")
        this.updateData()
    }
    
    updateData(){
        this.dataElem.getElementsByClassName("move_name")[0].innerHTML = this.name
        this.dataElem.getElementsByClassName("move_description")[0].innerHTML = this.description
        this.dataElem.getElementsByClassName("move_icon")[0].getElementsByTagName("img")[0].src = "rpg/" + this.style + ".png"
        this.dataElem.getElementsByClassName("move_power")[0].getElementsByTagName("span")[0].innerHTML = this.power
        this.dataElem.getElementsByClassName("move_tech")[0].getElementsByTagName("span")[0].innerHTML = this.tech
        this.dataElem.getElementsByClassName("move_speed")[0].getElementsByTagName("span")[0].innerHTML = this.speed
        this.dataElem.getElementsByClassName("move_element")[0].getElementsByTagName("img")[0].src = "rpg/move_element_" + toFile(this.element) + ".png"

        this.menuElem.getElementsByTagName("TD")[0].innerHTML = this.name
        this.menuElem.getElementsByTagName("TD")[1].innerHTML = this.description
        this.menuElem.getElementsByTagName("TD")[2].innerHTML = this.power
        this.menuElem.getElementsByTagName("TD")[3].innerHTML = this.tech
        this.menuElem.getElementsByTagName("TD")[4].innerHTML = this.speed
        this.menuElem.getElementsByTagName("TD")[5].getElementsByTagName("img")[0].src = "rpg/move_element_" + toFile(this.element) + ".png"

        if(party != undefined && party[active] != undefined){
            var position = party[active].moves.map(a => a.move).indexOf(this)
            this.dataElem.onclick = function(){
                party[active].attack(position)
            }
        }
        
        var move = this
        this.dataElem.onmouseover = function(){
            preview(move.target(party[active]))
        }
        this.dataElem.onmouseout = function(){
            updateBoard()
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
            
            case styles.straight_rows:
            var exit = false
            for(var e = 0; e < board[0].length; e++){
                exit = false;
                for(var i = unit.coords.x; i < board.length && i > -1 && !exit; i += (1 * badMult)){
                    if(getBoard(i, e) != undefined && getBoard(i, e).alignment != unit.alignment){
                        final.push({x: i, y: e})
                        exit = true
                    }
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
        var exp = 0
        if(targets.length != 0){
            this.effect(unit, targets)
        }
        for(var i = 0; i < targets.length; i++){
            var target = getBoard(targets[i].x, targets[i].y)
            exp += this.hit(unit, target, targets.length)
        }
        return {targets: targets.length > 0, exp: exp}
    }

    hit(unit, target, targetLength){
        var experience = 0
        if(unit == undefined || target == undefined){
            return
        }
        unit.updateStats()
        target.updateStats()
        var damage = this.power
        if(this.properties.heal != true){
            damage *= unit.stats.strength / target.stats.vitality
        }
        if(this.properties.split){
            damage /= targetLength
        }
        if(target.alignment && this.properties.heal != true){
            damage /= 4
        }
        this.animation(unit, target, damage)
        experience += target.classes[target.activeClass].level / unit.classes[unit.activeClass].level * 100 * (damage / target.stats.maxHealth)
        target.updateCondition()
        updateData()
        updateBoard()
        return experience
    }
}

var moves = {
    shot: new Move("Shot", "Damage 1 ahead", 30, 0, 20, styles.straight, "Neutral", {}, function(unit, target, damage){
        var bullet = document.createElement("DIV")
        bullet.className = "bullet"
        bullet.style.left = unit.spriteElem.getBoundingClientRect().left + 55 + "px"
        bullet.style.top = unit.spriteElem.getBoundingClientRect().top + 45 + "px"
        document.body.appendChild(bullet)
        var distance = Math.abs(target.spriteElem.getBoundingClientRect().left - unit.spriteElem.getBoundingClientRect().left)
        $(bullet).animate({
           'left': target.spriteElem.getBoundingClientRect().left + "px"
        }, distance / 4, function(){
            target.health -= damage
            target.hitAnimation()
            $(this).remove()
        })
    }, function(){}),
    multishot: new Move("Multi-Shot", "Damage all ahead", 15, 5, 20, styles.straight_rows, "Neutral", {}, function(unit, target, damage){
        var bullet = document.createElement("DIV")
        bullet.className = "bullet"
        bullet.style.left = unit.spriteElem.getBoundingClientRect().left + 55 + "px"
        bullet.style.top = unit.spriteElem.getBoundingClientRect().top + 45 + "px"
        bullet.style.transform = "rotate(" + (getAngle({x: unit.spriteElem.getBoundingClientRect().left, y: unit.spriteElem.getBoundingClientRect().top}, {x: target.spriteElem.getBoundingClientRect().left, y: target.spriteElem.getBoundingClientRect().top}) / Math.PI * 180) + "deg)"
        document.body.appendChild(bullet)
        $(bullet).animate({
            'left': target.spriteElem.getBoundingClientRect().left + "px",
            'top': target.spriteElem.getBoundingClientRect().top + "px"
        }, 250, function(){
            target.health -= damage
            target.hitAnimation()
            $(this).remove()
        })
    }, function(){}),
    poison_needle: new Move("Poison Needle", "Poison 1 ahead", 5, 6, 25, styles.straight, "Earth", {}, function(unit, target, damage){
        var bullet = document.createElement("DIV")
        bullet.className = "bullet poison_bullet"
        bullet.style.left = unit.spriteElem.getBoundingClientRect().left + 55 + "px"
        bullet.style.top = unit.spriteElem.getBoundingClientRect().top + 45 + "px"
        document.body.appendChild(bullet)
        $(bullet).animate({
           'left': target.spriteElem.getBoundingClientRect().left + "px"
        }, 250, function(){
            target.health -= damage
            target.statuses.push({type: "Poison", length: 4000})
            target.hitAnimation()
            $(this).remove()
        })
    }, function(){}),
    sick_burn: new Move("Sick Burn", "Burn 1 ahead", 5, 6, 25, styles.straight, "Fire", {}, function(unit, target, damage){
        var bullet = document.createElement("DIV")
        bullet.className = "bullet burn_bullet"
        bullet.style.left = unit.spriteElem.getBoundingClientRect().left + 55 + "px"
        bullet.style.top = unit.spriteElem.getBoundingClientRect().top + 45 + "px"
        document.body.appendChild(bullet)
        $(bullet).animate({
           'left': target.spriteElem.getBoundingClientRect().left + "px",
           'height': "35px"
        }, 250, function(){
            target.health -= damage
            target.statuses.push({type: "Burn", length: 2500})
            target.hitAnimation()
            $(this).remove()
        })
    }, function(){}),
    power_spark: new Move("Power Spark", "Shock 1 ahead", 5, 6, 25, styles.straight, "Electric", {}, function(unit, target, damage){
        var bullet = document.createElement("DIV")
        bullet.className = "bullet shocked_bullet"
        bullet.style.left = unit.spriteElem.getBoundingClientRect().left + 55 + "px"
        bullet.style.top = unit.spriteElem.getBoundingClientRect().top + 45 + "px"
        document.body.appendChild(bullet)
        $(bullet).animate({
           'left': target.spriteElem.getBoundingClientRect().left + "px"
        }, 250, function(){
            target.health -= damage
            target.statuses.push({type: "Shocked", length: 900})
            target.hitAnimation()
            $(this).remove()
        })
    }, function(){}),
    beam: new Move("Beam", "Damage all ahead (split)", 35, 6, 20, styles.straight_pierce, "Neutral", {split: true}, function(unit, target, damage){
        setTimeout(function(){
            target.health -= damage
            target.hitAnimation()
        }, 150)
    }, function(unit, targets){
        var beam = document.createElement("DIV")
        beam.className = "beam"
        beam.style.left = unit.spriteElem.getBoundingClientRect().left + 75 + "px"
        if(!unit.alignment){
            beam.style.left = unit.spriteElem.getBoundingClientRect().left - ($(window).width() * 2) + "px"
        } 
        beam.style.top = unit.spriteElem.getBoundingClientRect().top + 45 + "px"
        document.body.appendChild(beam)
        setTimeout(function(){
            $(beam).remove()
        }, 500)
    }),
    heal_all: new Move("Heal All", "Heals all Allies", 15, 5, 30, styles.all_same, "Neutral", {heal: true}, function(unit, target, damage){
        var heart = document.createElement("IMG")
        heart.className = "heart"
        heart.src = "rpg/heal_heart.png"
        heart.style.left = target.spriteElem.getBoundingClientRect().left + 30 + "px"
        heart.style.top = target.spriteElem.getBoundingClientRect().top + 45 + "px"
        document.body.appendChild(heart)
        setTimeout(function(){
            target.health += damage
            $(heart).remove()
        }, 1000)
    }, function(){ })
}

class Skill{
    constructor(name_){
        this.name = name_
    }
}

var skills = {
    test: new Skill("test")
}

// example of stats: {maxHealth: 1, maxTech: 1, strength: 1, vitality: 1, stamina: 1, agility: 1}

class Class{
    constructor(name_, stats_, skills_, moves_){
        this.name = name_
        this.stats = stats_
        this.skills = skills_
        this.moves = moves_
    }

    statBonus(level, main, unit){
        var final = {}
        final = {maxHealth: 0, maxTech: 0, strength: 0, vitality: 0, stamina: 0, agility: 0}
        var keys = Object.keys(final)
        var basis = level + Math.floor(level / 10) * 5
        if(main){
            basis *= 1.2
        }
        for(var i = 0; i < keys.length; i++){
            final[keys[i]] = Math.ceil(final[keys[i]] + basis * this.stats[keys[i]])
        }
        return final;
    }
}

var classes = {
    gamer: new Class("Gamer",           
        {maxHealth: .3, maxTech: .65, strength: .5, vitality: .5, stamina: .1, agility: .95}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.beam, unlockLevel: 2}, 
            {move: moves.poison_needle, unlockLevel: 4}]),
    baller: new Class("Baller",           
        {maxHealth: .5, maxTech: .5, strength: .5, vitality: .5, stamina: .5, agility: .5}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.multishot, unlockLevel: 2}, 
            {move: moves.sick_burn, unlockLevel: 4}]),
    writer: new Class("Writer",         
        {maxHealth: .2, maxTech: .8, strength: .3, vitality: .6, stamina: .5, agility: .6}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.beam, unlockLevel: 2}, 
            {move: moves.heal_all, unlockLevel: 4}]),
    animator: new Class("Animator",     
        {maxHealth: .3, maxTech: .5, strength: .4, vitality: .4, stamina: 1, agility: .4}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.multishot, unlockLevel: 2}, 
            {move: moves.power_spark, unlockLevel: 4}]),
    student: new Class("Student",       
        {maxHealth: 1, maxTech: .6, strength: .3, vitality: .6, stamina: .35, agility: .15}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.beam, unlockLevel: 2}, 
            {move: moves.sick_burn, unlockLevel: 4}]),
    spriter: new Class("Spriter",       
        {maxHealth: .5, maxTech: .95, strength: .75, vitality: .2, stamina: .4, agility: .2}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.multishot, unlockLevel: 2}, 
            {move: moves.sick_burn, unlockLevel: 4}]),
    programmer: new Class("Programmer", 
        {maxHealth: .4, maxTech: .5, strength: .8, vitality: .5, stamina: .8, agility: 0},
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.beam, unlockLevel: 2}, 
            {move: moves.heal_all, unlockLevel: 4}]),
    musician: new Class("Musician",     
        {maxHealth: .45, maxTech: .35, strength: .6, vitality: .2, stamina: .9, agility: .5}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.beam, unlockLevel: 2}, 
            {move: moves.poison_needle, unlockLevel: 4}]),
    artist: new Class("Artist",         
        {maxHealth: .45, maxTech: 1, strength: .1, vitality: 1, stamina: .2, agility: .25}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.beam, unlockLevel: 2}, 
            {move: moves.power_spark, unlockLevel: 4}]),
    met: new Class("Met",               
        {maxHealth: 1.4, maxTech: 1.6, strength: 1.8, vitality: 1.6, stamina: 1.9, agility: 1}, 
        [skills.test], 
        [   {move: moves.shot, unlockLevel: 1}, 
            {move: moves.power_spark, unlockLevel: 1}])
}

class Unit{
    constructor(name_, alignment_, class_, base_, min_, max_){
        this.alive = true

        this.name = name_
        this.alignment = alignment_;

        this.inspiration = 0;
        this.base = base_

        this.levelMin = min_
        this.levelMax = max_

        this.classes = []
        for(var i in class_){
            this.classes.push({class: class_[i], level: 1, experience: 0})
        }
        this.activeClass = Math.floor(Math.random() * this.classes.length);

        this.stats = {}
        if(this.alignment){
            this.base.maxHealth *= 2.5
        }
        this.moves = []
        this.updateStats()

        this.health = this.stats.maxHealth
        this.tech = this.stats.maxTech
        this.speed = Math.random() * 20 + 40

        this.statuses = []
        while(Math.random() > .35 && this.statuses.length < 4){
            var status = randomValue(statuses)
            var mod = 1
            if(status.substring(status.length - 1, status.length) == "-"){
                mod = -1
            }
            this.statuses.push({
                type: randomValue(statuses),
                modifier: Math.ceil(Math.random() * 4) * mod,
                length: Math.random() * 10000
            })
        }
        this.statuses = [] // for now

        this.recruited = false
        this.coords = {x: undefined, y: undefined}

        this.spriteElem = document.createElement("IMG")
        this.spriteElem.className = "sprite_ally"
        this.maskElem = document.createElement("DIV")
        this.maskElem.className = "mask"
        if(alignment_){
            this.dataElem = document.getElementById("unit_data_temp").content.cloneNode(true).querySelector("div")
            if(toFile(this.name) == "bean" || toFile(this.name) == "nick" || toFile(this.name) == "mason"){
                this.spriteElem.src = "rpg/ally_sprite_" + toFile(this.name) + ".gif"
            } else {
                this.spriteElem.src = "rpg/ally_sprite_" + "jasper" + ".gif"
            }
            this.menuElem = document.getElementById("menu_data_temp").content.cloneNode(true).querySelector("div")
            this.menuElem.getElementsByClassName("menu_unit_data_name")[0].innerHTML = this.name
            this.menuElem.getElementsByClassName("menu_unit_data_portrait")[0].src = "rpg/ally_portrait_" + toFile(this.name) + ".png"
            this.menuElem.getElementsByClassName("menu_unit_data_sprite")[0].src = this.spriteElem.src
        } else {
            this.dataElem = document.getElementById("unit_data_temp_enemy").content.cloneNode(true).querySelector("div")
            this.spriteElem.src = "rpg/enemy_sprite_" + toFile(this.name) + ".gif"
            this.speed = 30 * Math.random();
        }
        if(this.alignment){
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
                updateBoard()
            }
        } 
        
        this.updateCondition()
        this.updateData()
    }

    updateStats(){
        var final = this.base
        for(var i = 0; i < this.classes.length; i++){
            final = addObj(final, this.classes[i].class.statBonus(this.classes[i].level, i == this.activeClass, this))
        }
        this.stats = final

        this.possibleMoves = [];
        for(var i = 0; i < this.classes.length; i++){
            for(var e = 0; e < this.classes[i].class.moves.length; e++){
                this.possibleMoves.push({move: this.classes[i].class.moves[e].move, unlocked: this.classes[i].class.moves[e].unlockLevel <= this.classes[i].level})
            }
        }

        if(activeRight != menuSections.moves_right){
            for(var i = 0; i < this.possibleMoves.length && this.moves.length < 4; i++){
                if(this.possibleMoves[i].unlocked && this.moves.filter(a => a.move == this.possibleMoves[i].move).length < 1){
                    this.moves.push({move: this.possibleMoves[i].move})
                }
            }
        }
    }

    updateData(){
        this.updateCondition()

        $(this.maskElem).css('-webkit-mask-image',"url('" + this.spriteElem.src + "')")
        if(!this.alignment){
            this.maskElem.style.top = "-36px"
        }
        this.dataElem.getElementsByClassName("unit_health_bar")[0].getElementsByTagName("div")[0].style.width = (this.health / this.stats.maxHealth * 100) + "%"
        this.dataElem.getElementsByClassName("unit_health_number")[0].innerHTML = Math.ceil(this.health) + " / " + Math.ceil(this.stats.maxHealth)
        
        this.dataElem.getElementsByClassName("unit_status")[0].innerHTML = ""
        this.maskElem.style.opacity = "0"
        for(var i = 0; i < this.statuses.length; i++){
            var newStatus = document.createElement("div")
            newStatus.className = "status_" + toFile(this.statuses[i].type)
            newStatus.innerHTML = this.statuses[i].type
            if(toBase(this.statuses[i].type) != this.statuses[i].type){
                newStatus.innerHTML += Math.abs(this.statuses[i].modifier)
            } else {
                this.maskElem.style.opacity = ".6";
                this.maskElem.className = "mask status_" + toFile(this.statuses[i].type)
            }
            this.dataElem.getElementsByClassName("unit_status")[0].appendChild(newStatus)
        }

        if(!this.alignment){
            this.spriteElem.onmouseover = function(){
                var temp = enemy_group.map(function(a){return a.spriteElem}).indexOf(this)
                if(temp != undefined){
                    enemyActive = temp;
                    updateDataReplace()
                }
            }
        }

        this.dataElem.getElementsByClassName("unit_name")[0].innerHTML = this.name
        if(this.alignment){
            this.dataElem.getElementsByClassName("unit_tech_bar")[0].getElementsByTagName("div")[0].style.width = (this.tech / this.stats.maxTech * 100) + "%"
            this.dataElem.getElementsByClassName("unit_tech_number")[0].innerHTML = Math.ceil(this.tech) + " / " + Math.ceil(this.stats.maxTech)
            this.dataElem.getElementsByClassName("unit_speed_bar")[0].getElementsByTagName("div")[0].style.width = (this.speed) + "%"
            this.dataElem.getElementsByClassName("unit_speed_number")[0].innerHTML = Math.ceil(this.speed)

            this.dataElem.getElementsByClassName("unit_level")[0].innerHTML = "(Lvl. " + this.classes[this.activeClass].level + " " + this.classes[this.activeClass].class.name + ")"
            this.dataElem.getElementsByClassName("unit_experience_bar")[0].style.height = Math.min(96, 100 * (Math.max(.05, this.classes[this.activeClass].experience / expCap(this.classes[this.activeClass].level)))) + "%"
            this.dataElem.getElementsByClassName("unit_inspiration_bar")[0].style.height = Math.max(5, this.inspiration) + "%"
            this.dataElem.getElementsByClassName("unit_portrait")[0].getElementsByTagName("img")[0].src = "rpg/ally_portrait_" + toFile(this.name) + ".png"

            this.menuElem.getElementsByClassName("menu_unit_data_level")[0].innerHTML = "Lvl. " + this.classes[this.activeClass].level + " " + this.classes[this.activeClass].class.name + ""
            if(party.indexOf(this) != -1){
                var partyPosition = party.indexOf(this)
                this.menuElem.onclick = function(){
                    active = partyPosition
                    updateMenu()
                }
            } else {
                this.menuElem.onclick = function(){
                    var temp = Object.entries(allies).map(function(a){return a[1].menuElem}).indexOf(this)
                    switchParty(Object.entries(allies)[temp][1])
                    updateMenu()
                }
            }
        } else {
            this.dataElem.getElementsByClassName("unit_level")[0].innerHTML = "(Lvl. " + this.classes[this.activeClass].level + ")"
            this.dataElem.getElementsByClassName("unit_portrait")[0].getElementsByTagName("img")[0].src = "rpg/enemy_portrait_" + toFile(this.name) + ".png"
        }
        return this.dataElem
    }

    updateCondition(){
        for(var i = 0; i < this.statuses.length; i++){
            for(var e = i + 1; e < this.statuses.length; e++){
                if(this.statuses[e] != undefined && toBase(this.statuses[e].type) == toBase(this.statuses[i].type)){
                    this.statuses[i].modifier += this.statuses[e].modifier
                    this.statuses.splice(e,1)
                }
            }
            if(this.statuses[i].type != toBase(this.statuses[i].type)){
                if(this.statuses[i].modifier < 0){
                    this.statuses[i].type = toBase(this.statuses[i].type) + "-"
                } else if(this.statuses[i].modifier > 0){
                    this.statuses[i].type = toBase(this.statuses[i].type) + "+"
                } else {
                    this.statuses.splice(i,1)
                    return;
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
        for(var i = 0; i < this.classes.length; i++){
            if(this.alignment && this.classes[i].experience > expCap(this.classes[i].level)){
                this.classes[i].experience -= expCap(this.classes[i].level)
                this.classes[i].level += 1
                newMessage("<b>" + this.name + "</b> has leveled up!")
                newMessage("<b>" + this.name + "</b> is now Lvl. "  + this.classes[i].level + "!")
                this.updateStats()
                this.health = this.stats.maxHealth
            }
        }
    }

    copy(){
        var final = copyInstance(this)
        final.dataElem = this.dataElem.cloneNode(true)
        final.spriteElem = this.spriteElem.cloneNode(true)
        final.maskElem = this.maskElem.cloneNode(true)
        this.statuses = []
        return final
    }

    deathCheck(){
        if(this.health < 1 && this.alive){
            genExplosion(this.spriteElem.getBoundingClientRect().left + 50, this.spriteElem.getBoundingClientRect().top + 50)
            if(this.alignment){
                this.alive = false
                this.speed = 0
            } else {
                enemy_group.splice(enemy_group.indexOf(this),1)
            }
            deathCheck()
            updateDataReplace()
            updateBoard()
        }
    }

    die(){
        this.health = 0
        this.deathCheck()
    }

    hitAnimation(){
        this.spriteElem.removeAttribute("hit")
        this.maskElem.removeAttribute("hit")
        if(this.alignment){
            this.spriteElem.setAttribute("hit", "left")
            this.maskElem.setAttribute("hit", "left")
        } else{
            this.spriteElem.setAttribute("hit", "right")
            this.maskElem.setAttribute("hit", "right")
        }
        var temp = this
        setTimeout(function(){
            clearAnimation()
        }, 800)
    }

    move(tC){
        if(board[tC.x] != undefined && board[tC.x][tC.y] != undefined && getBoard(tC.x, tC.y) == undefined && this.speed >= this.moveCost(tC)){
            if((board[tC.x][tC.y].className == "platform_ally" && !this.alignment) || (board[tC.x][tC.y].className == "platform_enemy" && this.alignment)){
                return
            }
            this.speed -= this.moveCost(tC)
            this.coords = {x: Number(tC.x), y: Number(tC.y)};
        } 
        if(this.moveCost(tC) >= this.speed && tC.x < 3){
            spawnWarning(false)
        }
        updateBoard()
    }

    moveCost(coords){
        return Math.ceil(distance(this.coords, coords) * 10)
    }

    attack(move){
        if(this.tech < this.moves[move].move.tech || this.speed < this.moves[move].move.speed){
            if(this.alignment){
                spawnWarning(false)
            }
            return true;
        }
        var results = this.moves[move].move.attack(this) 
        if(results.targets > 0){
            this.tech -= this.moves[move].move.tech
            this.speed -= this.moves[move].move.speed
            if(this.alignment){
                cash += results.exp
            }
            this.classes[this.activeClass].experience += results.exp
        } else {
            return false
        }
        this.updateCondition()
        return true
    }
}

var expCap = function(level){
    return 100 * Math.pow(level, .7) + 50
}

var allies = {
    jasper: new Unit("Jasper", true,     [classes.artist, classes.writer, classes.gamer]     ,{maxHealth: 15, maxTech: 05, strength: 30, vitality: 25, stamina: 5, agility: 10}),
    tucker: new Unit("Tucker", true,   [classes.artist, classes.writer, classes.animator]   ,{maxHealth: 15, maxTech: 20, strength: 10, vitality: 15, stamina: 15, agility: 10}),
    mason: new Unit("Mason", true,     [classes.artist, classes.writer, classes.student]     ,{maxHealth: 15, maxTech: 05, strength: 20, vitality: 35, stamina: 10, agility: 05}),
    sam: new Unit("Sam", true,         [classes.artist, classes.baller, classes.gamer]      ,{maxHealth: 20, maxTech: 05, strength: 32, vitality: 14, stamina: 14, agility: 05}), //
    bean: new Unit("Bean", true,       [classes.artist, classes.programmer, classes.spriter] ,{maxHealth: 11, maxTech: 23, strength: 05, vitality: 23, stamina: 13, agility: 17}), 
    hayden: new Unit("Hayden", true,   [classes.artist, classes.student, classes.gamer]      ,{maxHealth: 27, maxTech: 14, strength: 13, vitality: 15, stamina: 08, agility: 13}),
    lorenzo: new Unit("Lorenzo", true, [classes.artist, classes.writer, classes.musician]    ,{maxHealth: 10, maxTech: 36, strength: 05, vitality: 13, stamina: 10, agility: 14}),
    nick: new Unit("Nicole", true,       [classes.artist, classes.musician, classes.programmer],{maxHealth: 18, maxTech: 20, strength: 16, vitality: 06, stamina: 08, agility: 22}),
    rick: new Unit("Rick", true,       [classes.artist, classes.spriter, classes.gamer]      ,{maxHealth: 15, maxTech: 15, strength: 15, vitality: 15, stamina: 15, agility: 15}), 
    paige: new Unit("Lumiet", true,     [classes.artist, classes.programmer, classes.gamer] ,{maxHealth: 15, maxTech: 15, strength: 15, vitality: 15, stamina: 15, agility: 15}),
    cass: new Unit("Cass", true,     [classes.artist, classes.writer, classes.gamer] ,{maxHealth: 15, maxTech: 15, strength: 15, vitality: 15, stamina: 15, agility: 15}),
    amy: new Unit("Amy", true,     [classes.artist, classes.animator, classes.gamer] ,{maxHealth: 15, maxTech: 15, strength: 15, vitality: 15, stamina: 15, agility: 15})
}

var enemies = {
    met: new Unit("Met", false,[classes.met],        {maxHealth: 16, maxTech: 5, strength: 6, vitality: 10, stamina: 6, agility: 10}    ,1,100),
    meta: new Unit("Met Alpha", false,[classes.met], {maxHealth: 32, maxTech: 10, strength: 9, vitality: 13, stamina: 6, agility: 13}   ,3,100),
    metb: new Unit("Met Beta", false,[classes.met],  {maxHealth: 51, maxTech: 20, strength: 13, vitality: 19, stamina: 6, agility: 17}  ,5,100)
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
    switch(party.length){
        case 0: y = allies.bean; break;
        case 1: y = allies.mason; break;
        case 2: y = allies.nick; break;
    }
    var coords = {x: Math.floor(Math.random() * board.length / 2), y: Math.floor(Math.random() * board[0].length) }
    while(getBoard(coords.x, coords.y) != undefined){
        coords = {x: Math.floor(Math.random() * board.length / 2), y: Math.floor(Math.random() * board[0].length) }
    }
    y.coords = coords
    y.recruited = true
    document.getElementById("ally_data_holder").appendChild(y.dataElem)
    party.push(y)
    updateData()
}

var spawn = function(person, level){
    var x = Object.keys(enemies)
    var y = enemies[x[Math.floor(Math.random() * x.length)]]
    if(person != undefined){
        y = person
    }
    enemy_group.push(y.copy())
    var monster = enemy_group[enemy_group.length - 1]
    document.getElementById("enemy_data_holder").appendChild(enemy_group[enemy_group.length - 1].dataElem)
    var coords = {x: board.length / 2 + Math.floor(Math.random() * board.length / 2), y: Math.floor(Math.random() * board[0].length) }
    while(getBoard(coords.x, coords.y) != undefined){
        coords = {x: board.length / 2 + Math.floor(Math.random() * board.length / 2), y: Math.floor(Math.random() * board[0].length) }
    }
    monster.coords = coords
    monster.classes[monster.activeClass].level = level
}

var board = []
var createBoard = function(width, height){
    document.getElementById("battle").innerHTML = ""
    board = Array(width * 2)
    for(var i = 0; i < width * 2; i++){
         board[i] = []
    }
    for(var i = 0; i < height; i++){
        var trow = document.createElement("TR")
        for(var e = 0; e < width * 2; e++){
            board[e][i] = document.createElement("TD")
            if(e < width){
                board[e][i].className = "platform_ally"
            } else {
                board[e][i].className = "platform_enemy"
            }
            board[e][i].setAttribute("x", e)
            board[e][i].setAttribute("y", i)
            board[e][i].onclick = function(){
                party[active].move({x: this.getAttribute("x"), y: this.getAttribute("y")})
                updateBoard()
            }
            trow.appendChild(board[e][i])
        }   
        document.getElementById("battle").appendChild(trow)
    }
}
createBoard(2,3)

var updateBoard = function(){
    for(var i = 0; i < board.length; i++){
        for(var e = 0; e < board[i].length; e++){
            board[i][e].setAttribute("move", "false")
            board[i][e].innerHTML = ""
        }
    }
    for(var i = 0; i < party.length; i++){
        if(party[i].alive){
            var tC = party[i].coords
            if(tC.x != undefined && tC.y != undefined){
                board[tC.x][tC.y].innerHTML = ""
                board[tC.x][tC.y].appendChild(party[i].spriteElem)
                board[tC.x][tC.y].appendChild(party[i].maskElem)
            }
            party[i].spriteElem.removeAttribute("glow")
        }
    }
    for(var i = 0; i < enemy_group.length; i++){
        var tC = enemy_group[i].coords
        if(tC.x != undefined && tC.y != undefined){
            board[tC.x][tC.y].innerHTML = ""
            board[tC.x][tC.y].appendChild(enemy_group[i].spriteElem)
            board[tC.x][tC.y].appendChild(enemy_group[i].maskElem)
        }
    }
    document.getElementById("move_data_holder").innerHTML = ""
    if(party[active] != undefined){
        party.forEach(function(a,b){if(b != active){a.dataElem.style.transform = "translateX(0)"}})
        party[active].dataElem.style.transform = "translateX(20px)"
        for(var i = 0; i < party[active].moves.length; i++){
            document.getElementById("move_data_holder").appendChild(party[active].moves[i].move.updateData())
        }
    }
    updateData()
}

var deathCheck = function(){
    var alive = true
    for(var i = 0; i < party.length; i++){
        if(party[i].alive){
            alive = false
        }
    }
    if(alive){
        battleActive = false
        if(currentLevel > 1){
            currentLevel -= 1
        }
        cash *= .5
    }
}

var updateData = function(){
    for(var i = 0; i < party.length; i++){
        party[i].updateData()
    }
    for(var i = 0; i < enemy_group.length; i++){
        enemy_group[i].updateData()
    }
    document.getElementById("currentLevel").innerHTML = "Round " + currentLevel
    document.getElementById("currentCash").innerHTML = Math.floor(cash) / 100
}

var updateDataReplace = function(){
    document.getElementById("ally_data_holder").innerHTML = ""
    document.getElementById("enemy_data_holder").innerHTML = ""
    for(var i = 0; i < party.length; i++){
        if(party[i].alive){
            document.getElementById("ally_data_holder").appendChild(party[i].updateData())
        }
    }
    if(enemyActive != -1 && enemy_group[enemyActive] != undefined){
        document.getElementById("enemy_data_holder").appendChild(enemy_group[enemyActive].updateData())
    }
}

var updateMenu = function(){
    document.getElementById("battle_menu_left_data").innerHTML = ""
    document.getElementById("members_menu_right_data").innerHTML = ""
    var k = Object.keys(allies)
    for(var i = 0; i < k.length; i++){
        allies[k[i]].updateData()
        if(party.indexOf(allies[k[i]]) != -1){
            document.getElementById("battle_menu_left_data").appendChild(allies[k[i]].menuElem)
            allies[k[i]].menuElem.style.backgroundColor = ""
        } else {
            document.getElementById("members_menu_right_data").appendChild(allies[k[i]].menuElem)
            allies[k[i]].menuElem.style.backgroundColor = ""
        }
    }
    if(party[active] != undefined){
        party[active].menuElem.style.backgroundColor = "#c8c8c8"
    }

    party[active].updateStats()
    var tr = menuSections.classes_right.getElementsByTagName("TR")[1]
    tr.getElementsByTagName("TD")[1].innerHTML = Math.floor(party[active].base.maxHealth)
    tr.getElementsByTagName("TD")[2].innerHTML = Math.floor(party[active].base.maxTech)
    tr.getElementsByTagName("TD")[3].innerHTML = Math.floor(party[active].base.strength)
    tr.getElementsByTagName("TD")[4].innerHTML = Math.floor(party[active].base.vitality)
    tr.getElementsByTagName("TD")[5].innerHTML = Math.floor(party[active].base.stamina)
    tr.getElementsByTagName("TD")[6].innerHTML = Math.floor(party[active].base.agility)
    var tr = menuSections.classes_right.getElementsByTagName("TR")[5]
    tr.getElementsByTagName("TD")[1].innerHTML = Math.floor(party[active].stats.maxHealth)
    tr.getElementsByTagName("TD")[2].innerHTML = Math.floor(party[active].stats.maxTech)
    tr.getElementsByTagName("TD")[3].innerHTML = Math.floor(party[active].stats.strength)
    tr.getElementsByTagName("TD")[4].innerHTML = Math.floor(party[active].stats.vitality)
    tr.getElementsByTagName("TD")[5].innerHTML = Math.floor(party[active].stats.stamina)
    tr.getElementsByTagName("TD")[6].innerHTML = Math.floor(party[active].stats.agility)
    for(var i = 0; i < party[active].classes.length; i++){
        tr = menuSections.classes_right.getElementsByTagName("TR")[2 + i]
        var bonus = party[active].classes[i].class.statBonus(party[active].classes[i].level, party[active].activeClass == i)
        if(party[active].activeClass == i){
            tr.getElementsByTagName("TD")[0].innerHTML = "➤"
        } else {
            tr.getElementsByTagName("TD")[0].innerHTML = ""
        }
        tr.getElementsByTagName("TD")[1].innerHTML = "Lvl. " + party[active].classes[i].level + " " + party[active].classes[i].class.name
        tr.getElementsByTagName("TD")[2].innerHTML = Math.floor(bonus.maxHealth)
        tr.getElementsByTagName("TD")[3].innerHTML = Math.floor(bonus.maxTech)
        tr.getElementsByTagName("TD")[4].innerHTML = Math.floor(bonus.strength)
        tr.getElementsByTagName("TD")[5].innerHTML = Math.floor(bonus.vitality)
        tr.getElementsByTagName("TD")[6].innerHTML = Math.floor(bonus.stamina)
        tr.getElementsByTagName("TD")[7].innerHTML = Math.floor(bonus.agility)
    }

    var tbl = menuSections.moves_right.getElementsByTagName("TABLE")[0]
    $(tbl).find("tr:gt(0)").remove();
    for(var i = 0; i < party[active].moves.length; i++){
        party[active].moves[i].move.menuElem.onclick = function(){
            if(party[active].moves.length < 2){
                return
            }
            party[active].moves.splice(party[active].moves.map(a => a.move.menuElem).indexOf(this), 1)
            updateMenu()
        }
        tbl.appendChild(party[active].moves[i].move.menuElem)
    }
    tbl = menuSections.moves_right.getElementsByTagName("TABLE")[1]
    $(tbl).find("tr:gt(0)").remove();
    for(var i = 0; i < party[active].possibleMoves.length; i++){
        if(party[active].possibleMoves[i].unlocked && party[active].moves.filter(a => a.move == party[active].possibleMoves[i].move).length < 1){
            party[active].possibleMoves[i].move.menuElem.onclick = function(){
                if(party[active].moves.length > 2){
                    return
                }
                party[active].moves.push({move: party[active].possibleMoves[party[active].possibleMoves.map(a => a.move.menuElem).indexOf(this)].move})
                updateMenu()
            }
            tbl.appendChild(party[active].possibleMoves[i].move.menuElem)
        }
    }
}

var switchParty = function(replace){
    if(party[active] == undefined){
        return
    }
    party[active] = replace
}

var getBoard = function(x,y){
    for(var i = 0; i < party.length; i++){
        if(party[i].coords.x == x && party[i].coords.y == y && party[i].alive){
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
    $("DIV").finish()
    $("IMG").finish()
    for(var i = 0; i < party.length; i++){
        party[i].spriteElem.removeAttribute("hit")
        party[i].maskElem.removeAttribute("hit")
    }
    for(var i = 0; i < enemy_group.length; i++){
        enemy_group[i].spriteElem.removeAttribute("hit")
        enemy_group[i].maskElem.removeAttribute("hit")
    }
}

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
    if(battleActive){
        document.getElementById("menu").style.display = "none"
        for(var i = 0; i < party.length; i++){
            if(party[i].alive){
                if(party[i].statuses.map(a => a.type).indexOf("Poison") != -1){
                    party[i].health -= .01
                }
                if(party[i].statuses.map(a => a.type).indexOf("Burn") != -1){
                    party[i].health -= .005
                }
                if(party[i].statuses.map(a => a.type).indexOf("Shocked") != -1){
                    party[i].speed -= party[i].stats.stamina / 500
                }
                party[i].speed += Math.pow(party[i].stats.stamina, .6) / 90
                if(party[i].speed > 100){
                    party[i].speed = 100
                    party[i].tech += .02
                    if(party[i].tech > party[i].stats.maxTech){
                        party[i].tech = party[i].stats.maxTech
                    }
                }
                for(var e = 0; e < party[i].statuses.length; e++){
                    party[i].statuses[e].length -= 1
                    if(party[i].statuses[e].length < 1){
                        party[i].statuses.splice(e,1)
                    }
                }
                party[i].deathCheck()
            }
        }
        for(var i = 0; i < enemy_group.length; i++){
            if(enemy_group[i].statuses.map(a => a.type).indexOf("Poison") != -1){
                enemy_group[i].health -= .01
            }
            enemy_group[i].speed += enemy_group[i].stats.stamina / 550 + (.05 * Math.random())
            if(!enemy_group[i].attack(Math.floor(Math.random() * enemy_group[i].moves.length)) && Math.random() > .95){
                switch(Math.floor(Math.random() * 4)){
                    case 0:
                        enemy_group[i].move({x: enemy_group[i].coords.x, y: enemy_group[i].coords.y - 1}); break;
                    case 1:
                        enemy_group[i].move({x: enemy_group[i].coords.x, y: enemy_group[i].coords.y + 1}); break;
                    case 2:
                        enemy_group[i].move({x: enemy_group[i].coords.x - 1, y: enemy_group[i].coords.y}); break;
                    case 3:
                        enemy_group[i].move({x: enemy_group[i].coords.x + 1, y: enemy_group[i].coords.y}); break;
                }
            }
            if(enemy_group[i].speed > 100){
                enemy_group[i].speed = 100
                enemy_group[i].tech += .1
                if(enemy_group[i].tech > enemy_group[i].stats.maxTech){
                    enemy_group[i].tech = enemy_group[i].stats.maxTech
                }
            }
            enemy_group[i].deathCheck()
        }
        if(enemy_group.length == 0){
            currentLevel += 1
            newMessage("All enemies defeated!")
            newMessage("On to Round " + currentLevel + "!")
            if(currentLevel == 4){
                createBoard(3,3)
            }
            if(currentLevel == 7){
                createBoard(3,4)
            }
            if(currentLevel == 10){
                createBoard(3,5)
            }
            fillBoard()
        }
        for(var i = 0; i < enemy_group.length; i++){
            enemy_group[i].spriteElem.setAttribute("glow", "false")
        }
        if(enemyActive != -1 && enemy_group[enemyActive] != undefined){
            enemy_group[enemyActive].spriteElem.setAttribute("glow", "true")
        }
        if(party[active] != undefined){
            party[active].spriteElem.setAttribute("glow", "true")
        }
        updateData()
    } else if(!animating){
        document.getElementById("menu").style.display = "block"
        forEach(menuSections, a => a.style.display = "none")
        activeLeft.style.display = "block"
        activeRight.style.display = "block"
        document.getElementById("battle_menu_right_rounds").getElementsByTagName("DIV")[0].innerHTML = currentLevel
    } else {
        document.getElementById("menu").style.display = "none"
    }
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
    if(!doExplosions){
        return
    }
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

recruit(); recruit(); recruit(); 
party[active].dataElem.style.transform = "translateX(20px)"

var currentLevel = 1
var fillBoard = function(){
    var count = enemy_group.length
    var countMax = Math.ceil(board.length * board[0].length / 2 * .75)
    while(count < countMax && (count < countMax / 2 || Math.random() > .2)){
        var monster = enemies[Object.keys(enemies)[Math.floor(Math.random() * Object.keys(enemies).length)]];
        var level = Math.max(1, Math.floor(currentLevel - Math.random() * 3))
        while(monster.levelMin > level || monster.levelMax < level){
            var monster = enemies[Object.keys(enemies)[Math.floor(Math.random() * Object.keys(enemies).length)]];
        }
        spawn(monster, level)
        count++
    }
    updateDataReplace()
    updateBoard()
}
fillBoard()
updateMenu();