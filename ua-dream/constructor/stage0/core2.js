// const canvas = document.getElementById("cw");//#5
// const ctx = canvas.getContext("2d");//#5
// canvas.style="border: 1px solid; background-color:white;"//#6

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

drawCircle(150, 100, 60, 'blue');

drawCircle(150, 100, 20, 'red');

