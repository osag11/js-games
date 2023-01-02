/* 
with respect to akirattii
https://gist.github.com/akirattii/9165836 
*/
(function () {

    // var btn_popup = document.getElementById("btn_popup");
    var popup = document.getElementById("popup");
    var popup_bar = document.getElementById("popup_bar");
    var btn_close = document.getElementById("btn_close");

    var offset = { x: 0, y: 0 };

    popup_bar.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    popup_bar.addEventListener('touchstart', mouseDown, false);
    window.addEventListener('touchend', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', popupMove, true);
        window.removeEventListener('touchmove', popupMove, true);
    }

    function mouseDown(e) {
        offset.x = e.clientX - popup.offsetLeft;
        offset.y = e.clientY - popup.offsetTop;

        if (e.touches && e.touches.length > 0) {
            offset.x = e.touches[0].clientX - popup.offsetLeft;
            offset.y = e.touches[0].clientY - popup.offsetTop;
        }

        window.addEventListener('mousemove', popupMove, true);
        window.addEventListener('touchmove', popupMove, true);
    }

    function popupMove(e) {
        popup.style.position = 'absolute';
        var top = e.clientY - offset.y;
        var left = e.clientX - offset.x;

        if (e.touches && e.touches.length > 0) {
            top = parseInt(e.touches[0].clientY - offset.y)
            left = parseInt(e.touches[0].clientX - offset.x)
        }

        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }

    //-- / let the popup make draggable & movable.
    window.onkeydown = function (e) {
        if (e.keyCode == 27) { // if ESC key pressed
            btn_close.click(e);
        }
    }

    // btn_popup.onclick = function (e) {
    //     // reset div position
    //     popup.style.top = "100px";
    //     popup.style.left = "200px";
    //     popup.style.display = "block";
    // }

    btn_close.onclick = function (e) {
        popup.style.display = "none";
    }
}());