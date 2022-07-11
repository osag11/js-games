let planeModel = {
    x: 0,
    y: 50,
    color: "black",
    lifes: 3
}

function drawPlane() {

    planeModel.x += 50;
    if (planeModel.x > scene.width) {
        planeModel.x = 0;
        planeModel.y += 50;
    }

    if (isPlaneLanded()) {
        planeModel.x-=40;
        planeModel.color = "green"
        planeModel.y = scene.height - 50;
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
        message(`plane crashed! ${planeModel.lifes} lifes left...`, "orange", 20);

        planeModel.x= 0;
        planeModel.y= 50;
        weaponModel.bomb.state = 0;
    }
}

function drawCrash()
{
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
    let survivedHouses = cityModel.houses.find(({size}) => size > 0);

    if(!survivedHouses && planeModel.y >= scene.height){
        return true;
    }
    return false;
}
