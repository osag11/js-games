const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.border = '5px solid blue';

const toolsCanvas = document.getElementById("tools");
toolsCanvas.style.border = '5px solid green';
const ctx2 = toolsCanvas.getContext("2d");

ctx2.lineWidth = 2;
ctx2.strokeStyle = "blue";

let Shapes = RenderModel(ctx);

function main() {

    const t0 = performance.now();

    window.requestAnimationFrame(main);
    clear();
    Shapes.drawShapes();
    update();

    if (gridOn) drawGrid(ctx);

    const t1 = performance.now();
    console.log(`Call to main: ${t1 - t0} ms.`);
}

function setSize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth - tools.width;
    toolsCanvas.height = window.innerHeight - colorBlock.height - 44 ;
    toolsCanvas.style.marginTop = colorBlock.height + 44 + "px";
}

// entry-point
setSize();
get_offset();
initGrid();
main();


demo();

function demo() {
    let a = 100, b = 150, c = 200;
    Shapes.add(shapeData([pathPoint(10 + c, 100 + c), pathPoint(100, 50), pathPoint(100, 100), pathPoint(200, 50), pathPoint(200, 100), pathPoint(200, 250)], [], 'polygon', 'blue', false));


    Shapes.add(shapeData([pathPoint(10, 10), pathPoint(10, 50), pathPoint(100, 50), pathPoint(100, 10), pathPoint(10, 10 + c, true),
    pathPoint(10, 10 + c), pathPoint(10, 50 + c), pathPoint(100, 50 + c), pathPoint(100, 10 + c)], [], 'polygon', 'green', true));

    Shapes.add(shapeData([pathPoint(10, 10 + a), pathPoint(100 + c, 50 + b), pathPoint(100 + a, 100 + a)], [], 'polygon', 'coral', true));
    Shapes.add(shapeData([], [200, 200, 50], 'circle', 'red', false));
    Shapes.add(shapeData([], [200, 200, 500, 100], 'rect', 'aqua', true));
    Shapes.add(shapeData([], [200, 400, 50], 'circle', 'violet', true));
    Shapes.add(shapeData([], [200, 400, 50, 100], 'rect', 'yellow', true));

    //
    Shapes.add(shapeData([], [200, 50, 200, 130, 50, 40, 50], 'arc', 'yellow', true));
}
