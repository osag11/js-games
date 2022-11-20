const canvas = document.getElementById("cw");
const context = canvas.getContext("2d");
context.globalAlpha = 0.5;

const cursor = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

// const colors1 = ["blue", , "cyan", "aquamarine", "aqua", "royalblue", "steelvlue", "skyblue", "CornflowerBlue", "DarkCyan"];
// const colors2 = ["yellow", "orange",  "gold", "darkorange", "coral",  "SandyBrown", "LemonChiffon"];
const colors1 = ["blue", , "cyan", "aqua", "skyblue"];
const colors2 = ["yellow",  "orange", "gold", "LemonChiffon"];


let particlesArray = [];
let radiusStep = 1.5;
let direction = 0;

generateParticles(10);
setSize();
anim();

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

function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
        finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
}

function setSize() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
}

function Particle(x, y, particleTrailWidth, strokeColor, rotateSpeed, instance) {
    this.instance = instance;
    // this.colliting = false;
    this.x = x;
    this.y = y;
    this.particleTrailWidth = particleTrailWidth;
    this.strokeColor = strokeColor;
    this.theta = Math.random() * Math.PI * 2;
    this.rotateSpeed = rotateSpeed;
    this.t = 20 + Math.random() * 40;
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
    };

    this.rotate = () => {
        const ls = {
            x: this.x,
            y: this.y,
        };
        this.theta += this.rotateSpeed;
        this.x = cursor.x + Math.cos(this.theta) * (this.t + this.forcedSize);
        this.y = cursor.y + Math.sin(this.theta) * (this.t + this.forcedSize);
        context.beginPath();
        context.lineWidth = this.particleTrailWidth;
        context.strokeStyle = this.strokeColor;
        context.moveTo(ls.x, ls.y);
        context.lineTo(this.x, this.y);
        context.stroke();
    };
}

function anim() {
    window.requestAnimationFrame(anim);

    context.fillStyle = "rgba(0,0,0,0.05)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach((particle) => {
        particle.rotate();

        if(particle.instance>=8){
            particle.update(radiusStep*direction, 0.05, getRandomUAColor(particle.instance));
        }else
        {
            particle.update(radiusStep*direction, 0.05);
        }        
    });
}


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    return colors[getRandom(0, colors.length - 1)]
}

function getRandomUAColor(id) {
    if(id%2==1)
    return colors1[getRandom(0, colors1.length - 1)]
        else
    return colors2[getRandom(0, colors2.length - 1)]

}
