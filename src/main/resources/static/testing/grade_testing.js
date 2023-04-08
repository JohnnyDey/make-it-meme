class GradeTesting extends Grade {

    onGrade(score) {
        window.fakeLobby.round.memes[0].lines = [];
        window.creation.initCreation();
        window.creation.updateState(window.fakeLobby);
    }
}