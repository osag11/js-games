// https://codepen.io/pizza3/pen/BVzYNP
// pickerModel:
var colorBlock = document.getElementById('color-block');
var ctxColor = colorBlock.getContext('2d',{ willReadFrequently: true });

var colorStrip = document.getElementById('color-strip');
var ctxColorStrip = colorStrip.getContext('2d',{ willReadFrequently: true });

var colorLabel = document.getElementById('color-label');

let pickerModel = {
    x: 0,
    y: 0,
    drag: false,
    rgbaColor: 'rgba(255,0,0,1)'
}

function initPicker() {
    ctxColor.rect(0, 0, colorBlock.width, colorBlock.height);
    fillGradient();

    ctxColorStrip.rect(0, 0, colorStrip.width, colorStrip.height);
    var grd1 = ctxColorStrip.createLinearGradient(0, 0, 0, colorBlock.height);
    grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctxColorStrip.fillStyle = grd1;
    ctxColorStrip.fill();
}

function pick(color) {
    pickerModel.rgbaColor = color;
    colorLabel.style.backgroundColor = pickerModel.rgbaColor;
    fillGradient();
}

function click(e) {
    pickerModel.x = e.offsetX;
    pickerModel.y = e.offsetY;
    var imageData = ctxColorStrip.getImageData(pickerModel.x, pickerModel.y, 1, 1).data;
    pickerModel.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    randomColorState(false);
    fillGradient();
}

function fillGradient() {
    ctxColor.fillStyle = pickerModel.rgbaColor;
    ctxColor.fillRect(0, 0, colorBlock.width, colorBlock.height);

    var grdWhite = ctxColorStrip.createLinearGradient(0, 0, colorBlock.width, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctxColor.fillStyle = grdWhite;
    ctxColor.fillRect(0, 0, colorBlock.width, colorBlock.height);

    var grdBlack = ctxColorStrip.createLinearGradient(0, 0, 0, colorBlock.height);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctxColor.fillStyle = grdBlack;
    ctxColor.fillRect(0, 0, colorBlock.width, colorBlock.height);
}

function mousedown(e) {
    pickerModel.drag = true;
    changeColor(e);
}

function mousemove(e) {
    if (pickerModel.drag) {
        changeColor(e);
    }
}

function mouseup(e) {
    pickerModel.drag = false;
}

function changeColor(e) {
    pickerModel.x = e.offsetX;
    pickerModel.y = e.offsetY;
    var imageData = ctxColor.getImageData(pickerModel.x, pickerModel.y, 1, 1).data;
    pickerModel.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    colorLabel.style.backgroundColor = pickerModel.rgbaColor;

    // inform
    randomColorState(false);
}

colorStrip.addEventListener("click", click, false);
colorBlock.addEventListener("mousedown", mousedown, false);
colorBlock.addEventListener("mouseup", mouseup, false);
colorBlock.addEventListener("mousemove", mousemove, false);

initPicker();