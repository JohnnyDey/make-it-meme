class GradeTesting extends Grade {

    onGrade() {
        window.fakeLobby.rounds[0].memes[0].lines = [];
        window.creation.initCreation();
        window.creation.updateState(window.fakeLobby);
    }
}