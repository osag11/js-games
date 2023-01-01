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
const lineHeight2 = 40;
const margin = 40;

function drawLayers() {
    let counter = 0;

    ctx2.font = "16px serif";
    ctx2.fillStyle = layerCloneMode ? 'red' : 'green';

    ctx2.fillText(`layer clone: ${layerCloneMode}`, 5, 25);

    if (xLock) {
        ctx2.fillStyle = 'red';
        ctx2.fillText(`xLock: ${xLock}`, 200, 25);
    }

    if (yLock) {
        ctx2.fillStyle = 'red';
        ctx2.fillText(`yLock: ${yLock}`, 200, 25);
    }

    for (let l of model.layers) {

        ctx2.fillStyle = '#FCC178';
        if (model.layers.indexOf(l) === model.activeLayer) {
            ctx2.fillStyle = '#ED5B6D';
        }
        ctx2.fillRect(0, layerHeight * counter + margin, toolsCanvas.width, layerHeight - 50 + margin);

        ctx2.fillStyle = 'black';
        ctx2.font = "20px serif";

        ctx2.fillText(l.name ?? layerNames[l.id], 5, layerHeight * counter + lineHeight + margin);


        ctx2.fillText(l.zoom ?? 1, 5, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.shapes.length, 40, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.gridSize, 110, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.shapeType, 140, layerHeight * counter + lineHeight2 + margin);
        ctx2.fillText(l.polygonSize, 220, layerHeight * counter + lineHeight2 + margin);

        ctx2.font = "10px serif";
        ctx2.fillText("zoom      count                     grid     shape                      corners    visible", 0, layerHeight * counter + 52 + margin);


        ctx2.fillStyle = l.visible ? 'green' : 'red';

        ctx2.beginPath();
        ctx2.arc(270, layerHeight * counter + 25 + margin, 15, 0, 2 * Math.PI, 0);
        ctx2.fill();
        ctx2.closePath();

        // remember 'visible' button position
        l.posX = 270;
        l.posY = layerHeight * counter + 25 + margin;

        counter++;
    }
}

function onLayerNameChanged(val) {
    layer().name = val;
    updateLayersList();
}

function onActiveLayerChanged(val) {
    model.activeLayer = parseInt(val);
    let layerNameEl = document.getElementById('layerName');
    layerNameEl.value = layer().name ?? layerNames[model.activeLayer];
    initGrid(layer().gridSize * (layer().zoom ?? 1));
}

function updateLayersList() {
    let activeLayerEl = document.getElementById('activeLayer');
    activeLayerEl.innerHTML = "";

    for (let l of model.layers) {
        l.id = model.layers.indexOf(l);
        var option = document.createElement("option");
        option.text = l.name ?? layerNames[l.id];
        option.value = l.id;
        activeLayerEl.options.add(option);
    }

    activeLayerEl.selectedIndex = model.activeLayer;
}

const layerNames = ['palette', 'first layer', 'second layer', 'third layer', 'fourth layer', 'fifth layer', 'sixth layer', 'seventh layer', 'eighth layer', 'ninth layer', 'tenth layer'];

function addLayer() {
    if (model.layers.length >= 11) {
        return;
    }

    model.layers.push(
        {
            visible: true,
            shapes: layerCloneMode ? [...layer().shapes] : [],
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
    'Hot keys',
    ' [R] : random color',
    ' [G] : grid on/off',
    ' [+] or [NumPadPlus] : make grid larger',
    ' [-] or [NumPadMinus] : make grid smaller',
    ' ',

    '1,2,3,4,5,6,7,8,9 : shapes selection, where',
    ' [1] : square',
    ' [2] : circle',
    ' [3-8] : polygons from triangle to octagon',
    ' [9] : double size circle',
    ' ',

    ' [Del] : remove last created shape (tile)',
    ' [Esc] : clean active visible layer from shapes (tiles)',
    ' [E] or [Space] : edit mode',
    ' Edit mode allows to select shape,',
    '  drag and drop selected shape to move,',
    '  take color from selected shape',
    ' ',
    ' [up arrow] : extract all colors to palette',
    ' [left arrow] : replay back shapes creation',
    ' [right arrow] : replay forth shapes creation',
    ' ',
    ' [X] : lock X coordinate to draw perfect vertical line',
    ' [Y] : lock Y coordinate to draw perfect horizontal line',
    ' [C] : shapes will be copied (cloned) from active layer to new created',
    '  see [+] "add layer" button on layer panel',
  

    ' ',
    
    ' [H]: show help',

];

function drawHelp() {
    let counter = 0;

    ctx2.font = "16px serif";
    ctx2.fillStyle = 'lime';

    for (let h of helpContent) {
        ctx2.fillText(h, 5, 18 * counter + 20);
        counter++;
    }
}

function helpEnable() {
    help = !help;
}

function mouseEvents(e) {

    const bounds = toolsCanvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left - window.scrollX - markRadius;
    mouse.y = e.pageY - bounds.top - window.scrollY - markRadius;

    if (mouse.x > 0 && mouse.x < toolsCanvas.width && mouse.y > 0 && mouse.y < toolsCanvas.height) {

        mouse.type = e.type;

        console.log(mouse);

        for (let l of model.layers) {
            if (l.posX > mouse.x - 15
                && l.posX < mouse.x + 15
                && l.posY > mouse.y - 15
                && l.posY < mouse.y + 15
            ) {
                console.log(l);
                l.visible = !l.visible;
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
                }
            }

        }
    }
}

["mousedown"].forEach(name => document.addEventListener(name, mouseEvents));

// https://eperezcosano.github.io/hex-grid/
let hexPalettte = false;
let paletteColors = ['red', 'green', 'blue'];
function drawHexagonGrid(width, height, r, colors = ['red', 'green', 'blue']) {
    let idx = -1;
    const a = 2 * Math.PI / 6;

    for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
        for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
            idx++;
            if (idx > colors.length - 1) idx = 0;

            let color = colors[idx];
            drawPolygonCtx2(x, y, r, color);
        }
    }
}

function drawPolygonCtx2(x, y, r, color, corners = 6) {
    const a = 2 * Math.PI / corners;
    ctx2.fillStyle = color;

    ctx2.beginPath();
    for (var i = 0; i < corners; i++) {
        ctx2.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx2.closePath();
    ctx2.fill();
}
