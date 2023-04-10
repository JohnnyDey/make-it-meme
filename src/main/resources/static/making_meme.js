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
        this.timer = new Timer(this.container, () => {window.ws.submitMeme(this.lobby.id, this.caps.map(v => v.val()))});
        if (this.lobby) {
            this.timer.initTimer(this.lobby.config.timer || 0);
        }

        const row = createAndAppend('row row-cols-1 row-cols-lg-2 justify-content-around gy-3', this.container);
        this.initContent(row);
    }

    updateState(lobby, id) {
        this.id = id;
        this.lobby = lobby;
        this.initCreation();
        this.canvas.updateImage(this.getMeme().img);
    }

    initContent(parent) {
        let col = createAndAppend('col meme', parent);
        this.canvas.initCanvas(col);

        col = createAndAppend('col make-text', parent);
        if (this.lobby) {
            const memeCaps = this.getMeme().caps;

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
                    cap.height(0);
                    cap.height(cap[0].scrollHeight);
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

    onSubmit() {
        this.timer.clearInterval();
        window.ws.submitMeme(this.lobby.id, this.caps.map(v => v.val()));
        $(this.container).empty();
        const row = createAndAppend('row py-5', this.container);
        row.innerText = 'Ты создал шедевр! Можешь отдохнуть, поку другие трудятся.';
    }

    getMeme() {
        return this.lobby.round.memes.find(m => m.playerId == this.id);
    }
}