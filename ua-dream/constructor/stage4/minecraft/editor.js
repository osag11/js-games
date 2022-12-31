// https://www.youtube.com/watch?v=7PYvx8u_9Sk&t=577s
// Canvas HTML5 JavaScript Full Tutorial
// Canvas Drag & Drop Objects Tutorial | HTML5 Canvas JavaScript Tutorial [#10]
let shapes = [];
let shapesHistory = [];

let is_dragging, edit_mode = false;
let startX;
let startY;

let offset_x;
let offset_y;

function get_offset() {
    let canvas_offsets = canvas.getBoundingClientRect();
    offset_x = canvas_offsets.left;
    offset_y = canvas_offsets.top;
}

window.onscroll = function () { get_offset(); }

window.onresize = function () {
    setSize();
    get_offset();
}
canvas.onresize = function () { get_offset(); }

let current_shape = null;

function selectShape() {

    let pX = mouseEditor.x;
    let pY = mouseEditor.y;
    // let pColor = pickerModel.rgbaColor;

    let existing = findShape(pX, pY);

    // let existing = shapes.find(el =>
    //     el.x === pX &&
    //     el.y === pY);

    if (existing) {
        current_shape = existing;
        pick(existing.c);
        randomColor = false;

    } else {
        current_shape = null;
    }
}

function addShape() {

    let color = randomColor ? generateColor() : pickerModel.rgbaColor;
    let newShape = { x: mouseEditor.x, y: mouseEditor.y, c: color };

    let existing = shapes.find(el =>
        el.x === newShape.x &&
        el.y === newShape.y &&
        (randomColor || el.c === newShape.c));

    if (!existing) {
        shapes.push(newShape);
        // current_shape = newShape;

    } else {

        current_shape = existing;
        console.log('skip:' + JSON.stringify(newShape));
    }
}

function mouse_down(event) {
    //event.preventDefault();

    startX = parseInt(event.clientX - offset_x)
    startY = parseInt(event.clientY - offset_y)


    if (edit_mode)
        selectShape();
    else
        addShape();


    is_dragging = true;
}

function mouse_up(event) {
    if (!is_dragging) {
        return;
    }
    //event.preventDefault();
    is_dragging = false;
}

function mouse_out(event) {
    if (!is_dragging) {
        return;
    }
    //event.preventDefault();
    is_dragging = false;
}

function mouse_move(event) {

    mouseEditor.x = parseInt(event.clientX - offset_x) - gridSize / 2;
    mouseEditor.y = parseInt(event.clientY - offset_y) - gridSize / 2;

    if (gridOn) {
        mouseEditor.x = roundNearest(mouseEditor.x, gridSize);
        mouseEditor.y = roundNearest(mouseEditor.y, gridSize);
    }

    if (!is_dragging) {
        return;
    } else {

        // event.preventDefault();

        let mouseX = parseInt(event.clientX - offset_x);
        let mouseY = parseInt(event.clientY - offset_y);

        if (gridOn) {
            mouseX = roundNearest(mouseX, gridSize);
            mouseY = roundNearest(mouseY, gridSize);
        }

        let dx = mouseX - startX;
        let dy = mouseY - startY;

        if (edit_mode) {

            if (current_shape) {

                current_shape.x += dx;
                current_shape.y += dy;
                if (gridOn) {
                    current_shape.x = roundNearest(current_shape.x, gridSize);
                    current_shape.y = roundNearest(current_shape.y, gridSize);
                }
            }

        } else {
            addShape();
        }

        startX = mouseX;
        startY = mouseY;

        // console.log(`${startX}, ${startY}`)
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;

canvas.onmousemove = mouse_move;
canvas.onmouseout = mouse_out;

function draw() {

    for (let s of shapes) {
        ctx.fillStyle = s.c;
        if (shapeType === 'square') {

            ctx.fillRect(s.x, s.y, gridSize, gridSize);
        }

        if (shapeType === 'circle') {
            ctx.beginPath();
            ctx.arc(s.x + gridSize / 2, s.y + gridSize / 2, Math.abs(gridSize / 2), 0, 2 * Math.PI, 0);
            ctx.fill();
        }
        // center
        // ctx.fillStyle = "red";
        // ctx.fillRect(s.x, s.y, 2, 2);
    }

    drawPointer();
}


function drawPointer() {

    if (edit_mode) {
        // selected grid cell
        ctx.fillStyle = "blue";
        let size = 5;
        ctx.fillRect(mouseEditor.x, mouseEditor.y, size, size);
        ctx.fillRect(mouseEditor.x, mouseEditor.y + gridSize - size, size, size);
        ctx.fillRect(mouseEditor.x + gridSize - size, mouseEditor.y, size, size);
        ctx.fillRect(mouseEditor.x + gridSize - size, mouseEditor.y + gridSize - size, size, size);

        // current shape selection
        if (current_shape) {
            ctx.strokeStyle = "red"
            ctx.lineWidth = 2;
            ctx.strokeRect(current_shape.x, current_shape.y, gridSize, gridSize);
        }
    }
    // big crosss
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = pickerModel.rgbaColor; // from picker
    ctx.beginPath();
    ctx.moveTo(mouseEditor.x + gridSize / 2, 0);
    ctx.lineTo(mouseEditor.x + gridSize / 2, canvas.height);

    ctx.moveTo(0, mouseEditor.y + gridSize / 2);
    ctx.lineTo(canvas.width, mouseEditor.y + gridSize / 2);
    ctx.rect(mouseEditor.x, mouseEditor.y, gridSize, gridSize);
    ctx.stroke();

}

function findShape(x, y) {
    result = [];
    for (var i = shapes.length - 1; i >= 0; i--) {
        let shape = shapes[i];

        let shape_left = shape.x - gridSize / 2;
        let shape_right = shape.x + gridSize;

        let shape_top = shape.y - gridSize / 2;
        let shape_bottom = shape.y + gridSize;

        if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
            if (result.length < 30) {
                result.push(shape);
            }
        }
    }
    console.log(JSON.stringify(result));
    result.sort((a, b) => {
        return (a.x - b.x) * (a.y - b.y);
    })
    console.log(`----${x};${y}------`)
    console.log(JSON.stringify(result));

    return result[0];// result[result.length-1];
}

function randomColorClick(isChecked)
{
    console.log(isChecked);
    colorLabel.style.backgroundColor = isChecked?'white':pickerModel.rgbaColor;
    colorLabel.children[0].textContent = isChecked?'random':'';
}