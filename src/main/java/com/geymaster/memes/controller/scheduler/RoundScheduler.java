package com.geymaster.memes.controller.scheduler;

import com.geymaster.memes.messages.LobbyRequest;
import com.geymaster.memes.messages.MemeRequest;
import com.geymaster.memes.model.Lobby;
import com.geymaster.memes.model.Meme;
import com.geymaster.memes.model.Round;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ScheduledFuture;

@Component
public class RoundScheduler {
    private static final int GRADE_TIME = 15;
    private static final int RESULTS_TIME = 50;

    @Autowired ThreadPoolTaskScheduler scheduler;
    @Autowired private SimpMessagingTemplate template;

    private void scheduleGrade(Lobby lobby, int time) {
        ScheduledFuture<?> future =
                scheduler.schedule(() -> startGrade(lobby), Instant.now().plusSeconds(time + 1));
        lobby.setFuture(future);
    }

    public void startGrade(Lobby lobby) {
        Meme possiblyGradingMeme = lobby.getMemeToGradeUnsafe();
        if (possiblyGradingMeme.isGrading()) {
            possiblyGradingMeme.grade();
        }
        if (!lobby.isAllGradesSubmitted()) {
            Meme memeToGrade = lobby.getMemeToGradeUnsafe();
            memeToGrade.grading();
            lobby.getPlayers()
                    .forEach(
                            p -> {
                                template.convertAndSendToUser(
                                        p.getId(),
                                        "/grade",
                                        new MemeRequest(memeToGrade, lobby.getId(), p.isLeader()));
                            });
            scheduleGrade(lobby, GRADE_TIME);
        } else {
            startResults(lobby);
        }
    }

    private void startResults(Lobby lobby) {
        Round lastRound = lobby.getLastRound();
        lastRound
                .getMemes()
                .forEach(
                        (player, meme) -> {
                            meme.calculatePreliminaryScore();
                        });
        lastRound
                .getMemes()
                .forEach(
                        (player, meme) -> {
                            meme.calculateTotalScore(player, lastRound);
                            player.addScore(meme);
                        });
        lobby.getPlayers()
                .forEach(
                        p ->
                                template.convertAndSendToUser(
                                        p.getId(), "/results", new LobbyRequest(lobby.toDto())));
        lastRound.graded();
        scheduler.schedule(() -> startCreation(lobby), Instant.now().plusSeconds(RESULTS_TIME));
    }

    public void startCreation(Lobby lobby) {
        if (lobby.isLastRoundExist()) {
            lobby.getPlayers()
                    .forEach(
                            p ->
                                    template.convertAndSendToUser(
                                            p.getId(),
                                            "/creation",
                                            new LobbyRequest(lobby.toDto())));
            scheduleGrade(lobby, lobby.getConfig().getTimer());
        }
    }
}
