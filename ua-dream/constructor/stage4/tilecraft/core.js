const mouseEditor = { x: 0, y: 0 };

let randomColor = false;
let is_dragging, move_mode, screenshot_mode = false;

const model = {
    activeLayer: 0,
    backgroundIdx: 0,
    background: ['black', 'white', 'url("./images/horse-run.png")'],
    layers: [
        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'square',
            polygonSize: 6,
            gridSize: 50,
            transparency: 105
        },

        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'circle2x',
            polygonSize: 4,
            gridSize: 10,
        },

        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'circle',
            polygonSize: 6,
            gridSize: 30,
            transparency: 125
        },

        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'polygon',
            polygonSize: 8,
            gridSize: 20,
        },

        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'polygon',
            polygonSize: 5,
            gridSize: 40,
        },

        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'polyline',
            polygonSize: 3,
            gridSize: 40,
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
        layer().current_shape = existing;
        injectColor(existing.c);
        randomColorState(false);

    } else {
        layer().current_shape = null;
    }
}

let xLock = null;
let yLock = null;

function addShape() {
    if (!layer().visible) return;

    let shapes = layer().shapes;

    let color = randomColor ? generateColor() : rgba2hex(pickerModel.rgbaColor);
    let newShape = { x: mouseEditor.x, y: mouseEditor.y, c: color };

    let existing = shapes.find(el =>
        el.x === newShape.x &&
        el.y === newShape.y &&
        (randomColor || el.c === newShape.c));

    if (!existing) {
        shapes.push(newShape);
    } else {
        layer().current_shape = existing;
        console.log('skip:' + JSON.stringify(newShape));
    }
}

let polylinePrevious = { color: null, action: null };
let debugOn = false;
let debugInfo = [];

function draw() {
    for (let layer of model.layers) {
        if (!layer.visible) { continue; }

        let alfa = alfaChannel(layer.transparency);

        let gridSize = layer.gridSize;
        let shapeType = layer.shapeType;
        if (shapeType === 'polyline') {
            polylinePrevious = { color: null, action: null };
        }

        for (let s of layer.shapes) {

            let color = s.c;
            if (alfa) {
                color = s.c + alfa;
            }

            ctx.fillStyle = color;

            if (shapeType === 'square') {
                ctx.fillRect(s.x, s.y, gridSize, gridSize);
            }

            if (shapeType === 'circle') {
                ctx.beginPath();
                ctx.arc((s.x + gridSize / 2), (s.y + gridSize / 2), Math.abs(gridSize / 2), 0, 2 * Math.PI, 0);
                ctx.fill();
            }

            if (shapeType === 'circle2x') {
                ctx.beginPath();
                ctx.arc((s.x + gridSize / 2), (s.y + gridSize / 2), Math.abs(gridSize), 0, 2 * Math.PI, 0);
                ctx.fill();
            }

            if (shapeType === 'polygon') {
                drawPolygon(ctx, (s.x + gridSize / 2), (s.y + gridSize / 2), (Math.abs(gridSize / 2)), color, layer.polygonSize);
            }

            if (shapeType === 'polyline') {
                ctx.lineWidth = gridSize / 2;
                ctx.strokeStyle = color;

                if (polylinePrevious.color !== color) {

                    if (polylinePrevious.action === null) {
                        // start new path
                        ctx.beginPath();
                        ctx.moveTo((s.x + gridSize / 2), (s.y + gridSize / 2));
                        polylinePrevious.action = 'mt';
                        polylinePrevious.color = color;

                        continue;
                    }

                    if (polylinePrevious.action === 'mt') {
                        // draw and close
                        ctx.lineTo((s.x + gridSize / 2), (s.y + gridSize / 2));
                        polylinePrevious.action = 'lt';
                        polylinePrevious.color = color;
                        ctx.stroke();
                        ctx.closePath();
                        continue;
                    }


                    if (polylinePrevious.action === 'lt') {
                        // close previous path
                        ctx.strokeStyle = polylinePrevious.color;
                        ctx.stroke();
                        ctx.closePath();
                        // begin new path
                        ctx.beginPath();
                        ctx.moveTo((s.x + gridSize / 2), (s.y + gridSize / 2));
                        polylinePrevious.action = 'mt';
                        polylinePrevious.color = color;

                        continue;
                    }
                }
                else {

                    ctx.lineTo((s.x + gridSize / 2), (s.y + gridSize / 2));
                    polylinePrevious.action = 'lt';
                    polylinePrevious.color = color;

                    continue;
                }
            }
            // debug info drawing:
            // mark tile origin point
            // ctx.fillStyle = "red";
            // ctx.fillRect(s.x, s.y, 2, 2);
            // mark tile color name
            // ctx.font = "12px serif";
            // ctx.fillStyle = "white";
            // ctx.fillText(s.c,s.x, s.y);

        }// for each shape end

        if (shapeType === 'polyline') {
            // close last polyline path
            ctx.stroke();
            // TODO: option closePolyline
            //ctx.closePath();
        }
    }

    if (!screenshot_mode) {
        drawPointer();
    }

    if (debugOn) {
        ctx.fillStyle = "white";
        ctx.font = "12px serif";
        for (let i = 0; i < debugInfo.length; i++) {
            ctx.fillText(debugInfo[i], 20, 20 * (i + 1));
        }
        ctx.fillText(`x: ${mouseEditor.x} y: ${mouseEditor.y}`, canvas.width - 80, 20);
    }
}


function drawPointer() {
    let gridSize = layer().gridSize;
    let edit_mode = layer().edit_mode;
    let move_mode = layer().move_mode;

    if (edit_mode) {

        // selected grid cell
        ctx.fillStyle = "blue";
        let size = gridSize / 8;
        ctx.fillRect(mouseEditor.x, mouseEditor.y, size, size);
        ctx.fillRect(mouseEditor.x, (mouseEditor.y + gridSize - size), size, size);
        ctx.fillRect((mouseEditor.x + gridSize - size), mouseEditor.y, size, size);
        ctx.fillRect((mouseEditor.x + gridSize - size), (mouseEditor.y + gridSize - size), size, size);


        ctx.fillRect((mouseEditor.x + gridSize/2 - size/2), mouseEditor.y, size, size);
        ctx.fillRect((mouseEditor.x + gridSize/2 - size/2), (mouseEditor.y + gridSize - size), size, size);
        ctx.fillRect(mouseEditor.x, (mouseEditor.y + gridSize/2 - size/2), size, size);
        ctx.fillRect((mouseEditor.x + gridSize - size), (mouseEditor.y + gridSize/2 - size/2), size, size);


        // current shape selection
        if (layer().current_shape) {
            ctx.strokeStyle = "red"
            ctx.lineWidth = 2;
            ctx.strokeRect(layer().current_shape.x, layer().current_shape.y, gridSize, gridSize);
        }
    }
    if (move_mode) {
        ctx.fillStyle = "white";
        ctx.font = `${gridSize / 4}px serif`;
        ctx.fillText(`MOVE`, (mouseEditor.x + gridSize / 10), (mouseEditor.y + gridSize / 2));

        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.strokeRect(mouseEditor.x, mouseEditor.y, (gridSize + 2), (gridSize + 2));
    }


    // big cross
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = pickerModel.rgbaColor; // from picker
    ctx.beginPath();
    ctx.moveTo((mouseEditor.x + gridSize / 2), 0);
    ctx.lineTo((mouseEditor.x + gridSize / 2), canvas.height);

    ctx.moveTo(0, (mouseEditor.y + gridSize / 2));
    ctx.lineTo(canvas.width, (mouseEditor.y + gridSize / 2));
    ctx.rect(mouseEditor.x, mouseEditor.y, gridSize, gridSize);
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
    randomColorSwitch.checked = enabled;

    colorLabel.children[1].style.color = contrastColor(rgba2hex(pickerModel.rgbaColor));
    colorLabel.children[1].style.display = enabled ? 'none' : 'block';
    colorLabel.children[1].textContent = rgba2hex(pickerModel.rgbaColor).toLowerCase();
    colorLabel.children[0].style.display = enabled ? 'block' : 'none';
}


function drawPolygon(ctx, x, y, r, color, corners = 6) {
    const a = 2 * Math.PI / corners;
    ctx.fillStyle = color;

    ctx.beginPath();
    for (var i = 0; i < corners; i++) {
        ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.fill();
}
