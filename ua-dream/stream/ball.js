const balls = [];

const vF = 5;
const ballProblemSolvedRadius = 15;
const targetColor = 'red';
const ballInitialSize = 25;
const ballMaxSize = 50;
const killingSpeed = 0.1;
const colorChangeCount = 600;
const targetLifes = 3;
let idCounter =0;

function Ball(id) {
    this.x = canvas.width * Math.random();
    this.y = canvas.height * Math.random();
    this.vx = 1 * vF;
    this.vy = 1 * vF;
    this.radius = ballInitialSize;
    this.color = targetColor;
    this.colorChangeCounter = colorChangeCount;
    this.colliting = false;
    this.lifesCount = targetLifes;
    this.id = id?id:++idCounter;

    this.recoverColor = () => {
        this.colorChangeCounter--;
        if(this.colorChangeCounter < 0)
        {
            this.colorChangeCounter = colorChangeCount;
            this.color = targetColor;
        }
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    this.handleCollision = (theta) => {
        this.vx = -direction * Math.cos(theta) * vF * getDeviation(0.9);
        this.vy = -direction * Math.sin(theta) * vF * getDeviation(0.9);
    }
};

function initBalls(n) {

    while (balls.length > 0) {
        balls.pop();
    }
    for (let i = 0; i < n; i++) {
        balls.unshift(new Ball());
    }
}


function handleBallCollision(ball, theta) {
    // log(theta);

    ball.vx = -direction * Math.cos(theta) * vF * getDeviation(0.9);
    ball.vy = -direction * Math.sin(theta) * vF * getDeviation(0.9);
}

function log(theta) {
    console.log(theta * 180 / Math.PI % 360);
    console.log(`cos: ${Math.cos(theta)}`);
    console.log(`sin: ${Math.sin(theta)}`);
    console.log(`tan: ${Math.tan(theta)}`);
}

function drawTargets() {
    for (let ball of balls) {
        drawTarget(ball);
    }
}

function drawTarget(ball) {

    ball.draw();
    // ball.color = targetColor;
    ball.recoverColor();
    let speedDeviation = getDeviation(0.5);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy * speedDeviation;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx * speedDeviation;
    }

    // invert if leaving canvas
    if (ball.y < 0) {
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

function getMinRadius(r) {
    if (r < 20) return 20;
    return r;
}