class Creation {
    constructor() {
        this.content = $('body');
    }

    initCreation() {
        this.content.empty();
        const content = createElement('content');
        this.content.append(content);

        const container = createAndAppend('container py-5', content);
        let row = createAndAppend('row justify-content-end', container);
        let col = createAndAppend('col-auto timer', row);
        this.time = $(createAndAppend('time', col));
        this.initTimer(this.lobby.config.timer || 0);

        row = createAndAppend('row row-cols-1 row-cols-lg-2 justify-content-around gy-3', container);
        this.initContent(row);
    }

    updateState(lobby) {
        this.lobby = lobby;
        this.initCreation();
        this.img = new Image();
        this.img.onload = () => {
            this.ctx.canvas.width = this.img.naturalWidth;
            this.ctx.canvas.height = this.img.naturalHeight;
            this.restartCanvas()
        };

        this.img.src = window.location + this.lobby.rounds[0].memes[0].img;
    }

    initContent(parent) {
        let col = createAndAppend('col meme', parent);
        this.initCanvas(col);

        col = createAndAppend('col make-text', parent);

        let textCount = this.lobby.rounds[0].memes[0].caps.length;
        while (textCount > 0) {
            const text = createElement('text', 'textarea');
            text.placeholder = 'Текст ' + (this.lobby.rounds[0].memes[0].caps.length - textCount + 1);
            col.append(text);
            const cap = $(text);
            cap.bind('input propertychange', function() {
                this.restartCanvas();
                if (cap.val()) {
                    this.draw(cap);
                }
            }.bind(this));
            textCount--;
        }
        col.append(createElement('start-button', 'button', 'Готово'));
    }

    initCanvas(parent) {
        const canvas = createElement('image', 'canvas')
        parent.append(canvas);
        this.canvas = $(canvas)[0];
        this.ctx = this.canvas.getContext("2d");
    }

    initTimer(seconds) {
        let time = seconds;
        const intervalFunc = function() {
            const min = this.formatTime(Math.floor(time / 60));
            const sec = this.formatTime(time % 60);
            this.time.text(min + ':' + sec);
            if (time == 0) {
                clearInterval(this.timer)
            }
            time--;
        }.bind(this)
        intervalFunc();
        this.timer = setInterval(intervalFunc, 1000);
    }

    formatTime(val) {
        return val > 9 ? val : '0' + val;
    }

    //canvas part
    draw(cap) {
        let lines = 2;
        let strings = [];
        let fontSize;
        do {
            lines++;
            fontSize = 150 / lines;
            this.ctx.font = fontSize + "px serif";
            strings = cap.val().split("\n");
            strings = strings.flatMap(v => this.splitByMaxWidth(v, 550));
        } while (lines < strings.length)
        this.fillText(fontSize, strings);
    }

    restartCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
    }

    fillText(fontSize, strings) {
        let y = fontSize;
        for (let i = 0; i < strings.length; i++) {
            this.ctx.fillText(strings[i], 5, y);
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
}