let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
let timerEl = document.querySelector('.timerDisplay');

let interval = null;
let watch = {
    h: "0",
    m: "0",
    s: "0",
    ms: "0",
    paused: true
}
function startPauseTimer(e) {
    watch.paused = !watch.paused;

    if (interval !== null) {
        clearInterval(interval);
    }

    if (watch.paused) {
        e.currentTarget.innerHTML = "Start";
        e.currentTarget.style.backgroundColor = "#20b380";
    } else {
        interval = setInterval(displayTimer, 100);
        e.currentTarget.innerHTML = "Pause";
        e.currentTarget.style.backgroundColor = "#205e94"
    }
}

function resetTimer(e) {
    clearInterval(interval);
    [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
    timerEl.innerHTML = '00 : 00 : 0';
}

['click', 'ontouchstart'].forEach(function (evt) {
    document.getElementById('startPauseTimer').addEventListener(evt, (e) => startPauseTimer(e), false);

    document.getElementById('resetTimer').addEventListener(evt, (e) => resetTimer(e), false);
});


function displayTimer() {
    milliseconds += 100;
    if (milliseconds == 1000) {
        milliseconds = 0;
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
            if (minutes == 60) {
                minutes = 0;
                hours++;
            }
        }
    }

    watch.h = hours < 10 ? "0" + hours : hours;
    watch.m = minutes < 10 ? "0" + minutes : minutes;
    watch.s = seconds < 10 ? "0" + seconds : seconds;
    watch.ms = milliseconds == 0 || milliseconds > 900 ? "0" : (milliseconds / 100).toFixed(0);

    timerEl.innerHTML = formatTimeString(watch);
    refreshStage();
}

function formatTimeString(w) {
    return w.h > 0 ? `${w.h} : ${w.m} : ${w.s} . ${w.ms}` : `${w.m} : ${w.s} . ${w.ms}`;
}