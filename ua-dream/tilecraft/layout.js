const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const toolsCanvas = document.getElementById("tools");
const ctx2 = toolsCanvas.getContext("2d", { willReadFrequently: true });

function get_offset() {
    // let canvas_offsets = canvas.getBoundingClientRect();
    // offset_x = canvas_offsets.left;
    // offset_y = canvas_offsets.top;
}

window.onscroll = function () { get_offset(); }

window.onresize = function () {
    setSize();
    get_offset();
}

canvas.onresize = function () { get_offset(); }

function setSize() {

    let winHeight = window.innerHeight;
    let winWidth = window.innerWidth;

    if (window.innerWidth > 768) {
        let colorPanelWidth = 300;
        let colorPanelHeight = 193;
        let vMargin = 8;
        let hMargin = 22;

        canvas.width = winWidth - colorPanelWidth - hMargin;
        canvas.height = winHeight - vMargin;

        toolsCanvas.height = window.innerHeight - colorPanelHeight - vMargin;
        toolsCanvas.width = window.innerWidth - canvas.width - hMargin;

    } else {

        let colorPanelWidth = 300;
        let colorPanelHeight = 193;

        let vMargin = 8;
        let hMargin = 22;

        canvas.width = winWidth - hMargin;
        canvas.height = winHeight - vMargin;

        toolsCanvas.height = colorPanelHeight - vMargin;
        toolsCanvas.width = window.innerWidth - colorPanelWidth - hMargin;
    }
}

setSize();