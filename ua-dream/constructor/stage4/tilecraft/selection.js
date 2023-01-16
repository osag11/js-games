const selectionModel = {
    x: 0, y: 0,
    lx: 0, ly: 0,
    button: 0,
    hold: 0,

    enabled: false,
    moving: false,
    inverse: false
};


function handleMouseEvents(e) {

    const bounds = canvas.getBoundingClientRect();
    selectionModel.x = e.pageX - bounds.left - window.scrollX - markRadius;
    selectionModel.y = e.pageY - bounds.top - window.scrollY - markRadius;

    if (gridOn) {
        selectionModel.x = roundNearest(selectionModel.x, gridSize);
        selectionModel.y = roundNearest(selectionModel.y, gridSize);
    }

    if (selectionModel.x > 0 && selectionModel.x < canvas.width && selectionModel.y > 0 && selectionModel.y < canvas.height) {

        if (e.type === "mousedown") {
            selectionModel.button = true;
        }

        if (e.type === "mouseup") {
            selectionModel.button = false;
            selectionModel.hold = false;
        }

        selectionModel.hold = selectionModel.button && e.type === "mousemove";

        return updateSelection();
    }


    return false;
}

//["mousedown", "mouseup", "mousemove"].forEach(name => document.addEventListener(name, mouseEvents));
// http://jsfiddle.net/cpbwx5vr/1/


const point = (x, y) => ({ x, y });
//  linear interpolation between two numbers  
// https://quickref.me/calculate-the-linear-interpolation-between-two-numbers
const lerp = (a, b, amount) => (1 - amount) * a + amount * b;

const polylineShape = () => ({
    color: undefined,
    points: [],
    activePoint: null, hoverPoint: null, insertPoint: null, centerPoint: null,
    closePath: true,
    useInterpolation: true,
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

    getInterpolationPoints() {
        let result = [];
        let pointsCopy = [...this.points];
        if (this.closePath && this.points.length > 2) {
            pointsCopy = pointsCopy.concat(pointsCopy[0]);
        }

        for (let i = 1; i < pointsCopy.length; i++) {
            let p1 = pointsCopy[i - 1];
            let p2 = pointsCopy[i];
            let dist = getDistance(p1, p2);
            let amount = dist / layer().gridSize;
            let iterator = 0;

            result.push(p1);

            while (iterator <= 1) {
                iterator += 1 / amount;
                let ip = point(
                    lerp(p2.x, p1.x, iterator),
                    lerp(p2.y, p1.y, iterator)
                );

                let maxX = Math.max(p1.x, p2.x);
                let minX = Math.min(p1.x, p2.x);
                let maxY = Math.max(p1.x, p2.x);
                let minY = Math.min(p1.x, p2.x);
// here is bug, not all cases handled
                if (ip.x <= maxX && ip.x >= minX || ip.y <= maxY && ip.y >= minY) {
                    result.push(ip);
                }
            }
        }

        return result;
    },

    reducePoints(minInterval) {
        let result = [];
        let pointsCopy = [...this.points];
        if (this.closePath && this.points.length > 2) {
            pointsCopy = pointsCopy.concat(pointsCopy[0]);
        }

        let iterator = 0;
        let initialPoint = pointsCopy[iterator];
        result.push(initialPoint);
        let nextPoint = pointsCopy[iterator];

        while (nextPoint) {

            nextPoint = pointsCopy[iterator];
            if (!nextPoint) break;

            let dist = getDistance(initialPoint, nextPoint);

            if (dist > minInterval) {
                result.push(nextPoint);
                initialPoint = pointsCopy[iterator]
            }
            iterator++;
        }

        return result;
    },

    center() {

        if (this.points.length < 3) {
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

    dispose() {
        this.activePoint = null;
        this.hoverPoint = null;
        this.insertPoint = null;
        this.center();
        selectionModel.moving = false;
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
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        if (this.points && this.points.length > 0) {
            ctx.moveTo(this.points[0].x, this.points[0].y)
        }

        for (const p of this.points) {
            ctx.lineTo(p.x, p.y)
        }

        if (this.closePath) {
            ctx.closePath();
        }
        ctx.stroke();

        // draw interpolation
        if (this.useInterpolation) {
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            for (const p of this.getInterpolationPoints()) {

                ctx.moveTo(p.x + markRadius, p.y);
                ctx.arc(p.x, p.y, markRadius * 0.6, 0, Math.PI * 2);
            }

            ctx.stroke();
        }

        // draw marks
        let contrastBgColor = getContrastBgColor();

        ctx.font = `${markRadius * 4}px serif`;
        ctx.strokeStyle = this.color;
        ctx.beginPath();

        for (const p of this.points) {

            ctx.moveTo(p.x + markRadius, p.y);
            ctx.arc(p.x, p.y, markRadius, 0, Math.PI * 2);
        }
        ctx.stroke();

        ctx.fillStyle = contrastBgColor;
        for (const p of this.points) {
            ctx.fillText(this.points.indexOf(p), p.x + markRadius * 2, p.y + markRadius);
        }


        ctx.lineWidth = 2;

        if (this.hoverPoint) {
            //drawCircle(this.hoverPoint, contrastBgColor, markRadius * 2);
            ctx.strokeStyle = contrastBgColor;
            ctx.strokeRect(this.hoverPoint.x - markRadius * 2, this.hoverPoint.y - markRadius * 2, markRadius * 4, markRadius * 4);
        }

        if (this.insertPoint) {
            //drawCircle(this.insertPoint, "blue", markRadius * 2 + 1);
            ctx.strokeStyle = contrastBgColor;
            ctx.strokeRect(this.insertPoint.x - markRadius * 2, this.insertPoint.y - markRadius * 2, markRadius * 4, markRadius * 4);
        }

        if (this.activePoint) { //&& !this.insertPoint
            drawCircle(this.activePoint, contrastBgColor, markRadius * 1.5);
            ctx.stroke();
        }


        if (this.centerPoint && this.points.length > 2) {
            ctx.lineWidth = this.isCenterSelected ? markRadius * 2 : markRadius * 1;
            drawCircle(this.centerPoint, this.isCenterSelected ? contrastBgColor : this.color, markRadius * 4);

            ctx.font = `${markRadius * 4}px serif`;
            ctx.fillStyle = this.color;
            ctx.fillText(selectionModel.inverse ? 'inverse' : '', this.centerPoint.x - markRadius * 6, this.centerPoint.y + markRadius * 8);
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

    selectionTool.hoverPoint = selectionTool.closest(selectionModel);

    selectionTool.cursor = selectionTool.hoverPoint ? "move" : "crosshair";

    if (selectionModel.button) {

        selectionTool.isCenterSelected = selectionTool.centerPoint ? getDistance(selectionTool.centerPoint, selectionModel) <= markRadius * 4 : false;
        if (selectionTool.isCenterSelected) {

            selectionModel.moving = true;
            selectionTool.cursor = "move";
        }
    }


    if (selectionModel.moving && selectionModel.hold) {
        selectionTool.move(selectionModel.x - selectionModel.lx, selectionModel.y - selectionModel.ly);
        selectionTool.cursor = "move";

    }
    else {
        if (selectionModel.button && !selectionModel.hold) {
            let closest = selectionTool.closest(selectionModel);

            if (closest) selectionTool.insertPoint = closest;

            selectionTool.activePoint = closest;


            if (selectionTool.activePoint === undefined && selectionModel.button && !selectionModel.moving) {
                selectionTool.cursor = "crosshair";
                let p = point(selectionModel.x, selectionModel.y);
                selectionTool.addPoint(p);
                selectionModel.button = false;
                selectionTool.center();
            }
        }

        if (selectionModel.button && selectionModel.hold && !selectionModel.moving) {

            if (selectionTool.activePoint) {
                selectionTool.cursor = "move";
                selectionTool.activePoint.x += selectionModel.x - selectionModel.lx;
                selectionTool.activePoint.y += selectionModel.y - selectionModel.ly;
                selectionTool.center();
            }
        }
        selectionModel.moving = selectionModel.hold && selectionModel.moving;
    }

    selectionTool.color = pickerColor();
    selectionModel.lx = selectionModel.x;
    selectionModel.ly = selectionModel.y;

    debugInfo[0] = JSON.stringify(selectionModel);
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
    //ctx.closePath();
}
