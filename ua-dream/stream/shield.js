
const particlesArray = [];

// settings, adjustable in runtime
let minCount = 51;
let maxCount = 300;

let minRadius = 30;
let maxRadius = 80;

const radiusStep = 1.5;
const particleSize = 3;

const rotationSpeedMin = 0.02;
const rotationSpeedMax = 0.05;

let direction = -1;
let roundCount = 1;

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
    let limit = minCount;

    if (cursor.x >= canvas.width - 5 || cursor.x < 5) {
        // cool down
        limit = 2;
    }

    if (particlesArray.length > limit) {
        let deleted = particlesArray.pop();
        particlesIndex.push(deleted.instance);
        //console.log(`disposing: #${deleted.instance} / ${particlesArray.length} (${particlesIndex.length})`);
    }
}

function handleParticlesCollision(particle) {

    for (let ball of balls) {
        if (rectIntersect(particle.x, particle.y, particleSize, particleSize, ball.x, ball.y, getMinRadius(ball.radius), getMinRadius(ball.radius))) {

            particle.colliting = true;

            ball.setColor(particle.strokeColor);
            ball.handleCollision(particle.theta);

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

        if (ball.lifesCount > 0) {

            // respawn
            ball.radius = ballInitialSize + (roundCount > ballMaxSize ? ballMaxSize : roundCount); // bigger than previous
            console.log(`round: ${roundCount}, target: #${ball.id} / ${balls.length}, lifes: ${ball.lifesCount}`)

            ball.x = getRandom(100, canvas.width);
            ball.y = getRandom(100, canvas.height);
            ball.recoverColor(50);
            addHearts(1, ball.x, ball.y);

        } else {

            // remove
            let idx = balls.indexOf(ball);
            balls.splice(idx, 1)

            console.log(`round: ${roundCount}, finished target: #${ball.id} / ${balls.length}`)
        }

        showRewards(ball, roundCount);
    }
}

function showRewards(ball, roundCount) {
    if (roundCount % 2 == 0) {
        addFlag(ball.x, ball.y);
    }

    if (roundCount % 2 == 1) {
        addHearts(rewardsSize.hearts, ball.x, ball.y);
    }

    if (roundCount % 3 == 0) {
        showNextAffirmation();
    }
}

