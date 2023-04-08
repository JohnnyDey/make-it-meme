package com.geymaster.memes.controller;

import com.geymaster.memes.messages.LobbyRequest;
import com.geymaster.memes.model.Lobby;
import com.geymaster.memes.model.Player;
import com.geymaster.memes.storage.LobbyStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.function.Consumer;

@Controller
public class LobbyController {

    @Autowired private SimpMessagingTemplate template;

    @Autowired private LobbyStorage lobbyStorage;

    @MessageMapping("/game/lobby/create")
    public void create(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.create();
        Player player = new Player(principal.getName(), request.getName(), request.getAvatarId(), true);
        lobby.getPlayers().add(player);
        template.convertAndSendToUser(principal.getName(), "/lobby", new LobbyRequest(lobby.toDto()));
    }

    @MessageMapping("/game/lobby/join")
    public void join(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.getLobby(request.getLobbyId());
        lobby.checkLeader(principal);
        lobby.runInLock(() -> {
            if (lobby.hasPlayer(principal.getName())) {
                throw new IllegalArgumentException("Player Already exists");
            }
            Player player = new Player(principal.getName(), request.getName(), request.getAvatarId());
            lobby.getPlayers().add(player);
            notifyPlayers(lobby);
        });
    }

    @MessageMapping("/game/lobby/kick")
    public void kick(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.getLobby(request.getLobbyId());
        lobby.checkLeader(principal);
        lobby.runInLock(()-> {
            Player player = lobby.getPlayerById(request.getName());
            lobby.getPlayers().remove(player);
            notifyPlayers(lobby);
        });
    }

    private void notifyPlayers(Lobby lobby) {
        Consumer<Player> notify = p -> template.convertAndSendToUser(p.getId(),
                "/lobby", new LobbyRequest(lobby.toDto()));
        lobby.getPlayers().forEach(notify);
    }
}
