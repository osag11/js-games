const canvas = document.getElementById("scene");
const ctx = scene.getContext("2d");
document.addEventListener("keydown", handleKeyDown);

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// color option 1: custom set
const colors = ["beige", "Plum", "Salmon", "Cornsilk", "Peru", "CadetBlue", "green", "blue", "yellow", "violet", "brown", "grey", "cyan", "black"];
function getRandomColor() {
    return colors[getRandom(0, colors.length - 1)]
}

// color option 2
function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
        finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
}

// figures
function drawRect(x, y, color, size) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function drawCircle(x, y, color, size) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
}

function drawTriangle(x, y, color, size) {

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size, y - size);
    ctx.lineTo(x + size, y - size);
    ctx.fill();
}

let maxSize = 20;
// let counter = 1;//#2
function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed}`)

    let x = getRandom(0, canvas.width);
    let y = getRandom(0, canvas.height);

    // let x= counter++; //#2
    // let y = Math.sin(x)* canvas.height; //#2

    let color = generateColor();

    if (keyPressed == 38) {//up
        drawRect(x, y, color, getRandom(10, maxSize));
        // maxSize++; //#1
    }

    if (keyPressed == 40) {//down
        drawCircle(x, y, color, getRandom(10, maxSize) * 0.5);
        // maxSize--;//#1
    }

    if (keyPressed == 32) {//space
        drawTriangle(x, y, color, getRandom(10, maxSize) * 0.5);
    }

    if (keyPressed == 107) {//+
        maxSize++;
        console.log(`maxSize: ${maxSize}`)

    }

    if (keyPressed == 109) {//-
        maxSize--;
        if (maxSize < 20) maxSize = 20;//#1
        console.log(`maxSize: ${maxSize}`)

    }
}
