const hearts = [];
let heartSize = {min:20, max:50};

// const flags = [];
// let flagSize = {min:20, max:50};


function addHearts(count, x, y, area) {
    if(!area) area=200;

    for (let i = 0; i < count; i++) {

    let hca = w3color(getRandomUAColor(i));
    hca.opacity=0.3;

        hearts.push({
            x: x + getRandom(-area, area),
            y: y + getRandom(-area, area),
            w: getRandom(heartSize.min, heartSize.max),
            h: getRandom(heartSize.min, heartSize.max),
            color: hca.toRgbaString()
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