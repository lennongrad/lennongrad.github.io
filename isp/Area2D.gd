extends Area2D

signal move_signal

# class member variables go here, for example:
# var a = 2
# var b = "textvar"

func _ready():
	pass
	   
	
func set_move_target(viewport, event, shape_idx):
    if event.is_action("lmb"):
         emit_signal("move_signal")