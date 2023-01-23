const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const toolsCanvas = document.getElementById("tools");
const ctx2 = toolsCanvas.getContext("2d", { willReadFrequently: true });

function main() {

    // const t0 = performance.now();

    window.requestAnimationFrame(main);
    clear();
    draw();
    if (gridOn) drawGrid(ctx);

    if (selectionModel.enabled) {
        selectionTool.draw();
    }

    if (hexPalette) {
        drawHexagonGrid(toolsCanvas.width, toolsCanvas.height, 20, paletteColors);
    } else {
        if (help)
            drawHelp();
        else
            drawLayersUI();
    }
    // const t1 = performance.now();
    // console.log(`Call to main: ${t1 - t0} ms.`);
}

function setSize() {
    // Hackish layout. TODO: rework
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth - tools.width;
    toolsCanvas.height = window.innerHeight - colorBlock.height - 44;
    toolsCanvas.style.marginTop = colorBlock.height + 44 + "px";
}

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

// entry-point
setSize();
get_offset();
initGrid(layer().gridSize);
setup();

// start loop
main();


function setup() {
    mobile_layout = detectMob();
    
    gridOn = false;
    randomColor = true;
    initGrid(layer().gridSize);
    // layer().zoom =0.7; 
    initGrid(layer().gridSize * (layer().zoom ?? 1));

    updateLayersList();
    canvas.style.cursor = selectionTool.cursor;
    selectionTool.color = pickerModel.rgbaColor;

    selectionModel.mirrorAxis.p1 = { x: canvas.width / 2, y: 50 };
    selectionModel.mirrorAxis.p2 = { x: canvas.width / 2, y: canvas.height - 50 };
}