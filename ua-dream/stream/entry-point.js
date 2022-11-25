// Entry point
// pre-configuration

function setNewGame(){
    setSize();
    generateParticles(2);
    addHearts(1, getRandom(0, canvas.width), getRandom(0, canvas.height), 1);
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





