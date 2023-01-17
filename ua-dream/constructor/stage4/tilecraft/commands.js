function delete_previous_shape_command() {
    if (layer().current_shape) {
        let idx = layer().shapes.indexOf(layer().current_shape)
        layer().shapes.splice(idx, 1);
        layer().current_shape = layer().shapes[idx - 1];
        console.log(`deleted #${idx} from ${layer().shapes.length}`)
    }
}

function inverse_selection_switch_command() {
    selectionModel.inverse = !selectionModel.inverse;
    return selectionModel.inverse;
}

function selection_tool_close_path_switch_command() {
    selectionTool.closePath = !selectionTool.closePath;
}

function selection_tool_interpolation_switch_command() {
    selectionTool.useInterpolation = !selectionTool.useInterpolation;
}

function delete_selection_active_point_command() {

    let nextActivePoint = selectionTool.points[selectionTool.points.indexOf(selectionTool.activePoint) - 1];
    selectionTool.deletePoint(selectionTool.activePoint);
    selectionTool.activePoint = nextActivePoint;
    selectionTool.hoverPoint = null;
    selectionTool.insertPoint = null;
    selectionTool.center();
}

function mirror_tool_switch_command() {
    selectionModel.mirrorAxis.enabled = !selectionModel.mirrorAxis.enabled;
}

function mirror_tool_use_reflection_only_switch_command() {
    selectionModel.mirrorAxis.useReflectionOnly = !selectionModel.mirrorAxis.useReflectionOnly;
}

function fill_selection_tiles_command(paletteStrategy = 'next') {
    let selectionPoints = selectionTool.getPoints(selectionModel.mirrorAxis.useReflectionOnly);

    let shift = layer().gridSize / 2;
    let paletteColor = nextPaletteColor(1);
    for (let sp of selectionPoints) {

        let p = {
            c: hexPalette ? paletteStrategy === 'sequence' ? nextPaletteColor(paletteSequenceLength) : paletteColor : randomColor ? generateColor() : pickerColor(),
            x: sp.x - shift,
            y: sp.y - shift
        }

        layer().shapes.push(p);
    }
}

function make_selection_from_layer_tiles_command() {
    selectionModel.enabled = true;
    let shift = layer().gridSize / 2;
    selectionTool.points = [...layer().shapes].map(s => point(s.x + shift, s.y + shift));
    selectionTool.center();
}

function reduce_selection_base_points_command() {
    let size = layer().gridSize / 2;
    selectionTool.points = selectionTool.reducePoints(size);
    selectionTool.center();
}


const minTileSize = 8;
function feel_tiles_grid_command() {

    if (!layer().visible) return;

    const gridSize = layer().gridSize > minTileSize ? layer().gridSize : minTileSize;
    let x = 0, y = 0;

    paletteColors = paletteColors.map(x => x.startsWith('#') ? x : '#' + colorByName(x));

    while (y < canvas.height) {
        let color;
        if (hexPalette) {
            color = nextPaletteColor(paletteSequenceLength);
        } else if (randomColor)
            color = generateColor();
        else
            color = pickerColor();


        if (selectionModel.inverse)
            layer().shapes.unshift({ x: x, y: y, c: color });
        else
            layer().shapes.push({ x: x, y: y, c: color });

        x += gridSize;

        if (x > canvas.width) {
            x = 0;
            y += gridSize;
        }
    }
}

let paletteSequenceLength = 3;

function apply_selection_color_command(paletteStrategy) {
    if (!layer().selection) return;

    let paletteNextColor = nextPaletteColor(1);

    for (let sp of layer().selection) {
        if (paletteStrategy) {
            sp.c = paletteStrategy === 'sequence' ? nextPaletteColor(paletteSequenceLength) : paletteNextColor;
        } else {
            sp.c = hexPalette ? paletteNextColor : randomColor ? generateColor() : pickerColor();
        }
    }
}

function delete_selection_points_command() {

    if (selectionTool.points.length > 0 && layer().selection?.length > 0) {
        layer().selection = [];
    }
    else {
        selectionTool.points = [];
    }

    selectionTool.dispose();
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

    return layer().gridSize;
}

function grid_minus_command() {
    if (layer().gridSize <= 1) {
        layer().gridSize -= 0.1
    } else {
        layer().gridSize--;
        initGrid(layer().gridSize < 2 ? 2 : layer().gridSize * (layer().zoom ?? 1));//do not let be grid size less than 2        
    }

    return layer().gridSize;
}

function transparency_minus_command() {
    if (!layer().transparency) layer().transparency = 255;
    layer().transparency--;
    if (layer().transparency <= 1) layer().transparency = 1;
    return layer().transparency;
}

function transparency_plus_command() {
    if (!layer().transparency) layer().transparency = 255;
    layer().transparency++;
    if (layer().transparency > 255) layer().transparency = 255;
    return layer().transparency;
}

function palette_sequence_lenght_minus() {
    paletteSequenceLength--;
    if (paletteSequenceLength < 1) paletteSequenceLength = 1;
    console.log(paletteSequenceLength);
    return paletteSequenceLength;
}

function palette_sequence_lenght_plus() {
    paletteSequenceLength++;
    if (paletteSequenceLength > 100) paletteSequenceLength = 100;
    console.log(paletteSequenceLength);
    return paletteSequenceLength;
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

function observer_switch_command() {
    // show state of all tools
}


let clipboard = [];

function clipboard_paste_command() {
    if (clipboard && clipboard.length > 0) {
        layer().shapes = layer().shapes.concat([...clipboard.map((s) => { return { x: s.x, y: s.y, c: s.c } })])
    }
}

function clipboard_copy_command() {

    let filtered = [];
    for (let s of layer().shapes) {
        if (layer().selection.indexOf(s) >= 0) {
            filtered.push(s);
        }
    }

    clipboard = [...filtered];
}

function select_all_command() {
    layer().selection = [...layer().shapes];
}

function handle_clear_command() {
    if (selectionModel.enabled) {
        delete_selection_points_command();

    } else {
        clear_layer_shapes_command();
    }
}

function clear_layer_shapes_command() {
    if (layer().visible) { // if layer not activated - skip action

        if (layer().selection && layer().selection.length > 0) {
            if (layer().selection.length == layer().shapes.length) {
                // all shapes selected => cleanup selection
                layer().selection = [];
            } else {
                // selected and non selected shapes present
                let filtered = [];
                for (let s of layer().shapes) {

                    if (selectionModel.inverse) {
                        // preserve selected, drop all other
                        if (layer().selection.indexOf(s) >= 0) {
                            filtered.push(s);
                        }
                    } else {
                        // drop selected
                        if (layer().selection.indexOf(s) < 0) {
                            filtered.push(s);
                        }
                    }
                }

                layer().shapes = [...filtered];

                if (!selectionModel.inverse) {
                    layer().selection = [];
                }

            }
        } else { // selection empty
            // cleanup all shapes
            layer().shapes = [];
        }
    }
}
function selection_marks_switch_command() {
    selectionModel.hideMarks = !selectionModel.hideMarks;
}

function clear_selection_command() {
    selectionTool.points = [];
    layer().selection = [];
}

function selection_tool_disable_command() {
    selectionModel.enabled = false;
    canvas.style.cursor = "crosshair";
    selectionTool.activePoint = null;
    selectionTool.hoverPoint = null;
}

function selection_tool_switch_command() {
    selectionModel.enabled = !selectionModel.enabled;
    selectionTool.center();
    layer().move_mode = false;
    if (!selectionModel.enabled) {
        canvas.style.cursor = "crosshair";
    }
}

function apply_selection_command() {

    if (!selectionModel.enabled) {
        return;
    }

    let p2d = new Path2D();
    ctx.strokeStyle = '#ffffff00';
    let gridSize = layer().gridSize;
    for (const p of selectionTool.getPoints()) {
        p2d.lineTo(p.x, p.y);
    }
    ctx.stroke(p2d);
    ctx.closePath();

    layer().selection = [];

    for (let s of layer().shapes) {
        let pointInPath = ctx.isPointInPath(p2d, s.x + gridSize / 2, s.y + gridSize / 2);
        if (selectionModel.inverse) pointInPath = !pointInPath;

        if (pointInPath) {
            layer().selection.push(s);
            console.log(JSON.stringify(s));
        }
    }
}

function edit_mode_switch_command() {
    layer().edit_mode = !layer().edit_mode;
    layer().move_mode = false;
    return layer().edit_mode;
}

function move_mode_switch_command(move_selection_copy = false) {
    layer().move_mode = !layer().move_mode;

    if (selectionModel.enabled) {
        layer().move_mode = true;
        selection_tool_disable_command();
    }

    layer().move_selection_copy = move_selection_copy;
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

function layer_move_up_command() {
    let nextUp = model.layers[model.activeLayer - 1];
    if (nextUp) {
        model.layers[model.activeLayer - 1] = model.layers[model.activeLayer];
        model.layers[model.activeLayer] = nextUp;
        model.activeLayer--;
    }
}

function layer_move_down_command() {
    let nextDown = model.layers[model.activeLayer + 1];
    if (nextDown) {
        model.layers[model.activeLayer + 1] = model.layers[model.activeLayer];
        model.layers[model.activeLayer] = nextDown;
        model.activeLayer++;
    }
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

        const image = new Image();
        let img_uri;
        navigator.clipboard.readText()
            .then(
                (text) => {
                    console.log(text);
                    img_uri = text;
                    image.src = img_uri;
                }
            );

        image.onload = function () {
            model.background.push(`url("${img_uri}")`);
            model.backgroundIdx = model.background.length - 1;
            applyBackground();
        };

        image.onerror = function () {
            model.background.push(pickerModel.rgbaColor);
            model.backgroundIdx = model.background.length - 1;
            applyBackground();
        };
    }
    else if (action === "remove") {//remove
        model.background.splice(model.backgroundIdx, 1);
        model.backgroundIdx = 0;
    }
    else if (action === "rotate") {
        model.backgroundIdx++;
        if (model.backgroundIdx > model.background.length - 1) model.backgroundIdx = 0;
        applyBackground();
    }
}

function applyBackground() {
    canvas.style.background = model.background[model.backgroundIdx] ?? 'black';
    canvas.style.backgroundSize = 'contain';
    console.log(JSON.stringify(model.background));
}

function save_file_command() {
    let date = new Date().toISOString().split('T')[0];
    model.selectionPoints = selectionTool.points;
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

function palette_import_layer_colors_command() {
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

    for (let cS of clonedShapes) {

        if (paletteColors.indexOf(cS.c) < 0) {
            paletteColors.push(cS.c);
        }
    }
}

function history_back_command(bySelectionSize) {
    if (bySelectionSize && selectionTool.points.length > 0) {
        for (let i = 0; i < selectionTool.points.length; i++) {
            let s = layer().shapes.pop();
            if (s)
                layer().shapesHistory.push(s);
            else return i;
        }
    }

    let s = layer().shapes.pop();
    if (s) {
        layer().shapesHistory.push(s);
        return 1;
    }

    return 0;
}

function history_forward_command(bySelectionSize) {

    if (bySelectionSize && selectionTool.points.length > 0) {
        for (let i = 0; i < selectionTool.points.length; i++) {
            let s = layer().shapesHistory.pop();
            if (s) layer().shapes.push(s);
            else return i;
        }
    }

    let s = layer().shapesHistory.pop();
    if (s) {
        layer().shapes.push(s);
        return 1;
    }
    return 0;
}

function palette_add_color_command() {
    let color = randomColor ? generateColor() : pickerColor();
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
        if (model.layers.indexOf(l) !== model.activeLayer)
            l.visible = visible;
    }
}

function clean_all_layers_command(visible) {
    for (let l of model.layers) {
        l.shapes = [];
    }
}