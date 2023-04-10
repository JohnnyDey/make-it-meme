class Timer {

    constructor(parent, onTimerFire) {
        this.fireEvent = onTimerFire
        let row = createAndAppend('row justify-content-end', parent);
        let col = createAndAppend('col-auto timer', row);
        this.time = $(createAndAppend('time', col));
        if (this.lobby) {
            this.initTimer(this.lobby.config.timer || 0);
        }
    }

    initTimer(seconds) {
        let time = seconds;
        const intervalFunc = function() {
            const min = this.formatTime(Math.floor(time / 60));
            const sec = this.formatTime(time % 60);
            this.time.text(min + ':' + sec);
            if (time == 0) {
                if (this.fireEvent) this.fireEvent();
                this.clearInterval()
            }
            time--;
        }.bind(this)
        intervalFunc();
        this.timer = setInterval(intervalFunc, 1000);
    }

    formatTime(val) {
        return val > 9 ? val : '0' + val;
    }

    clearInterval() {
        clearInterval(this.timer);
    }

}