const canvas = document.getElementById("cw");
const ctx = canvas.getContext("2d");
ctx.globalAlpha = 0.5;

addEventListener("resize", () => setSize());

function setSize() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
}

function clear() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// main loop
function main() {
    window.requestAnimationFrame(main);
    clear();

    drawDreams();
    drawTargets();
    drawParticles();
    disposeParticles();
    disposeRewards();

    output.draw();
}