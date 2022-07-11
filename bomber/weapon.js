let weaponModel = {
    bomb: {
        amount: 50,
        states: ["ready", "fly"],
        state: 0,
        x: 0,
        y: 0,
        size: 8
    },

    rocket: {
        amount: 2
    }
}

function drawBomb() {
    if (weaponModel.bomb.state == 0) {
        weaponModel.bomb.x = planeModel.x;
        weaponModel.bomb.y = planeModel.y;

        let x = weaponModel.bomb.x;
        let y = weaponModel.bomb.y;

        ctx2d.fillStyle = "black"
        ctx2d.beginPath();
        ctx2d.arc(x + 20, y, weaponModel.bomb.size, 0, 2 * Math.PI, 0);
        ctx2d.fill()
    }

    if (weaponModel.bomb.state == 1) {
        weaponModel.bomb.y += 50;
        let x = weaponModel.bomb.x;
        let y = weaponModel.bomb.y;

        if (isBombHitTarget()) {
            weaponModel.bomb.y = planeModel.y;
            weaponModel.bomb.state = 0;
            let house = cityModel.houses.find(({ x }) => x === weaponModel.bomb.x)
            if(house) {
                house.size -= 2;
                house.top = scene.height - house.size * cityModel.houseStageHeight
            }

            ctx2d.fillStyle = "red"
            ctx2d.beginPath();
            ctx2d.arc(x + 20, y, weaponModel.bomb.size * 3, 0, 2 * Math.PI, 0);
            ctx2d.fill();
        }

        ctx2d.fillStyle = "black"
        ctx2d.beginPath();
        ctx2d.arc(x + 20, y, weaponModel.bomb.size, 0, 2 * Math.PI, 0);
        ctx2d.moveTo(x +20, y); 
        ctx2d.lineTo(x +12, y-12);        
        ctx2d.lineTo(x +28, y-12);        
        ctx2d.lineTo(x +20, y); 

        ctx2d.fill()
    }
}

function isBombHitTarget() {
    let result = cityModel.houses.find(({ x, top }) => x === weaponModel.bomb.x && top <= weaponModel.bomb.y);
    if (result) {
        console.log(result);
        console.log("bomb hit house!");
        return true;
    } else {
        result = weaponModel.bomb.y >= scene.height;
        console.log("bomb hit ground!");
        return false;
    }
}

function drawRocket() {

}