const canvas = document.getElementById('scene');
const ctx = scene.getContext('2d');
const imageFinishedHorse = new Image();
imageFinishedHorse.src = "horse.png";

const imageRunningHorse = new Image();
imageRunningHorse.src = "horse-run.png";

document.addEventListener("keydown", handleKeyDown);

let model = {
    winners: [],
    round: 1,
    horse1: {
        name: "Veronika",
        x: 100, y: 100,
        speed: 30,
        stats: { won: 0, steps: [] }
    },
    horse2: {
        name: "Kristina",
        x: 100, y: 300,
        speed: 30,
        stats: { won: 0, steps: [] }

    },
    horse3: {
        name: "Maria",
        x: 100, y: 500,
        speed: 30,
        stats: { won: 0, steps: [] }

    },
    horse4: {
        name: "Polina",
        x: 100, y: 700,
        speed: 30,
        stats: { won: 0, steps: [] }
    },
}

function drawFinishLine(color) {
    ctx.fillStyle = color;
    ctx.fillRect(scene.width - 100, 0, 50, scene.height);
}

function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed}`)
    if (keyPressed == 32) {

        if (model.winners.length == 4) {

            model.winners.forEach(h => {
                h.x = 100;
                h.finished = 0;
            });

            model.round++;
            model.winners = [];
        }
    }
}

let colors = ["Cyan", "Green"]
function clean() {
    ctx.clearRect(0, 0, scene.width, scene.height);
}


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function main_loop() {
    window.requestAnimationFrame(main_loop);
    clean();
    drawFinishLine(colors[0]);

    drawHorse(model.horse1)
    drawHorse(model.horse2)
    drawHorse(model.horse3)
    drawHorse(model.horse4)
}


function drawHorse(horse) {
    if (!horse.finished) {
        if (horse.x > scene.width - 100) {
            horse.finished = true;

            if (model.winners.length == 0) {
                horse.stats.won++;
            }
            model.winners.push(horse);

            return;
        }

        let distance = getRandom(1, horse.speed);
        horse.x += distance / 2;

        // steps stats
        if (horse.stats.steps[model.round - 1]) {
            horse.stats.steps[model.round - 1].d += distance;
            horse.stats.steps[model.round - 1].s++;

        } else {
            horse.stats.steps.push({ d: distance, s: 1, r: model.round });
        }
        console.log(`${horse.name} ran ${distance} distance`)
    }
    
    let img = horse.finished ? imageFinishedHorse : imageRunningHorse;
    ctx.drawImage(img, horse.x, horse.y, 100, 100);
    ctx.textAlign = 'left';
    ctx.font = 'bold 12pt Arial Black';
    ctx.fillStyle = colors[1];

    ctx.fillText(horse.name, 0, horse.y);

    let pos = model.winners.indexOf(horse);

    if (pos >= 0) {
        let latestRun = horse.stats.steps[horse.stats.steps.length - 1];
        ctx.fillText(`${pos + 1} (won: ${horse.stats.won}) (steps: ${latestRun.s} distance: ${latestRun.d} in round: #${latestRun.r})`, 100, horse.y);
    }
}

main_loop();