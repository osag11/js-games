// https://www.youtube.com/watch?v=7PYvx8u_9Sk&t=577s
// Canvas HTML5 JavaScript Full Tutorial
// Canvas Drag & Drop Objects Tutorial | HTML5 Canvas JavaScript Tutorial [#10]
let pathes = [];

let is_dragging = false;
let startX;
let startY;

let offset_x;
let offset_y;

function get_offset () {
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

function mouse_down(event) {
    //event.preventDefault();

    startX = parseInt(event.clientX - offset_x)
    startY = parseInt(event.clientY - offset_y)
    
    current_shape = Shapes.is_in_shape(startX, startY);
    is_dragging = current_shape ? true : false;
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
    if (!is_dragging) {
        return;
    } else {

       // event.preventDefault();

        let mouseX = parseInt(event.clientX - offset_x);
        let mouseY = parseInt(event.clientY - offset_y);

        if (gridOn) {
            mouseX = roundNearest(mouseX, 10);
            mouseY = roundNearest(mouseY, 10);
        }

        let dx = mouseX - startX;
        let dy = mouseY - startY;

        if (current_shape) {
            Shapes.move(current_shape, dx, dy);
        }

        startX = mouseX;
        startY = mouseY;

        console.log(`${startX}, ${startY}`)
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;

canvas.onmousemove = mouse_move;
canvas.onmouseout = mouse_out;


// function is_mouse_in_shape(x, y, shape) {
//     let shape_left = shape.x;
//     let shape_right = shape.x + shape.width;

//     let shape_top = shape.y;
//     let shape_bottom = shape.y + shape.height;

//     if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
//         return true;
//     }
//     return false;
// }