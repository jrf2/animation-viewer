var canvas, context;

var centerButtonPressed = false;
var reverse = false;
var flip = false;

function getMousePos(canvas, evt) {
	// get canvas position
	var obj = canvas;
	var top = 0;
	var left = 0;

	while(obj && obj.tagName != 'BODY') {
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}

	// return relative mouse position
	var mouseX = evt.clientX - left + window.pageXOffset;
	var mouseY = evt.clientY - top + window.pageYOffset;
	return {
		x: mouseX,
		y: mouseY
	};
}

window.onload = function() {
	canvas = document.getElementById("viewerCanvas");
	context = canvas.getContext("2d");
	
	text = document.getElementById("frameCount").value;
	
	lastTime = new Date().getTime();
	
	canvas.addEventListener('DOMMouseScroll', function(event) {
		event.preventDefault();
		if (event.detail < 0 && Camera.GetZoom() < 3) {
			Camera.SetZoom(Camera.GetZoom()+0.1);
		} else if (event.detail > 0 && Camera.GetZoom() > 0.5) {
			Camera.SetZoom(Camera.GetZoom()-0.1);
		}
	}, true);
	
	canvas.addEventListener('mousewheel', function(event) {
		event.preventDefault();
		if (event.wheelDelta < 0 && Camera.GetZoom() < 3) {
			Camera.SetZoom(Camera.GetZoom()+0.1);
		} else if (event.wheelDelta > 0 && Camera.GetZoom() > 0.5) {
			Camera.SetZoom(Camera.GetZoom()-0.1);
		}
	}, true);
		
	canvas.addEventListener('mousemove', function(event) {
		if (centerButtonPressed && imageObj) {
			var pos = getMousePos(canvas, event);
			if (flip) {
				pos.x -= ((imageObj.width/frameCount)*Camera.GetZoom())*2.5;
			} else {
				pos.x -= ((imageObj.width/frameCount)*Camera.GetZoom())*1.5;
			}
			pos.y -= (imageObj.height*Camera.GetZoom());
			Camera.SetPosition(pos);
		}
	}, false);
	
	canvas.addEventListener('mouseup', function(event){ 
		event.preventDefault();
		centerButtonPressed = false;
    }, false);

	canvas.addEventListener('mousedown', function(event){
		event.preventDefault();
		var pos = getMousePos(canvas, event);
		for (var i = 0; i < frameCount; i++) {
			if (boxes[i].x < pos.x && boxes[i].y < pos.y && 
				boxes[i].x + boxes[i].w > pos.x &&
				boxes[i].y + boxes[i].h > pos.y) {
					frameIndex = i;
					return;
			}
		}
		centerButtonPressed = true;
	}, false);
	
	// To enable drag and drop
	canvas.addEventListener("dragover", function (evt) {
		evt.preventDefault();
	}, false);

	// Handle dropped image file - only Firefox and Google Chrome
	canvas.addEventListener("drop", function (evt) {
		var files = evt.dataTransfer.files;
		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				var reader = new FileReader();
				
				// Note: addEventListener doesn't work in Google Chrome for this event
				reader.onload = function (evt) {
					imageObj.src = evt.target.result;
					frameIndex = 0;
				};
				reader.readAsDataURL(file);
			}
		}
		evt.preventDefault();
	}, false);
	
	var FPS = 30;
	setInterval(function() {
		update();
		draw();
	}, 100/FPS);
}

var imageObj = new Image();

var frameCount = 1;
var frameSpeed = 100;
var frameIndex = 0;
var play = true;

function prevFrame() {
	if(frameIndex > 0) {
		frameIndex--;
	}
}

function nextFrame() {
	if(frameIndex < frameCount-1) {
		frameIndex++;
	}
}

function stopGo() {	
	play = !play;
	if (play === true) {
		document.getElementById("goStopBtnImg").src = "images/pause.png";
	} else {
		document.getElementById("goStopBtnImg").src = "images/play.png";
	}
}

var lastTime = 0;
var diff = 0;
function nextFrameLoop() {
	var now = new Date().getTime();
	diff = now - lastTime;
	if (play && diff > frameSpeed) {
		if (reverse) {
			frameIndex--;
		} else {
			frameIndex++;
		}
		if (frameIndex > frameCount-1) {
			frameIndex = 0;
		} else if (frameIndex < 0) {
			frameIndex = frameCount-1;
		}
		lastTime = now;
	}
}

function saveData() {
	var dataURL = canvas.toDataURL();
	window.location = dataURL;
}

var text = "drag image over thasdasdfasdffe canvas";

function update() {
	var canvasdiv = document.getElementById("viewerCanvas");
	context.canvas.width = 570;//canvasdiv.scrollWidth;
	context.canvas.height = 725;//canvasdiv.scrollHeight;
	
	frameCount = Number(document.getElementById("frameCount").value);
	if (!frameCount || frameCount < 1) { 
		frameCount = 1;
	}
	
	frameSpeed = Number(document.getElementById("frameSpeed").value);
	if (!frameSpeed || frameSpeed < 1) frameSpeed = 1;
	
	nextFrameLoop();
}

function clearScreen() {
    context.beginPath();
    context.fillStyle = "gray";
    context.rect(0, 0, context.canvas.width, context.canvas.height);
    context.fill();
}

// drawFrame(context, index, count, x, y, desiredWidth, desiredHeight)
function drawFrame(context, index, count, x, y, width, height) {
	// draw background
	context.shadowOffsetX = 2;
	context.shadowOffsetY = 2;
	context.shadowBlur = 5;
	context.shadowColor = "black";
	context.fillStyle = "white";
	context.fillRect(x, y, width, height);
	
	// draw image
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	context.shadowColor = "black";
	context.drawImage(imageObj, 
		(imageObj.width/count)*index, 0,
		imageObj.width/count, imageObj.height,
		x, y, width, height);
}

var boxes = { };

function draw() {
    clearScreen();
	
    // draw debug info
	context.fillStyle = "white";
	context.fillText(diff, 25, 25);
	context.fillText(frameIndex, 50, 50);
	
	// draw Frames
	if (imageObj) {
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowBlur = 5;
		context.shadowColor = "black";
		context.fillStyle = "#333333";
		context.fillRect(0, 0, 570, 100);
		boxes = {};
		for (var i = 0; i < frameCount; i++) {
			if (i === frameIndex) {
				context.globalAlpha = 1;
			} else {
				context.globalAlpha = 0.6;
			}
			boxes[i] = { x: 10 + 70*i, y: 10,  w: 60, h: 80 };
			drawFrame(context, i, frameCount, 10 + 70*i, 10, 60, 80);
		}
	}
	
	// apply camera transformation
    Camera.ApplyTransformation(context);
	context.globalAlpha = 1;
	if (flip) {
		context.translate(imageObj.width/2, 0);
		context.scale(-1, 1);
	}
	drawFrame(context, frameIndex, frameCount, 150, 150, imageObj.width/frameCount, imageObj.height);
}