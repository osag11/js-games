const vF = 5;
const ballProblemSolvedRadius = 5;
const targetColor = 'red';
let killingSpeed = 0.01;


const ball = {
    x: 100,
    y: 100,
    vx: 1 * vF,
    vy: 1 * vF,
    radius: 25,
    color: targetColor,
    colliting: false,
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    },

    handleCollision(){
        
    }
}; 



function handleBallCollision(ball, theta){
    // log(theta);

    ball.vx = -direction * Math.cos(theta) * vF * getDeviation(0.9);
    ball.vy = -direction * Math.sin(theta) * vF * getDeviation(0.9);


}

function log(theta)
{
    console.log(theta*180/Math.PI%360);
    console.log(`cos: ${Math.cos(theta)}` );
    console.log(`sin: ${Math.sin(theta)}`);
    console.log(`tan: ${Math.tan(theta)}`);
}

  
function drawTarget(ball) {
    ball.draw();
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

function getMinRadius(r) {
    if (r < 20) return 20;
    return r;
}