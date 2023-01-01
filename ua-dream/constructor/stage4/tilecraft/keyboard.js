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

    if (keyPressed == 107 || keyPressed == 187) {// +
        layer().gridSize++;
        initGrid(layer().gridSize * (layer().zoom ?? 1));
    }

    if (keyPressed == 109 || keyPressed == 189) {// -
        layer().gridSize--;
        initGrid(layer().gridSize * (layer().zoom ?? 1));
    }

    if (keyPressed == 71) {// G
        gridOn = !gridOn;
    }
    if (keyPressed == 72) {// H
        help = !help;
    }
    if (keyPressed == 27) {// Esc
        if (layer().visible) {
            layer().shapes = [];
        }
    }

    if (keyPressed == 69 || keyPressed == 32) {// E or Space
        layer().edit_mode = !layer().edit_mode;
    }

    if (keyPressed == 82) {// R
        randomColor = !randomColor;
        randomColorState(randomColor);
    }

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

    if (keyPressed == 67) {// C
        layerCloneMode = !layerCloneMode;
    }

    if (keyPressed == 88) {// X

        if (xLock) {
            xLock = null;
        }
        else {
            xLock = mouseEditor.x;
        }
        yLock = null;
    }

    if (keyPressed == 89) {// Y
        if (yLock) {
            yLock = null;
        }
        else {
            yLock = mouseEditor.y;
        }
        xLock = null;
    }

    if (keyPressed == 66) {// B
        // backround: black, white, custom
        if (event.ctrlKey) {//add
            model.background.push(pickerModel.rgbaColor);
            model.backgroundIdx = model.background.length-1;            
        } else if(event.shiftKey){//remove
            model.background.splice(model.backgroundIdx, 1);
            model.backgroundIdx = 0;        }      
        else {//rotate
            model.backgroundIdx++;
            if (model.backgroundIdx > model.background.length - 1) model.backgroundIdx = 0;
            canvas.style.background = model.background[model.backgroundIdx] ?? 'black';
        }
        canvas.style.background = model.background[model.backgroundIdx] ?? 'black';

        console.log(JSON.stringify(model.background));
    }

    if (keyPressed == 80) {// P
        hexPalettte = !hexPalettte;
    }


    if (keyPressed == 83) {// S
    }

    if (keyPressed == 84) {// T
    }

    // 39 ArrowRight
    // 37 ArrowLeft
    // 38 ArrowUp
    // 40 ArrowDown

    if (keyPressed == 38) { // ArrowUp
        let gridSize = layer().gridSize;

        let clonedShapes = [...layer().shapes];

        // order by color name
        clonedShapes.sort((a, b) => {
            const nameA = a.c.toUpperCase();
            const nameB = b.c.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });

        paletteColors = [];
        layer().shapesHistory = [...layer().shapes]; // make backup
        layer().shapes = [];

        let x = 0;
        let y = 0;

        for (let cS of clonedShapes) {

            if (paletteColors.indexOf(cS.c) < 0) {
                paletteColors.push(cS.c);

                layer().shapes.unshift({ x: x, y: y, c: cS.c });
                x += gridSize;
                if (x > canvas.width) {

                    x = 0;
                    y += gridSize;
                }
            }
        }
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