// main loop
function main() {
    window.requestAnimationFrame(main);
    clear();

    drawDreams();
    drawTargets();
    drawParticles();
    disposeParticles();
}

// Entry point
// pre-configuration
setSize();
generateParticles(2);
addHearts(5, getRandom(0, canvas.width), getRandom(0, canvas.height), 500);
initBalls(3);
affirmations = shuffle(affirmations);
// starting main loop
main();


