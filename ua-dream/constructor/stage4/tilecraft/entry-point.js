const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d",{ willReadFrequently: true });

const toolsCanvas = document.getElementById("tools");
const ctx2 = toolsCanvas.getContext("2d",{ willReadFrequently: true });

//canvas.style.border = '2px solid blue';
//toolsCanvas.style.border = '2px solid green';

function main() {

    const t0 = performance.now();

    window.requestAnimationFrame(main);
    clear();
    draw();
    if (gridOn) drawGrid(ctx);

    // PoC
    if (hexPalette) {
        drawHexagonGrid(toolsCanvas.width, toolsCanvas.height, 20, paletteColors);
    } else {
        if (help)
            drawHelp();
        else
            drawLayersUI();
    }
    const t1 = performance.now();
    // console.log(`Call to main: ${t1 - t0} ms.`);
}

function setSize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth - tools.width;
    toolsCanvas.height = window.innerHeight - colorBlock.height - 44;
    toolsCanvas.style.marginTop = colorBlock.height + 44 + "px";
}


// entry-point
setSize();
get_offset();
initGrid(layer().gridSize);
setup();

// start loop
main();


function setup() {
    gridOn = false;
    randomColor = true;
    initGrid(layer().gridSize);
    // layer().zoom =0.7; 
    initGrid(layer().gridSize * (layer().zoom ?? 1));

    updateLayersList();
}
