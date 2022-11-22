
const particlesArray = [];

let direction = -1;
let roundCount = 1;
const particleSize = 3;
// settings, adjustable in runtime
let maxCount = 300;
let minCount = 51;
let maxRadius = 80;
let minRadius = 30;

const radiusStep = 1.5;
const rotationSpeedMax = 0.05;
const rotationSpeedMin = 0.02;

function generateParticles(amount) {
    for (let i = 0; i < amount; i++) {
        particlesArray[i] = new Particle(
            innerWidth / 2,
            innerHeight / 2,
            particleSize,
            getRandomUAColor(i),
            rotationSpeedMin,
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
    this.forcedOrbit = 0;

    this.update = (orbit, speed, color) => {
        this.rotateSpeed = speed;

        if (color) {
            this.strokeColor = color;
        }

        this.forcedOrbit += orbit;
        if (this.forcedOrbit < 0 || this.forcedOrbit > 200) {
            this.forcedOrbit -= orbit;
        }
    };

    this.rotate = () => {
        const ls = {
            x: this.x,
            y: this.y,
        };
        this.theta += this.rotateSpeed;
        this.x = cursor.x + Math.cos(this.theta) * (this.t + this.forcedOrbit);
        this.y = cursor.y + Math.sin(this.theta) * (this.t + this.forcedOrbit);
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
}

const particlesIndex = [];

function disposeParticles() {
    // remove from the end
    if (particlesArray.length > minCount) {
        let deleted = particlesArray.pop();
        particlesIndex.push(deleted.instance);
        console.log(`disposing: ${deleted.instance} / ${particlesArray.length} / ${particlesIndex.length}`);
    }
}

function handleParticlesCollision(particle) {

    for (let ball of balls) {
        if (rectIntersect(particle.x, particle.y, particleSize, particleSize, ball.x, ball.y, getMinRadius(ball.radius), getMinRadius(ball.radius))) {

            particle.colliting = true;
            ball.color = particle.strokeColor;

            handleBallCollision(ball, particle.theta);
            handleRoundEnded(ball);

            break;

        } else {
            particle.colliting = false;
        }
    }

    let speed = direction > 0 ? rotationSpeedMax : rotationSpeedMin;

    if (particle.colliting) {
        particle.update(radiusStep * direction, speed, getRandomUAColor(particle.instance));
        addParticle(speed);

    } else {
        particle.update(radiusStep * direction, speed);
    }
}


function addParticle(speed) {
    let id = particlesArray.length;

    if (particlesIndex.length > 0) {
        id = particlesIndex.pop();
    }
    if (particlesArray.length < maxCount) {
        // add to beginning
        particlesArray.unshift(new Particle(
            cursor.x,
            cursor.y,
            particleSize,
            getRandomUAColor(id),
            speed,
            id
        ));
    }
}

function handleRoundEnded(ball) {
    if (ball.radius > ballProblemSolvedRadius) {
        ball.radius -= killingSpeed;
    } else {
        // new round
        roundCount++;
        ball.lifesCount--;

        addHearts(rewardsSize.hearts, ball.x, ball.y);

        if (ball.lifesCount > 0) {
            // reborn
            ball.radius = ballInitialSize + roundCount>50?50:roundCount;
            
            ball.x = getRandom(100, canvas.width);
            ball.y = getRandom(100, canvas.height);
        } else {
            let idx = balls.indexOf(ball);
            balls.splice(idx, 1)
        }
    }
}
