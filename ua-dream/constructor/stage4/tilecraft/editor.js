// https://www.youtube.com/watch?v=7PYvx8u_9Sk&t=577s
// Canvas HTML5 JavaScript Full Tutorial
// Canvas Drag & Drop Objects Tutorial | HTML5 Canvas JavaScript Tutorial [#10]

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

let screenshot_mode = false;

function mouse_down(event) {
    event.preventDefault();
    if (event.which === 3) {
        screenshot_mode = true;
        return;
    }
    screenshot_mode = false;

    startX = parseInt(event.clientX - offset_x)
    startY = parseInt(event.clientY - offset_y)

    if (event.touches && event.touches.length > 0) {
        startX = parseInt(event.touches[0].clientX - offset_x)
        startY = parseInt(event.touches[0].clientY - offset_y)

        // touch specific
        mouseEditor.x = startX;
        mouseEditor.y = startY;

        if (gridOn) {
            mouseEditor.x = roundNearest(mouseEditor.x, gridSize);
            mouseEditor.y = roundNearest(mouseEditor.y, gridSize);
        }
    }

    if (layer().edit_mode)
        selectShape();
    else
        addShape();

    is_dragging = true;
}

function mouse_up(event) {
    if (!is_dragging) {
        return;
    }
    event.preventDefault();
    is_dragging = false;
}

function mouse_out(event) {
    if (!is_dragging) {
        return;
    }
    event.preventDefault();
    is_dragging = false;
}

function mouse_move(event) {
    let gridSize = layer().gridSize;

    mouseEditor.x = parseInt(event.clientX - offset_x) - gridSize / 2;
    mouseEditor.y = parseInt(event.clientY - offset_y) - gridSize / 2;

    if (event.touches && event.touches.length > 0) {
        mouseEditor.x = parseInt(event.touches[0].clientX - offset_x) - gridSize / 2;
        mouseEditor.y = parseInt(event.touches[0].clientY - offset_y) - gridSize / 2;
        
        // touchend(mouseEditor.x, mouseEditor.y);
    }
    if (xLock) {
        mouseEditor.x = xLock;
    }
    if (yLock) {
        mouseEditor.y = yLock;
    }

    if (gridOn) {
        mouseEditor.x = roundNearest(mouseEditor.x, gridSize);
        mouseEditor.y = roundNearest(mouseEditor.y, gridSize);
    }

    if (!is_dragging) {
        return;
    } else {

        event.preventDefault();

        let mouseX = parseInt(event.clientX - offset_x);
        let mouseY = parseInt(event.clientY - offset_y);

        if (event.touches && event.touches.length > 0) {
            mouseX = parseInt(event.touches[0].clientX - offset_x);
            mouseY = parseInt(event.touches[0].clientY - offset_y);
        }

        if (gridOn) {
            mouseX = roundNearest(mouseX, gridSize);
            mouseY = roundNearest(mouseY, gridSize);
        }

        let dx = mouseX - startX;
        let dy = mouseY - startY;

        if (layer().edit_mode) {

            if (layer().current_shape) {

                layer().current_shape.x += dx;
                layer().current_shape.y += dy;

                if (gridOn) {
                    layer().current_shape.x = roundNearest(layer().current_shape.x, gridSize);
                    layer().current_shape.y = roundNearest(layer().current_shape.y, gridSize);
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
    ctx2.clearRect(0, 0, toolsCanvas.width, toolsCanvas.height);
}

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;

canvas.onmousemove = mouse_move;
canvas.onmouseout = mouse_out;

// touch device
canvas.ontouchstart = mouse_down;
canvas.ontouchmove = mouse_move;
canvas.ontouchend = mouse_out;


