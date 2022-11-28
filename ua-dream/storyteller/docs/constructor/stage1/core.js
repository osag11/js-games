const canvas = document.getElementById("cw");
const ctx = canvas.getContext("2d");
ctx.globalAlpha = 0.5;

window.addEventListener("resize", () => setSize());

function setSize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}

function clear() {
    ctx.fillStyle = "rgba(0,0,0,1)"; //"rgba(0,0,0,0.1)"//#1
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// setSize();//#2
let ball = new Ball(100, 100);
main();

function main() {
    window.requestAnimationFrame(main);
    clear();

    ball.move();
    ball.draw();
}

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 10;
    this.vy = 10;
    this.radius = 25;
    this.color = 'white';

    this.move = () => {
        this.x += this.vx;
        this.y += this.vy;

        if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
            ball.vx = -ball.vx;// - 0.1;//#3
        }

        if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
            ball.vy = -ball.vy;// - 0.1;//#3
        }
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};