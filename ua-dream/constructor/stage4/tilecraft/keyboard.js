window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed} ${event.code}`)

    let shapes = layer().shapes;
    let shapesHistory = layer().shapesHistory;

    if (keyPressed == 46) { // Del

        if (current_shape) {
            let idx = shapes.indexOf(current_shape)
            shapes.splice(idx, 1);
            current_shape = shapes[idx - 1];
            console.log(`deleted #${idx} from ${shapes.length}`)
        }
    }

    if (keyPressed == 107) {// +
        layer().gridSize++;
        initGrid(layer().gridSize);
    }

    if (keyPressed == 109) {// -
        layer().gridSize--;
        initGrid(layer().gridSize);

    }
    // keyPressed: 83 KeyS
    // keyPressed: 67 KeyC


    if (keyPressed == 71) {// G
        gridOn = !gridOn;
    }

    if (keyPressed == 27) {// Esc
        layer().shapes = [];
    }

    if (keyPressed == 69) {// E
        edit_mode = !edit_mode;
    }

    if (keyPressed == 84) {// T

    }

    if (keyPressed == 82) {// R
        randomColor = !randomColor;
        randomColorState(randomColor);
    }

   // let shapeType= layer().shapeType;

    if (keyPressed == 49) {// 1
        layer().shapeType = 'square'
    }

    if (keyPressed == 50) {// 2
        layer().shapeType = 'circle'
    }

    if (keyPressed == 51) {// 3
        layer().shapeType = 'polygon';
        layer().polygonSize = 3;
    }

    if (keyPressed == 52) {// 4
        layer().shapeType = 'polygon';
        layer().polygonSize = 4;

    }

    if (keyPressed == 53) {// 5
        layer().shapeType = 'polygon';
        layer().polygonSize = 5;

    }

    if (keyPressed == 54) {// 6
        layer().shapeType = 'polygon';
        layer().polygonSize = 6;

    }

    if (keyPressed == 55) {// 7
        layer().shapeType = 'polygon';
        layer().polygonSize = 7;

    }


    if (keyPressed == 56) {// 8
        layer().shapeType = 'polygon';
        layer().polygonSize = 8;
    }


    if (keyPressed == 57) {// 9
        layer().shapeType = 'circle2x'
    }


    if (keyPressed == 83) {// S
    }

    if (keyPressed == 67) {// C
    }

    // 39 ArrowRight
    // 37 ArrowLeft
    // 38 ArrowUp
    // 40 ArrowDown

    if (keyPressed == 38) { // ArrowUp
        let gridSize =  layer().gridSize;

        let clonedShapes = [...layer().shapes];
        clonedShapes.sort((a, b) => {
            const nameA = a.c.toUpperCase(); // ignore upper and lowercase
            const nameB = b.c.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });

        let usedColors = [];
        layer().shapes = [];
        let x = 0;
        let y = 0;

        for (let cS of clonedShapes) {

            if (usedColors.indexOf(cS.c) < 0) {
                usedColors.push(cS.c);

                layer().shapes.unshift({ x: x, y: y, c: cS.c });
                x += gridSize;
                if (x > canvas.width) {

                    x = 0;
                    y += gridSize;
                }
            }
        }

        // drawHexagonGrid(toolsCanvas.width,toolsCanvas.height, 30, usedColors);

    }

    if (keyPressed == 37) { // ArrowLeft

        let s = shapes.pop();
        if (s) shapesHistory.push(s);
    }

    if (keyPressed == 39) { // ArrowRight

        let s = shapesHistory.pop();
        if (s) shapes.push(s);
    }
}