// https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isColliding = false;
    }
}


// class Ball extends GameObject
// {
//     constructor (context, x, y, vx, vy, mass){
//         super(context, x, y, vx, vy, mass);

//         this.radius = 25;
//     }

//     draw() {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
//         ctx.closePath();
//         ctx.fillStyle = this.color;
//         ctx.fill();
//     }

    
//     handleCollision(theta){
//         this.vx = -direction * Math.cos(theta) * vF * getDeviation(0.9);
//         this.vy = -direction * Math.sin(theta) * vF * getDeviation(0.9);
//     }
// }