// Lobby settings Page
class Lobby {
    constructor() {
        this.content = $('body');
    }

    initLobbyPage() {
        this.content.empty();
        const content = createElement('content');
        this.content.append(content);

        const container = createAndAppend('container py-5', content);
        let row = createAndAppend('row row-cols-1 row-cols-lg-2 justify-content-around', container);

        this.initLobbyList(row);
        this.initLobbySettings(row);
    }

    initLobbyList(parent) {
        this.lobbyList = createElement('col lobby-list');
        parent.append(this.lobbyList);

        this.lobbyList.append(createElement(null, 'h1', 'Игроки'));
        this.lobbyList.append(this.createDropDown());
        this.addPlayer('Лидер лобби');
    }

    createDropDown() {
        const select = createElement('form-control', 'select');
        select.append(createElement(null, 'option', '12 игроков'));
        select.append(createElement(null, 'option', '16 игроков'));
        select.append(createElement(null, 'option', '20 игроков'));
        select.append(createElement(null, 'option', '24 игроков'));
        return select;
    }

    initLobbySettings(parent) {
        let col = createAndAppend('col', parent);
        let row = createAndAppend('row row-cols-1 lobby-settings', col);
        row.append(this.createCheckboxSetting('Option 1'));
        row.append(this.createCheckboxSetting('Option 2', true));

        row = createAndAppend('row row-cols-2', col);

        const startButton = createElement('button col', 'button', 'Начать игру');
        row.append(startButton);
        this.startButton = $(startButton);
        this.startButton.click(function() {
            window.ws.startGame(this.id);
        }.bind(this));

        const copyCode = createElement('button col', 'button', 'Скопировать код');
        row.append(copyCode);
        this.copyCode = $(copyCode);
        this.copyCode.click(function() {
            navigator.clipboard.writeText(this.id);
        }.bind(this));

    }

    createCheckboxSetting(label, checked){
        let col = createElement('col selecting-settings');
        const container = createElement('checkbox-container');
        const input = createElement('form-check-input', 'input');
        input.type = 'checkbox';
        input.checked = checked;
        container.append(input);
        container.append(createElement('form-check-label', 'label', label));
        return col;
    }

    addPlayer(playerName) {
        const player = createAndAppend('player', this.lobbyList);
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