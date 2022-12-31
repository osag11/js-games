const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.border = '5px solid blue';

const toolsCanvas = document.getElementById("tools");
toolsCanvas.style.border = '5px solid green';
const ctx2 = toolsCanvas.getContext("2d");
ctx2.lineWidth = 2;
ctx2.strokeStyle = "blue";

const mouseEditor = { x: 0, y: 0 };
let shapeType = 'circle';// 'circle' 'square' 'circle2x'
let polygonSize = 6;
let randomColor = false;


function main() {

    const t0 = performance.now();

    window.requestAnimationFrame(main);
    clear();
    draw();
    if (gridOn) drawGrid(ctx);

    // PoC
    //drawHexagonGrid(canvas.width,canvas.height);

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
initGrid(gridSize);
setup();
// start loop
main();


function setup() {
    gridOn = true;
    gridSize = 50;
    randomColor =true;
    initGrid(gridSize);
}
