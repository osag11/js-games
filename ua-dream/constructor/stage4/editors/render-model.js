const pathPoint = (x, y, m = false) => ({ x, y, m });
// type = 'path([])', 'circle(x,y,r)', 'rect(x,y,w,h)', 'arcTo(x1,y1,x2,y2,r)', 
const shapeData = (points = [], args = [], type = 'polygon', color = 'white', fill = true) => ({ points, args, type, color, fill });
let objectsStore=[];


// Renderer
const RenderModel = (ctx) => ({
    ctx: ctx,
    objects: objectsStore,

    is_in_shape(x, y) {
        for (let obj of this.objects) {
            if (this.ctx.isPointInPath(obj.p2d, x, y)) {
                return obj;
            }
        }
        return null;
    },

    move(obj, dx, dy) {
        obj.p2d = new Path2D();
        switch (obj.data.type) {
            case 'polygon':
                for (const p of obj.data.points) {
                    p.x += dx;
                    p.y += dy;
                }
                break;

            case 'arc':
                obj.data.args[0] += dx;
                obj.data.args[1] += dy;
                obj.data.args[2] += dx;
                obj.data.args[3] += dy;
                obj.data.args[4] += dx;
                obj.data.args[5] += dy;

                break;

            case 'rect':
            case 'circle':
                obj.data.args[0] += dx;
                obj.data.args[1] += dy;
                break;
        }
    },

    scale(obj, scale) {
        obj.p2d = new Path2D();

        switch (obj.data.type) {
            case 'polygon':
                for (const p of obj.data.points) {
                    p.x *= scale;
                    p.y *= scale;
                }
                break;

            case 'arc':
                obj.data.args[0] *= scale;
                obj.data.args[1] *= scale;
                obj.data.args[2] *= scale;
                obj.data.args[3] *= scale;
                obj.data.args[4] *= scale;
                obj.data.args[5] *= scale;
                break;

            case 'rect':
                obj.data.args[2] *= scale;
                obj.data.args[3] *= scale;
                break;

            case 'circle':
                obj.data.args[2] *= scale;
                break;
        }
    },

    add(data) {
        const obj = {};
        obj.p2d = new Path2D();
        obj.data = data;
        this.objects.push(obj);
    },


    // draw
    drawShapes() {
        for (let obj of this.objects) {
            this.draw(obj);
        }

        this.drawDemo();
    },

    draw(obj) {

        switch (obj.data.type) {
            case 'polygon':
                this.drawPolygon(obj);
                break;

            case 'circle':
                this.drawCircle(obj);
                break;

            case 'rect':
                this.drawRect(obj);
                break;

            case 'arc':
                this.drawArc(obj);
                break;

            default: this.drawPolygon(obj);
        }

    },

    ctxShapeColor(shape, p2d) {

        if (shape.fill) {
            this.ctx.lineWidth = 1;
            this.ctx.fillStyle = shape.color;
            this.ctx.fill(p2d);
        } else {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = shape.color;
            this.ctx.stroke(p2d);
        }
    },

    drawPolygon(obj) {

        let shape = obj.data;
        let p2d = obj.p2d;

        if (shape.points && shape.points.length > 0) {
            p2d.moveTo(shape.points[0].x, shape.points[0].y);
        }

        for (const p of shape.points) {
            if (p.m) {
                p2d.moveTo(p.x, p.y);
            }
            else {
                p2d.lineTo(p.x, p.y);
            }
        }

        this.ctxShapeColor(shape, p2d);

        //this.ctx.save();
    },

    drawCircle(obj) {

        let shape = obj.data;
        let p2d = obj.p2d;

        this.ctx.lineWidth = 1;
        p2d.arc(shape.args[0], shape.args[1], shape.args[2], 0, 2 * Math.PI);
        this.ctxShapeColor(shape, p2d);
        //this.ctx.save();

    },

    drawRect(obj) {
        let shape = obj.data;
        let p2d = obj.p2d;

        p2d.rect(shape.args[0], shape.args[1], shape.args[2], shape.args[3]);
        this.ctxShapeColor(shape, p2d);
        //this.ctx.save();

    },

    drawArc(obj) {
        let shape = obj.data;
        let p2d = obj.p2d;
        p2d.moveTo(shape.args[0], shape.args[1]);
        p2d.arcTo(shape.args[2], shape.args[3], shape.args[4], shape.args[5], shape.args[6]);
        this.ctxShapeColor(shape, p2d);
        //this.ctx.save();
    },

    drawDemo(){
        // Arc
        // this.ctx.beginPath();
        // this.ctx.strokeStyle = 'pink';
        // this.ctx.lineWidth = 5;
        // this.ctx.moveTo(200, 50);
        // this.ctx.arcTo(200,130, 50, 40, 50);
        // this.ctx.stroke();
    }
});



function drawPolygon(points, color, fill = true) {

    // TBD: (x,y,m)

    // let shape = obj.data;
    // let p2d = obj.p2d;

    // if (shape.points && shape.points.length > 0) {
    //     p2d.moveTo(shape.points[0].x, shape.points[0].y);
    // }

    // for (const p of shape.points) {
    //     if (p.m) {
    //         p2d.moveTo(p.x, p.y);
    //     }
    //     else {
    //         p2d.lineTo(p.x, p.y);
    //     }
    // }

    // this.ctxFillColor(shape, p2d);

    // this.ctx.save();
}

function shapeColor(p2d, color, fill =true) {

    if (fill) {
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = color;
        this.ctx.fill(p2d);
    } else {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.stroke(p2d);
    }
}

// Animator function
// state has phase or iterator
// x: linear(100,600)
// y: const(500)
// y: sin(x, 100)
// y: linear(20,50)
// y: scale(x, 0.5)
// x: sin(10,60)  y: sin(10,60)
// bounce or jumper (gravity)
// ballistic (gravity)
// reflector (box)