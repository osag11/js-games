const canvas = document.getElementById("cw");
const ctx = canvas.getContext("2d");
ctx.globalAlpha = 0.5;

const cursor = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

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

function setSize() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
}

function clear() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function main() {
    window.requestAnimationFrame(main);
    clear();

    drawDream();
    drawTargets();
    drawParticles();
    disposeParticles();
}

//------- Entry point -----------

setSize();
generateParticles(2);
addHearts(5, getRandom(0, canvas.width), getRandom(0, canvas.height), 500);
initBalls(20);

main();
