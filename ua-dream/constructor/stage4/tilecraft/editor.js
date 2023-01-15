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

function mouse_down(event) {
    event.preventDefault();
    if (event.which === 3) {// right button click
        screenshot_mode = true;
        return;
    }

    screenshot_mode = false;

    if (selectionToolModel.enabled) {
        handleMouseEvents(event);
        return;
    }

    let gridSize = layer().gridSize;

    startX = parseInt(event.clientX - offset_x - gridSize / 2)
    startY = parseInt(event.clientY - offset_y - gridSize / 2)

    if (event.touches && event.touches.length > 0) {
        if (event.touches.length > 1) {
            return;
        }

        startX = parseInt(event.touches[0].clientX - offset_x - gridSize / 2)
        startY = parseInt(event.touches[0].clientY - offset_y - gridSize / 2)

        // touch specific
        mouseEditor.x = startX;
        mouseEditor.y = startY;

        if (gridOn) {
            mouseEditor.x = roundNearest(mouseEditor.x, gridSize);
            mouseEditor.y = roundNearest(mouseEditor.y, gridSize);
        }
    }

    if (typeof xLock == 'number') {
        mouseEditor.x = xLock;
    }
    if (typeof yLock == 'number') {
        mouseEditor.y = yLock;
    }

    if (layer().edit_mode) {
        selectShape();
    }
    else if (layer().move_mode) {
        // do nothing
    }
    else {
        addShape();
    }

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
    let pinch = handlePinch(event);

    if (pinch) {
        return;
    }

    if (selectionToolModel.enabled) {
        handleMouseEvents(event);
        return;
    }

    let gridSize = layer().gridSize;

    mouseEditor.x = parseInt(event.clientX - offset_x) - gridSize / 2;
    mouseEditor.y = parseInt(event.clientY - offset_y) - gridSize / 2;

    if (event.touches && event.touches.length > 0) {
        mouseEditor.x = parseInt(event.touches[0].clientX - offset_x) - gridSize / 2;
        mouseEditor.y = parseInt(event.touches[0].clientY - offset_y) - gridSize / 2;
    }
    if (typeof xLock == 'number') {
        mouseEditor.x = xLock;
    }
    if (typeof yLock == 'number') {
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

        } else if (layer().move_mode) {// MOVE TOOL
            if (layer().selection && layer().selection.length > 0) {

                if (layer().move_selection_copy) {
                    let deepCopy = layer().selection.map((s) => ({ x: s.x, y: s.y, c: s.c }))
                    layer().shapes = layer().shapes.concat(deepCopy);
                    layer().selection = [...deepCopy];

                    for (let s of layer().selection) {
                        s.x += dx;
                        s.y += dy;
                    }
                    layer().move_selection_copy = false;

                } else {

                    if (selectionToolModel.inversed) {
                        for (let s of layer().shapes) {
                            if (layer().selection.indexOf(s) < 0) {
                                s.x += dx;
                                s.y += dy;
                            }
                        }
                    } else {
                        for (let s of layer().selection) {
                            s.x += dx;
                            s.y += dy;
                        }

                    }
                }

            } else {
                for (let s of layer().shapes) {
                    s.x += dx;
                    s.y += dy;
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

canvas.onwheel = onwheel;

function getPositionAlongTheLine(x1, y1, x2, y2, percentage) {
    return { x: x1 * (1.0 - percentage) + x2 * percentage, y: y1 * (1.0 - percentage) + y2 * percentage };
}

const zoomIntensity = 0.2;

function onwheel(event) {
    event.preventDefault();

    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    const wheel = event.deltaY < 0 ? 1 : -1;
    const zoom = wheel * zoomIntensity;

    if (event.ctrlKey) {
        zoomSelectionToolShape(mouseX, mouseY, zoom);
        return;
    }
    zoomLayerShapes(mouseX, mouseY, zoom);
}

function zoomSelectionToolShape(mouseX, mouseY, zoom) {

    for (let p of selectionTool.points) {

        let xy = getPositionAlongTheLine(p.x, p.y, mouseX, mouseY, zoom);
        p.x = xy.x;
        p.y = xy.y;
    }
    selectionTool.center();
}

function zoomLayerShapes(mouseX, mouseY, zoom) {
    for (let shape of layer().shapes) {

        let xy = getPositionAlongTheLine(shape.x, shape.y, mouseX, mouseY, zoom);
        shape.x = xy.x;
        shape.y = xy.y;
    }
    if (layer().selection && layer().selection.length > 0) {
        for (let shape of layer().selection) {

            let xy = getPositionAlongTheLine(shape.x, shape.y, mouseX, mouseY, zoom);
            shape.x = xy.x;
            shape.y = xy.y;
        }
    }
}

let lastDist, lastCenter;
function handlePinch(evt) {

    evt.preventDefault();

    if (!evt.touches) return;

    var touch1 = evt.touches[0];
    var touch2 = evt.touches[1];

    if (touch1 && touch2) {

        var p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
        };

        var p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
        };

        debugInfo[0] = JSON.stringify(evt.touches);
        debugInfo[1] = JSON.stringify({ p1: p1, p2: p2 });

        if (!lastCenter) {
            lastCenter = getCenter(p1, p2);
            return;
        }

        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!lastDist) {
            lastDist = dist;
        }

        let zoom = dist > lastDist ? -zoomIntensity / 10 : zoomIntensity / 10;

        zoomLayerShapes(newCenter.x, newCenter.y, zoom);

        lastDist = dist;

        return true;
    }

    return false;
}

function getDistance(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function getCenter(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}