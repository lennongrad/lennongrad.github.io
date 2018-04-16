extends Sprite

var image = [];
var select = false;
var scaler = .5;
var rotated = 0.0;
var cd = [];

var size = 10;
var fulfillment = size;
var blast = 3;
var cover = 3;

func _ready():
	pass
	
func init(x, y, i):
	if(i == 0):
		select = true
	set_scale(Vector2(scaler,scaler))
	cd = [x,y];
	set_offset(Vector2(145 + (cd[0] * 108) + (52 * (cd[1] % 2)),75 + (cd[1] * 93)));
	get_node("selectUnit").set_position(Vector2(145 + (cd[0] * 108) + (52 * (cd[1] % 2)),75 + (cd[1] * 93)));

func _process(delta):
	rotated += (3.14 / 1000)
	get_node("selectUnit").set_rotation(rotated);
	if(select):
		get_node("selectUnit").visible = true;
	else:
		get_node("selectUnit").visible = false;
		

func update():
	set_offset(Vector2(145 + (cd[0] * 108) + (52 * (cd[1] % 2)),75 + (cd[1] * 93)));
	get_node("selectUnit").set_position(Vector2(145 + (cd[0] * 108) + (52 * (cd[1] % 2)),75 + (cd[1] * 93)));
	
func move(coords):
	if(coords[0] < 0 || coords[0] >= get_parent().get("width") || coords[1] < 0 || coords[1] >= get_parent().get("height")):
		return true
	if(get_parent().get("matrix")[coords[0]][coords[1]].biome == "Water"):
		return true
	cd[0] = coords[0]
	cd[1] = coords[1]
	update()
	return false

func _on_Button_pressed():
	print("hi");
