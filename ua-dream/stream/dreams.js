const hearts = [];
const heartSize = { min: 20, max: 50 };
const rewardsSize = { hearts: 3, flags: 2, flowers: 2 };
let affirmations = [
    "Mama is healthy", "Papa at home", "Our home is OK", "My city is free from tanks", 
"Воля переможе!", "Слава Україні!","Героям Слава!", "Glory to Heroes",  
"I Am Happy", "We won and free!", "putin executed in Hague", "For Ukrainian Victory!", "Love, Peace, Freedom!",
];

const activeAffirmations = [];
const flags = [];
const flagSize = { 
   w:{ min: 80/3, max: 120/3}, 
   h:{ min: 40/3, max: 60/3 } 
};


function addHearts(count, x, y, area) {
    if (!area) area = 200;

    for (let i = 0; i < count; i++) {

        let colorA = addOpacity(getRandomUAColor(hearts.length), 0.3);

        hearts.push({
            x: x + getRandom(-area, area),
            y: y + getRandom(-area, area),
            w: getRandom(heartSize.min, heartSize.max),
            h: getRandom(heartSize.min, heartSize.max),
            color: colorA
        });
    }
}

let affIdx = 0;

function showNextAffirmation() {
    if (affIdx >= affirmations.length) {
        affIdx = 0;
    }

    let a = affirmations[affIdx];
    addAffirmation(a);
    affIdx++;
}

function addAffirmation(affirmation) {
    activeAffirmations.push(
        {
            text: affirmation,
            x: getRandom(0, canvas.width),
            y: getRandom(0, canvas.height),
            angle: getRandom(-70, 70),
            color: addOpacity(getRandomUAColor(activeAffirmations.length), 0.4),
            fontSize: getRandom(36, 102) - affirmation.length,
        }
    );
}

function addFlag(x, y) {
    flags.push({
        x: x,
        y: y,
        c1: getRandomUAColor(1),
        c2: getRandomUAColor(0),
        w: getRandom(flagSize.w.min, flagSize.w.max),
        h: getRandom(flagSize.h.min, flagSize.h.max),
    });
}


function drawDreams() {
    // hearts
    for (let h of hearts) {
        drawHeart(h.x, h.y, h.w, h.h, h.color);
    }

    for (let f of flags) {
        drawUAFlag(f.x, f.y, f.w, f.h, f.c1, f.c2);
    }

    // affirmations
    for (let aff of activeAffirmations) {
        ctx.save();

        ctx.fillStyle = aff.color
        ctx.font = `${aff.fontSize}px serif`;
        ctx.textAlign = "center";
        ctx.translate(aff.x, aff.y);
        ctx.rotate(aff.angle * Math.PI / 180);
        ctx.fillText(aff.text, 0, 0);

        ctx.restore();
    }
}

function drawUAFlag(x, y, w, h, c1,c2) {
    ctx.fillStyle = c1;
    ctx.fillRect(x - w / 2, y - h / 2, w, h / 2);
    ctx.fillStyle = c2;
    ctx.fillRect(x - w / 2, y, w, h / 2);
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