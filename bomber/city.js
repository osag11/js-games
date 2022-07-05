
let cityModel = {
    houseWidth: 50,
    houseStageHeight: 50,
    houses: [],
    minHouseSize: 4,
    maxHouseSize: 12,
    colors: ["red", "green", "blue", "yellow", "violet", "brown", "black", "grey"]
}


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSize() {
    return getRandom(5, 10);
}

function getRandomColor() {
    return cityModel.colors[getRandom(0, cityModel.colors.length - 1)]
}

function drawCity() {
    if (cityModel.houses.length == 0) {
    // build houses model
        for (let i = 0; i < scene.width / cityModel.houseWidth; i++) {
            let size = getRandomSize();
            cityModel.houses.push({
                x: i * cityModel.houseWidth,
                size: size,
                color: getRandomColor(),
                roofColor: getRandomColor(),
                top: scene.height - (size) * cityModel.houseStageHeight
            })
        }
    }

    for (let i = 0; i < cityModel.houses.length; i++) {
        let h = cityModel.houses[i];
        drawHouse(h.x, h.size, h.color, h.roofColor);
    }
}

function drawHouse(x, size, color, roofColor) {
    drawWalls(x, size, color);
    drawRoof(x, scene.height - size * cityModel.houseStageHeight, roofColor);
    drawWindows(x, size);
}

function drawWalls(x, size, color) {
    ctx2d.fillStyle = color;
    ctx2d.fillRect(x, scene.height, cityModel.houseWidth - 4, -size * cityModel.houseStageHeight);
}


function drawRoof(x, y, color) {
    ctx2d.fillStyle = color;

    ctx2d.beginPath();
    ctx2d.moveTo(x-2, y);
    ctx2d.lineTo(x+15, y-30);
    ctx2d.lineTo(x+32, y-30);
    ctx2d.lineTo(x+49, y);
    ctx2d.fill();
}

function drawWindows(x, size) {

        ctx2d.fillStyle = getRandomColor();

    for (let i = 0; i <= size * cityModel.houseStageHeight; i+= cityModel.houseStageHeight) {
        ctx2d.fillRect(x+5, scene.height - (i-10), 16, 25);

        ctx2d.fillRect(x+25, scene.height - (i-10), 16, 25);
    }
}
