function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

var initialTop = 50
var initialLeft = 50
var initialWidth = 55
var initialOpacity = 1
var initialScale = 6
var initialTopWork = -150

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
			goalScale = 16
			break;
		case ($(window).width() > 700):
			goalScale = 11
			break;
		case ($(window).width() > 500):
			goalScale = 9
			break;
	}
	
	if(scrollTop > screen.height * .3){
		goalTop = 0
		goalLeft = 0
		goalWidth = 9
		goalOpacity = 0
		goalScale = 8
	}
	
	if(scrollTop > document.getElementById("work-header").getBoundingClientRect().top + 10){
		goalTopWork = 1
	}

	currentTop = lerp(currentTop, goalTop, .05)
	currentLeft = lerp(currentLeft, goalLeft, .05)
	currentWidth = lerp(currentWidth, goalWidth, .025)
	currentOpacity = lerp(currentOpacity, goalOpacity, .025)
	currentScale = lerp(currentScale, goalScale, .025)
	currentTopWork = lerp(currentTopWork, goalTopWork, .035)
	
	document.getElementById("title").style.bottom = "calc(" + currentTop + "vh + 5px)"
	document.getElementById("title").style.left = "calc(" + currentLeft + "vw - 5px)"
	document.getElementById("title").style.width = currentWidth + "em"
	document.getElementById("title").style.transform = "translate(-" + 50 * currentOpacity + "%)"
	document.getElementById("title-name").style.opacity = currentOpacity
	document.getElementById("toc").style.opacity = currentOpacity
	document.getElementById("header").style.fontSize = currentScale + "px"
	//document.getElementById("work").style.top = currentTopWork + "rem"
}, 1);
