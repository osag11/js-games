function delete_previous_shape_command() {
    if (layer().current_shape) {
        let idx = layer().shapes.indexOf(layer().current_shape)
        layer().shapes.splice(idx, 1);
        layer().current_shape = layer().shapes[idx - 1];
        console.log(`deleted #${idx} from ${layer().shapes.length}`)
    }
}

function grid_plus_command() {
    if (layer().gridSize < 1) {
        layer().gridSize += 0.1
    } else {
        layer().gridSize++;
        initGrid(layer().gridSize < 2 ? 2 : layer().gridSize * (layer().zoom ?? 1));//do not let be grid size less than 2
    }
}

function grid_minus_command() {
    if (layer().gridSize <= 1) {
        layer().gridSize -= 0.1
    } else {
        layer().gridSize--;
        initGrid(layer().gridSize < 2 ? 2 : layer().gridSize * (layer().zoom ?? 1));//do not let be grid size less than 2
    }
}

function hex_palette_switch_command() {
    hexPalette = !hexPalette;
    help = false;
}

function grid_switch_command() {
    gridOn = !gridOn;
}

function help_switch_command() {
    help = !help;
    hexPalette = false;
}

function clear_layer_shapes_command() {
    if (layer().visible) {
        layer().shapes = [];
    }
}

function edit_mode_switch_command() {
    layer().edit_mode = !layer().edit_mode;
}

function random_color_switch_command() {
    randomColor = !randomColor;
    randomColorState(randomColor);
}

function shape_apply_command(shape) {
    layer().shapeType = shape;
}

function shape_polygon_apply_command(size) {
    layer().shapeType = 'polygon';
    layer().polygonSize = size;
}

function x_lock_command() {
    if (xLock) {
        xLock = null;
    }
    else {
        xLock = mouseEditor.x;
    }
    yLock = null;
}

function y_lock_command() {
    if (yLock) {
        yLock = null;
    }
    else {
        yLock = mouseEditor.y;
    }
    xLock = null;
}

function layer_clone_mode_switch_command() {
    layerCloneMode = !layerCloneMode;
}

function background_command(action) {
    if (action === "add") {//add
        model.background.push(pickerModel.rgbaColor);
        model.backgroundIdx = model.background.length - 1;
    }
    else if (action === "remove") {//remove
        model.background.splice(model.backgroundIdx, 1);
        model.backgroundIdx = 0;
    }
    else if (action === "rotate") {
        model.backgroundIdx++;
        if (model.backgroundIdx > model.background.length - 1) model.backgroundIdx = 0;
        canvas.style.background = model.background[model.backgroundIdx] ?? 'black';
    }

    canvas.style.background = model.background[model.backgroundIdx] ?? 'black';
    canvas.style.backgroundSize = 'contain';
    console.log(JSON.stringify(model.background));
}


function save_file_command() {
    let date = new Date().toISOString().split('T')[0];
    download(JSON.stringify(model), `tiles-${date}.json`, 'text/plain');
}

function palette_import_layer_colors_command() {
    let gridSize = layer().gridSize;
    let clonedShapes = [...layer().shapes];

    // order by color name
    clonedShapes.sort((a, b) => {
        const nameA = a.c.toUpperCase();
        const nameB = b.c.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    paletteColors = [];
    layer().shapesHistory = [...layer().shapes]; // make backup
    layer().shapes = [];

    let x = 0;
    let y = 0;

    for (let cS of clonedShapes) {

        if (paletteColors.indexOf(cS.c) < 0) {
            paletteColors.push(cS.c);

            layer().shapes.unshift({ x: x, y: y, c: cS.c });
            x += gridSize;
            if (x > canvas.width) {

                x = 0;
                y += gridSize;
            }
        }
    }
}

function history_back_command() {
    let s = layer().shapes.pop();
    if (s) layer().shapesHistory.push(s);
}

function history_forward_command() {
    let s = layer().shapesHistory.pop();
    if (s) layer().shapes.push(s);
}

function palette_add_color_command() {
    paletteColors.push(generateColor());
}
