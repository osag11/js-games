const pathPoint = (x, y, m = false) => ({ x, y, m });
// type = 'path([])', 'circle(x,y,r)', 'rect(x,y,w,h)', 'arcTo(x1,y1,x2,y2,r)', 
const shape = (points = [], args = [], type = 'path', color = 'white', fill = true) => ({ points, args, type, color, fill });


const ShapesCtor = (ctx) => ({
    ctx: ctx,
    objects: [],

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
        switch (obj.shape.type) {
            case 'path':
                for (const p of obj.shape.points) {
                    p.x += dx;
                    p.y += dy;
                }
                break;

            case 'arc':
                obj.shape.args[0] += dx;
                obj.shape.args[1] += dy;
                obj.shape.args[2] += dx;
                obj.shape.args[3] += dy;
                break;

            case 'rect':
            case 'circle':
                obj.shape.args[0] += dx;
                obj.shape.args[1] += dy;
                break;
        }
    },

    scale(obj, scale) {
        obj.p2d = new Path2D();

        switch (obj.shape.type) {
            case 'path':
                for (const p of obj.shape.points) {
                    p.x *= scale;
                    p.y *= scale;
                }
                break;

            case 'arc':
                obj.shape.args[0] *= scale;
                obj.shape.args[1] *= scale;
                obj.shape.args[2] *= scale;
                obj.shape.args[3] *= scale;
                break;

            case 'rect':
                obj.shape.args[2] *= scale;
                obj.shape.args[3] *= scale;
                break;

            case 'circle':
                obj.shape.args[2] *= scale;
                break;
        }
    },

    add(shape) {
        const obj = {};
        obj.p2d = new Path2D();
        obj.shape = shape;
        this.objects.push(obj);
    },


    // draw
    drawShapes() {
        for (let obj of this.objects) {
            this.draw(obj);
        }
    },

    draw(obj) {
        switch (obj.shape.type) {
            case 'path':
                this.drawPath(obj);
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

            default: this.drawPath(obj);
        }
    },

    ctxFillColor(shape, p2d) {

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

    drawPath(obj) {

        let shape = obj.shape;
        let p2d= obj.p2d;

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

        this.ctxFillColor(shape, p2d);
        
        this.ctx.save();
    },

    drawCircle(obj) {

        let shape = obj.shape;
        let p2d= obj.p2d;

        this.ctx.lineWidth = 1;
        p2d.arc(shape.args[0], shape.args[1], shape.args[2], 0, 2 * Math.PI);
        this.ctxFillColor(shape, p2d);
        this.ctx.save();

    },

    drawRect(obj) {
        let shape = obj.shape;
        let p2d= obj.p2d;

        p2d.rect(shape.args[0], shape.args[1], shape.args[2], shape.args[3]);
        this.ctxFillColor(shape, p2d);
        this.ctx.save();

    },

    drawArc(obj) {
        let shape = obj.shape;
        let p2d= obj.p2d;

        p2d.arcTo(shape.args[0], shape.args[1], shape.args[2], shape.args[3], shape.args[4]);
        this.ctxFillColor(shape, p2d);
        this.ctx.save();
    },
});

