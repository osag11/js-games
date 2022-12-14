const mouse = { x: 0, y: 0, button: 0, lx: 0, ly: 0, update: true };
const markRadius = 4;

function mouseEvents(e) {

    const bounds = toolsCanvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - window.scrollX - markRadius;
    mouse.y = e.pageY - bounds.top - window.scrollY - markRadius;

    if (gridOn) {
        mouse.x = roundNearest(mouse.x, 10);
        mouse.y = roundNearest(mouse.y, 10);
    }

    if (mouse.x > 0 && mouse.x < toolsCanvas.width && mouse.y > 0 && mouse.y < toolsCanvas.height) {
        mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
        mouse.update = true;

        if (e.type === "mousedown" && activePoint) {
            insertPoint = activePoint;
        }
    }
}

["mousedown", "mouseup", "mousemove"].forEach(name => document.addEventListener(name, mouseEvents));
// http://jsfiddle.net/cpbwx5vr/1/

const point = (x, y) => ({ x, y });

const poly = () => ({
    color: undefined,
    fill: false,
    points: [],

    addPoint(p) {
        if (insertPoint) {
            let idx = this.points.indexOf(insertPoint) + 1;
            this.points.splice(idx, 0, point(p.x, p.y));
        } else {
            this.points.push(point(p.x, p.y));
        }
        console.log(`(${p.x}; ${p.y})`);
    },

    draw() {
        ctx2.lineWidth = 2;
        ctx2.beginPath();

        if (this.points && this.points.length > 0) {
            ctx2.moveTo(this.points[0].x, this.points[0].y)
        }

        for (const p of this.points) {
            ctx2.lineTo(p.x, p.y)
        }

        if (this.fill) {
            ctx2.fillStyle = this.color;
            ctx2.fill();
        } else {
            ctx2.strokeStyle = this.color;
            ctx2.stroke();
        }

        ctx2.closePath();
        ctx2.save();

        // draw marks
        if (this.fill) ctx2.strokeStyle = "blue";

        for (const p of this.points) {
            ctx2.moveTo(p.x + 4, p.y);
            ctx2.arc(p.x, p.y, markRadius, 0, Math.PI * 2);
        }
        ctx2.stroke();
    },

    closest(pos, dist = markRadius * 2) {
        var i = 0, index = -1;
        dist *= dist;
        for (const p of this.points) {
            var x = pos.x - p.x;
            var y = pos.y - p.y;
            var d2 = x * x + y * y;
            if (d2 < dist) {
                dist = d2;
                index = i;
            }
            i++;
        }
        if (index > -1) { return this.points[index] }
    }
});

function drawCircle(pos, color = "red", size = 8) {
    ctx2.strokeStyle = color;
    ctx2.beginPath();
    ctx2.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx2.stroke();
}

let polygon = poly();
var activePoint, insertPoint, cursor;
var dragging = false;

function update() {
    if (mouse.update) {
        cursor = "crosshair";

        ctx2.clearRect(0, 0, toolsCanvas.width, toolsCanvas.height);
        if (gridOn) drawGrid(ctx2);

        if (!dragging) { activePoint = polygon.closest(mouse) }

        if (activePoint === undefined && mouse.button) {
            polygon.addPoint(mouse);
            mouse.button = false;
        } else if (activePoint) {
            if (mouse.button) {
                if (dragging) {
                    activePoint.x += mouse.x - mouse.lx;
                    activePoint.y += mouse.y - mouse.ly;
                } else { dragging = true }
            } else { dragging = false }
        }

        polygon.color = pickerModel.rgbaColor;
        polygon.draw();

        if (activePoint) {
            drawCircle(activePoint);
            cursor = "move";
        }

        if (insertPoint) {
            drawCircle(insertPoint, 'yellow');
        }

        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        toolsCanvas.style.cursor = cursor;
        mouse.update = false;
    }
}

// function to detect the mouse position
// function oMousePos(canvas, evt) {
//     var ClientRect = canvas.getBoundingClientRect();
//     return {
//         x: Math.round(evt.clientX - ClientRect.left),
//         y: Math.round(evt.clientY - ClientRect.top)
//     };
// }

window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed} ${event.code}`)

    if (keyPressed == 46) { // Del
        if (insertPoint) {
            let idx = polygon.points.indexOf(insertPoint)
            polygon.points.splice(idx, 1);
            insertPoint = undefined;
            mouse.update = true;
            return;
        }

        if (current_shape) {
            let idx = objectsStore.indexOf(current_shape)
            objectsStore.splice(idx, 1);
            current_shape = undefined;
            return;
        }
    }

    if (keyPressed == 71) {// G
        gridOn = !gridOn;
    }

    if (keyPressed == 27) {// Esc
        // ["mousedown", "mouseup", "mousemove"].forEach(name => document.removeEventListener(name, mouseEvents));
        // ["mousedown", "mouseup", "mousemove"].forEach(name => document.addEventListener(name, mouseEvents));
        // Shapes = RenderModel(ctx);

        // demo();
        // polygon.points = [];
        // polygon = poly();

        if (objectsStore.length > 0) {
            objectsStore = [];
            return;
        }

        if (polygon.points.length > 0) {
            polygon.points = [];
            return;
        }
    }
}

let closePath = true;
function handleClosePathClick(cb) {
    closePath = cb.checked;
}

function apply() {
    let points = [...polygon.points];
    if (closePath) {
        points.push(point(polygon.points[0].x, polygon.points[0].y));
    }

    Shapes.add(shapeData(points, [], 'path', polygon.color, polygon.fill))

    polygon.points = [];

    insertPoint = undefined;
    mouse.update = true;
}

function switchFill() {
    polygon.fill = !polygon.fill;
    fillSwitch.style.background = polygon.fill ? pickerModel.rgbaColor : "transparent";
    mouse.update = true;
}