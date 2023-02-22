// Lobby settings Page
class Lobby {
    constructor() {
        this.content = $('body');
    }

    initLobbyPage() {
        this.content.empty();
        const background = createElement('background');
        this.content.append(background);

        const parent = createElement('parent-lobby');
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
        return createElement('dropdown');
    }

    initLobbySettings(parent) {
        const settingsParent = createElement('lobby-settings-parent');
        parent.append(settingsParent);

        const settings = createElement('lobby-settings');
        settingsParent.append(settings);

        const parentButton = createElement('parent-button');
        settingsParent.append(parentButton);

        const startButton = createElement('button-start', 'button', 'Начать игру');
        parentButton.append(startButton);
        this.startButton = $(startButton);
        this.startButton.click(function() {
            window.ws.startGame(this.id);
        }.bind(this));

        const copyCode = createElement('button-start', 'button', 'Скопировать код');
        parentButton.append(copyCode);
        this.copyCode = $(copyCode);
        this.copyCode.click(function() {
            navigator.clipboard.writeText(this.id);
        }.bind(this));

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