class Canvas {
     initCanvas(parent, restore) {
        const canvas = createElement('image', 'canvas')
        this.download = () => {
            const anchor = document.createElement("a");
            anchor.href = canvas.toDataURL("image/png");
            anchor.download = "meme.png";
            anchor.click();
        };
        parent.append(canvas);
        this.canvas = $(canvas)[0];
        this.ctx = this.canvas.getContext("2d");
        this.restore = restore;
    }

    draw(text, cap) {
        let lines = 0;
        let strings = [];
        let fontSize;
        const maxFont = cap.maxFont || this.ctx.canvas.height / 10;
        do {
            lines++;
            fontSize = Math.min(maxFont, cap.height / lines);
            this.ctx.font = fontSize + "px Arial";
            strings = text.split("\n");
            strings = strings.flatMap(v => this.splitByMaxWidth(v, cap.width));
        } while (lines < strings.length)
        if (cap.angle) {
            this.ctx.rotate(cap.angle * Math.PI / 180);
        }
        this.ctx.textAlign = cap.center ? 'center' : 'start';
        this.fillText(fontSize, strings, cap.x, cap.y + fontSize);
        if (cap.angle) {
            this.ctx.rotate(-cap.angle * Math.PI / 180);
        }
    }

    drawTestFields(cap) {
        const xRation = cap.center ? cap.width / 2 : 0;
        this.ctx.rotate(cap.angle * Math.PI / 180);
        this.ctx.strokeStyle = 'white';
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillRect(cap.x - xRation, cap.y, cap.width, cap.height);
        this.ctx.globalAlpha = 1.0;
        this.ctx.rotate(-cap.angle * Math.PI / 180);
    }

    restartCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        if (this.color) {
            this.ctx.fillStyle = this.color;
        }
    }

    fillText(fontSize, strings, initX, initY) {
        let y = initY;
        for (let i = 0; i < strings.length; i++) {
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = fontSize/10;
            this.ctx.strokeText(strings[i], initX, y);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(strings[i], initX, y);
            y += fontSize;
        }
    }

    splitByMaxWidth(value, max) {
        const words = value.split(' ');
        let res = [''];
        for (let i = 0; i < words.length; i++) {
            let newVal = res[res.length - 1] ? res[res.length - 1] + ' ' + words[i] : words[i];
            if (this.ctx.measureText(newVal).width > max) {
                res[res.length] = words[i];
            } else {
                res[res.length - 1] = newVal;
            }
        }
        return res;
    }

    updateImage(src, afterLoad) {
        this.img = new Image();
        this.img.onload = () => {
            this.ctx.canvas.width = this.img.naturalWidth;
            this.ctx.canvas.height = this.img.naturalHeight;
            this.restartCanvas();
            if (afterLoad) {
                afterLoad();
            }
        };
        this.img.src = window.origin + "/" + src;
    }

    censor(userId) {
        if (this.consored) {
            if (window.blacklist.includes(userId)) {
                window.blacklist = window.blacklist.filter(e => e != userId);
            }
            this.ctx.textAlign = 'start';
            this.restartCanvas();
            this.restore();
            this.consored = false;
        } else {
            if (userId && !window.blacklist.includes(userId)) {
                window.blacklist.push(userId);
            }
            this.ctx.textAlign = 'center';
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'red';
            this.ctx.font = this.canvas.height / 10 + 'px Yanone-Regular';
            this.ctx.fillText('Ну это бан!', this.canvas.width / 2, this.canvas.height / 2);
            this.consored = true;
        }
    }
}
