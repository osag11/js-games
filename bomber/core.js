
//--------------- variables ------------
const scene = document.getElementById("scene");
const ctx2d = scene.getContext("2d");
let frameNumber = 0;
const borderColor = 'green';
const borderSize = 5;
const frameRate = 200;

let messageModel = {
  text: "",
  color: "black",
  time: 10
}

// ------------functions-------------------

document.addEventListener("keydown", handleKeyDown);
clean();
main_loop();

function handleKeyDown(event) {
  const keyPressed = event.keyCode;
  console.log(`keyPressed: ${keyPressed}`)
  if (keyPressed == 32) {
    if (weaponModel.bomb.state == 0) {
      weaponModel.bomb.state = 1;
    }
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

function message(text,color="black",time=10)
{
  messageModel.text = text;
  messageModel.color = color;
  messageModel.time = time;  
}

function draw() {
  drawCity();
  if( planeModel.lifes<=0){
    message("game over!", "red");
    drawMessage();
    return;
  }

  drawPlane();
  drawBomb();
  drawMessage();
}

function drawMessage()
{  
  if(messageModel.time <=0){
    messageModel.text = ""
  }

  messageModel.time--;

  ctx2d.strokeStyle = messageModel.color
  ctx2d.font = '64px serif';
  ctx2d.textAlign = 'center';
  ctx2d.strokeText(messageModel.text, scene.width/2, scene.height/2);
}