const mouse = { x: 0, y: 0, button: 0, lx: 0, ly: 0, update: true };
const markRadius = 4;

window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed} ${event.code}`)

    if (keyPressed == 46) { // Del
        shapes.pop();
    }

    if (keyPressed == 107) {// +
        gridSize++;
        initGrid(gridSize);
    }

    if (keyPressed == 109) {// -
        gridSize--;
        initGrid(gridSize);

    }
    // keyPressed: 83 KeyS
    // keyPressed: 67 KeyC


    if (keyPressed == 71) {// G
        gridOn = !gridOn;
    }

    if (keyPressed == 27) {// Esc
        shapes = [];
    }

    if (keyPressed == 69) {// E
        edit_mode = !edit_mode;
    }

    if (keyPressed == 84) {// T
        shapeType = 'triangle'
    }

    if (keyPressed == 82) {// R
        randomColor = !randomColor;
    }

    if (keyPressed == 83) {// S
        shapeType = 'square'
    }

    if (keyPressed == 67) {// C
        shapeType = 'circle'
    }
}

function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
        finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
}
