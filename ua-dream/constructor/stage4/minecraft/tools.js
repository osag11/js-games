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

    // 39 ArrowRight
    // 37 ArrowLeft
    // 38 ArrowUp
    if (keyPressed == 38) { // 

        let clonedShapes = [...shapes];
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
          ///shapes = [];
          let x = 0;
          let y= 0;
          for(let cS of clonedShapes)
          {
            shapes.push({x:x,y:y,c:cS.c});
            x+=gridSize;
            if(x>canvas.width)
            {

                x=0;
                y+=gridSize;
            }
          }
    }    
    
    // 40 ArrowDown
    if (keyPressed == 37) { // 

        let s = shapes.pop();
        if (s) shapesHistory.push(s);
    }

    if (keyPressed == 39) { // 

        let s = shapesHistory.pop();
        if (s) shapes.push(s);
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



