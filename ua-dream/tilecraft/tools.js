const mouse = { x: 0, y: 0, type: null };
const markRadius = 4;

function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
        finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
}

let layerCloneMode = false;
const layerHeight = 75;
const lineHeight = 20;
const lineHeight2 = 45;
const margin = 40;
const alertColor = '#fffe00';
const infoColor = 'lime';
const activeLayerColor = '#ED5B6D';
const layerColor = '#FCC178';

function drawLayersUI() {
    let counter = 0;

    ctx2.font = "16px serif";

    if (selectionModel.enabled) {
        ctx2.fillStyle = alertColor;
        ctx2.fillText(`selection tool enabled`, 5, 25);

    } else {
        ctx2.fillStyle = layerCloneMode ? alertColor : infoColor;
        ctx2.fillText(`layer clone: ${layerCloneMode}`, 5, 25);
    }

    if (typeof xLock == 'number') {
        ctx2.fillStyle = alertColor;
        ctx2.fillText(`xLock: ${xLock}`, 200, 25);
    }

    if (typeof yLock == 'number') {
        ctx2.fillStyle = alertColor;
        ctx2.fillText(`yLock: ${yLock}`, 200, 25);
    }

    for (let l of model.layers) {

        ctx2.fillStyle = layerColor;
        if (model.layers.indexOf(l) === model.activeLayer) {
            ctx2.fillStyle = activeLayerColor;
        }
        ctx2.fillRect(0, layerHeight * counter + margin, toolsCanvas.width, layerHeight - 50 + margin);

        ctx2.fillStyle = 'black';
        ctx2.font = "20px serif";

        ctx2.fillText(l.name ?? layerNames[l.id], 5, layerHeight * counter + lineHeight + margin);


        // ctx2.fillText(l.zoom ?? 1, 5, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.shapes.length, 5, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.transparency ?? 255, 60, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.gridSize > 1 ? l.gridSize : l.gridSize.toFixed(1), 110, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.shapeType, 150, layerHeight * counter + lineHeight2 + margin);
        if (l.shapeType === 'polygon') {
            ctx2.fillText(l.polygonSize, 225, layerHeight * counter + lineHeight2 + margin);
        }

        ctx2.font = "10px serif";
        ctx2.fillText(" tiles                opacity          grid         shape                                 visible", 0, layerHeight * counter + 58 + margin);


        ctx2.fillStyle = l.visible ? 'green' : 'red';

        ctx2.beginPath();
        ctx2.arc(270, layerHeight * counter + 30 + margin, 15, 0, 2 * Math.PI, 0);
        ctx2.fill();
        ctx2.closePath();

        // remember 'visible' button position for mouse handler
        l.posX = 270;
        l.posY = layerHeight * counter + 30 + margin;

        counter++;
    }
}

// TBD: layer renamer to v-keyboard
// unblock mouse events
function onLayerNameChanged(val) {
    layer().name = val;
    updateLayersList();
}

function onActiveLayerChanged(val) {
    model.activeLayer = parseInt(val);
    let layerNameEl = document.getElementsByName('layerName');
    layerNameEl.forEach(x => x.value = layer().name ?? layerNames[model.activeLayer]);
    initGrid(layer().gridSize * (layer().zoom ?? 1));
    refreshBtnState();
}

function updateLayersList() {
    let activeLayerEl = document.getElementsByName('activeLayer');
    //TBD: move active layer selector to VirtualKeyboard
    activeLayerEl.forEach(x => x.innerHTML = "");

    for (let l of model.layers) {
        l.id = model.layers.indexOf(l);
        var option = document.createElement("option");
        option.text = l.name ?? layerNames[l.id];
        option.value = l.id;
        activeLayerEl.forEach(x => x.options.add(option));
    }

    activeLayerEl.forEach(x => x.selectedIndex = model.activeLayer);
}

const layerNames = ['backstage', 'first layer', 'second layer', 'third layer', 'fourth layer', 'fifth layer', 'sixth layer', 'seventh layer', 'eighth layer', 'ninth layer', 'tenth layer'];

function addLayer() {
    if (model.layers.length >= 11) {
        return;
    }

    let shapesCopy = layerCloneMode ? layer().shapes.map((s) => ({ x: s.x, y: s.y, c: s.c })) : [];

    model.layers.push(
        {
            visible: true,
            shapes: shapesCopy,
            shapesHistory: [],

            shapeType: layer().shapeType,
            polygonSize: layer().polygonSize,
            gridSize: layer().gridSize,
        }
    );

    model.activeLayer = 0;

    updateLayersList();
}

function removeLayer() {
    if (model.layers.length <= 1) {
        return;
    }

    model.layers.splice(model.activeLayer, 1);
    for (let i = model.activeLayer; i >= 0; i--) {
        if (model.layers[i]) {
            model.activeLayer = i;
            break;
        }
    }
    updateLayersList();
}

let help = false;
let helpContent = [
    'Tools and keys',
    ' [S] : save project to file',
    ' [R] : random color on/off',
    ' [P] : palette with colors (generated previously by [up arrow])',
    ' [G] : grid on/off',
    ' [+] or [NumPadPlus] : make grid larger',
    ' [-] or [NumPadMinus] : make grid smaller',
    //' [M] - move tool',
    //' [Z] - zoom',
    //' [Space] - selection tool',
    ' [*] - transparency plus',
    ' [/] - transparency minus',
    ' ',

    '1,2,3,4,5,6,7,8,9 : tile shape selection, where',
    ' [1] : square',
    ' [2] : circle',
    ' [3-8] : polygons from triangle to octagon',
    ' [9] : double size circle',
    ' [0] : polyline',
    ' ',

    ' [Del] : remove last created tile',
    ' [Esc] : clean active visible layer from tiles',
    ' [E] or [Space] : edit mode',
    ' Edit mode allows to select shape,',
    '  drag and drop selected shape to move,',
    '  take color from selected shape',
    ' ',

    ' [UP arrow] : extract all colors from layer to palette',
    ' [Ctrl + up arrow] : transform layer tiles to palette',
    ' [DOWN arrow] : add new random color to palette',
    ' [LEFT arrow] : replay back tiles creation',
    ' [RIGHT arrow] : replay forth tiles creation',
    ' ',

    ' [X] : lock X coordinate to draw perfect vertical line',
    ' [Y] : lock Y coordinate to draw perfect horizontal line',
    ' [C] : shapes will be copied (cloned) from active layer to new created',
    '  see [+] "add layer" button on layer panel',
    ' ',

    ' [B] : switch backround',
    ' [Ctrl + B] : add new backround',
    ' [Shift + B] : remove current backround',
    ' [H]: show help',
];

function drawHelp() {
    let counter = 0;

    ctx2.font = "14px serif";
    ctx2.fillStyle = 'lime';

    for (let h of helpContent) {
        ctx2.fillText(h, 5, 16 * counter + 18);
        counter++;
    }
}

let ignoreMouseEvents = false;
function mouseEvents(e) {
    e.preventDefault();
    if (ignoreMouseEvents) return;

    let handled = false;
    const bounds = toolsCanvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - window.scrollX - markRadius;
    mouse.y = e.pageY - bounds.top - window.scrollY - markRadius;

    if (mouse.x > 0 && mouse.x < toolsCanvas.width && mouse.y > 0 && mouse.y < toolsCanvas.height) {

        mouse.type = e.type;

        console.log(mouse);

        if (hexPalette) {
            for (let hg of hexaGridData) {
                if (hg.x > mouse.x - hg.r
                    && hg.x < mouse.x + hg.r
                    && hg.y > mouse.y - hg.r
                    && hg.y < mouse.y + hg.r
                ) {
                    console.log(hg.c);
                    injectColor(hg.c);
                    randomColorState(false);
                    handled = true;
                    break;
                }
            }
        }
        else {
            let touchRadius = 15 + 10;

            for (let l of model.layers) {

                if (l.posX > mouse.x - touchRadius
                    && l.posX < mouse.x + touchRadius
                    && l.posY > mouse.y - touchRadius
                    && l.posY < mouse.y + touchRadius
                ) {
                    console.log(l);
                    l.visible = !l.visible;
                    handled = true;
                    break;
                }

                if (
                    l.posY > mouse.y - 45
                    && l.posY < mouse.y + 25
                ) {
                    console.log(l);
                    let idx = model.layers.indexOf(l);

                    if (idx >= 0) {
                        model.activeLayer = idx;
                        updateLayersList();
                        onActiveLayerChanged(idx);
                        handled = true;
                        return;
                    }
                }
            }
        }
        if (!handled) {
            toggleVirtualKeyboard();
        }
    }
}

["mousedown", "touchstart "].forEach(name => document.addEventListener(name, mouseEvents));

let namingInProgress = false;

function nameFocusHandler(event) {
    namingInProgress = event.type === 'focusin' ? true : false;// focusin or focusout
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function downloadPNG(filename) {
    /// create an "off-screen" anchor tag
    var a = document.createElement('a'), e;
    a.href = canvas.toDataURL("image/png;base64");
    a.download = filename;
    a.click();
}

var openFile = function (event) {
    var input = event.target;
    var reader = new FileReader();

    reader.onload = function () {
        var text = reader.result;
        let jsonModel = JSON.parse(text)
        model.layers = jsonModel.layers;
        model.selectionPoints = jsonModel.selectionPoints;
        model.background = jsonModel.background;
        model.backgroundIdx = jsonModel.backgroundIdx;

        // apply        
        selectionTool.points = model.selectionPoints;
    };
    reader.readAsText(input.files[0]);
};


let hexPaletteIdx = 0;
let hexPaletteSwitchCounter = 0;

function nextPaletteColor(sequence = 1) {
    let color;

    if (paletteColors.length > 0) {
        hexPaletteSwitchCounter++;

        if (hexPaletteSwitchCounter >= sequence) {
            hexPaletteIdx++;
            hexPaletteSwitchCounter = 0;
        }
        if (hexPaletteIdx > paletteColors.length - 1) {
            hexPaletteIdx = 0;
        }
        color = paletteColors[hexPaletteIdx];
        return color;
    }
    return "#aaa";
}
// with respect to eperezcosano
// https://eperezcosano.github.io/hex-grid/
let hexPalette = false;
let paletteColors = ['red', 'green', 'blue', 'white', 'grey', 'black', 'cyan', 'magenta', 'yellow'];
let hexaGridData = [];
function drawHexagonGrid(width, height, r, colors = ['red', 'green', 'blue']) {
    let idx = -1;
    const a = 2 * Math.PI / 6;
    paletteColors = paletteColors.map(x => x.startsWith('#') ? x : '#' + colorByName(x));

    hexaGridData = [];
    for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
        for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
            idx++;
            if (idx > colors.length - 1) idx = 0;
            let color = colors[idx];
            
            hexaGridData.push({ x: x, y: y, r: r, c: color });
            drawPolygon(ctx2, x, y, r, color);
        }
    }
}

