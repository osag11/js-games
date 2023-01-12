function delete_previous_shape_command() {
    if (layer().current_shape) {
        let idx = layer().shapes.indexOf(layer().current_shape)
        layer().shapes.splice(idx, 1);
        layer().current_shape = layer().shapes[idx - 1];
        console.log(`deleted #${idx} from ${layer().shapes.length}`)
    }
}

function grid_switch_command(callback) {
    gridOn = !gridOn;
    callback = gridOn;
    return gridOn;
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

function transparency_minus_command() {
    if (!layer().transparency) layer().transparency = 255;
    layer().transparency--;
    if (layer().transparency <= 1) layer().transparency = 1;
}

function transparency_plus_command() {
    if (!layer().transparency) layer().transparency = 255;
    layer().transparency++;
    if (layer().transparency > 255) layer().transparency = 255;
}

function hex_palette_switch_command() {
    help = false;
    hexPalette = !hexPalette;
    return hexPalette;
}

function screenshot_mode_switch_command() {
    screenshot_mode = !screenshot_mode;
    return screenshot_mode;
}

function help_switch_command() {
    hexPalette = false;
    help = !help;
    return help;
}

function clear_layer_shapes_command() {
    if (layer().visible) {
        layer().shapes = [];
    }
}

function edit_mode_switch_command() {
    layer().edit_mode = !layer().edit_mode;
    layer().move_mode = false;
    return layer().edit_mode;
}

function move_mode_switch_command() {
    layer().move_mode = !layer().move_mode;
    layer().edit_mode = false;

    return layer().move_mode;
}

function random_color_switch_command() {
    randomColor = !randomColor;
    randomColorState(randomColor);
    return randomColor;
}

function shape_apply_command(shape) {
    layer().shapeType = shape;
    return shape;
}

function shape_polygon_apply_command(size) {
    layer().shapeType = 'polygon';
    layer().polygonSize = size;
    return size;
}

function x_lock_command() {
    if (typeof xLock == 'number') {
        xLock = null;
    }
    else {
        xLock = mouseEditor.x;
    }
    yLock = null;
    return xLock;
}

function y_lock_command() {
    if (typeof yLock == 'number') {
        yLock = null;
    }
    else {
        yLock = mouseEditor.y;
    }
    xLock = null;
    return yLock;
}

function layer_add_command() {
    addLayer();
}

function layer_remove_command() {
    removeLayer();
}

function debug_mode_switch_command() {
    debugOn = !debugOn;
    return debugOn;
}

function layer_clone_mode_switch_command() {
    layerCloneMode = !layerCloneMode;
    return layerCloneMode;
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
    download(JSON.stringify(model), `tiles-${date}-${Date.now()}.json`, 'text/plain');
}

function save_picture_command() {
    screenshot_mode = true;    
    let date = new Date().toISOString().split('T')[0];

    setTimeout(function onTick() {
          downloadPNG(`tiles-${date}-${Date.now()}.png`);
          screenshot_mode = false;
  }, 1000) 
}

function palette_import_layer_colors_command(destroy) {
    let gridSize = layer().gridSize;
    if (layer().shapes.length == 0) return;
    let clonedShapes = [...layer().shapes];
    hexPalette = true;
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

    if (destroy) {
        layer().shapesHistory = [...layer().shapes]; // make backup
        layer().shapes = [];
    }

    let x = 0;
    let y = 0;

    for (let cS of clonedShapes) {

        if (paletteColors.indexOf(cS.c) < 0) {
            paletteColors.push(cS.c);

            if (destroy) {
                layer().shapes.unshift({ x: x, y: y, c: cS.c });
                x += gridSize;

                if (x > canvas.width) {
                    x = 0;
                    y += gridSize;
                }
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
    let color = generateColor();
    paletteColors.push(color);
    injectColor(color);
}

function getActiveShapeName() {
    if (layer().shapeType === 'polygon') {
        return layer().shapeType + layer().polygonSize;
    } else {
        return layer().shapeType;
    }
}

function transparency_max_min_command() {
    let transparency = layer().transparency ?? 255;

    if (transparency < 255) {
        layer().transparency = 255;
        return true;
    }

    if (transparency == 255) {
        layer().transparency = 100;
        return false;
    }
}


function all_layers_visible_command(visible) {
    for (let l of model.layers) {
        if (model.layers.indexOf(l) !==model.activeLayer)
            l.visible = visible;
    }
}

function clean_all_layers_command(visible) {
    for (let l of model.layers) {
        l.shapes = [];
    }
}