
let cityModel = {
    houseWidth: 50,
    houseStageHeight: 50,
    houses: [],
    minHouseSize: 1,
    maxHouseSize: 3,
    colors: ["beige", "Plum", "Salmon", "Cornsilk", "Peru", "CadetBlue", "green", "blue", "yellow", "violet", "brown", "grey"]
}


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSize() {
    return getRandom(cityModel.minHouseSize, cityModel.maxHouseSize);
}

function getRandomColor() {
    return cityModel.colors[getRandom(0, cityModel.colors.length - 1)]
}

function getRandomColor(excludeColor) {
    let colorIdx = getRandom(0, cityModel.colors.length - 1);
    let color = cityModel.colors[colorIdx];
    if (color == excludeColor) {
        if (colorIdx < cityModel.colors.length - 1) {
            color = cityModel.colors[colorIdx + 1];
        } else {
            color = cityModel.colors[0];
        }
    }
    return color;
}


function drawCity() {
    if (cityModel.houses.length == 0) {
        // build houses model
        for (let i = 1; i < scene.width / cityModel.houseWidth; i++) {
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
    if (size > 0) {
        drawWalls(x, size, color);
        drawRoof(x, scene.height - size * cityModel.houseStageHeight, roofColor);
        drawWindows(x, size, color);
     }
}

function drawWalls(x, size, color) {
    ctx2d.fillStyle = color;
    ctx2d.fillRect(x, scene.height, cityModel.houseWidth - 4, -size * cityModel.houseStageHeight);
}


function drawRoof(x, y, color) {
    ctx2d.fillStyle = color;

    ctx2d.beginPath();
    ctx2d.moveTo(x - 2, y);
    ctx2d.lineTo(x + 15, y - 30);
    ctx2d.lineTo(x + 32, y - 30);
    ctx2d.lineTo(x + 49, y);
    ctx2d.fill();
}


let winColors = [];
let winRandomFloorColors = [];
let lightSwitchCount = 0;

function drawWindows(x, size, houseColor) {

    if (!winColors[x]) {
        winColors[x] = getRandomColor(houseColor);
    }

    ctx2d.fillStyle = winColors[x];

    for (let i = 0; i <= size * cityModel.houseStageHeight; i += cityModel.houseStageHeight) {
        ctx2d.fillRect(x + 5, scene.height - (i - 10), 16, 25);
        ctx2d.fillRect(x + 25, scene.height - (i - 10), 16, 25);
    }

    // blinking light
    let randomFloor = getRandom(0, size)
    if (lightSwitchCount % 5 == 0) {
        winRandomFloorColors[x] = getRandomColor(houseColor);
    }

    ctx2d.fillStyle = winRandomFloorColors[x]
    ctx2d.fillRect(x + 5, scene.height - (randomFloor * cityModel.houseStageHeight - 10), 16, 25);
    ctx2d.fillRect(x + 25, scene.height - (randomFloor * cityModel.houseStageHeight - 10), 16, 25);

    lightSwitchCount++;

}
