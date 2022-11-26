const userInputState = ["", ""];

addEventListener("keydown", handleKeyDown);
// 107 NumpadAdd
// 109 NumpadSubtract
// 106 NumpadMultiply
// 84 KeyT
// 82 KeyR
// 67 KeyC
// 65 KeyA
// 70 KeyF
// 72 KeyH
// 75 KeyK
// 68 KeyD
// 79 KeyO
// 32 Space


function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed} ${event.code}`)


    if (keyPressed == 32) {
        // Show menu popup window
    }

    // LVL 2
    handleLvl2MenuCommands(keyPressed);

    // LVL 1
    handleTopMenuCommands(keyPressed);

    let menuMessage;
    if (userInputState[0].length > 0) {
        menuMessage = `${userInputState[0]}`;

        if (userInputState[1].length > 0) {
            menuMessage += `=>${userInputState[1]}`;
        }
    }

    if (menuMessage) {
        output.log(menuMessage);
    }

    handleCreationActionCommands(keyPressed);

    handleRemovalActionCommands(keyPressed);

    handleMenuHelpCommands(keyPressed);
}


function handleTopMenuCommands(keyPressed) {
    if (keyPressed == 80) { //P
        userInputState[0] = "particles";
        userInputState[1] = "";
    }

    if (keyPressed == 84) { //T
        userInputState[0] = "targets";
        userInputState[1] = "";
    }

    if (keyPressed == 82) { //R
        userInputState[0] = "rewards";
        userInputState[1] = "";
    }

    if (keyPressed == 67) { //C
        userInputState[0] = "cleanup/create";
        userInputState[1] = "";
    }

    if (keyPressed == 77) { //M
        userInputState[0] = "menu";
        userInputState[1] = "";
    }

    if (keyPressed == 8) {  // Backspace
        reset();
        setNewGame();
    }

    if (keyPressed == 192) {  // Backquote
        output.show = !output.show;
    }

    //output.log(userInputState[0]);
}


function handleLvl2MenuCommands(keyPressed) {

    // PARTICLES SHIELD

    if (keyPressed == 73) { //I
        if (userInputState[0] === "particles") {
            userInputState[1] = "internal-count";
        }
    }

    if (keyPressed == 69) { //E
        if (userInputState[0] === "particles") {
            userInputState[1] = "external-count";
        }
    }

    if (keyPressed == 79) { //O
        if (userInputState[0] === "particles") {
            userInputState[1] = "internal-radius";
        }
    }

    if (keyPressed == 81) { // Q
        if (userInputState[0] === "particles") {
            userInputState[1] = "external-radius";
        }
    }


    if (keyPressed == 83) { //S (slow)
        if (userInputState[0] === "particles") {
            userInputState[1] = "speed-min";
        }
    }

    if (keyPressed == 70) { //F (Fast)
        if (userInputState[0] === "particles") {
            userInputState[1] = "speed-max";
        }
    }

    // REWARDS
    if (keyPressed == 65) { //A
        if (userInputState[0] === "rewards" || userInputState[0] === "cleanup/create") {
            userInputState[1] = "affirmations";
        }
    }

    if (keyPressed == 70) { //F
        if (userInputState[0] === "rewards" || userInputState[0] === "cleanup/create") {
            userInputState[1] = "flags";
        }
    }

    if (keyPressed == 75) { //K (Kvitka)
        if (userInputState[0] === "rewards" || userInputState[0] === "cleanup/create") {
            userInputState[1] = "flowers";
        }
    }

    if (keyPressed == 72) { //H
        if (userInputState[0] === "rewards" || userInputState[0] === "cleanup/create") {
            userInputState[1] = "hearts";
        }
    }

    //output.log(userInputState[1]);
}


function handleCreationActionCommands(keyPressed) {
    let action1 = userInputState[0], action2 = userInputState[1];

    if (keyPressed == 107) { // NumpadAdd
        output.a_log(`=>[+]`);

        switch (action1) {
            case "particles":

                switch (action2) {
                    case "internal-count":
                        minCount++;
                        output.a_log(`: ${minCount}`);
                        break;

                    case "external-count":
                        maxCount++;
                        output.a_log(`: ${maxCount}`);
                        break;

                    case "internal-radius":
                        minRadius++;
                        output.a_log(`: ${minRadius}`);
                        break;

                    case "external-radius":
                        maxRadius++;
                        output.a_log(`: ${maxRadius}`);
                        break;

                    case "speed-min":
                        rotationSpeedMin += 0.005;
                        output.a_log(`: ${rotationSpeedMin}`);
                        break;

                    case "speed-max":
                        rotationSpeedMax += 0.005;
                        output.a_log(`: ${rotationSpeedMax}`);
                        break;
                }

                break;

            case "targets":
                balls.unshift(new Ball());
                output.a_log(`: ${balls.length}`);
                break;


            case "rewards":

                switch (action2) {
                    case "flags":
                        rewardsLimit.flags++;
                        output.a_log(`: ${rewardsLimit.flags}`);
                        break;

                    case "flowers":
                        rewardsLimit.flowers++;
                        output.a_log(`: ${rewardsLimit.flowers}`);
                        break;

                    case "affirmations":
                        rewardsLimit.affirmations++;
                        output.a_log(`: ${rewardsLimit.affirmations}`);
                        break;

                    case "hearts":
                        rewardsLimit.hearts++;
                        output.a_log(`: ${rewardsLimit.hearts}`);
                        break;
                }
                break;

            case "cleanup/create":

                switch (action2) {
                    case "flags":
                        addFlag(cursor.x, cursor.y);
                        output.a_log(`: ${flags.length}`);
                        break;

                    case "flowers":
                        addFlowers(1, cursor.x, cursor.y, 25);
                        output.a_log(`: ${flowers.length}`);
                        break;

                    case "affirmations":
                        showNextAffirmation(cursor.x, cursor.y);
                        output.a_log(`: ${activeAffirmations.length}`);
                        break;

                    case "hearts":
                        addHearts(1, cursor.x, cursor.y, 25)
                        output.a_log(`: ${hearts.length}`);
                        break;
                }

                break;
        }
    }
}


function handleRemovalActionCommands(keyPressed) {
    let action1 = userInputState[0], action2 = userInputState[1];

    if (keyPressed == 109) { // NumpadSubtract
        output.a_log(`=>[-]`);

        switch (action1) {
            case "particles":

                switch (action2) {
                    case "internal-count":
                        minCount--;
                        output.a_log(`: ${minCount}`);
                        break;

                    case "external-count":
                        maxCount--;
                        output.a_log(`: ${maxCount}`);
                        break;

                    case "internal-radius":
                        minRadius--;
                        output.a_log(`: ${minRadius}`);
                        break;

                    case "external-radius":
                        maxRadius--;
                        output.a_log(`: ${maxRadius}`);
                        break;

                    case "speed-min":
                        rotationSpeedMin -= 0.005;
                        output.a_log(`: ${rotationSpeedMin}`);
                        break;

                    case "speed-max":
                        rotationSpeedMax -= 0.005;
                        output.a_log(`: ${rotationSpeedMax}`);
                        break;
                }
                break;

            case "targets":
                balls.pop();
                output.a_log(`: ${balls.length}`);
                break;

            case "rewards":

                switch (action2) {
                    case "flags":
                        rewardsLimit.flags--;
                        output.a_log(`: ${rewardsLimit.flags}`);
                        break;

                    case "flowers":
                        rewardsLimit.flowers--;
                        output.a_log(`: ${rewardsLimit.flowers}`);
                        break;

                    case "affirmations":
                        rewardsLimit.affirmations--;
                        output.a_log(`: ${rewardsLimit.affirmations}`);
                        break;

                    case "hearts":
                        rewardsLimit.hearts--;
                        output.a_log(`: ${rewardsLimit.hearts}`);
                        break;
                }
                break;

            case "cleanup/create":

                switch (action2) {
                    case "flags":
                        flags.pop();
                        output.a_log(`: ${flags.length}`);
                        break;

                    case "flowers":
                        flowers.pop();
                        output.a_log(`: ${flowers.length}`);
                        break;

                    case "affirmations":
                        activeAffirmations.pop();
                        output.a_log(`: ${activeAffirmations.length}`);
                        break;

                    case "hearts":
                        hearts.pop();
                        output.a_log(`: ${hearts.length}`);
                        break;

                }

                break;
        }
    }

    if (keyPressed == 106) { // NumpadMultiply
        output.a_log(`=>[*]`);

        switch (action1) {
            case "targets":
                clearArray(balls);
                output.a_log(`: deleted all`);
                break;

            case "cleanup/create":

                clearArray(hearts);
                clearArray(flags);
                clearArray(activeAffirmations);
                clearArray(flowers);
                output.a_log(`: deleted all`);

                break;

        }
    }
}

function handleMenuHelpCommands(keyPressed) {

    if (userInputState[0] === "menu") {

        if (keyPressed == 49) { //Num1
            showDoc(0);
        }

        if (keyPressed == 50) { //Num2
            showDoc(1);
        }

        if (keyPressed == 51) { //Num3
            showDoc(2);
        }
    }
}

function showDoc(page) {
    output.m_log(docs[page]);
}

const docs = [
    `TOP MENU
T - targets (balls and other "problems")
R - rewards (hearts, flags, flowers etc)
P - particles (shield)
C - clear/create
M - menu help
\` - user menu console
<- - restart game (with existing rewards limits)
`
    ,

    `ACTIONS
rewards => flags, flowers, hearts, affirmations =>
[+] - increase limit of rewards
[-] - reduce limit of rewards

clean/create => flags, flowers, hearts, affirmations =>
[+] - create one selected reward, put to mouse cursor position
[-] - removes one selected rewards
[*] - removes all rewards

target
[+] - add one target
[-] - remove one target
[*] - removes all targets
`,

    `OPTIONS
particles =>
I - internal-count
E - external-count

O - internal-radius
Q - external-radius

S - speed-min
F - speed-max

rewards =>
F - flags
K - flowers
H - hearts
A - affirmations

clean/create =>
F - flags
K - flowers
H - hearts
A - affirmations

menu help
[1] - shows lvl 1 options
[2] - shows lvl 2 options
[3] - shows actions
`
];