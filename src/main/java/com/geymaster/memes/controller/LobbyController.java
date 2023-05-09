package com.geymaster.memes.controller;

import com.geymaster.memes.controller.integration.TwitchAuth;
import com.geymaster.memes.messages.LobbyRequest;
import com.geymaster.memes.model.Lobby;
import com.geymaster.memes.model.Player;
import com.geymaster.memes.storage.LobbyStorage;
import java.security.Principal;
import java.util.function.Consumer;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class LobbyController {

    @Autowired private SimpMessagingTemplate template;

    @Autowired private LobbyStorage lobbyStorage;

    @MessageMapping("/game/lobby/create")
    public void create(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.create(request.isTwitchRequired());
        Player.PlayerBuilder player =
                Player.builder()
                        .id(principal.getName())
                        .name(request.getName())
                        .avatarId(request.getAvatarId())
                        .leader(true);
        if (request.isTwitchRequired()) {
            Pair<String, String> idAndName = TwitchAuth.getUserId(request.getTwitchToken());
            player.name(idAndName.getRight()).twitchId(idAndName.getLeft());

        }

        lobby.getPlayers().add(player.build());
        template.convertAndSendToUser(
                principal.getName(), "/lobby", new LobbyRequest(lobby.toDto()));
    }

    @MessageMapping("/game/lobby/join")
    public void join(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.getLobby(request.getLobbyId());
        Player.PlayerBuilder player =
                Player.builder()
                        .id(principal.getName())
                        .name(request.getName())
                        .avatarId(request.getAvatarId());
        if (lobby.isTwitchRequired()) {
            if (request.getTwitchToken() == null) {
                throw new IllegalArgumentException("Это лобби требует авторизации через Twitch.");
            } else {
                Pair<String, String> idAndName = TwitchAuth.getUserId(request.getTwitchToken());
                player.name(idAndName.getRight()).twitchId(idAndName.getLeft());
            }
        }

        lobby.runInLock(
                () -> {
                    if (lobby.hasPlayer(principal.getName())) {
                        throw new IllegalArgumentException("Вы уже подключены.");
                    }
                    lobby.getPlayers().add(player.build());
                    notifyPlayers(lobby);
                });
    }

    @MessageMapping("/game/lobby/kick")
    public void kick(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.getLobby(request.getLobbyId());
        lobby.checkLeader(principal);
        lobby.runInLock(
                () -> {
                    Player player = lobby.getPlayerById(request.getName());
                    lobby.getPlayers().remove(player);
                    notifyPlayers(lobby);
                    template.convertAndSendToUser(
                            player.getId(), "/lobby", new LobbyRequest("Вы были исключены лидером лобби."));
                });
    }

    private void notifyPlayers(Lobby lobby) {
        Consumer<Player> notify =
                p ->
                        template.convertAndSendToUser(
                                p.getId(), "/lobby", new LobbyRequest(lobby.toDto()));
        lobby.getPlayers().forEach(notify);
    }

    @MessageExceptionHandler
    public void test(Exception e, Principal principal) {
        template.convertAndSendToUser(
                principal.getName(), "/lobby", new LobbyRequest(e.getMessage()));
    }
}
