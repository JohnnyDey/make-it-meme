package com.geymaster.memes.controller;

import com.geymaster.memes.messages.LobbyRequest;
import com.geymaster.memes.messages.MemeRequest;
import com.geymaster.memes.model.Lobby;
import com.geymaster.memes.storage.LobbyStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class GameController {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private LobbyStorage lobbyStorage;

    @MessageMapping("/game/{lobbyId}/start")
    public void start(MemeRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        template.convertAndSendToUser(principal.getName(), "/creation", new LobbyRequest(lobby.toDto()));
    }

    @MessageMapping("/game/{lobbyId}/submit")
    public void create(MemeRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
    }
}
