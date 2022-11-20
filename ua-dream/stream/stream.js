const canvas = document.getElementById("cw");
const ctx = canvas.getContext("2d");
ctx.globalAlpha = 0.5;

const cursor = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

// const colors1 = ["blue", , "cyan", "aquamarine", "aqua", "royalblue", "steelvlue", "skyblue", "CornflowerBlue", "DarkCyan"];
// const colors2 = ["yellow", "orange",  "gold", "darkorange", "coral",  "SandyBrown", "LemonChiffon"];
const colors1 = ["blue", , "cyan", "aqua", "skyblue"];
const colors2 = ["yellow", "orange", "gold", "LemonChiffon"];
const vF = 5;

const ball = {
    x: 100,
    y: 100,
    vx: 1 * vF,
    vy: 1 * vF,
    radius: 25,
    color: 'red',
    colliting: false,
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

let particlesArray = [];
let radiusStep = 1.5;
let direction = 0;


let maxCount = 300;
let minCount = 50;
let killingSpeed = 0.01;
let roundCount = 1;
const hearts = [];


generateParticles(2);
setSize();
main();

addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
        cursor.x = e.touches[0].clientX;
        cursor.y = e.touches[0].clientY;
    },
    { passive: false }
);


addEventListener('mousedown', function (e) {
    direction = 1;
});
addEventListener('mouseup', function (e) {
    direction = -1;
});

addEventListener("resize", () => setSize());


function generateParticles(amount) {
    for (let i = 0; i < amount; i++) {
        particlesArray[i] = new Particle(
            innerWidth / 2,
            innerHeight / 2,
            4,
            getRandomUAColor(i),
            0.02,
            i
        );
    }
}

// function generateColor() {
//     let hexSet = "0123456789ABCDEF";
//     let finalHexString = "#";
//     for (let i = 0; i < 6; i++) {
//         finalHexString += hexSet[Math.ceil(Math.random() * 15)];
//     }
//     return finalHexString;
// }

function setSize() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
function Particle(x, y, particleTrailWidth, strokeColor, rotateSpeed, instance) {
    this.instance = instance;
    this.colliting = false;
    this.x = x;
    this.y = y;
    this.particleTrailWidth = particleTrailWidth;
    this.strokeColor = strokeColor;
    this.theta = Math.random() * Math.PI * 2;
    this.rotateSpeed = rotateSpeed;
    this.t = 20 + Math.random() * 60;
    this.forcedSize = 0;

    this.update = (size, speed, color) => {
        this.rotateSpeed = speed;

        if (color) {
            this.strokeColor = color;
        }

        this.forcedSize += size;
        if (this.forcedSize < 0 || this.forcedSize > 200) {
            this.forcedSize -= size;
        }

        if (ball.colliting) {
            // console.log(this.theta*180/Math.PI%360);
            // console.log(`cos: ${Math.cos(this.theta)}` );
            // console.log(`sin: ${Math.sin(this.theta)}`);
            // console.log(`tan: ${Math.tan(this.theta)}`);
            ball.vx = -Math.sin(this.theta) * vF;
            ball.vy = -Math.cos(this.theta) * vF;
            if (particlesArray.length < maxCount) {
                particlesArray.push(new Particle(
                    cursor.x,
                    cursor.y,
                    4,
                    getRandomUAColor(particlesArray.length + 1),
                    0.02,
                    particlesArray.length + 1
                ));
            }
        }
    };

    this.rotate = () => {
        const ls = {
            x: this.x,
            y: this.y,
        };
        this.theta += this.rotateSpeed;
        this.x = cursor.x + Math.cos(this.theta) * (this.t + this.forcedSize);
        this.y = cursor.y + Math.sin(this.theta) * (this.t + this.forcedSize);
        ctx.beginPath();
        ctx.lineWidth = this.particleTrailWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.moveTo(ls.x, ls.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    };
}

function clear() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function main() {
    window.requestAnimationFrame(main);
    clear();
    drawDream();

    drawTarget();
    drawParticles();

    if (particlesArray.length > minCount) {
        console.log(particlesArray.pop().instance);
    }
}


function drawTarget() {
    ball.draw();
    let rand = 1 + Math.random() * 0.5 - Math.random() * 0.5;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy * rand;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx * rand;
    }

    // invert
    if ( ball.y < 0) {
        ball.vy = 1 * vF;
    }
    if (ball.y > canvas.height) {
        ball.vy = -1 * vF;

    }
    if (ball.x < 0) {
        ball.vx = 1 * vF;
    }
    if (ball.x > canvas.width) {
        ball.vx = -1 * vF;
    }

}
function minRadius(r) {
    if (r < 20) return 20;
    return r;
}

function drawParticles() {
    ball.color = "red";

    particlesArray.forEach((particle) => {
        particle.rotate();

        if (rectIntersect(particle.x, particle.y, 5, 5, ball.x, ball.y, minRadius(ball.radius), minRadius(ball.radius))) {

            ball.color = particle.strokeColor;
            if (ball.radius > 5) {
                ball.radius -= killingSpeed;
            } else {
                // new roindu
                addHearts(ball.x, ball.y);

                ball.radius = 25 + roundCount;
                ball.x = getRandom(100, canvas.width);
                ball.y = getRandom(100, canvas.height);
            }

            ball.colliting = true;
            particle.update(radiusStep * direction, 0.05, getRandomUAColor(particle.instance));
        } else {
            particle.update(radiusStep * direction, 0.05);
            ball.colliting = false;
        }
    });
}

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


function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}


function circleIntersect(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}


// function detectCollisions() {
//     let obj1;
//     let obj2;

//     // Reset collision state of all objects
//     for (let i = 0; i < gameObjects.length; i++) {
//         gameObjects[i].isColliding = false;
//     }

//     // Start checking for collisions
//     for (let i = 0; i < gameObjects.length; i++) {
//         obj1 = gameObjects[i];
//         for (let j = i + 1; j < gameObjects.length; j++) {
//             obj2 = gameObjects[j];

//             // Compare object1 with object2
//             if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
//                 obj1.isColliding = true;
//                 obj2.isColliding = true;
//             }
//         }
//     }
// }


// https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
    }
}