
let messageQueueModel = [
  {
    text: "The Bomber game",
    color: "black",
    time: 150
  }
]

let msgCtx = 0;
let msgText = undefined;

function message(text, ctx = 0, color = "black", time = 10,) {
  if (msgCtx === ctx && msgText === text) {
    return;
  }

  if (msgCtx && msgCtx !== ctx) {
    messageQueueModel = [];
    console.log('message queue clear');
  }

  msgCtx = ctx;

  let newMessage = { text: text, color: color, time: time };
  messageQueueModel.push(newMessage);
}


function drawMessage() {
  let currentMessage = messageQueueModel[0];

  if (currentMessage.time <= 0) {
    currentMessage.text = ""
    if (messageQueueModel.length > 1) {
      messageQueueModel.shift();
    }
  }

  currentMessage.time--;

  ctx2d.strokeStyle = currentMessage.color
  ctx2d.font = '64px serif';
  ctx2d.textAlign = 'center';
  ctx2d.strokeText(currentMessage.text, scene.width / 2, scene.height / 2);
}

function showInstructions(msgCtx = 0) {
  message("Let's go!", msgCtx, "cadetBlue", 50);
  message("Press 'space' to drop the bomb!", msgCtx, "cadetBlue", 50);
  message("Press 'down' to move lower to the land!", msgCtx, "cadetBlue", 50);
}
