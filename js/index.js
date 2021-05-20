
var radiusInPixels = 300;

var circleMargin = 50;

var circleCanvasWidth = (radiusInPixels + circleMargin)*2;
var circleCanvasHeight = (radiusInPixels + circleMargin)*2;

var lineCanvasWidth = radiusInPixels*2;
var lineCanvasHeight = radiusInPixels*2;

var canvasWidth = radiusInPixels*2;
var canvasHeight = radiusInPixels*2;

var currentTheta = 0;

const wrapper = document.querySelector('.wrapper');
const angleInfo = document.querySelector('.angle-info');
const circleCanvas = document.querySelector('.circle');
const lineCanvas = document.querySelector('.line');

const circleCtx = circleCanvas.getContext('2d');
const lineCtx = lineCanvas.getContext('2d');

const currAngleDisplay = document.getElementById("curr-angle-deg");
const currAngleDisplayRad = document.getElementById("curr-angle-rad");
const currSinDisplay = document.getElementById("curr-sin");
const currCosDisplay = document.getElementById("curr-cos");

var originX, originY;

document.addEventListener('DOMContentLoaded', () => {
	setDimensions();
	drawCircle();
	labelUnitCircle();

	lineCanvas.addEventListener('click',handleClick);
	lineCanvas.addEventListener('mousedown', handleMouseDown);
	lineCanvas.addEventListener('mouseup', handleMouseUp);
	lineCanvas.addEventListener('mousemove', handleMouseMove);

	var boundingClientRect = wrapper.getBoundingClientRect();
	var wrapperLeft = boundingClientRect.x;
	var wrapperTop = boundingClientRect.y;

	originX = wrapperLeft + circleMargin + radiusInPixels;
	originY = wrapperTop + circleMargin + radiusInPixels;

	drawLineFromCenterFromAngle(45);
	drawGuideLines(getAngleInRadians(45));
	updateButtons();
	document.getElementById('toggle').addEventListener('change',updateButtons);
});

var mouseDownValue = 0;

function handleMouseDown(e) {
	mouseDownValue = 1;
}

function handleMouseUp(e) {
	mouseDownValue = 0;
}

function handleMouseMove(e) {
	lineCanvas.style.cursor = 'grab';
	if (mouseDownValue) {
		lineCanvas.style.cursor = 'grabbing';
		handleClick(e);
	}
}

function handleClick(e) {
	var ptRelativeToCircX = e.clientX - originX;
	var ptRelativeToCircY = e.clientY - originY;
	var ptX = ptRelativeToCircX;
	var ptY = -1 * ptRelativeToCircY;
	var a = getAngleAtPoint(ptX,ptY);
	goToAngle(a);
}

// returns angle in degrees
function getAngleAtPoint(x,y) {
	var angleDeg = getAngleInDegrees(Math.atan(y/x));
	// if ((angle is between 90 and 180) || (angle is between 180 and 270))
	//	if ((x < 0 && y > 0) || (x < 0 && y < 0)) angleDeg = 180 + angleDeg;
	// else if angle is between 270 and 360
	//	else if (x > 0 && y < 0) angleDeg = 360 + angleDeg;
	if (x>0 && y<0) angleDeg = 360 + angleDeg;	// if angle is between 270 and 360
	else if (x<0) angleDeg = 180 + angleDeg;	// if angle is between 90 and 270
	return angleDeg;
}

function drawGuideLines(angleInRadians) {
	var pt1 = getPtsOnCircle(angleInRadians);
	currSinDisplay.innerHTML = (pt1.y).toFixed(3);
	currCosDisplay.innerHTML = (pt1.x).toFixed(3);

	if (angleInRadians == 0) {
		currSinDisplay.innerHTML = 0;
		currCosDisplay.innerHTML = 1;
	}
	else if (angleInRadians == getAngleInRadians(90)) {
		currSinDisplay.innerHTML = 1;
		currCosDisplay.innerHTML = 0;
	}
	else if (angleInRadians == getAngleInRadians(180)) {
		currSinDisplay.innerHTML = 0;
		currCosDisplay.innerHTML = -1;
	}
	else if (angleInRadians == getAngleInRadians(270)) {
		currSinDisplay.innerHTML = -1;
		currCosDisplay.innerHTML = 0;
	}

	var x = radiusInPixels * pt1.x;
	var y = radiusInPixels * pt1.y;
	x = x + 300;
	y = 300 - y;
	lineCtx.strokeStyle = 'red';
	lineCtx.beginPath();
	lineCtx.moveTo(x,y);
	lineCtx.lineTo(x,300);
	lineCtx.stroke();
	lineCtx.strokeStyle = 'blue';
	lineCtx.beginPath();
	lineCtx.moveTo(x,y);
	lineCtx.lineTo(300,y);
	lineCtx.stroke();
}

function setDimensions() {
	circleCanvas.width = circleCanvasWidth;
	circleCanvas.height = circleCanvasHeight;
	circleCanvas.style.width = circleCanvasWidth + 'px';
	circleCanvas.style.height = circleCanvasHeight + 'px';
	lineCanvas.width = canvasWidth;
	lineCanvas.height = canvasHeight;
	lineCanvas.style.width = canvasWidth + 'px';
	lineCanvas.style.height = canvasHeight + 'px';
	lineCanvas.style.top = circleMargin + 'px';
	lineCanvas.style.left = circleMargin + 'px';
	wrapper.style.width = circleCanvasWidth + 'px';
	wrapper.style.height = circleCanvasHeight + 'px';
	angleInfo.style.width = (circleCanvasWidth * .7) + 'px';
}

function convertPtToCanvas(pt) {
	return {
		x: radiusInPixels + (pt.x * radiusInPixels),
		y: radiusInPixels - (pt.y * radiusInPixels)
	}
}

function drawCircle() {
	circleCtx.beginPath();
	circleCtx.strokeStyle = "#cccccc";
	circleCtx.arc(radiusInPixels + circleMargin, radiusInPixels + circleMargin, radiusInPixels, 0, 2*Math.PI);
	circleCtx.stroke();
	circleCtx.beginPath();
	circleCtx.strokeStyle = "#cccccc";
	// x axis:
	circleCtx.moveTo(circleMargin, canvasHeight/2 + circleMargin);
	circleCtx.lineTo(canvasWidth + circleMargin, canvasHeight/2 + circleMargin);
	circleCtx.stroke();
	// y axis:
	circleCtx.moveTo(canvasWidth/2 + circleMargin, circleMargin);
	circleCtx.lineTo(canvasWidth/2 + circleMargin, canvasHeight + circleMargin);
	circleCtx.stroke();
}

const anglesForButtons = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

const anglesInRadians = [createFraction(0,0),
							createFraction('π',6),createFraction('π',4),createFraction('π',3),
							createFraction('π',2),createFraction('2π',3),createFraction('3π',4),
							createFraction('5π',6),createFraction('π',1),createFraction('7π',6),
							createFraction('5π',4),createFraction('4π',3),createFraction('3π',2),
							createFraction('5π',3),createFraction('7π',4),createFraction('11π',6)];


function updateButtons() {
	var toggle = document.getElementById('toggle');
	if (toggle.checked) {
		for (let i=0; i<anglesForButtons.length; i++) {
		createButton(i,1);	// 0=degrees, 1=radians
		}
	}
	else {
		for (let i=0; i<anglesForButtons.length; i++) {
			createButton(i,0);	// 0=degrees, 1=radians
		}
	}
}

function labelUnitCircle() {

	circleCtx.font = "100 18px Helvetica";
	circleCtx.textAlign = "center";
	circleCtx.textBaseline = "middle";
	for (let i=0; i<360; i+=15) {
		drawLine(getAngleInRadians(i));
	}
	//for (let i=0; i<anglesForButtons.length; i++) {
	//	createButton(i,1);	// 0=degrees, 1=radians
	//}

	function drawLine(angleInRadians) {
		var pt = convertPtToCanvas(getPtsOnCircle(angleInRadians));
		circleCtx.strokeStyle = '#cccccc';
		circleCtx.beginPath();
		circleCtx.moveTo(canvasWidth/2+circleMargin, canvasHeight/2+circleMargin);
		circleCtx.lineTo(pt.x+circleMargin, pt.y+circleMargin);
		circleCtx.stroke();
	}


}

function createButton(i,isRadian) {
		var deg = anglesForButtons[i];
		var d = document.createElement('DIV');
		d.style.display = "flex";
		d.style.flexDirection = "column";
		d.style.alignItems = "center";
		d.style.position = "relative";
		d.style.padding = "0 4px";

		var angleInRadians = getAngleInRadians(deg);
		var point = getPtsOnCircle(angleInRadians);
		point.x = 1.1 * point.x;
		point.y = 1.1 * point.y;
		var pt = convertPtToCanvas(point);
		var x = pt.x + circleMargin;
		var y = pt.y + circleMargin;
		var b = document.createElement('BUTTON');
		if (isRadian) {
			var t;
			if (i==0) t = document.createTextNode('0');
			else if (i==8) t = document.createTextNode('π');
			else t = anglesInRadians[i];
		}
		else {
			var t = document.createTextNode(deg + '°');
		}
		b.appendChild(t);
		b.classList.add('angle-button');
		b.style.left = (x-25) + 'px';
		b.style.top = (y-25) + 'px';
		b.setAttribute('onclick', "goToAngle("+deg+")");
		wrapper.appendChild(b);
}

function createFraction(num,den) {
		var d = document.createElement('DIV');
		d.style.display = "flex";
		d.style.flexDirection = "column";
		d.style.alignItems = "center";
		d.style.position = "relative";
		d.style.padding = "0 4px";

		var numerator = document.createElement('DIV');
		numerator.style.display = "flex";
		numerator.style.fontSize = "0.75em";
		numerator.style.lineHeight = "0.9";
		numerator.style.borderBottom = "2px solid #555";
		numerator.style.padding = "0 1px";
		var nn = document.createTextNode(num);
		numerator.appendChild(nn);
		d.appendChild(numerator);

		var denominator = document.createElement('DIV');
		denominator.style.display = "flex";
		denominator.style.fontSize = "0.7em";
		var dd = document.createTextNode(den);
		denominator.appendChild(dd);
		d.appendChild(denominator);

		return d;
}

function clearLineCanvas() {
	lineCtx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawLineFromCenterToPoint(x,y) {
	clearLineCanvas();
	lineCtx.strokeStyle = 'black';
	lineCtx.beginPath();
	lineCtx.moveTo(canvasWidth/2, canvasHeight/2);	// origin
	lineCtx.lineTo(x,y);
	lineCtx.stroke();
}

function drawLineFromCenterFromAngle(angleInDegrees) {
	var rad = getAngleInRadians(angleInDegrees);
	var pt = convertPtToCanvas(getPtsOnCircle(rad));
	drawLineFromCenterToPoint(pt.x, pt.y);
}

function getPtsOnCircle(angleInRadians) {
	return {
		x: Math.cos(angleInRadians),
		y: Math.sin(angleInRadians)
	}
}

function getAngleInRadians(angleInDegrees) {
	return angleInDegrees * (Math.PI/180);
}

function getAngleInDegrees(angleInRadians) {
	return angleInRadians * (180/Math.PI);
}

function goToAngle(angleInDegrees) {
	drawLineFromCenterFromAngle(angleInDegrees);
	var r = getAngleInRadians(angleInDegrees);
	drawGuideLines(r);
	if (angleInDegrees==0 || Number.isInteger(angleInDegrees)) {
		currAngleDisplay.innerHTML = angleInDegrees + '&#176;';
	}
	else {
		currAngleDisplay.innerHTML = angleInDegrees.toFixed(3) + '&#176;';
	}


currAngleDisplayRad.innerHTML = r.toFixed(3);

}


