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
import java.util.List;

@Controller
public class LobbyController {

    @Autowired private SimpMessagingTemplate template;

    @Autowired private LobbyStorage lobbyStorage;

    @MessageMapping("/game/lobby/create")
    public void create(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.create();
        lobby.getPlayers().add(new Player(principal.getName(), request.getName()));
        template.convertAndSendToUser(principal.getName(), "/lobby", new LobbyRequest(lobby.toDto()));
    }

    @MessageMapping("/game/lobby/join")
    public void join(LobbyRequest request, Principal principal) {
        Lobby lobby = lobbyStorage.getLobby(request.getLobbyId());
        lobby.runInLock(() -> {
            List<Player> players = lobby.getPlayers();
            if (players.stream().anyMatch(p -> p.getId().equals(principal.getName()))) {
                throw new IllegalArgumentException("Player Already exists");
            }
            players.add(new Player(principal.getName(), request.getName()));
            players.forEach(p -> template.convertAndSendToUser(p.getId(), "/lobby", new LobbyRequest(lobby.toDto())));
        });
    }
}
