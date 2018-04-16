extends Sprite

var scaler = .5;

var image = [];
var cd = [];
var select = false;

var resource = 0;
var harvest = false;
var harvest_efficiency = 0;
var abundance = 0;
var level = 0;
var biome = "field.jpeg";
var good = 0;
var output = 0;
var population = 0;

func _ready():
	pass
	
func init(x, y, width):
	randomize()
	image = ["res://hexBlack.png", "res://hexRed.png"];
	set_scale(Vector2(scaler,scaler))
	cd = [x,y];
	set_texture(load(image[0]));
	set_offset(Vector2(145 + (cd[0] * 108) + (52 * (cd[1] % 2)),75 + (cd[1] * 93)));
	resource = randi() % 9;
	level = randi() % 3;
	abundance = randi() % 3;
	population = randi() % 10000;
	
	match randi() % 3:
		0:
			biome = "Field"
		1:
			biome = "Mountain"
		2:
			biome = "Sand"
	
	if(float(abs((width / 2) - x)) / width > float(10 + randi() % 50)/100):
		biome = "Water";
	
	if((randi() % 10 > 2 && level == 2) || biome != "Field"):
		level = 0
	
	image = ["res://hex" + biome + ".png", "res://hex" + biome + "Sel.png"];
	
	if(level == 2):
		var city_proto = load("res://city.tscn");
		var newCity = city_proto.instance();
		newCity.set_position(Vector2(145 + (cd[0] * 108) + (52 * (cd[1] % 2)),40 + (cd[1] * 93)));
		add_child(newCity);

func _process(delta):
	if(select):
		set_texture(load(image[1]));
	else:
		set_texture(load(image[0]));
		

func _on_Button_pressed():
	print("hi");
