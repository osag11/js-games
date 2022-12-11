// https://www.youtube.com/watch?v=7PYvx8u_9Sk&t=577s
// Canvas HTML5 JavaScript Full Tutorial
// Canvas Drag & Drop Objects Tutorial | HTML5 Canvas JavaScript Tutorial [#10]
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.border = '5px solid blue';

const toolsCanvas = document.getElementById("tools");
toolsCanvas.style.border = '5px solid green';
const ctx2 = toolsCanvas.getContext("2d");


function setSize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth - tools.width;
    toolsCanvas.height = window.innerHeight;
    toolsCanvas.style.marginTop = colorBlock.height + 12 + "px";
}

let offset_x;
let offset_y;

let get_offset = function () {
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

let shapes = [];
let current_shape_index = null;
let is_dragging = false;
let startX;
let startY;

shapes.push({ x: 200, y: 50, width: 200, height: 200, color: 'blue' });
shapes.push({ x: 100, y: 50, width: 100, height: 100, color: 'red' });
shapes.push({ x: 100, y: 150, width: 70, height: 70, color: 'white' });

let is_mouse_in_shape = function (x, y, shape) {
    let shape_left = shape.x;
    let shape_right = shape.x + shape.width;

    let shape_top = shape.y;
    let shape_bottom = shape.y + shape.height;

    if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
        return true;
    }
    return false;
}

let mouse_down = function (event) {

    event.preventDefault();

    startX = parseInt(event.clientX - offset_x)
    startY = parseInt(event.clientY - offset_y)
    let index = 0;
    for (let shape of shapes) {
        if (is_mouse_in_shape(startX, startY, shape)) {
            current_shape_index = index;
            is_dragging = true;
            return;
        }
        index++;
    }
}


let mouse_up = function (event) {
    if (!is_dragging) {
        return;
    }
    event.preventDefault();
    is_dragging = false;
}


let mouse_out = function (event) {
    if (!is_dragging) {
        return;
    }
    event.preventDefault();
    is_dragging = false;
}


let mouse_move = function (event) {
    if (!is_dragging) {
        return;
    } else {
        event.preventDefault();
        let mouseX = parseInt(event.clientX - offset_x);
        let mouseY = parseInt(event.clientY - offset_y);

        if (gridOn) {
            mouseX = roundNearest(mouseX, 10);
            mouseY = roundNearest(mouseY, 10);
        }

        let dx = mouseX - startX;
        let dy = mouseY - startY;


        let current_shape = shapes[current_shape_index];
        current_shape.x += dx;
        current_shape.y += dy;
        if (gridOn) {
            current_shape.x = roundNearest(current_shape.x, 10);
            current_shape.y = roundNearest(current_shape.y, 10);
        }

        startX = mouseX;
        startY = mouseY;
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let draw_shapes = function () {

    for (let shape of shapes) {
        ctx.fillStyle = shape.color;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    }
}

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;

canvas.onmousemove = mouse_move;
canvas.onmouseout = mouse_out;

function roundNearest(num,nearest=10) {
    return Math.round(num / nearest) * nearest;
  }
// entry-point
setSize();
get_offset();

function main() {
    window.requestAnimationFrame(main);
    clear();
    draw_shapes();
    if (gridOn) drawGrid(ctx);
}

initGrid();
main();