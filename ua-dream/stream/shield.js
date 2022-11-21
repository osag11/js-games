
let particlesArray = [];

let maxCount = 300;
let minCount = 50;
let killingSpeed = 0.01;
let roundCount = 1;


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





function drawParticles() {

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




