let planeModel = {
    x: 0,
    y: scene.height - 6,
    color: "Grey",
    lifes: 3,
    direction: -1
}

function drawPlane() {

    planeModel.x += 2;
    planeModel.y += planeModel.direction * 5;

    if (planeModel.direction < 0) {
        if (planeModel.y <= 50) {
            startNewMission();
        }
    }

    if (planeModel.x > scene.width) {
        planeModel.x = 0;
        planeModel.y += 50;
    }

    if (isPlaneLanded()) {
        if (planeModel.x > scene.width / 3) {
            planeModel.x -= 4;
        }
        planeModel.color = "Grey"
        planeModel.y = scene.height - 6;
        if (cityModel.misionComplete == 0) {
            message("Congratulations! Level passed.", 1, "green");
            message("press arrow up to start next level", 1, "cadetblue", 100);
        }
        cityModel.misionComplete = 1;
        weaponModel.bomb.state = 2;
    }

    ctx2d.fillStyle = planeModel.color;

    let x = planeModel.x;
    let y = planeModel.y;

    ctx2d.beginPath();
    ctx2d.moveTo(x + 50, y);
    ctx2d.lineTo(x, y);
    ctx2d.lineTo(x, y - 20);
    ctx2d.lineTo(x + 10, y - 20);
    ctx2d.lineTo(x + 15, y - 10);
    ctx2d.lineTo(x + 10, y - 10);
    ctx2d.lineTo(x + 40, y - 12);
    ctx2d.moveTo(x + 50, y);
    ctx2d.fill();

    if (isPlaneCrashed()) {
        drawCrash();

        planeModel.lifes--;
        message(`plane crashed! ${planeModel.lifes} lifes left...`, planeModel.lifes + 10, "orange", 20);

        planeModel.x = 0;
        planeModel.y = 50;
        weaponModel.bomb.state = 0;
    }
}

function drawCrash() {
    let x = planeModel.x;
    let y = planeModel.y;

    ctx2d.fillStyle = "red";
    ctx2d.beginPath();
    ctx2d.moveTo(x + 50, y);
    for (let i = 0; i < 10; i++) {
        ctx2d.lineTo(x + getRandom(0, 30), y + getRandom(0, 30));
        ctx2d.lineTo(x - getRandom(0, 30), y + getRandom(0, 30));
        ctx2d.lineTo(x + getRandom(0, 30), y - getRandom(0, 30));
        ctx2d.lineTo(x - getRandom(0, 30), y - getRandom(0, 30));
    }
    ctx2d.moveTo(x + 50, y);
    ctx2d.fill();
}

function isPlaneCrashed() {
    const result = cityModel.houses.find(({ x, top }) => x === planeModel.x && top <= planeModel.y);
    if (result) {
        console.log(result);
        console.log("plane crashed!");
        return true;
    }
    return false;
}

function isPlaneLanded() {
    let survivedHouses = cityModel.houses.find(({ size }) => size > 0);

    if (!survivedHouses && planeModel.y >= scene.height - 10) {
        return true;
    }
    return false;
}
