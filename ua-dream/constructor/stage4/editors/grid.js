const gridImage = new Image();
let gridOn = false;

function initGrid() {
    
    var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
        <defs> \
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse"> \
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5" /> \
            </pattern> \
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"> \
                <rect width="100" height="100" fill="url(#smallGrid)" /> \
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1" /> \
            </pattern> \
        </defs> \
        <rect width="100%" height="100%" fill="url(#grid)" /> \
    </svg>';

    var DOMURL = window.URL || window.webkitURL || window;
    
    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);

    gridImage.onload = function () {
      DOMURL.revokeObjectURL(url);
    }
    gridImage.src = url;
}

function drawGrid(ctx) {
    ctx.drawImage(gridImage, 0, 0);
}

function roundNearest(num, nearest = 10) {
    return Math.round(num / nearest) * nearest;
}