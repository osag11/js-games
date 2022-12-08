var canvas;
var ctx;
var x = 75;
var y = 50;
var SIZE = 30;
var dragok = false;

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    return setInterval(draw, 10);
}

function draw() {
    clear();

    ctx.fillStyle = "red";
    // rect(x - 15, y - 15, 30, 30);
    rect(x - SIZE/2, y - SIZE/2, SIZE, SIZE);

}

function myMove(e) {
    if (dragok) {
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;
    }
}

function myDown(e) {
    if (e.pageX < x + 15 + canvas.offsetLeft && e.pageX > x - 15 +
        canvas.offsetLeft && e.pageY < y + 15 + canvas.offsetTop &&
        e.pageY > y - 15 + canvas.offsetTop) {
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;
        dragok = true;
        canvas.onmousemove = myMove;
    }
}

function myUp() {
    dragok = false;
    canvas.onmousemove = null;
}

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;