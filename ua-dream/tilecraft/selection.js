const selectionModel = {
    x: 0, y: 0,
    lx: 0, ly: 0,
    button: 0,
    hold: 0,

    mirrorAxis: {
        p1: undefined,
        p2: undefined,
        selected: undefined,
        enabled: false,
        useReflectionOnly: false
    },

    enabled: false,
    moving: false,
    inverse: false,
    hideMarks: false,
};


function handleMouseEvents(e) {

    const bounds = canvas.getBoundingClientRect();
    selectionModel.x = e.pageX - bounds.left - window.scrollX - markRadius;
    selectionModel.y = e.pageY - bounds.top - window.scrollY - markRadius;

    if (e.touches && e.touches.length > 0) {
        selectionModel.x = parseInt(e.touches[0].clientX - markRadius * 2);
        selectionModel.y = parseInt(e.touches[0].clientY + markRadius * 2);
    }

    if (gridOn) {
        selectionModel.x = roundNearest(selectionModel.x, layer().gridSize);
        selectionModel.y = roundNearest(selectionModel.y, layer().gridSize);
    }

    if (selectionModel.x > 0 && selectionModel.x < canvas.width && selectionModel.y > 0 && selectionModel.y < canvas.height) {

        if (e.type === "mousedown" || e.type === "touchstart") {
            selectionModel.button = true;
        }

        if (e.type === "mouseup" || e.type === "touchend") {
            selectionModel.button = false;
            selectionModel.hold = false;
        }

        selectionModel.hold = selectionModel.button && (e.type === "mousemove" || e.type === "touchmove");

        updateSelection();
    }
}


const point = (x, y) => ({ x, y });

// linear interpolation between two numbers  
// Kudo to https://quickref.me/calculate-the-linear-interpolation-between-two-numbers
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

    getPoints(useReflectionOnly) {

        let selectionPoints = this.useInterpolation ? this.getInterpolationPoints() : this.points;
        let reflectedPoints = selectionModel.mirrorAxis.enabled ? this.reflect(selectionPoints, selectionModel.mirrorAxis.p1, selectionModel.mirrorAxis.p2) : [];

        if (useReflectionOnly) {
            return reflectedPoints;
        }

        return selectionPoints.concat(reflectedPoints);
    },

    reflect(points, p1, p2) {
        let reflectedPoints = [];
        for (const p of points) {
            let rp = reflect(p, p1, p2);
            reflectedPoints.push(rp);
        }
        return reflectedPoints;
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
                let maxY = Math.max(p1.y, p2.y);
                let minY = Math.min(p1.y, p2.y);

                if (ip.x <= maxX && ip.x >= minX && ip.y <= maxY && ip.y >= minY) {
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
            pointsCopy.push(point(pointsCopy[0].x, pointsCopy[0].y));
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

            for (const p of this.points) {
                ctx.lineTo(p.x, p.y)
            }
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
            const drawingPoints = this.getInterpolationPoints()
            for (const p of drawingPoints) {

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
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = contrastBgColor;
        for (const p of this.points) {
            ctx.fillText(this.points.indexOf(p), p.x + markRadius * 2, p.y + markRadius);
        }

        if (this.centerPoint && this.points.length > 2) {
            ctx.lineWidth = this.isCenterSelected ? markRadius * 2 : markRadius * 1;
            drawCircle(this.centerPoint, this.isCenterSelected ? contrastBgColor : this.color, markRadius * 3);

            ctx.font = `${markRadius * 4}px serif`;
            ctx.fillStyle = this.color;
            ctx.fillText(selectionModel.inverse ? 'inverse' : '', this.centerPoint.x - markRadius * 6, this.centerPoint.y + markRadius * 8);
        }

        ctx.lineWidth = 1;

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

        let ma = selectionModel.mirrorAxis;

        if (ma.enabled) {

            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.moveTo(ma.p1.x, ma.p1.y);
            ctx.lineTo(ma.p2.x, ma.p2.y);
            ctx.stroke();

            ctx.strokeStyle = contrastBgColor;
            ctx.strokeRect(ma.p1.x - markRadius * 2, ma.p1.y - markRadius * 2, markRadius * 4, markRadius * 4);
            ctx.strokeRect(ma.p2.x - markRadius * 2, ma.p2.y - markRadius * 2, markRadius * 4, markRadius * 4);
            ctx.stroke();


            let reflectedPoints = this.reflect(this.getInterpolationPoints(), ma.p1, ma.p2);

            if (reflectedPoints.length > 0) {

                ctx.strokeStyle = contrastBgColor;
                ctx.lineWidth = 1;
                ctx.beginPath();

                ctx.moveTo(reflectedPoints[0].x, reflectedPoints[0].y)

                for (const p of reflectedPoints) {
                    ctx.lineTo(p.x, p.y)
                }

                if (this.closePath) {
                    ctx.closePath();
                }

                for (const p of reflectedPoints) {

                    ctx.moveTo(p.x + markRadius, p.y);
                    ctx.arc(p.x, p.y, markRadius, 0, Math.PI * 2);
                }

                ctx.stroke();
            }
        }
    },

    closest(pos, points, dist = markRadius * 2) {

        if (!points) {
            points = this.points;
        }
        return getClosest(points, pos, dist)

    }
});


let selectionTool = polylineShape();

function updateSelection() {
    let dx = selectionModel.x - selectionModel.lx;
    let dy = selectionModel.y - selectionModel.ly;

    selectionTool.hoverPoint = selectionTool.closest(selectionModel);
    selectionTool.cursor = selectionTool.hoverPoint ? "move" : "crosshair";

    if (selectionModel.button) {

        selectionTool.isCenterSelected = selectionTool.centerPoint ? getDistance(selectionTool.centerPoint, selectionModel) <= markRadius * 4 : false;
        if (selectionTool.isCenterSelected) {

            selectionModel.moving = true;
            selectionTool.cursor = "move";
        }

        let mirrorPoints = [selectionModel.mirrorAxis.p1, selectionModel.mirrorAxis.p2];
        selectionModel.mirrorAxis.selected = selectionTool.closest(selectionModel, mirrorPoints, markRadius * 10);

        if (selectionModel.mirrorAxis.selected) {

            selectionModel.mirrorAxis.moving = true;
            selectionTool.cursor = "move";

            // debugInfo[0] = JSON.stringify(selectionModel.mirrorAxis.selected);
            // debugInfo[1] = JSON.stringify(selectionModel.mirrorAxis.p1);
            // debugInfo[2] = JSON.stringify(selectionModel.mirrorAxis.p2);
        }
    }


    if (selectionModel.moving && selectionModel.hold) {
        selectionTool.move(dx, dy);
        selectionTool.cursor = "move";

    } else if (selectionModel.mirrorAxis.moving && selectionModel.hold) {
        selectionTool.cursor = "move";

        if (selectionModel.mirrorAxis.parallel) {

            selectionModel.mirrorAxis.p1.x += xLock ? 0 : dx;
            selectionModel.mirrorAxis.p1.y += yLock ? 0 : dy;

            selectionModel.mirrorAxis.p2.x += xLock ? 0 : dx;
            selectionModel.mirrorAxis.p2.y += yLock ? 0 : dy;

        } else if(selectionModel.mirrorAxis.selected) {
            selectionModel.mirrorAxis.selected.x += xLock ? 0 : dx;
            selectionModel.mirrorAxis.selected.y += yLock ? 0 : dy;
        }
    }
    else {

        if (selectionModel.button && !selectionModel.hold) {
            let closest = selectionTool.closest(selectionModel, undefined, markRadius * 4);

            if (closest) selectionTool.insertPoint = closest;

            selectionTool.activePoint = closest;

            if (selectionTool.activePoint === undefined && selectionModel.button && !selectionModel.moving && !selectionModel.mirrorAxis.moving) {
                selectionTool.cursor = "crosshair";
                let p = point(selectionModel.x, selectionModel.y);
                selectionTool.addPoint(p);
                selectionModel.button = false;
                selectionTool.center();
            }

            selectionModel.mirrorAxis.parallel = false;
            selectionModel.parallel = false;

        }

        if (selectionModel.button && selectionModel.hold && !selectionModel.moving) {

            if (selectionTool.activePoint) {
                selectionTool.cursor = "move";

                if (selectionModel.parallel) {
                    let idx = selectionTool.points.indexOf(selectionTool.activePoint);

                    let next = selectionTool.points[idx - 1] ?? selectionTool.points[idx + 1] ?? point(0, 0);
                    next.x += xLock ? 0 : dx;
                    next.y += yLock ? 0 : dy;
                }

                selectionTool.activePoint.x += xLock ? 0 : dx;
                selectionTool.activePoint.y += yLock ? 0 : dy;

                selectionTool.center();
            }
        }

        selectionModel.moving = selectionModel.hold && selectionModel.moving;
    }

    selectionModel.mirrorAxis.moving = selectionModel.hold && selectionModel.mirrorAxis.moving;

    selectionTool.color = pickerColor();
    selectionModel.lx = selectionModel.x;
    selectionModel.ly = selectionModel.y;

    // debugInfo[0] = JSON.stringify(selectionModel);
    // debugInfo[1] = 'active: ' + JSON.stringify(selectionTool.activePoint);
    // debugInfo[2] = 'hover: ' + JSON.stringify(selectionTool.hoverPoint);
    // debugInfo[3] = 'insert: ' + JSON.stringify(selectionTool.insertPoint);
}


function drawCircle(pos, color = "red", size = 8) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

// Kudo to https://gist.github.com/balint42/b99934b2a6990a53e14b#file-reflect-js
var reflect = function (p, p0, p1) {
    var dx, dy, a, b, x, y;

    dx = p1.x - p0.x;
    dy = p1.y - p0.y;
    a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
    b = 2 * dx * dy / (dx * dx + dy * dy);
    x = Math.round(a * (p.x - p0.x) + b * (p.y - p0.y) + p0.x);
    y = Math.round(b * (p.x - p0.x) - a * (p.y - p0.y) + p0.y);

    return { x: x, y: y };
}