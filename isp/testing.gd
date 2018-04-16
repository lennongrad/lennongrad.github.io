extends Panel

var width = 12;
var height = 12;

var units = [];
var unSel = 0;
var unCov = 0;

var matrix = [];
var curselected = [0,0];

var hasPressed = false;

var curr;
var tw;
var th;

var pressCur = 0;
var pressUn = 0;
var pressed = false;

func _ready():
	get_node("Button").connect("pressed", self, "_on_button_pressed");
	pass

func _on_button_pressed():
	get_node("Panel").visible = true;
	get_node("steelback").visible = true;
	get_node("unitPanel").visible = true;
	get_node("Button").visible = false;
	
	var hex_proto = load("res://hex.tscn");
	for x in range(width):
    	matrix.append([]);
    	for y in range(height):
        	matrix[x].append(hex_proto.instance());
        	matrix[x][y].init(x, y, width);
        	add_child(matrix[x][y])
			
	var unit_proto = load("res://unit.tscn");
	units.append(unit_proto.instance());
	units[0].init(2,2, 0);
	add_child(units[0])
	units.append(unit_proto.instance());
	units[1].init(5,3, 1);
	add_child(units[1])
		
	selected([0,0]);
	hasPressed = true;

func _process(delta):
	pressed = false;
	pressCur+=1
	if(Input.is_action_pressed("ui_up") && pressCur > 2):
		selected([curselected[0], curselected[1] - 1]);
		pressed = true;
	if(Input.is_action_pressed("ui_down") && pressCur > 2):
		selected([curselected[0], curselected[1] + 1]);
		pressed = true;
	if(Input.is_action_pressed("ui_right") && pressCur > 2):
		selected([curselected[0] + 1, curselected[1]]);
		pressed = true;
	if(Input.is_action_pressed("ui_left") && pressCur > 2):
		selected([curselected[0] - 1, curselected[1]]);
		pressed = true;
	
	pressUn+=1
	if(Input.is_key_pressed(KEY_W) && pressUn > 2):
		if(units[unSel].move([units[unSel].cd[0], units[unSel].cd[1] - 1])):
			if(units[unSel].move([units[unSel].cd[0] + 1, units[unSel].cd[1] - 1])):
				units[unSel].move([units[unSel].cd[0] - 1, units[unSel].cd[1] - 1])
		pressed = true;
	if(Input.is_key_pressed(KEY_S) && pressUn > 2):
		if(units[unSel].move([units[unSel].cd[0], units[unSel].cd[1] + 1])):
			if(units[unSel].move([units[unSel].cd[0] - 1, units[unSel].cd[1] + 1])):
				units[unSel].move([units[unSel].cd[0] + 1, units[unSel].cd[1] + 1])
		pressed = true;
	if(Input.is_key_pressed(KEY_D) && pressUn > 2):
		units[unSel].move([units[unSel].cd[0] + 1, units[unSel].cd[1]]);
		pressed = true;
	if(Input.is_key_pressed(KEY_A) && pressUn > 2):
		units[unSel].move([units[unSel].cd[0] - 1, units[unSel].cd[1]]);
		pressed = true;
		
	if(pressed):
		pressCur = 0;
		pressUn = 0
		
	for e in range(units.size()):
		if(units[e].cd[0] == curselected[0] && units[e].cd[1] == curselected[1]):
			unCov = e;
			if(Input.is_key_pressed(KEY_SPACE)):
				units[e].select = true
				unSel = e;
		else:
			if(Input.is_key_pressed(KEY_SPACE)):
				units[e].select = false
	
	if(hasPressed): 
		get_node("Panel/harvest").text = str(matrix[curselected[0]][curselected[1]].harvest);
		get_node("Panel/harvest_efficiency").text = str(matrix[curselected[0]][curselected[1]].harvest_efficiency);
		get_node("Panel/resource").text = str(matrix[curselected[0]][curselected[1]].resource);
		get_node("Panel/abundance").text = str(matrix[curselected[0]][curselected[1]].abundance);
		get_node("Panel/population").text = str(matrix[curselected[0]][curselected[1]].population);
		get_node("steelback/good").text = str(matrix[curselected[0]][curselected[1]].good);
		get_node("steelback/output").text = str(matrix[curselected[0]][curselected[1]].output);
		
		get_node("unitPanel/cover").text = str(units[unCov].cover);
		get_node("unitPanel/blast").text = str(units[unCov].blast);
		get_node("unitPanel/fulfillment").text = str(units[unCov].fulfillment) + " / " + str(units[unCov].size);
		
		get_node("Panel/ColorRect/landscape").set_texture(load(matrix[curselected[0]][curselected[1]].biome + ".jpeg"))
		
		curr = load(matrix[curselected[0]][curselected[1]].biome + ".jpeg").get_size() 
		th = 78
		tw = 158 
		get_node("Panel/ColorRect/landscape").set_scale(Vector2(tw / curr.x, th / curr.y))
		
		for i in range(3):
			if(i <= matrix[curselected[0]][curselected[1]].level):
				get_node("Panel/level" + str(i)).color = "#e41c1c"
			else:
				get_node("Panel/level" + str(i)).color = "#000000"

func selected(coords):
	if(coords[0] < 0 || coords[0] >= width || coords[1] < 0 || coords[1] >= height):
		return
	curselected = coords;
	for x in range(width):
    	for y in range(height):
        	if(x == coords[0] && y == coords[1]):
            	matrix[x][y].select = true;
        	else:
            	matrix[x][y].select = false;
