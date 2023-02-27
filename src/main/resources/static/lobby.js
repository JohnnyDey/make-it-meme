// Lobby settings Page
class Lobby {
    constructor() {
        this.content = $('body');
    }

    initLobbyPage() {
        this.content.empty();
        const background = createElement('background');
        this.content.append(background);

        const parent = createElement('lobby');
        background.append(parent);

        this.initLobbyList(parent);
        this.initLobbySettings(parent);
    }

    initLobbyList(parent) {
        this.lobbyList = createElement('lobby-list');
        parent.append(this.lobbyList);

        this.lobbyList.append(createElement(null, 'h1', 'Игроки'));
        this.lobbyList.append(this.createDropDown());
        this.addPlayer('Лидер лобби');
    }

    createDropDown() {
        const selectWrapper = createElement('select');
        const select = createElement('dropdown', 'select');
        select.append(createElement(null, 'option', '12 игроков'));
        select.append(createElement(null, 'option', '16 игроков'));
        select.append(createElement(null, 'option', '20 игроков'));
        select.append(createElement(null, 'option', '24 игроков'));
        selectWrapper.append(select)
        return selectWrapper;
    }

    initLobbySettings(parent) {
        const settingsParent = createElement('lobby-settings-wrapper');
        parent.append(settingsParent);

        const settings = createElement('lobby-settings');
        settingsParent.append(settings);

        settings.append(this.createCheckboxSetting('Option 1'));
        settings.append(this.createCheckboxSetting('Option 2', true));

        const parentButton = createElement('buttons-wrapper');
        settingsParent.append(parentButton);

        const startButton = createElement('button', 'button', 'Начать игру');
        parentButton.append(startButton);
        this.startButton = $(startButton);
        this.startButton.click(function() {
            window.ws.startGame(this.id);
        }.bind(this));

        const copyCode = createElement('button', 'button', 'Скопировать код');
        parentButton.append(copyCode);
        this.copyCode = $(copyCode);
        this.copyCode.click(function() {
            navigator.clipboard.writeText(this.id);
        }.bind(this));

    }

    createCheckboxSetting(label, checked){
        const settings = createElement('selecting-settings');
        settings.append(this.createCheckbox(checked));
        settings.append(createElement(null, null, label));
        return settings;
    }

    createCheckbox(checked) {
        const checkbox = createElement('container', 'label');
        const check = createElement(null, 'input');
        check.type = 'checkbox';
        check.checked = checked;
        checkbox.append(check);
        checkbox.append(createElement('checkmark', 'span'));
        return checkbox;
    }

    addPlayer(playerName) {
        const player = createElement(['player', 'lobby-list-vip']);
        this.lobbyList.append(player);
        player.append(createElement('player-avatar'));
        player.append(playerName);
    }

    updateState(lobby) {
        this.id = lobby.id;
        this.clearPlayerList();
        for (const player of lobby.players) {
            this.addPlayer(player.name);
        }
    }

    clearPlayerList() {
        for (const node of this.lobbyList.children) {
            if (node.classList.contains('player')) {
                this.lobbyList.removeChild(node);
            }
        }
    }

}