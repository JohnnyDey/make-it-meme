class WebSocketWrapper {

    constructor() {
        var socket = new SockJS('/mim-websocket');
        this.stompClient = Stomp.over(socket);
        const onConnect = function(frame) {
            const creds = frame.headers['user-name'];
            this.stompClient.subscribe('/user/' + creds + '/lobby', function(resp) {
                const lobby = JSON.parse(resp.body).lobby;
                window.lobby.updateState(lobby, lobby.leaderId == creds);
            });
            this.stompClient.subscribe('/user/' + creds + '/creation', function(resp) {
                window.creation.updateState(JSON.parse(resp.body).lobby, creds);
            });
            this.stompClient.subscribe('/user/' + creds + '/grade', function(resp) {
                window.grade.initGradePage(JSON.parse(resp.body), creds);
            });
            this.stompClient.subscribe('/user/' + creds + '/results', function(resp) {
                const lobby = JSON.parse(resp.body).lobby;
                window.results.initResults(lobby, lobby.leaderId == creds);
            });
        }

        this.stompClient.connect({}, onConnect.bind(this));
    }

    createLobby(creatorName, avaId) {
        this.stompClient.send('/app/game/lobby/create', {}, JSON.stringify({
            'name': creatorName,
            'avatarId': avaId
        }));
    }

    joinLobby(creatorName, lobbyId, avaId) {
        this.stompClient.send('/app/game/lobby/join', {}, JSON.stringify({
            'lobbyId': lobbyId,
            'name': creatorName,
            'avatarId': avaId
        }));
    }

    startGame(lobbyId, timer, roundCount, oneMeme, inGameJoin) {
        this.stompClient.send(`/app/game/${lobbyId}/start`, {}, JSON.stringify({
            'lobbyId': lobbyId,
            'lobby': {
                'config':{
                    'timer': timer,
                    'roundCount': roundCount,
                    'oneMeme': oneMeme,
                    'inGameJoin': inGameJoin
                }
            }
        }));
    }

    submitMeme(lobbyId, caps) {
        this.stompClient.send(`/app/game/${lobbyId}/submit`, {}, JSON.stringify({
            'lobbyId': lobbyId,
            'lines': caps
        }));
    }

    gradeMeme(lobbyId, grade) {
        this.stompClient.send(`/app/game/${lobbyId}/grade`, {}, JSON.stringify({
            'grade': grade,
        }));
    }

    kickPlayer(lobbyId, playerId){
         this.stompClient.send('/app/game/lobby/kick', {}, JSON.stringify({
            'lobbyId': lobbyId,
            'name': playerId,
         }));
    }

    buddyMeme(lobbyId){
         this.stompClient.send(`/app/game/${lobbyId}/buddy`);
    }
}