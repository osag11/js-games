const hearts = [];

function addHearts(x, y) {
    roundCount++;
    for (let i = 0; i < roundCount; i++) {

        hearts.push({
            x: x + getRandom(-200, 200),
            y: y + getRandom(-200, 200),
            w: getRandom(100, 200),
            h: getRandom(100, 200),
            color: getRandomUAColor(i)
        });
    }
}

function drawDream() {
    for (let h of hearts) {
        drawHeart(h.x, h.y, h.w, h.h, h.color);
    }
}

function drawHeart(fromx, fromy, w, h, color) {

    var x = fromx;
    var y = fromy;
    var width = w;
    var height = h;

    ctx.save();
    ctx.beginPath();
    var topCurveHeight = height * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
        x, y,
        x - width / 2, y,
        x - width / 2, y + topCurveHeight
    );

    // bottom left curve
    ctx.bezierCurveTo(
        x - width / 2, y + (height + topCurveHeight) / 2,
        x, y + (height + topCurveHeight) / 2,
        x, y + height
    );

    // bottom right curve
    ctx.bezierCurveTo(
        x, y + (height + topCurveHeight) / 2,
        x + width / 2, y + (height + topCurveHeight) / 2,
        x + width / 2, y + topCurveHeight
    );

    // top right curve
    ctx.bezierCurveTo(
        x + width / 2, y,
        x, y,
        x, y + topCurveHeight
    );

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

}