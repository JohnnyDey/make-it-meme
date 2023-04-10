package com.geymaster.memes.controller;

import com.geymaster.memes.messages.GradeRequest;
import com.geymaster.memes.messages.LobbyRequest;
import com.geymaster.memes.messages.MemeRequest;
import com.geymaster.memes.model.Lobby;
import com.geymaster.memes.model.Meme;
import com.geymaster.memes.model.Player;
import com.geymaster.memes.model.Round;
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
import java.util.Optional;
import java.util.concurrent.ScheduledFuture;

@Controller
public class GameController {
    private static final int GRADE_TIME = 15;
    private static final int RESULTS_TIME = 50;

    @Autowired private SimpMessagingTemplate template;

    @Autowired private LobbyStorage lobbyStorage;

    @Autowired ThreadPoolTaskScheduler scheduler;

    @MessageMapping("/game/{lobbyId}/start")
    public void start(LobbyRequest request, Principal principal, @DestinationVariable String lobbyId) {
        Lobby lobby = lobbyStorage.getLobby(lobbyId);
        lobby.runInLock(() -> {
            lobby.init(request.getLobby().getConfig());
            startCreation(lobby);
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
                startGrade(lobby);
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
            meme.buddy(player);
        });
    }

    private void scheduleGrade(Lobby lobby, int time) {
        ScheduledFuture<?> future = scheduler.schedule(() -> startGrade(lobby), Instant.now().plusSeconds(time + 1));
        lobby.setFuture(future);
    }

    private void startGrade(Lobby lobby) {
        Meme possiblyGradingMeme = lobby.getMemeToGradeUnsafe();
        if (possiblyGradingMeme.isGrading()) {
            possiblyGradingMeme.grade();
        }
        if (!lobby.isAllGradesSubmitted()) {
            Meme memeToGrade = lobby.getMemeToGradeUnsafe();
            memeToGrade.grading();
            lobby.getPlayers().forEach(p -> template.convertAndSendToUser(p.getId(), "/grade",
                    new MemeRequest(memeToGrade, lobby.getId())));
            scheduleGrade(lobby, GRADE_TIME);
        } else {
            startResults(lobby);
        }
    }

    private void startResults(Lobby lobby){
        Round lastRound = lobby.getLastRound();
        lastRound.getMemes().forEach((player, meme) -> {
            meme.calculatePreliminaryScore();
        });
        lastRound.getMemes().forEach((player, meme) -> {
            meme.calculateTotalScore(player, lastRound);
            player.addScore(meme);
        });
        lobby.getPlayers().forEach(p -> template.convertAndSendToUser(p.getId(), "/results",
                new LobbyRequest(lobby.toDto())));
        lastRound.graded();
        scheduler.schedule(() -> startCreation(lobby), Instant.now().plusSeconds(RESULTS_TIME));
    }

    private void startCreation(Lobby lobby){
        if (lobby.isLastRoundExist()) {
            lobby.getPlayers().forEach(p -> template.convertAndSendToUser(p.getId(), "/creation",
                    new LobbyRequest(lobby.toDto())));
            scheduleGrade(lobby, lobby.getConfig().getTimer());
        }
    }
}
