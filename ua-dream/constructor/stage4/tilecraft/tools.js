const mouse = { x: 0, y: 0, button: 0, lx: 0, ly: 0, update: true };
const markRadius = 4;



function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
        finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
}



// https://eperezcosano.github.io/hex-grid/
function drawHexagonGrid(width, height, r, colors = ['red', 'green', 'blue']) {
    let idx = -1;
    const a = 2 * Math.PI / 6;

    for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
        for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
            idx++;
            if (idx > colors.length - 1) idx = 0;

            let color = colors[idx];
            drawPolygonCtx2(x, y, r, color);
        }
    }
}


function drawPolygonCtx2(x, y, r, color, corners = 6) {
    const a = 2 * Math.PI / corners;
    ctx2.fillStyle = color;

    ctx2.beginPath();
    for (var i = 0; i < corners; i++) {
        ctx2.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx2.closePath();
    ctx2.fill();
}

