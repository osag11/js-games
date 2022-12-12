const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.style.border = '5px solid blue';


const toolsCanvas = document.getElementById("tools");
toolsCanvas.style.border = '5px solid green';
const ctx2 = toolsCanvas.getContext("2d");
ctx2.lineWidth = 2;
ctx2.strokeStyle = "blue";

const Shapes = ShapesCtor(ctx);

function main() {
    window.requestAnimationFrame(main);
    clear();
    // draw_shapes();
    Shapes.drawShapes();

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


let a= 100,b=150,c = 200;
Shapes.add(shape([pathPoint(10+c,100+c), pathPoint(100,50), pathPoint(100,100), pathPoint(200,50), pathPoint(200,100), pathPoint(200,250)],[],'path','blue', false));


Shapes.add(shape([pathPoint(10,10), pathPoint(10,50), pathPoint(100,50), pathPoint(100,10), pathPoint(10,10+c, true),  
    pathPoint(10,10+c), pathPoint(10,50+c), pathPoint(100,50+c), pathPoint(100,10+c)],[],'path','green', true));

    Shapes.add(shape([pathPoint(10,10+a), pathPoint(100+c,50+b), pathPoint(100+a,100+a)],[],'path','coral', true));
Shapes.add(shape([],[200,200,50],'circle','red', false));
Shapes.add(shape([],[200,200,500,100],'rect','aqua', true));
Shapes.add(shape([],[200,400,50],'circle','violet', true));
Shapes.add(shape([],[200,400,50,100],'rect','yellow', true));
Shapes.add(shape([],[0,0,50,100,80],'arc','yellow', true));

// Demo
// shapes.push({ x: 200, y: 50, width: 200, height: 200, color: 'blue' });
// shapes.push({ x: 100, y: 50, width: 100, height: 100, color: 'red' });
// shapes.push({ x: 100, y: 150, width: 70, height: 70, color: 'white' });
