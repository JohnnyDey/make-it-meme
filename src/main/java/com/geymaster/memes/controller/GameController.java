package com.geymaster.memes.controller;

import com.geymaster.memes.controller.scheduler.RoundScheduler;
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
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Arrays;

@Controller
public class GameController {

    @Autowired private LobbyStorage lobbyStorage;
    @Autowired private RoundScheduler scheduler;

    @MessageMapping("/game/{lobbyId}/start")
    public void start(LobbyRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            lobby.init(request.getLobby().getConfig());
            scheduler.startCreation(lobby);
        });
    }

    @MessageMapping("/game/{lobbyId}/submit")
    public void create(MemeRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            Player player = lobby.getPlayerById(principal.getName());
            Meme meme = lobby.getLastRound().getMemes().get(player);
            meme.submit(Arrays.stream(request.getLines()).toList());
            if (lobby.isAllMemesSubmitted()) {
                lobby.getLastRound().created();
                lobby.getFuture().cancel(true);
                scheduler.startGrade(lobby);
            }
        });
    }

    @MessageMapping("/game/{lobbyId}/grade")
    public void grade(GradeRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            Meme meme = lobby.getMemeToGradeUnsafe();
            Player player = lobby.getPlayerById(principal.getName());
            meme.grade(request.getGrade(), player);
        });
    }

    @MessageMapping("/game/{lobbyId}/buddy")
    public void buddy(Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            Meme meme = lobby.getMemeToGradeUnsafe();
            Player player = lobby.getPlayerById(principal.getName());
            Meme playerMeme = lobby.getLastRound().getMemes().get(player);
            if (!playerMeme.equals(meme)) {
                meme.buddy(player);
            }
        });
    }
}
