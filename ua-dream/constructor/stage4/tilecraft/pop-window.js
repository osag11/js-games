/* 
with respect to akirattii
https://gist.github.com/akirattii/9165836 
*/
let virtualKeyboard = true;
let popupStyle = { top: 40, left: 200 };

// var btn_popup = document.getElementById("btn_popup");
let popup = document.getElementById("popup");
let popup_bar = document.getElementById("popup_bar");
let btn_close = document.getElementById("btn_close");

let offset = { x: 0, y: 0 };

popup.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

popup.addEventListener('touchstart', mouseDown, false);
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

        // touchstart(e);
    }
    touchstart(e);

    window.addEventListener('mousemove', popupMove, true);
    window.addEventListener('touchmove', popupMove, true);
}


function popupMove(e) {

    //e.preventDefault();

    popup.style.position = 'absolute';
    var top = e.clientY - offset.y;
    var left = e.clientX - offset.x;

    if (e.touches && e.touches.length > 0) {
        top = parseInt(e.touches[0].clientY - offset.y)
        left = parseInt(e.touches[0].clientX - offset.x)
    }
    popupStyle.top = top;
    popupStyle.left = left;

    popup.style.top = popupStyle.top + 'px';
    popup.style.left = popupStyle.left + 'px';
}

//-- / let the popup make draggable & movable.
window.onkeydown = function (e) {
    if (e.keyCode == 27) { // if ESC key pressed
        closeVirtualKeyboard();
    }
}

// btn_close.onclick = function (e) {
//     virtualKeyboard = false;
//     popVirtualKeyboard();
// }

function closeVirtualKeyboard()
{
    virtualKeyboard = false;
    popVirtualKeyboard();
}

function popVirtualKeyboard() {
    popup.style.top = popupStyle.top + "px";//canvas.height - popup.clientHeight;
    popup.style.left = popupStyle.left + "px";
    popup.style.display = virtualKeyboard ? "block" : "none";
}

popVirtualKeyboard();


// long touch hold button
var onlongtouch;
var timer;
var touchduration = 800; //length of time we want the user to touch before we do something
let holdInProgress = false;
function touchstart(e) {
    e.preventDefault();
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
        if(btn_tap_action) btn_tap_action.call();

    }    

    holdInProgress=false;
}

onlongtouch = function () {
    timer = null;
    holdInProgress=true;
    console.log('hold');

    setTimeout(function onTick() {
        console.log('hold');
        if(btn_hold_action) btn_hold_action.call();
        if(holdInProgress) onlongtouch();
    }, 100)
};

let btn_hold_action=null;
let btn_tap_action=null;

function btnHoldStart(btn) {
    btn_hold_action = btn.onclick;
    console.log(btn);
}

function btnTouchStart(btn) {
    btn_tap_action = btn.onclick;
    btn_hold_action = null;
    console.log(btn);
}

function btnMouseHoldStart(btn){
    btn_hold_action = btn.onclick;
}

function btnMouseStart(btn){
    btn_hold_action = null;
}