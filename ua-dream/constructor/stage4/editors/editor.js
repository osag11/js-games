// https://www.youtube.com/watch?v=7PYvx8u_9Sk&t=577s
// Canvas HTML5 JavaScript Full Tutorial
// Canvas Drag & Drop Objects Tutorial | HTML5 Canvas JavaScript Tutorial [#10]
let pathes = [];

let shapes = [];
let polygons = [];

let current_shape_index = null;
let current_path_index = null;

let is_dragging = false;
let startX;
let startY;

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

function is_mouse_in_shape(x, y, shape) {
    let shape_left = shape.x;
    let shape_right = shape.x + shape.width;

    let shape_top = shape.y;
    let shape_bottom = shape.y + shape.height;

    if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
        return true;
    }
    return false;
}
let current_shape = null;

function mouse_down(event) {

    event.preventDefault();

    startX = parseInt(event.clientX - offset_x)
    startY = parseInt(event.clientY - offset_y)
    current_shape = Shapes.is_in_shape(startX, startY);
    is_dragging = current_shape ? true : false;
    // let index = 0;
    // for (let shape of shapes) {
    //     if (is_mouse_in_shape(startX, startY, shape)) {
    //         current_shape_index = index;
    //         is_dragging = true;

    //         current_path_index = null;
    //         return;
    //     }
    //     index++;
    // }
    // current_shape_index = null;

    // // pathes
    // index = 0;
    // for (let p of pathes) {
    //     if (ctx.isPointInPath(p, startX, startY)) {
    //         current_path_index = index;
    //         is_dragging = true;
    //         return;
    //     }
    //     index++;
    // }
    // current_path_index = null;
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

        if (current_shape) {
            Shapes.move(current_shape, dx, dy);
        }

        // // current_shape
        // let current_shape = shapes[current_shape_index];
        // if (current_shape) {
        //     current_shape.x += dx;
        //     current_shape.y += dy;
        //     if (gridOn) {
        //         current_shape.x = roundNearest(current_shape.x, 10);
        //         current_shape.y = roundNearest(current_shape.y, 10);
        //     }
        //     console.log(`(${current_shape.x}; ${current_shape.y})`);
        // }

        // // current_path        
        // let current_path = polygons[current_path_index];
        // // let pathOrigin = pathes[current_path_index];
        // if (current_path) {

        //     for (const p of current_path.points) {
        //         ctx.lineTo(p.x, p.y);
        //         p.x += dx;
        //         p.y += dy;

        //         if (gridOn) {
        //             p.x = roundNearest(p.x, 10);
        //             p.y = roundNearest(p.y, 10);
        //         }
        //         console.log(`(${p.x}; ${p.y})`);
        //     }
        // }

        startX = mouseX;
        startY = mouseY;
    }
}

function clear() {
    // ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// function draw_shapes() {
//     for (let shape of shapes) {
//         ctx.fillStyle = shape.color;
//         ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
//     }

//     // polygons:
//     drawPolygons2();
// }

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;

canvas.onmousemove = mouse_move;
canvas.onmouseout = mouse_out;


// function drawPolygons2() {
//     pathes = [];
//     for (let poly of polygons) {
//         ctx.lineWidth = 2;
//         const path = new Path2D();
//         for (const p of poly.points) {
//             path.lineTo(p.x, p.y);
//         }
//         path.points = poly.points;
//         path.closePath();

//         if (poly.fill) {
//             ctx.fillStyle = poly.color;
//             ctx.fill(path);
//         } else {
//             ctx.strokeStyle = poly.color;
//             ctx.stroke(path);
//         }

//         ctx.save();
//         pathes.push(path);
//     }
// }

// function drawPolygons() {
//     for (let poly of polygons) {
//         ctx.lineWidth = 2;
//         ctx.beginPath();

//         for (const p of poly.points) {
//             ctx.lineTo(p.x, p.y);
//         }
//         ctx.closePath();

//         if (poly.color) {
//             ctx.fillStyle = poly.color;
//             ctx.fill();
//         } else {
//             ctx.strokeStyle = 'green';
//             ctx.stroke();
//         }

//         ctx.save();
//     }
// }

