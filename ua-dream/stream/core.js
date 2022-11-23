const canvas = document.getElementById("cw");
const ctx = canvas.getContext("2d");
ctx.globalAlpha = 0.5;

const cursor = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
        cursor.x = e.touches[0].clientX;
        cursor.y = e.touches[0].clientY;
    },
    { passive: false }
);

addEventListener('mousedown', function (e) {
    direction = 1;
});

addEventListener('mouseup', function (e) {
    direction = -1;
});

addEventListener("resize", () => setSize());

function setSize() {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
}

function clear() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

addEventListener("keydown", handleKeyDown);

let userActionsState = [];

function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed} ${event.code}`)

    // KeyS (83) => shield =>
    // KeyT (84) => targets => (Add, Subtract)
    // KeyR (82) => rewards => (Add, Subtract)
    // KeyC (67) => cleanup (limits) => 
    // `        { KeyF (70) => flags => (Add, Subtract) }
    //          { KeyA (65) => aff => (Add, Subtract) }
    //          { KeyH (72) => hearts => (Add, Subtract) }
    // NumpadMultiply (106) { KeyH => hearts => (Add, Subtract) }

    // 107 NumpadAdd
    // 109 NumpadSubtract
    // 84 KeyT
    // 82 KeyR
    // 67 KeyC
    // 106 NumpadMultiply
    // 65 KeyA
    // 70 KeyF
    // 72 KeyH
    // 32 Space apply?
    if (keyPressed == 32) {

    }

    // LVL 1
    if (keyPressed == 83) {//S
        userActionsState[0] = "shield";
    }

    if (keyPressed == 84) {//T
        userActionsState[0] = "targets";
    }

    if (keyPressed == 82) {//R
        userActionsState[0] = "rewards";
    }

    if (keyPressed == 67) {//C
        userActionsState[0] = "cleanup";
    }

    // LVL 2
    if (keyPressed == 65) {//A
        userActionsState[1] = "affirmations";
    }

    if (keyPressed == 73) {//I
        userActionsState[1] = "internal";
    }

    if (keyPressed == 69) {//E
        userActionsState[1] = "external";
    }

    if (keyPressed == 70) {//F
        userActionsState[1] = "flags";
    }

    if (keyPressed == 75) { //K
        userActionsState[1] = "flowers";
    }

    if (keyPressed == 72) { //H
        userActionsState[1] = "hearts";
    }

    let action1,action2;
    if (keyPressed == 107) {// NumpadAdd

        action1 = userActionsState[0];

        switch (action1) {
            case "shield":
                action2 = userActionsState[1];

                switch (action2) {
                    case "internal":
                        minCount++;
                        break;

                    case "external":
                        maxCount++;
                        break;
                }

                break;

            case "targets":
                balls.unshift(new Ball());
                break;


            case "rewards":
                action2 = userActionsState[1];

                switch (action2) {
                    case "flags":
                        rewardsLimit.flags++;
                        break;

                    case "flowers":
                        rewardsLimit.flowers++;
                        break;

                    case "affirmations":
                        rewardsLimit.affirmations++;
                        break;

                    case "hearts":
                        rewardsLimit.hearts++;
                        break;
                }
                break;

            case "cleanup":

                action2 = userActionsState[1];

                switch (action2) {
                    case "flags":
                        addFlag(cursor.x, cursor.y);
                        break;

                    case "flowers":
                        addFlowers(1, cursor.x, cursor.y, 5);
                        break;

                    case "affirmations":
                        showNextAffirmation(cursor.x, cursor.y);
                        break;

                    case "hearts":
                        addFlag(cursor.x, cursor.y);
                        break;
                }

                break;
        }
    }


    if (keyPressed == 109) { // NumpadSubtract
        action1 = userActionsState[0];

        switch (action1) {
            case "shield":
                action2 = userActionsState[1];

                switch (action2) {
                    case "internal":
                        minCount--;
                        break;

                    case "external":
                        maxCount--;
                        break;
                }

                break;

            case "targets":
                balls.pop();
                break;

            case "rewards":
                action2 = userActionsState[1];

                switch (action2) {
                    case "flags":
                        rewardsLimit.flags--;
                        break;

                    case "flowers":
                        rewardsLimit.flowers--;
                        break;

                    case "affirmations":
                        rewardsLimit.affirmations--;
                        break;

                    case "hearts":
                        rewardsLimit.hearts--;
                        break;
                }
                break;

            case "cleanup":

                action2 = userActionsState[1];

                switch (action2) {
                    case "flags":
                        flags.pop();
                        break;

                    case "flowers":
                        flowers.pop();
                        break;

                    case "affirmations":
                        affirmations.pop();
                        break;

                    case "hearts":
                        hearts.pop();
                        break;
                }

                break;
        }
    }

}