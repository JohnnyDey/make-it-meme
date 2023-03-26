package com.geymaster.memes.controller;

import com.geymaster.memes.messages.GradeRequest;
import com.geymaster.memes.messages.LobbyRequest;
import com.geymaster.memes.messages.MemeRequest;
import com.geymaster.memes.model.Lobby;
import com.geymaster.memes.model.Meme;
import com.geymaster.memes.model.Player;
import com.geymaster.memes.storage.LobbyStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.util.Arrays;
import java.util.concurrent.ScheduledFuture;

@Controller
public class GameController {

    @Autowired private SimpMessagingTemplate template;

    @Autowired private LobbyStorage lobbyStorage;

    @Autowired ThreadPoolTaskScheduler scheduler;

    @MessageMapping("/game/{lobbyId}/start")
    public void start(LobbyRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            lobby.init(request.getLobby().getConfig());
            lobby.getPlayers().forEach(p -> template.convertAndSendToUser(p.getId(), "/creation",
                    new LobbyRequest(lobby.toDto())));
            scheduleEndOfTheTurn(lobby);
        });
    }

    private void scheduleEndOfTheTurn(Lobby lobby) {
        ScheduledFuture<?> future = scheduler.schedule(() -> startGrade(lobby),
                Instant.now().plusSeconds(lobby.getConfig().getTimer() + 1));
        lobby.setFuture(future);
    }

    private void startGrade(Lobby lobby){
        lobby.getLastRound().created();
        lobby.getPlayers().forEach(p -> template.convertAndSendToUser(p.getId(), "/grade",
                new MemeRequest(lobby.getMemeToGrade().orElseThrow(), lobby.getId())));
    }

    @MessageMapping("/game/{lobbyId}/submit")
    public void create(MemeRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            Player player = lobby.getPlayerById(principal.getName());
            Meme meme = lobby.getLastRound().getMemes().get(player);
            meme.submit(Arrays.stream(request.getLines()).toList());
            if (lobby.isAllMemesSubmitted()) {
                lobby.getFuture().cancel(true);
                startGrade(lobby);
            }
        });
    }

    @MessageMapping("/game/{lobbyId}/grade")
    public void grade(GradeRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            Meme meme = lobby.getMemeToGrade().orElseThrow();
            Player player = lobby.getPlayerById(principal.getName());
            meme.grade(request.getGrade(), lobby.getPlayers().size(), player);
        });
    }
}
