
const output = new Output();

function Output() {
    this.limit = 10;
    this.messageStack = [];
    this.show = false;

    this.log = (message) => {
        console.log(message)

        this.messageStack.push(message);

        if (this.messageStack.length > this.limit) {
            this.messageStack.shift();
        }
    }

    this.a_log = (message) => {
        console.log(message);
        this.messageStack[this.messageStack.length - 1] += message;
    }

    this.m_log = (message) => {
        console.log(message);
        clearArray(this.messageStack);
        message.split(/\r?\n/).forEach(row => {
         this.messageStack.push(row);           
        });    
    }

    this.draw = () => {

        if (this.show) {
            ctx.fillStyle = 'green';
            ctx.font = '12px Monospace';
            for (let i = 0; i < this.messageStack.length; i++) {
                ctx.fillText(this.messageStack[i], 0, i * 14 + 14);
            }
        }
    }

}

function clearArray(array) {
    while (array.length > 0) {
        array.pop();
    }
}

