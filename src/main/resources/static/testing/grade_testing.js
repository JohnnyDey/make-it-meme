class GradeTesting extends Grade {

    onGrade(score) {
        window.fakeLobby.rounds[0].memes[0].lines = [];
        window.creation.initCreation();
        window.creation.updateState(window.fakeLobby);
    }
}