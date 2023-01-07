/* 
with respect to akirattii
https://gist.github.com/akirattii/9165836 
*/
let virtualKeyboard = false;
let popupStyle = { top: 40, left: 200 };
let offset = { x: 0, y: 0 };

let popup = document.getElementById("popup");
let popup_bar = document.getElementById("popup_bar");
let btn_close = document.getElementById("btn_close");

let btn_hold_action = null;
let btn_tap_action = null;

const btnState = {
    help_state: "help",
    palette_state: "hexPalette",
    edit_mode_state: "layer().edit_mode",
    move_mode_state: "layer().move_mode",
    transparency_state: "!layer().transparency||layer().transparency===255",
    x_lock_state: "xLock",
    y_lock_state: "yLock",
    grid_state: "gridOn",
    random_color_state: "randomColor",
    layer_clone_mode_state: "layerCloneMode",
    debug_mode_state: "debugOn",
}
const enabledBtnBorder = '5px solid #00cfff';

document.getElementsByName("virtual_keyboard")
    .forEach(kb => {
        kb.addEventListener('mousedown', mouseDown, false);
        kb.addEventListener('touchstart', mouseDown, false);
    });

popup_bar.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

popup_bar.addEventListener('touchstart', mouseDown, false);
window.addEventListener('touchend', mouseUp, false);

function mouseUp() {
    window.removeEventListener('mousemove', popupMove, true);
    window.removeEventListener('touchmove', popupMove, true);

    touchend();
}

function mouseDown(e) {

    offset.x = e.clientX - popup.offsetLeft;
    offset.y = e.clientY - popup.offsetTop;

    if (e.touches && e.touches.length > 0) {
        offset.x = e.touches[0].clientX - popup.offsetLeft;
        offset.y = e.touches[0].clientY - popup.offsetTop;
    }

    touchstart(e);

    window.addEventListener('mousemove', popupMove, true);
    window.addEventListener('touchmove', popupMove, true);
}

let touchTremorInfo = { x: 0, y: 0, diff: 0 };
// long touch hold button
var onlongtouch;
var timer;
var touchduration = 800; //length of time we want the user to touch before we do something
let holdInProgress = false;
let longTouchRepeatInterval = 100;

function popupMove(e) {

    popup.style.position = 'absolute';
    var left = e.clientX - offset.x;
    var top = e.clientY - offset.y;

    if (e.touches && e.touches.length > 0) {
        left = parseInt(e.touches[0].clientX - offset.x);
        top = parseInt(e.touches[0].clientY - offset.y);
    }

    let diff = (Math.abs(touchTremorInfo.x - left) + Math.abs(touchTremorInfo.y - top));
    touchTremorInfo = { x: left, y: top, diff: diff };

    popupStyle.top = top;
    popupStyle.left = left;

    popup.style.top = popupStyle.top + 'px';
    popup.style.left = popupStyle.left + 'px';

    // prevent commands long touch execution
    if (touchTremorInfo.diff > 2) {
        btn_hold_action = null;
        btn_tap_action = null;
        console.log('hold action aborted');
    }

    // debugInfo[0] = JSON.stringify(touchTremorInfo);
}

window.onkeydown = function (e) {
    if (e.keyCode == 27) { // if ESC key pressed
        closeVirtualKeyboard();
    }
}

function toggleVirtualKeyboard() {
    virtualKeyboard = !virtualKeyboard;
    popVirtualKeyboard();
}

function closeVirtualKeyboard() {
    virtualKeyboard = false;
    popVirtualKeyboard();
}

function popVirtualKeyboard() {
    popup.style.top = popupStyle.top + "px";
    popup.style.left = popupStyle.left + "px";
    popup.style.display = virtualKeyboard ? "block" : "none";
    refreshBtnState();
}

popVirtualKeyboard();

function touchstart(e) {
    e.preventDefault();
    longTouchRepeatInterval = 100;
    ignoreMouseEvents = true;

    if (!timer) {
        timer = setTimeout(onlongtouch, touchduration);
    }
}

function touchend() {
    //stops short touches from firing the event
    if (timer) {
        clearTimeout(timer);
        timer = null;
        console.log('touch');
        if (btn_tap_action) {
            let res = eval(btn_tap_action);
            console.log(`${btn_hold_action} => ${res}`);
        }

        refreshBtnState();

        btn_tap_action = null;
        btn_hold_action = null;
    }

    ignoreMouseEvents = false;
    holdInProgress = false;
}

onlongtouch = function () {

    timer = null;
    holdInProgress = true;
    longTouchRepeatInterval -= 2;

    if (longTouchRepeatInterval < 20) longTouchRepeatInterval = 20;

    setTimeout(function onTick() {
        console.log('hold: ' + longTouchRepeatInterval);

        if (btn_hold_action) {
            let res = eval(btn_hold_action);
            console.log(`${btn_hold_action} => ${res}`);
        }

        btn_tap_action = null;
        if (holdInProgress) onlongtouch();

    }, longTouchRepeatInterval)
};


function parseAction(btn) {
    var action = btn.outerHTML.match(/onclick="[a-zA-Z_(\d)']*"/gm)[0]?.split('"')[1];
    return action;
}

function btnHoldStart(btn) {
    var action = parseAction(btn);
    btn_hold_action = action;
    btn_tap_action = action;
}

function btnTouchStart(btn) {
    var action = parseAction(btn);
    btn_tap_action = action;
    btn_hold_action = null;

}

function btnMouseHoldStart(btn) {
    var action = parseAction(btn);
    btn_hold_action = action;
    btn_tap_action = null;
}


function refreshBtnState() {
    for (const property in btnState) {
        document.getElementsByName(property)
            .forEach(btn => {
                let state = eval(btnState[property]);
                console.log(`${property} ${btnState[property]} ${state}`);
                btn.style.border = state == true || typeof state == 'number' ? enabledBtnBorder : ''
            });
    }

    let activeShape = getActiveShapeName();

    for (let shape of [
        'square', 'circle', 'circle2x', 'polyline',
        'polygon3', 'polygon4', 'polygon5', 'polygon6',
        'polygon7', 'polygon8',
    ]) {

        document.getElementsByName('shape_state_' + shape)
            .forEach(btn => {
                btn.style.border = shape == activeShape ? enabledBtnBorder : '';
            });
    }
}


