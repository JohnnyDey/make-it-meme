// Lobby settings Page
class Lobby {
    roundDuration = [ {name: '60 секунд', value: 60},
                   {name: '90 секунд (рекомендуется)', value: 90, selected: true},
                   {name: '120 секунд', value: 120},
                   {name: '150 секунд', value: 150},
                   {name: '180 секунд', value: 180},
                   {name: 'без ограничений', value: 0}];
    roundCount = [ {name: '2', value: 2},
                  {name: '5', value: 5},
                  {name: '7', value: 7, selected: true},
                  {name: '10', value: 10},
                  {name: '12', value: 12},
                  {name: '15', value: 15}];
    playerLimits = [{name: '12 игроков', value: 12},
                  {name: '16 игроков', value: 16},
                  {name: '20 игроков', value: 20},
                  {name: '24 игроков', value: 24}];
    ROUND_DURATION_ID = 'round-duration';
    ROUND_COUNT_ID = 'round-count';
    ONE_PIC_ID = 'one-pic';
    IN_GAME_JOIN = 'in-game-join';

    constructor() {
        this.content = $('body');
    }

    initLobbyPage() {
        this.content.empty();
        const content = createElement('content');
        this.content.append(content);

        const container = createAndAppend('container py-5', content);
        this.listAndSettingsParent = createAndAppend('row row-cols-1 row-cols-lg-12 justify-content-around g-3', container);

        this.initLobbyList(this.listAndSettingsParent);
        this.initLobbySettings(this.listAndSettingsParent);
    }

    initLobbyList(parent) {
        this.lobbyList = createElement('col col-lg-4 lobby-list');
        parent.append(this.lobbyList);

        this.lobbyList.append(createElement(null, 'h1', 'Игроки'));
        this.addPlayer('Лидер лобби');
    }

    createDropDown(options, id, label) {
        const select = createElement('form-control', 'select');
        select.id = id;
        for (const option of options) {
            const opt = createElement(null, 'option', option.name);
            opt.value = option.value;
            select.append(opt);
            if (option.selected) {
                select.value = option.value;
            }
        }
        if (label) {
            let wrapper = createElement('col selecting-settings');
            const labelEl = createElement('form-check-label', 'label', label)
            labelEl.for = id;
            wrapper.append(labelEl);
            wrapper.append(select);
            return wrapper;
        }
        return select;
    }

    initLobbySettings(parent) {
        if (parent.children[1]) {
            parent.removeChild(parent.children[1]);
        }
        let col = createAndAppend('col col-lg-8 gx-lg-5', parent);
        let row = createAndAppend('row row-cols-1 lobby-settings', col);
        if (this.asLeader) {
            row.append(this.createDropDown(this.roundDuration, this.ROUND_DURATION_ID, 'Длительность создания мемов'));
            row.append(this.createDropDown(this.roundCount, this.ROUND_COUNT_ID, 'Количество раундов'));
            row.append(this.createCheckboxSetting('Одна картинка на всех', this.ONE_PIC_ID));
            row.append(this.createCheckboxSetting('Разрешить присоединение во время игры', this.IN_GAME_JOIN, true));

            row = createAndAppend('row row-cols-2', col);

            const startButton = createElement('button col', 'button', 'Начать игру');
            row.append(startButton);
            this.startButton = $(startButton);
            this.startButton.click(function() {
                window.ws.startGame(this.id,
                    $('#' + this.ROUND_DURATION_ID).val(),
                    $('#' + this.ROUND_COUNT_ID).val(),
                    $('#' + this.ONE_PIC_ID).is(':checked'),
                    $('#' + this.IN_GAME_JOIN).is(':checked'));
            }.bind(this));

            const copyCode = createElement('button col', 'button', 'Скопировать код');
            row.append(copyCode);
            this.copyCode = $(copyCode);
            this.copyCode.click(function() {
                navigator.clipboard.writeText(this.id);
            }.bind(this));
        } else {
            col = createAndAppend('col py-2', row);
            col.append(createElement(null, 'div', 'Подождите, пока лидел лобби запустит игру'));
        }
    }

    createCheckboxSetting(label, id, checked){
        let col = createElement('col selecting-settings');
        const container = createElement('form-check');
        const input = createElement('form-check-input', 'input');
        input.type = 'checkbox';
        input.id = id;
        input.checked = checked;
        container.append(input);
        const labelEl = createElement('form-check-label', 'label', label);
        labelEl.for = id;
        container.append(labelEl);
        col.append(container);
        return col;
    }

    addPlayer(player) {
        const playerBlock = createAndAppend('row justify-content-between p-1 player', this.lobbyList);
        const avatarBlock = createAndAppend('col col-auto g-0', playerBlock);
        const avatarImg = createElement('player-avatar', 'img')
        if (player.avatarId) {
            avatarImg.src = 'ava/ava' + player.avatarId + '.png';
            avatarImg.width = 31;
            avatarImg.height = 31;
            avatarBlock.append(avatarImg);
        }
        avatarBlock.append(player.name);

        const actionBlock = createAndAppend('col col-auto d-flex align-content-center flex-wrap g-0', playerBlock);
        this.addAction(player.leader, actionBlock);

         if (this.asLeader) {
            $(actionBlock).click(function() {
                window.ws.kickPlayer(this.id, player.id);
            }.bind(this));
        }
    }

    addAction(isLeader, parent) {
        if(this.asLeader || isLeader) {
            const action = createAndAppend('col material-icons', parent, 'span');
            if (isLeader) {
                action.innerText = 'stars';
            } else {
                action.classList.add("icon-close");
                action.innerText = 'cancel';
            }
        }
    }

    updateState(lobby, asLeader) {
        this.lobby = lobby;
        this.asLeader = asLeader;
        this.id = lobby.id;
        this.initLobbySettings(this.listAndSettingsParent);
        this.clearPlayerList();
        for (const player of lobby.players) {
            this.addPlayer(player);
        }
    }

    clearPlayerList() {
        const nodesToRemove = []
        for (const node of this.lobbyList.children) {
            if (node.classList.contains('player')) {
                nodesToRemove.push(node);
            }
        }
        for (let node of nodesToRemove) {
            this.lobbyList.removeChild(node);
        }
    }

}