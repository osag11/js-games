
//--------------- variables ------------
const scene = document.getElementById("scene");
const ctx2d = scene.getContext("2d");
let frameNumber = 0;
const borderColor = 'green';
const borderSize = 5;
const frameRate = 200;

// ------------functions-------------------

document.addEventListener("keydown", handleKeyDown);
clean();
main_loop();

function handleKeyDown(event) {
  const keyPressed = event.keyCode;
  console.log(`keyPressed: ${keyPressed}`)
  if(keyPressed == 32){

  }
}

function main_loop() {
  console.log(frameNumber++);

  clean();

  draw();

  setTimeout(function onTick() {
    main_loop();
  }, frameRate)
}

function clean() {
    ctx2d.clearRect(0, 0, scene.width, scene.height);  
    ctx2d.lineWidth = borderSize;
    ctx2d.strokeStyle = borderColor;
    ctx2d.strokeRect(0, 0, scene.width, scene.height);
}

function draw() {
  drawCity();
  drawPlane();
}