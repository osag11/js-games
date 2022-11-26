const colors3 = ["blue", "cyan", "aquamarine", "aqua", "royalblue", "steelvlue", "skyblue", "CornflowerBlue", "DarkCyan"];
const colors4 = ["yellow", "orange", "gold", "darkorange", "coral", "SandyBrown", "LemonChiffon"];

// https://www.w3schools.com/colors/colors_names.asp
const colors1 = ["blue", "cyan", "aqua", "skyblue", "RoyalBlue"];
const colors2 = ["yellow", "orange", "gold", "PeachPuff", "LemonChiffon"];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDeviation(range) {
    return 1 + Math.random() * range - Math.random() * range;
}

function getRandomColor(colors) {
    return colors[getRandom(0, colors.length - 1)]
}

function addOpacity(color, opacity) {
    let w3c = w3color(color);
    w3c.opacity = opacity;
    return w3c.toRgbaString()
}


function getRandomUAColor(id) {
    if (!id) id = getRandom(1, 2);
    if (id % 2 == 1)//odd
        return colors1[getRandom(0, colors1.length - 1)]
    else//even
        return colors2[getRandom(0, colors2.length - 1)]
}


function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
        finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
}


function shuffle(array) {

    let newArray = [];

    while (array.length) {

        let randomIndex = Math.floor(Math.random() * array.length);
        let element = array.splice(randomIndex, 1);

        newArray.push(element[0]);
    }

    return newArray;
}
