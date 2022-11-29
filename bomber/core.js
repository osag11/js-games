
//--------------- variables ------------
const scene = document.getElementById("scene");
const ctx2d = scene.getContext("2d");
let frameNumber = 0;
const borderColor = 'green';
const borderSize = 5;
const frameRate = 200;
let isGameOver = 0;

// ------------functions-------------------

document.addEventListener("DOMContentLoaded", () => {
  scene.width = document.body.offsetWidth; 
});

document.addEventListener("keydown", handleKeyDown);

main_loop();

function handleKeyDown(event) {
  const keyPressed = event.keyCode;
  console.log(`keyPressed: ${keyPressed}`)
  if (keyPressed == 32) {
    if (weaponModel.bomb.state == 0) {
      weaponModel.bomb.state = 1;
    }
  }

  if (keyPressed == 40) {
    planeModel.y+=50;
  }

  if (keyPressed == 38) {
    if(isPlaneLanded()){
      planeModel.direction = -1;
    }
  }

  if (keyPressed == 67) {
       cityModel.houses.forEach(h=>{ h.size = 0, h.top = scene.height - h.size * cityModel.houseStageHeight });
  }
}

function main_loop() {
  window.requestAnimationFrame(main_loop);
  console.log(frameNumber++);

  clean();

  draw();

  // wait(200) 

  // setTimeout(function onTick() {
  //   main_loop();
  // }, frameRate)
}

function clean() {
  ctx2d.clearRect(0, 0, scene.width, scene.height);
  ctx2d.lineWidth = borderSize;
  ctx2d.strokeStyle = borderColor;
  ctx2d.strokeRect(0, 0, scene.width, scene.height);
}


function draw() {
  drawCity();

  if(planeModel.lifes<=0){
    if(isGameOver == 0){
     message("game over!", 3, "red", 300);
     isGameOver = 1;
    }
    drawMessage();
    return;
  }

  drawPlane();
  drawBomb();
  drawMessage();
}


function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}