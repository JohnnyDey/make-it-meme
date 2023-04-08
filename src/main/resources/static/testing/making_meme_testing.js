class CreationTest extends Creation {
    onSubmit() {
        this.lobby.round.memes[0].lines = this.caps.map(v => v.val());
        window.grade.initGradePage(this.lobby.round.memes[0]);
    }

    initTimer() {
    }
}