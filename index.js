function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

var initialTop = 50
var initialLeft = 50
var initialWidth = 55
var initialOpacity = 1
var initialScale = .6
var initialTopWork = -150

var finalTop = -1.5
var finalLeft = -2
var finalWidth = 9
var finalOpacity = 0
var finalScale = .5

var currentTop = initialTop
var currentLeft = initialLeft
var currentWidth = initialWidth
var currentOpacity = initialOpacity
var currentScale = initialScale
var currentTopWork = initialTopWork

setInterval(function() {
	var scrollTop = $(window).scrollTop()
	
	var goalTop = initialTop
	var goalLeft = initialLeft
	var goalWidth = initialWidth
	var goalOpacity = initialOpacity
	var	goalScale = initialScale
	var goalTopWork = initialTopWork
	switch(true){
		case ($(window).width() > 950):
			goalScale = 1
			break;
		case ($(window).width() > 500):
			goalScale = .8
			break;
	}
	
	if(scrollTop > screen.height * .3){
		goalTop = finalTop
		goalLeft = finalLeft
		goalWidth = finalWidth
		goalOpacity = finalOpacity
		goalScale = finalScale

		/*if($(window).width() < 500){
			goalTop -= 1;
			goalLeft -= 1.2;
		}*/
	}
	
	if(scrollTop > document.getElementById("work-header").getBoundingClientRect().top + 10){
		goalTopWork = 1
	}

	var currentLerp = .05
	if(Math.abs(currentTop - goalTop) < .01){
		currentLerp = .8
	}

	currentTop = lerp(currentTop, goalTop, currentLerp)
	currentLeft = lerp(currentLeft, goalLeft, currentLerp)
	currentWidth = lerp(currentWidth, goalWidth, currentLerp * .5)
	currentOpacity = lerp(currentOpacity, goalOpacity, currentLerp * .5)
	currentScale = lerp(currentScale, goalScale, currentLerp * .5)
	currentTopWork = lerp(currentTopWork, goalTopWork, currentLerp * .65)
	
	document.getElementById("title").style.bottom = "calc(" + currentTop + "vh + 5px)"
	document.getElementById("title").style.left = "calc(" + currentLeft + "vw - 5px)"
	document.getElementById("title").style.width = currentWidth + "em"
	document.getElementById("title").style.transform = "translate(-" + 50 * currentOpacity + "%) scale(" + currentScale + ")"
	document.getElementById("title-name").style.opacity = currentOpacity
	document.getElementById("toc").style.opacity = currentOpacity
	//document.getElementById("header").style.fontSize = currentScale + "px" 
}, 1);
