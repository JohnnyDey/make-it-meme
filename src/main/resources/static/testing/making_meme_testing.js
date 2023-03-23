class CreationTest extends Creation {
    onSubmit() {
        this.lobby.rounds[0].memes[0].lines = this.caps.map(v => v.val());
        window.grade.initGradePage(this.lobby.rounds[0].memes[0]);
    }

    initTimer() {
    }
}