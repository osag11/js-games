let current_shape = null;
const mouseEditor = { x: 0, y: 0 };

let randomColor = false;
let is_dragging, edit_mode, move_mode = false;

const model = {
    activeLayer: 0,
    layers: [
        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'circle',
            polygonSize: 6,
            gridSize: 50,
        },

        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'polygon',
            polygonSize: 3,
            gridSize: 30,
        },

        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'square',
            polygonSize: 3,
            gridSize: 10,
        },
    ]
}
let layer = function () {
    return model.layers[model.activeLayer];
}

function selectShape() {
    if (!layer().visible) return;

    let pX = mouseEditor.x;
    let pY = mouseEditor.y;

    let existing = findShape(pX, pY);

    if (existing) {
        current_shape = existing;
        pick(existing.c);
        randomColorState(false);

    } else {
        current_shape = null;
    }
}

function addShape() {
    if (!layer().visible) return;

    let shapes = layer().shapes;

    let color = randomColor ? generateColor() : pickerModel.rgbaColor;
    let newShape = { x: mouseEditor.x, y: mouseEditor.y, c: color };
    let existing = shapes.find(el =>
        el.x === newShape.x &&
        el.y === newShape.y &&
        (randomColor || el.c === newShape.c));

    if (!existing) {
        shapes.push(newShape);

    } else {

        current_shape = existing;
        console.log('skip:' + JSON.stringify(newShape));
    }
}

function draw() {

    for (let layer of model.layers) {
        if (!layer.visible) { continue; }

        let gridSize = layer.gridSize;
        let shapeType = layer.shapeType;
        let zoom = layer.zoom ?? 1;

        for (let s of layer.shapes) {
            ctx.fillStyle = s.c;
            if (shapeType === 'square') {
                ctx.fillRect(s.x * zoom, s.y * zoom, gridSize * zoom, gridSize * zoom);
            }

            if (shapeType === 'circle') {
                ctx.beginPath();
                ctx.arc((s.x + gridSize / 2) * zoom, (s.y + gridSize / 2) * zoom, Math.abs(gridSize / 2) * zoom, 0, 2 * Math.PI, 0);
                ctx.fill();
            }

            if (shapeType === 'circle2x') {
                ctx.beginPath();
                ctx.arc((s.x + gridSize / 2) * zoom, (s.y + gridSize / 2) * zoom, Math.abs(gridSize) * zoom, 0, 2 * Math.PI, 0);
                ctx.fill();
            }

            if (shapeType === 'polygon') {
                drawPolygon((s.x + gridSize / 2) * zoom, (s.y + gridSize / 2) * zoom, (Math.abs(gridSize / 2)) * zoom, s.c, layer.polygonSize);
            }


            // center
            // ctx.fillStyle = "red";
            // ctx.fillRect(s.x, s.y, 2, 2);
        }
    }

    drawPointer();
}


function drawPointer() {
    let gridSize = layer().gridSize;
    let zoom = layer().zoom ?? 1;

    if (edit_mode) {

        // selected grid cell
        ctx.fillStyle = "blue";
        let size = 5;
        ctx.fillRect(mouseEditor.x * zoom, mouseEditor.y * zoom, size, size);
        ctx.fillRect(mouseEditor.x * zoom, (mouseEditor.y + gridSize - size) * zoom, size, size);
        ctx.fillRect((mouseEditor.x + gridSize - size) * zoom, mouseEditor.y * zoom, size, size);
        ctx.fillRect((mouseEditor.x + gridSize - size) * zoom, (mouseEditor.y + gridSize - size) * zoom, size, size);

        // current shape selection
        if (current_shape) {
            ctx.strokeStyle = "red"
            ctx.lineWidth = 2;
            ctx.strokeRect(current_shape.x * zoom, current_shape.y * zoom, gridSize * zoom, gridSize * zoom);
        }
    }
    // big cross
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = pickerModel.rgbaColor; // from picker
    ctx.beginPath();
    ctx.moveTo((mouseEditor.x + gridSize / 2) * zoom, 0);
    ctx.lineTo((mouseEditor.x + gridSize / 2) * zoom, canvas.height);

    ctx.moveTo(0, (mouseEditor.y + gridSize / 2) * zoom);
    ctx.lineTo(canvas.width , (mouseEditor.y + gridSize / 2) * zoom);
    ctx.rect(mouseEditor.x * zoom, mouseEditor.y * zoom, gridSize * zoom, gridSize * zoom);
    ctx.stroke();
}

function findShape(x, y) {
    let shapes = layer().shapes;
    let gridSize = layer().gridSize;

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

    return result[0];
}


function randomColorState(enabled) {
    console.log(enabled);
    randomColor = enabled;
    colorLabel.style.backgroundColor = enabled ? 'white' : pickerModel.rgbaColor;
    colorLabel.children[0].textContent = enabled ? 'random' : '';
}


function drawPolygon(x, y, r, color, corners = 6) {
    const a = 2 * Math.PI / corners;
    ctx.fillStyle = color;

    ctx.beginPath();
    for (var i = 0; i < corners; i++) {
        ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.fill();
}
