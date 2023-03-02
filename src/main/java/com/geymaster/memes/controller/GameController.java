package com.geymaster.memes.controller;

import com.geymaster.memes.messages.LobbyRequest;
import com.geymaster.memes.messages.MemeRequest;
import com.geymaster.memes.model.Lobby;
import com.geymaster.memes.storage.LobbyStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;

@Controller
public class GameController {

    @Autowired private SimpMessagingTemplate template;

    @Autowired private LobbyStorage lobbyStorage;

    @Autowired ThreadPoolTaskScheduler scheduler;

    @MessageMapping("/game/{lobbyId}/start")
    public void start(LobbyRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.init(request.getLobby().getConfig());
        notifyPlayers(lobby, "/creation");
        scheduler.schedule(() -> notifyPlayers(lobby, "/endturn"),
                Instant.now().plusSeconds(lobby.getConfig().getTimer() + 1));
    }

    private void notifyPlayers(Lobby lobby, String destination){
        lobby.getPlayers().forEach(p -> template.convertAndSendToUser(p.getId(), destination,
                new LobbyRequest(lobby.toDto())));
    }

    @MessageMapping("/game/{lobbyId}/submit")
    public void create(MemeRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
    }
}
