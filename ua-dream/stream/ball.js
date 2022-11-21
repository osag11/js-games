const vF = 5;
const targetColor = 'red';
let radiusStep = 1.5;

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
    }
};  

  
//   function drawBall() {
//     clear();
//     ball.draw();
//     ball.x += ball.vx;
//     ball.y += ball.vy;
  
//     if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
//       ball.vy = -ball.vy;
//     }
//     if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
//       ball.vx = -ball.vx;
//     }
  
//     raf = window.requestAnimationFrame(drawBall);
//   }


  
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

function minRadius(r) {
    if (r < 20) return 20;
    return r;
}