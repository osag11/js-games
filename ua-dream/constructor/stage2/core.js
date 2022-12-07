const canvas = document.getElementById("cw");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", () => setSize());

function setSize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}

function clear() {
    ctx.fillStyle = "rgba(0,0,0,1)"; //"rgba(0,0,0,0.1)"//#1
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

setSize();

const imageTank = new Image();
imageTank.src = "tank.png";

let tank = new Tank(100, 100);

main();

function main() {
    window.requestAnimationFrame(main);
    clear();

    tank.move();
    tank.draw();
}

function Tank(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 5;
    this.vy = 5;
    // focus point
    this.radius = 5;
    this.color = 'red';

    this.move = () => {
        this.x += this.vx;
        this.y += this.vy;

        if (tank.x + tank.vx > canvas.width || tank.x + tank.vx < 0) {
            tank.vx = -tank.vx;// - 0.1;//#3
        }

        if (tank.y + tank.vy > canvas.height || tank.y + tank.vy < 0) {
            tank.vy = -tank.vy;// - 0.1;//#3
        }
    }

    this.draw = () => {
        ctx.drawImage(imageTank, this.x, this.y, 300, 300);

        ctx.beginPath();
        ctx.arc(this.x+150, this.y+150, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};