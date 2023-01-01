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

const layerHeight = 70;
const lineHeight = 20;
const lineHeight2 = 40;

function drawLayers() {
    let counter = 0;

    ctx2.font = "20px serif";

    for (let l of model.layers) {

        ctx2.fillStyle = 'beige';
        if (model.layers.indexOf(l) === model.activeLayer) {
            ctx2.fillStyle = 'rgba(188,69,69,1)';
        }
        ctx2.fillRect(0, layerHeight * counter, toolsCanvas.width, layerHeight - 20);

        ctx2.fillStyle = 'black';
        ctx2.fillText(l.name ?? layerNames[l.id], 5, layerHeight * counter + lineHeight);

        ctx2.fillText(l.zoom ?? 1, 5, layerHeight * counter + lineHeight2);
        ctx2.fillText(l.shapes.length, 40, layerHeight * counter + lineHeight2);
        ctx2.fillText(l.gridSize, 110, layerHeight * counter + lineHeight2);
        ctx2.fillText(l.shapeType, 140, layerHeight * counter + lineHeight2);
        ctx2.fillText(l.polygonSize, 220, layerHeight * counter + lineHeight2);

        ctx2.fillStyle = l.visible ? 'green' : 'red';

        ctx2.beginPath();
        ctx2.arc(260, layerHeight * counter + 25, 15, 0, 2 * Math.PI, 0);
        ctx2.fill();
        ctx2.closePath();

        l.posX = 260;
        l.posY = layerHeight * counter + 25;

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

const layerNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

function addLayer() {
    if (model.layers.length >= 10) {
        return;
    }

    model.layers.push(
        {
            visible: true,
            shapes: [],
            shapesHistory: [],
            shapeType: 'square',
            polygonSize: 6,
            gridSize: 20,
            current_shape: null
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
                l.posY > mouse.y - 20
                && l.posY < mouse.y + 20
            ) {
                console.log(l);
                let idx = model.layers.indexOf(l);

                if (idx >= 0){
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
