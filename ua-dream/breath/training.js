let stageEl = document.querySelector('.trainingStage');
let resultsEl = document.querySelector('.results');

const model = {
    stage: 'training',
    current: [],
    history: []
}

function trainClick(e) {
    shiftStage("training");
}


function restClick(e) {
    shiftStage("resting");
}

function measureClick(e) {
    shiftStage("measuring");
}

function shiftStage(stage) {
    if (model.current.length == 0) {
        model.current.unshift({ stage: model.stage })
    }

    if (model.stage !== stage) {
        resetTimer();
        interval = setInterval(displayTimer, 100);

        model.current.unshift({ stage: model.stage })
    }
    model.stage = stage;
    model.current[0].stage = stage;
    model.current[0].time = formatTimeString(watch);

    stageEl.innerHTML = model.stage;

    resultsEl.innerHTML = "";
    for (const item of model.current) {
        redrawResults(item);
    }
}

function refreshStage() {
}


function redrawResults(item) {

    const node = document.createElement("li");
    const textnode = document.createTextNode(`${item.stage} ${item.time}`);
    node.appendChild(textnode);

    resultsEl.appendChild(node);
}


['click', 'ontouchstart'].forEach(function (evt) {
    document.getElementById('train').addEventListener(evt, (e) => trainClick(e), false);
    document.getElementById('rest').addEventListener(evt, (e) => restClick(e), false);
    document.getElementById('measure').addEventListener(evt, (e) => measureClick(e), false);
});
