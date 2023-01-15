const selectionToolModel = {
    x: 0, y: 0,
    lx: 0, ly: 0,
    button: 0,
    hold: 0,

    enabled: false,
    //dragging: false,
    moving: false,
    inversed: false
};


function handleMouseEvents(e) {

    const bounds = canvas.getBoundingClientRect();
    selectionToolModel.x = e.pageX - bounds.left - window.scrollX - markRadius;
    selectionToolModel.y = e.pageY - bounds.top - window.scrollY - markRadius;
    if (gridOn) {
        selectionToolModel.x = roundNearest(selectionToolModel.x, gridSize);
        selectionToolModel.y = roundNearest(selectionToolModel.y, gridSize);
    }

    if (selectionToolModel.x > 0 && selectionToolModel.x < canvas.width && selectionToolModel.y > 0 && selectionToolModel.y < canvas.height) {

        if (e.type === "mousedown") {
            selectionToolModel.button = true;
        }

        if (e.type === "mouseup") {
            selectionToolModel.button = false;
            selectionToolModel.hold = false;
        }

        selectionToolModel.hold = selectionToolModel.button && e.type === "mousemove";

        //debugInfo[0] = e.type;

        debugInfo[0] = e.type + ' ' + JSON.stringify(selectionToolModel);

        return updateSelection();
    }


    return false;
}

//["mousedown", "mouseup", "mousemove"].forEach(name => document.addEventListener(name, mouseEvents));
// http://jsfiddle.net/cpbwx5vr/1/


const point = (x, y) => ({ x, y });

const polylineShape = () => ({
    color: undefined,
    fill: false,
    points: [],
    activePoint: null, hoverPoint: null, insertPoint: null, centerPoint: null,
    cursor: "crosshair",
    isCenterSelected: false,

    addPoint(p) {
        if (this.insertPoint) {
            let idx = this.points.indexOf(this.insertPoint) + 1;
            this.points.splice(idx, 0, point(p.x, p.y));
        } else {
            this.points.push(point(p.x, p.y));
        }
        console.log(`(${p.x}; ${p.y})`);
    },

    deletePoint(p) {
        let idx = this.points.indexOf(p);
        if (idx >= 0) {
            this.points.splice(idx, 1);
        }
        return idx;
    },

    center() {

        if (this.points.length == 0) {
            this.centerPoint = null;
            return this.centerPoint;
        }

        let xArr = this.points.map(p => p.x);
        let yArr = this.points.map(p => p.y);
        let x_max = Math.max(...xArr);
        let y_max = Math.max(...yArr);
        let x_min = Math.min(...xArr);
        let y_min = Math.min(...yArr);

        this.centerPoint = point((x_min + x_max) / 2, (y_min + y_max) / 2);
        return this.centerPoint;
    },

    move(dx, dy) {
        for (const p of this.points) {
            p.x += dx;
            p.y += dy;
        }
        this.center();
    },

    draw() {

        ctx.lineWidth = 2;
        ctx.beginPath();
        canvas.style.cursor = this.cursor;

        if (this.points && this.points.length > 0) {
            ctx.moveTo(this.points[0].x, this.points[0].y)
        }

        for (const p of this.points) {
            ctx.lineTo(p.x, p.y)
        }

        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }

        ctx.closePath();

        // draw marks
        let contrastBgColor = getContrastBgColor();

        if (this.fill) ctx.strokeStyle = contrastBgColor;
        ctx.fillStyle = contrastBgColor;
        ctx.font = `${markRadius * 4}px serif`;

        for (const p of this.points) {
            ctx.moveTo(p.x + markRadius, p.y);
            ctx.arc(p.x, p.y, markRadius, 0, Math.PI * 2);

            ctx.fillText(this.points.indexOf(p), p.x + markRadius * 2, p.y + markRadius);

        }
        ctx.stroke();

        ctx.strokeStyle = contrastBgColor;
        if (this.hoverPoint) {
            drawCircle(this.hoverPoint, contrastBgColor, markRadius * 2);
            //ctx.strokeRect(this.hoverPoint.x-markRadius * 2, this.hoverPoint.y-markRadius * 2, markRadius * 4, markRadius * 4);

        }

        if (this.activePoint) {
            drawCircle(this.activePoint, contrastBgColor, markRadius * 2);
        }

        if (this.insertPoint) {
            //drawCircle(this.insertPoint, "blue", markRadius * 2 + 1);
            ctx.strokeRect(this.insertPoint.x - markRadius * 2, this.insertPoint.y - markRadius * 2, markRadius * 4, markRadius * 4);

        }

        if (this.centerPoint && this.points.length > 2) {
            ctx.lineWidth = this.isCenterSelected ? markRadius * 2 : markRadius * 1;
            drawCircle(this.centerPoint, this.isCenterSelected ? contrastBgColor : this.color, markRadius * 4);

            ctx.fillStyle = this.color;
            ctx.font = `${markRadius * 4}px serif`;
            ctx.fillText(selectionToolModel.inversed ? 'inversed' : '', this.centerPoint.x - markRadius * 6, this.centerPoint.y + markRadius * 6);

        }
    },

    closest(pos, dist = markRadius * 2) {
        var i = 0, index = -1;
        dist *= dist;
        for (const p of this.points) {
            var x = pos.x - p.x;
            var y = pos.y - p.y;
            var d2 = x * x + y * y;
            if (d2 < dist) {
                dist = d2;
                index = i;
            }
            i++;
        }
        if (index > -1) {
            debugInfo[4] = 'found closest: #' + index;

            return this.points[index]
        }
        // console.log('not found');
        debugInfo[4] = 'closest not found';

    }
});


let selectionTool = polylineShape();

function updateSelection() {

    selectionTool.hoverPoint = selectionTool.closest(selectionToolModel);

    selectionTool.cursor = selectionTool.hoverPoint ? "move" : "crosshair";

    if (selectionToolModel.button) {

        selectionTool.isCenterSelected = selectionTool.centerPoint ? getDistance(selectionTool.centerPoint, selectionToolModel) <= markRadius * 4 : false;
        if (selectionTool.isCenterSelected) {

            selectionToolModel.moving = true;//!selectionToolModel.moving;
            selectionTool.cursor = "move";
            selectionTool.activePoint = undefined;
            selectionTool.insertPoint = undefined;
        }
    }


    if (selectionToolModel.moving && selectionToolModel.hold) {
        selectionTool.move(selectionToolModel.x - selectionToolModel.lx, selectionToolModel.y - selectionToolModel.ly);
        selectionTool.cursor = "move";

    }
    else {
        if (selectionToolModel.button && !selectionToolModel.hold) {
            let closest = selectionTool.closest(selectionToolModel);

            if (selectionTool.activePoint === closest) {
                selectionTool.activePoint = undefined;
            } else {
                selectionTool.activePoint = closest;
            }

            if (selectionTool.activePoint) selectionTool.insertPoint = selectionTool.activePoint;


            if (selectionTool.activePoint === undefined && selectionToolModel.button && !selectionToolModel.moving) {
                selectionTool.cursor = "crosshair";
                let p = point(selectionToolModel.x, selectionToolModel.y);
                selectionTool.addPoint(p);
                selectionToolModel.button = false;
                selectionTool.center();
            }

        }

        if (selectionToolModel.button && selectionToolModel.hold && !selectionToolModel.moving) {

            if (selectionTool.activePoint) {
                selectionTool.cursor = "move";
                selectionTool.activePoint.x += selectionToolModel.x - selectionToolModel.lx;
                selectionTool.activePoint.y += selectionToolModel.y - selectionToolModel.ly;
                selectionTool.center();
            }
        }
        selectionToolModel.moving = selectionToolModel.hold && selectionToolModel.moving;
    }

    selectionTool.color = pickerModel.rgbaColor;
    selectionToolModel.lx = selectionToolModel.x;
    selectionToolModel.ly = selectionToolModel.y;
    // selectionTool.cursor = selectionToolModel.moving ? "move" : "crosshair";

    //debugInfo[0] = JSON.stringify(selectionToolModel);
    debugInfo[1] = 'active: ' + JSON.stringify(selectionTool.activePoint);
    debugInfo[2] = 'hover: ' + JSON.stringify(selectionTool.hoverPoint);
    debugInfo[3] = 'insert: ' + JSON.stringify(selectionTool.insertPoint);

    return true;
}


function drawCircle(pos, color = "red", size = 8) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.stroke();
}
