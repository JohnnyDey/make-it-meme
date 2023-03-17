class WebSocketWrapper {

    constructor() {
        var socket = new SockJS('/mim-websocket');
        this.stompClient = Stomp.over(socket);
        const onConnect = function(frame) {
            const creds = frame.headers['user-name'];
            this.stompClient.subscribe('/user/' + creds + '/lobby', function(resp) {
                window.lobby.updateState(JSON.parse(resp.body).lobby);
            });
            this.stompClient.subscribe('/user/' + creds + '/creation', function(resp) {
                window.creation.updateState(JSON.parse(resp.body).lobby);
            });
            this.stompClient.subscribe('/user/' + creds + '/endturn', function(resp) {
                console.log("Конец хода!")
            });
        }

        this.stompClient.connect({}, onConnect.bind(this));
    }

    createLobby(creatorName) {
        this.stompClient.send('/app/game/lobby/create', {}, JSON.stringify({
            'name': creatorName
        }));
    }

    joinLobby(creatorName, lobbyId) {
        this.stompClient.send('/app/game/lobby/join', {}, JSON.stringify({
            'lobbyId': lobbyId,
            'name': creatorName
        }));
    }

    startGame(lobbyId) {
        this.stompClient.send(`/app/game/${lobbyId}/start`, {}, JSON.stringify({
            'lobbyId': lobbyId,
            'lobby': {
                'config':{
                    'timer': 66
                }
            }
        }));
    }
}