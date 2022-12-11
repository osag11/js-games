const canvas = document.getElementById("cw");//#5
const ctx2 = canvas.getContext("2d");//#5
canvas.style = "border: 1px solid; background-color:white;"//#6


function drawEllipse(x, y, radiusX, radiusY, color) {
    ctx2.beginPath();
    ctx2.ellipse(x, y, radiusX, radiusY, 0, 2 * Math.PI, 0);
    ctx2.closePath();
    ctx2.fillStyle = color;
    ctx2.fill();
}

function drawCircle(x, y, radius, color) {
    ctx2.beginPath();
    ctx2.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx2.closePath();
    ctx2.fillStyle = color;
    ctx2.fill();
}


function drawRect(x, y, color, size) {
    ctx2.fillStyle = color;
    ctx2.fillRect(x, y, size, size);
}


function drawTriangle(x, y, color, size) {

    ctx2.fillStyle = color;

    ctx2.beginPath();
    ctx2.moveTo(x, y);
    ctx2.lineTo(x - size, y - size);
    ctx2.lineTo(x + size, y - size);
    ctx2.fill();
}


// version 2
function drawFrogScaled(x, y,scale) {
    drawEllipse(x + (150)*scale, y + 120*scale, 50*scale, 100*scale, 'green');
    drawEllipse(x + (150 +150)*scale, y + 120*scale, 50*scale, 100*scale, 'green');

    drawCircle(x + (150)*scale, y + 100*scale, 60*scale, 'blue');// left eye
    drawCircle(x + (150)*scale, y + 100*scale, 20*scale, 'red');// right eye

    drawCircle(x + (150 + 150)*scale, y + 100*scale, 60*scale, 'blue');// left eye
    drawCircle(x + (150 + 150)*scale, y + 100*scale, 20*scale, 'red');// left eye

    drawCircle(x + (150 + 75)*scale, y + 350*scale, 200*scale, 'green');//body

    drawCircle(x + (150 + 225)*scale, y + 560*scale, 60*scale, 'green');//right leg
    drawCircle(x + (150 + -75)*scale, y + 560*scale, 65*scale, 'green');//left leg
}

drawFrogScaled(500, 0, 0.5);

drawFrogScaled(0, 200, 0.2);

drawFrogScaled(300, 300, 0.6);

// version 1
// function drawFrog(x, y) {
//     drawEllipse(x + 150, y + 120, 50, 100, 'green');
//     drawEllipse(x + 150 +150, y + 120, 50, 100, 'green');

//     drawCircle(x + 150, y + 100, 60, 'blue');// left eye
//     drawCircle(x + 150, y + 100, 20, 'red');// right eye

//     drawCircle(x + 150 + 150, y + 100, 60, 'blue');// left eye
//     drawCircle(x + 150 + 150, y + 100, 20, 'red');// left eye

//     drawCircle(x + 150 + 75, y + 350, 200, 'green');//body

//     drawCircle(x + 150 + 250, y + 550, 60, 'green');//right leg
//     drawCircle(x + 150 + -75, y + 560, 65, 'green');//left leg

// }

// drawFrog(500, 0);

// drawFrog(0, 200);

// drawFrog(300, 300);


