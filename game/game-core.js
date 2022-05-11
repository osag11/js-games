
//--------------- variables ------------
const scene = document.getElementById("scene");
const scene_ctx = scene.getContext("2d");

let delta = 0;

// ------------functions-------------------

document.addEventListener("keydown", handle_key_down);

clean_scene(scene);

main_loop();

// Step #1.2
function handle_key_down(event) {
  const keyPressed = event.keyCode;
  console.log(`keyPressed: ${keyPressed}`)
}
// Step #1.1
function main_loop() {

  console.log(delta++);

  clean_scene(scene);

  draw(delta*2, delta*2);

// payload functions
// ...
  setTimeout(function onTick() {
    main_loop();
  }, 100)
}

// Step #2.1
function draw(x,y) {

  scene_ctx.fillStyle = 'blue';
  scene_ctx.fillRect(100+x, 100+y, 120, 120);

  scene_ctx.fillStyle = 'red';
  scene_ctx.fillRect(50+x*2, 50+y*2, 80, 80);
}

// Step #2.2
function clean_scene(canvas) {
  const ctx2d = canvas.getContext("2d");
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);

  const board_border = 'green';
  ctx2d.lineWidth = 5;
  ctx2d.strokeStyle = board_border;
  ctx2d.strokeRect(0, 0, canvas.width, canvas.height);
}
