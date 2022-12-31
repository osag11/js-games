let current_shape = null;

function selectShape() {

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

        if (shapeType === 'circle2x') {
            ctx.beginPath();
            ctx.arc(s.x + gridSize / 2, s.y + gridSize / 2, Math.abs(gridSize), 0, 2 * Math.PI, 0);
            ctx.fill();
        }

        if (shapeType === 'polygon') {
            drawPolygon(s.x + gridSize / 2, s.y + gridSize / 2, Math.abs(gridSize / 2), s.c, polygonSize);
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
    // big cross
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
