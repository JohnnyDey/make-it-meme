class Creation {
    constructor() {
        this.content = $('body');
        this.canvas = new Canvas();
    }

    initCreation() {
        this.content.empty();
        const content = createElement('content');
        this.content.append(content);

        this.container = createAndAppend('container py-5', content);
        let row = createAndAppend('row justify-content-end', this.container);
        let col = createAndAppend('col-auto timer', row);
        this.time = $(createAndAppend('time', col));
        if (this.lobby) {
            this.initTimer(this.lobby.config.timer || 0);
        }

        row = createAndAppend('row row-cols-1 row-cols-lg-2 justify-content-around gy-3', this.container);
        this.initContent(row);
    }

    updateState(lobby) {
        this.lobby = lobby;
        this.initCreation();
        this.canvas.updateImage(this.lobby.rounds[0].memes[0].img);
    }

    initContent(parent) {
        let col = createAndAppend('col meme', parent);
        this.canvas.initCanvas(col);

        col = createAndAppend('col make-text', parent);
        if (this.lobby) {
            const memeCaps = this.lobby.rounds[0].memes[0].caps;

            this.caps = [];
            let textCount = memeCaps.length;
            while (textCount > 0) {
                const text = createElement('text', 'textarea');
                text.placeholder = 'Текст ' + (memeCaps.length - textCount + 1);
                text.setAttribute('index', memeCaps.length - textCount);
                col.append(text);
                const cap = $(text);
                this.caps.push(cap);
                cap.bind('input propertychange', function() {
                    this.canvas.restartCanvas();
                    for (let cap of this.caps) {
                        if (cap.val()) {
                            this.canvas.draw(cap.val(), memeCaps[cap.attr('index')]);
                        }
                    }
                }.bind(this));
                textCount--;
            }
            const ready = createElement('start-button', 'button', 'Готово')
            $(ready).click(this.onSubmit.bind(this));
            col.append(ready);
        }
    }

    initTimer(seconds) {
        let time = seconds;
        const intervalFunc = function() {
            const min = this.formatTime(Math.floor(time / 60));
            const sec = this.formatTime(time % 60);
            this.time.text(min + ':' + sec);
            if (time == 0) {
                window.ws.submitMeme(this.lobby.id, this.caps.map(v => v.val()));
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

    onSubmit() {
        window.ws.submitMeme(this.lobby.id, this.caps.map(v => v.val()));
        $(this.container).empty();
        const row = createAndAppend('row py-5', this.container);
        row.innerText = 'Ты создал шедевр! Можешь отдохнуть, поку другие трудятся.';
    }
}