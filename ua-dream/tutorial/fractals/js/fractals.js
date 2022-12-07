//-----------------------------------------------------------------------
// Fractals
//
// Author: delimitry
//-----------------------------------------------------------------------
let frame_width;
let frame_height;

const canvas = document.getElementById("cv");
const context = canvas.getContext("2d");

window.addEventListener("resize", () => setSize());

function setSize() {
	frame_height = window.innerHeight;
	frame_width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	render();
}

function clear() {
	ctx.fillStyle = "rgba(0,0,0,1)"; //"rgba(0,0,0,0.1)"//#1
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

setSize();



function render() {
	context.clearRect(0, 0, frame_width, frame_height);
	max_iterations = 100;
	drawMandelbrot(frame_width, frame_height);
	// drawJulia(frame_width , frame_height);
	//drawBurningShipFractal(frame_width , frame_height);
	// drawSierpinskiCarpet(frame_width , frame_height);
}

function drawMandelbrot(frame_width, frame_height) {
	// prepare image and pixels
	var image_data = context.createImageData(frame_width, frame_height);
	var d = image_data.data;

	// max_iterations = 100;
	for (var i = 0; i < frame_height; i++) {
		for (var j = 0; j < frame_width; j++) {

			// limit the axis
			x0 = -2.0 + j * 3.0 / frame_width;	// (-2, 1)
			y0 = -1.0 + i * 2.0 / frame_height;	// (-1, 1)

			x = 0;
			y = 0;
			iteration = 0;

			while ((x * x + y * y < 4) && (iteration < max_iterations)) {
				x_n = x * x - y * y + x0;
				y_n = 2 * x * y + y0;
				x = x_n;
				y = y_n;
				iteration++;
			}

			// set pixel color [r,g,b,a]
			d[i * frame_width * 4 + j * 4 + 0] = iteration * 15;
			d[i * frame_width * 4 + j * 4 + 1] = iteration * 3;
			d[i * frame_width * 4 + j * 4 + 2] = iteration * 5;
			d[i * frame_width * 4 + j * 4 + 3] = 255;
		}
	}

	// draw image
	context.putImageData(image_data, 0, 0);
}


function drawJulia(frame_width, frame_height) {
	// prepare image and pixels
	var image_data = context.createImageData(frame_width, frame_height);
	var d = image_data.data;

	x0 = -0.4;
	y0 = -0.6;
	// max_iterations = 100;
	for (var i = 0; i < frame_height; i++) {
		for (var j = 0; j < frame_width; j++) {

			// limit the axis
			x = -1.5 + j * 3.0 / frame_width;
			y = -1.0 + i * 2.0 / frame_height;

			iteration = 0;

			while ((x * x + y * y < 4) && (iteration < max_iterations)) {
				x_n = x * x - y * y + x0;
				y_n = 2 * x * y + y0;
				x = x_n;
				y = y_n;
				iteration++;
			}

			// set pixel color [r,g,b,a]
			d[i * frame_width * 4 + j * 4 + 0] = iteration * 25;
			d[i * frame_width * 4 + j * 4 + 1] = iteration * 5;
			d[i * frame_width * 4 + j * 4 + 2] = iteration * 8;
			d[i * frame_width * 4 + j * 4 + 3] = 255;
		}
	}

	// draw image
	context.putImageData(image_data, 0, 0);
}

function drawBurningShipFractal(frame_width, frame_height) {
	// prepare image and pixels
	var image_data = context.createImageData(frame_width, frame_height);
	var d = image_data.data;

	// max_iterations = 100;
	for (var i = 0; i < frame_height; i++) {
		for (var j = 0; j < frame_width; j++) {

			x0 = -1.80 + j * (-1.7 + 1.80) / frame_width;
			y0 = -0.08 + i * (0.01 + 0.08) / frame_height;
			x = 0;
			y = 0;
			iteration = 0;

			while ((x * x + y * y < 4) && (iteration < max_iterations)) {
				x_n = x * x - y * y + x0;
				y_n = 2 * Math.abs(x * y) + y0;
				x = x_n;
				y = y_n;
				iteration++;
			}

			// set pixel color [r,g,b,a]
			d[i * frame_width * 4 + j * 4 + 0] = 25 + iteration * 30;
			d[i * frame_width * 4 + j * 4 + 1] = 25 + iteration * 10;
			d[i * frame_width * 4 + j * 4 + 2] = 85 - iteration * 5;
			d[i * frame_width * 4 + j * 4 + 3] = 255;
		}
	}

	// draw image
	context.putImageData(image_data, 0, 0);
}

function drawSierpinskiCarpet(frame_width, frame_height) {
	// draw carpet
	var draw_carpet = function (x, y, width, height, iteration) {
		if (iteration == 0) return;
		var w = width / 3;
		var h = height / 3;

		// draw subsquare
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect(x + w, y + h, w, h);

		// draw subcarpets
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				// remove central subsquare
				if (j == 1 && i == 1) continue;
				draw_carpet(x + j * w, y + i * h, w, h, iteration - 1);
			}
		}
	}

	// init carpet size		
	var carpet_width = frame_height;
	var carpet_height = frame_height;
	// align to the center
	var carpet_left = (frame_width - carpet_width) / 2;
	// limit the depth of recursion
	var max_iterations = 4;

	// draw Sierpinski carpet
	draw_carpet(carpet_left, 0, carpet_width, carpet_height, max_iterations);
}
