
const rewardsAmountPerRound = { hearts: 3, flags: 2, flowers: 1 };
const rewardsLimit = { hearts: 20, flags: 5, flowers: 10, affirmations: 5 };

let affirmations = [
    // UA multiline
    "війна закінчиться нашою перемогою | і в мене буде випускний",
    "навколо мене цілий світ добрих людей | які нам всім допомагають",
    "в мене є робота яка дає | багато грошей та задоволення",
    "мій тато повернувся з війни | і знову вдома",
    "Успіхи ЗСУ надихає на добрі справи | та жагу особисто розвиватися",

    // special multiline quotes ` ` in javascript:
    `І вам, лицарі великі, Богом не забуті.  
    Борітеся — поборете! Вам Бог помагає! 
    За вас правда, за вас слава 
    І воля святая!
    Т.Г. Шевченко`,

    // ENG
    // "Mama is healthy", "Papa at home", "Our home is OK", "My city is free from tanks", "I Am Happy",
    // "putin executed in Hague", "Glory to Heroes",    
    // "We won and free!", "For Ukrainian Victory!", "Love, Peace, Freedom!",

    // UA
    // "Воля переможе!", "Слава Україні!", "Героям Слава!",
    "моє місто відбудоване та безпечне", "моя мама здорова", "мене не зламати на шляху до моєї мрії", "мій собака та кіт в добрих руках",
    // "я вирішую як буде далі", "надія є, бо мені Бог допомагає", "наше місто належить тільки нам",
    // "з моїми бабусею і дідусем все добре", "всі мої друзі повернулися", "ми перемогли а я навчився програмувати",
    // "я люблю життя ціную волю як ніколи раніше", "я зароблю програмістом на новий будинок", "мій новий будинок буде кращим за старий",
    // "Україна є і завжди буде нашим домом", "моя сім'я в безпеці", "я куплю всім друзям нові ноутбуки",
    // "я буду жити добре та вільною людиною", "перед мною відкритий цілий світ можливостей", 
    "я залишетимусь доброю та сильною людиною",

    // RU
    // "мой город отстроен и безопасен", "моя мама здорова", "мой папа вернулся живой и снова дома", 
    // "с моими бабушкой и дедушкой все хорошо", "война закончится победой, и у меня будет выпускной", 
    // "все мои друзья вернулись", "мы победили, я научусь программировать", "я люблю жизнь", "я заработаю программистом на новый дом", 
    // "мой новый дом будет лучше старого", "мой город принадлежит только нам", "Украина есть и всегда будет нашим домом", 

    // RU multiline    
    // "я заработаю программированием много денег | и задоначу на ЗСУ все деньги | чтобы война никогда не повторилось"
];
const activeAffirmations = [];

const hearts = [];
const heartSize = { min: 15, max: 40 };

const flags = [];
const flagSize = {
    w: { min: 80 / 2, max: 120 / 2 },
    h: { min: 40 / 2, max: 60 / 2 }
};

const flowers = [];
const flowerSize = {
    radius: { min: 15, max: 40 },
    petals: { min: 5, max: 10 }
};

function addFlowers(count, x, y, area) {
    if (!area) area = 200;

    for (let i = 0; i < count; i++) {

        let randomizer = getRandom(1, 2);
        let colorA = addOpacity(getRandomUAColor(randomizer), 0.3);
        let colorACenter = addOpacity(getRandomUAColor(randomizer + 1), 0.3);

        flowers.unshift(
            new Flower(
                x + getRandom(-area, area),
                y + getRandom(-area, area),
                getRandom(flowerSize.radius.min, flowerSize.radius.max),
                getRandom(flowerSize.petals.min, flowerSize.petals.max),
                colorA,
                colorACenter
            ));
    }
}


function addHearts(count, x, y, area) {
    if (!area) area = 200;

    for (let i = 0; i < count; i++) {

        let colorA = addOpacity(getRandomUAColor(), 0.3);

        hearts.unshift({
            x: x + getRandom(-area, area),
            y: y + getRandom(-area, area),
            w: getRandom(heartSize.min, heartSize.max),
            h: getRandom(heartSize.min, heartSize.max),
            color: colorA
        });
    }
}

let affIdx = 0;

function showNextAffirmation(x, y) {
    if (affIdx >= affirmations.length) {
        affIdx = 0;
    }

    let aff = affirmations[affIdx];
    addAffirmation(aff, x, y);
    affIdx++;
}

function addAffirmation(affirmation, x, y) {
    activeAffirmations.unshift(
        {
            text: affirmation,
            x: x ? x : getRandom(0, canvas.width),
            y: y ? y : getRandom(0, canvas.height),
            angle: getRandom(-70, 70),
            color: addOpacity(getRandomUAColor(), 0.4),
            fontSize: getRandom(36, 72),
        }
    );
}

function addFlag(x, y) {
    flags.unshift({
        x: x,
        y: y,
        c1: getRandomUAColor(1),
        c2: getRandomUAColor(2),
        w: getRandom(flagSize.w.min, flagSize.w.max),
        h: getRandom(flagSize.h.min, flagSize.h.max),
    });
}


function drawDreams() {
    // hearts
    for (let h of hearts) {
        drawHeart(h.x, h.y, h.w, h.h, h.color);
    }

    for (let flower of flowers) {
        flower.draw();
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

        let textRows = aff.text.split(/\r?\n|\|/);
        if (textRows.length > 1) {
            let i = 0;
            textRows.forEach(row => {
                ctx.fillText(row, 0, i++ * aff.fontSize);
            });
        } else {
            ctx.fillText(aff.text, 0, 0);
        }

        //debug
        ctx.fillText(`${aff.text.length}: ${aff.fontSize}`, 0, aff.fontSize*textRows.length );

        ctx.restore();
    }
}

function drawUAFlag(x, y, w, h, c1, c2) {
    ctx.fillStyle = c1;
    ctx.fillRect(x - w / 2, y - h / 2, w, h / 2);
    ctx.fillStyle = c2;
    ctx.fillRect(x - w / 2, y, w, h / 2);
}

// https://stackoverflow.com/questions/58333678/draw-heart-using-javascript-in-any-postionx-y
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

// http://www.java2s.com/ref/javascript/html-canvas-bezier-curve-draw-flower.html
function Flower(centerX, centerY, radius, numPetals, color, centerColor) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.numPetals = numPetals;
    this.color = color;
    this.centerColor = centerColor;

    this.draw = () => {
        ctx.beginPath();

        // draw petals
        for (let n = 0; n < this.numPetals; n++) {
            let theta1 = ((Math.PI * 2) / this.numPetals) * (n + 1);
            let theta2 = ((Math.PI * 2) / this.numPetals) * (n);

            let x1 = (this.radius * Math.sin(theta1)) + this.centerX;
            let y1 = (this.radius * Math.cos(theta1)) + this.centerY;
            let x2 = (this.radius * Math.sin(theta2)) + this.centerX;
            let y2 = (this.radius * Math.cos(theta2)) + this.centerY;

            ctx.moveTo(this.centerX, this.centerY);
            ctx.bezierCurveTo(x1, y1, x2, y2, this.centerX, this.centerY);
        }

        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // draw yellow center
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius / 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.centerColor ? this.centerColor : "yellow";
        ctx.fill();
    }

}


function disposeRewards() {

    if (flags.length > rewardsLimit.flags) {
        flags.pop();
    }

    if (hearts.length > rewardsLimit.hearts) {
        hearts.pop();
    }

    if (activeAffirmations.length > rewardsLimit.affirmations) {
        activeAffirmations.pop();
    }

    if (flowers.length > rewardsLimit.flowers) {
        flowers.pop();
    }
}

// https://stackoverflow.com/questions/31096766/creating-the-butterfly-curve-with-arrays