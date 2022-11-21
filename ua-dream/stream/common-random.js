const colors3 = ["blue", , "cyan", "aquamarine", "aqua", "royalblue", "steelvlue", "skyblue", "CornflowerBlue", "DarkCyan"];
const colors4 = ["yellow", "orange",  "gold", "darkorange", "coral",  "SandyBrown", "LemonChiffon"];

const colors1 = ["blue", , "cyan", "aqua", "skyblue"];
const colors2 = ["yellow", "orange", "gold", "LemonChiffon"];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    return colors[getRandom(0, colors.length - 1)]
}

function getRandomUAColor(id) {
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
