
let particlesArray = [];
let direction = -1;
let roundCount = 1;

let maxCount = 300;
let minCount = 50;

let maxRadius = 80;
let minRadius = 30;
let radiusStep = 1.5;

let rotationSpeedMax = 0.05;
let rotationSpeedMin = 0.02;

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
    this.t = minRadius + Math.random() * maxRadius;
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
        ctx.beginPath();
        ctx.lineWidth = this.particleTrailWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.moveTo(ls.x, ls.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    };
}



function drawParticles() {

    particlesArray.forEach((particle) => {
        particle.rotate();
        handleParticlesCollision(particle);
    });
        
    // remove from the end
    if (particlesArray.length > minCount) {
        let deleted = particlesArray.pop();
        console.log(deleted.instance);
    }
}


function handleParticlesCollision(particle) {
    if (rectIntersect(particle.x, particle.y, 5, 5, ball.x, ball.y, getMinRadius(ball.radius), getMinRadius(ball.radius))) {

        ball.color = particle.strokeColor;

        particle.colliting = true;
        particle.update(radiusStep * direction, rotationSpeedMax, getRandomUAColor(particle.instance));

        handleBallCollision(ball, particle.theta);
        
        if (particlesArray.length < maxCount) {
            // add to beginning
            particlesArray.unshift(new Particle(
                cursor.x,
                cursor.y,
                4,
                getRandomUAColor(particlesArray[0].instance),
                rotationSpeedMin,
                particlesArray.length + 1
            ));
        }

        handleRoundEnd();

    } else {
        particle.colliting = false;
        particle.update(radiusStep * direction, 0.05);
    }

}

function handleRoundEnd() {
    if (ball.radius > ballProblemSolvedRadius) {
        ball.radius -= killingSpeed;
    } else {
        // new round
        roundCount++;
        addHearts(roundCount, ball.x, ball.y);

        ball.radius = 25 + roundCount;
        ball.x = getRandom(100, canvas.width);
        ball.y = getRandom(100, canvas.height);
    }
}
