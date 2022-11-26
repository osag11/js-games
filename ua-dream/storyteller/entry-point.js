// Entry point
// pre-configuration

function setNewGame(){
    setSize();
    generateParticles(2);
    addHearts(1, getRandom(canvas.width * 0.2, canvas.width * 0.8), getRandom(canvas.height *0.2, canvas.height *0.8), 1);
    initBalls(3);
    affirmations = shuffle(affirmations);
}

function reset()
{
    clearArray(particlesArray);    
    clearArray(hearts);
    clearArray(flags);
    clearArray(activeAffirmations);
    clearArray(flowers);  
}

setNewGame();

// starting main loop
main();