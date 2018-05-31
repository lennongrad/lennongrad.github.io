var dim = {x: $(window).width(), y: $(window).height()};
var mouse = {x: 0, y: 0}

document.onmousemove = function(event){
    mouse = {x: event.clientX, y: event.clientY};
}

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function isCollide(a, b) {
    var aRect = a.getBoundingClientRect()
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

var click = {left: false, right: false, middle: false}
document.onmousedown = function(e) { 
    if(e.which == 1){
        click.left = true;
    } else {
        click.right = true;
    }
}
document.onmouseup = function(e) {
    if(e.which == 1){
        click.left = false;
    } else {
        click.right = false;
    }
}   

class Element{
  constructor(id_, colour_){
    this.colour = new Color(colour_);
    this.id = id_;
  }
}

var elements = {
  hydrogen: new Element(1, "#DDDDDD"),
  helium: new Element(2, "#CCCCCC") 
}

class Particle{
  constructor(x_,y_,w_,h_,type_, class_){
    this.pos = {x: x_, y: y_}
    this.v = {x: -2 + Math.random() * 4, y: -2 + Math.random() * 4}
    this.d = {w: w_, h: h_}
    this.node = document.createElement(type_);
    this.node.className = class_;
  }

  draw(bounds){
    this.pos.x += this.v.x
    this.pos.y += this.v.y

    if(this.pos.x <= bounds.left  ){this.v.x *= -1; this.pos.x = bounds.left + 1}
    if(this.pos.x + this.d.w >= bounds.right ){this.v.x *= -1; this.pos.x = bounds.right - this.d.w - 1}
    if(this.pos.y <= bounds.top   ){this.v.y *= -1; this.pos.y = bounds.top + 1}
    if(this.pos.y + this.d.h >= bounds.bottom){this.v.y *= -1; this.pos.y = bounds.bottom - this.d.h - 1}

    this.node.style.left = this.pos.x + "px";
    this.node.style.top = this.pos.y + "px";
    this.node.style.width = this.d.w + "px";
    this.node.style.height = this.d.h + "px";
  }
}

class Electron extends Particle{
  constructor(x_,y_, element_){
    super(x_,y_,10,10,"DIV","electron")
  }

  draw(bounds_){
    super.draw(bounds_)
    return this.node
  }
}

class Atom extends Particle{
  constructor(x_,y_,w_,h_,element_, electrons_){
    super(x_,y_,w_,h_,"DIV","atom")
    this.element = element_
    this.electrons = []
    if(electrons_ != undefined){
      for(var i = 0; i < electrons_; i++){
        this.electrons.push(new Electron(this.d.h / 2, this.d.w / 2))
      }
    }
  }

  add(amt_){
    for(var i = 0; i < amt_; i++){
      this.electrons.push(new Electron(this.d.h / 2,this.d.w / 2))
    }
  }

  draw(){
    super.draw({left: 0, right: dim.x, top: 0, bottom: dim.y})
    this.node.innerHTML = ""
    for(var i in this.electrons){
      this.node.appendChild(this.electrons[i].draw({left: 0, right: this.d.w, top: 0, bottom: this.d.h}))
    }
    for(var i = 0; i < this.electrons.length; i++){
      for(var e = i + 1; e < this.electrons.length; e++){
        if(isCollide(this.electrons[i].node,this.electrons[e].node)){
          var temp = this.electrons[i].v;
          this.electrons[i].v = this.electrons[e].v;
          this.electrons[e].v = temp;
        }
      }
    }
    this.node.style.backgroundColor = this.element.colour.hex()
    document.body.appendChild(this.node)
  }
}

var atoms = []
atoms.push(new Atom(25, 25, 90, 90, elements["hydrogen"], 3))

var render = function(){
  document.body.innerHTML = ""
  for(var i in atoms){
    atoms[i].draw(document.body)
  }
}

setInterval(render, 5)