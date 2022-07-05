let planeModel = {
    x:0,
    y:50,
    color: "black"
}

function drawPlane()
{
    planeModel.x+=50;
    if(planeModel.x>scene.width)
    {
        planeModel.x = 0;
        planeModel.y += 50;
    }

    ctx2d.fillStyle = planeModel.color;

    let x=planeModel.x;
    let y=planeModel.y;

    ctx2d.beginPath();
    ctx2d.moveTo(x+50, y);
    ctx2d.lineTo(x, y);
    ctx2d.lineTo(x, y-20);
    ctx2d.lineTo(x+10, y-20);
    ctx2d.lineTo(x+15, y-12);
    ctx2d.lineTo(x+10, y-12);
    ctx2d.lineTo(x+40, y-12);
    ctx2d.moveTo(x+50, y);

    ctx2d.fill();

    if(isPlaneCrashed())
    {
        ctx2d.fillStyle = "red";
        ctx2d.beginPath();
        ctx2d.moveTo(x+50, y);
        for(let i=0;i<10;i++)
        {
            ctx2d.lineTo(x+getRandom(0,30), y+getRandom(0,30));
            ctx2d.lineTo(x-getRandom(0,30), y+getRandom(0,30));
            ctx2d.lineTo(x+getRandom(0,30), y-getRandom(0,30));
            ctx2d.lineTo(x-getRandom(0,30), y-getRandom(0,30));
        }

        ctx2d.moveTo(x+50, y);
        ctx2d.fill();
    }
}

function isPlaneCrashed()
{
    const result = cityModel.houses.find( ({ x, top }) => x === planeModel.x && top <= planeModel.y );
    if(result){
        console.log(result);
        console.log("game over!");
    }
    return result;
}
