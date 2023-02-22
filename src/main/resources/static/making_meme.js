class Creation {
    constructor() {
        this.content = $('body');
    }

    initCreation() {
        this.content.empty();
        const background = createElement('background');
        this.content.append(background);

        const timer = createElement('timer');
        background.append(timer);
        const timerItems = createElement('timer_items');
        timer.append(timerItems);
        const minutes = createElement('timer_item');
        timerItems.append(minutes);
        this.minutes = $(minutes);
        const seconds = createElement('timer_item');
        timerItems.append(seconds);
        this.seconds = $(seconds);
        this.initTimer(90);

        const content = createElement('content');
        background.append(content);
        this.initContent(content);
    }

    updateState() {
        this.initCreation();
    }

    initContent(parent) {
        const content = createElement('meme');
        parent.append(content);

        const textArea = createElement('make-text');
        parent.append(textArea);
        textArea.append(createElement('parent-text'));
        textArea.append(createElement('start-button', 'button', 'Готово'));
    }

    initTimer(seconds) {
        let time = seconds;
        const intervalFunc = function() {
            this.minutes.text(Math.floor(time / 60));
            this.seconds.text(time % 60);
            time--;
        }.bind(this)
        this.timer = setInterval(intervalFunc, 1000);
    }

}