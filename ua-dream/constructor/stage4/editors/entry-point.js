const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.border = '5px solid blue';


const toolsCanvas = document.getElementById("tools");
toolsCanvas.style.border = '5px solid green';
const ctx2 = toolsCanvas.getContext("2d");
ctx2.lineWidth = 2;
ctx2.strokeStyle = "blue";


function main() {
    window.requestAnimationFrame(main);
    clear();
    draw_shapes();
    if (gridOn) drawGrid(ctx);
}

function toolsMain() {
    requestAnimationFrame(toolsMain);
    update();
}

function setSize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth - tools.width;
    toolsCanvas.height = window.innerHeight;
    toolsCanvas.style.marginTop = colorBlock.height + 12 + "px";
}

// entry-point
setSize();
get_offset();
initGrid();
main();
toolsMain();


// Demo
shapes.push({ x: 200, y: 50, width: 200, height: 200, color: 'blue' });
shapes.push({ x: 100, y: 50, width: 100, height: 100, color: 'red' });
shapes.push({ x: 100, y: 150, width: 70, height: 70, color: 'white' });
