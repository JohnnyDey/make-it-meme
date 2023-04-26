package com.geymaster.memes.model;

import com.geymaster.memes.messages.LobbyDto;
import com.geymaster.memes.model.Round.RoundBuilder;
import com.geymaster.memes.storage.MemeStorage;
import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.locks.ReentrantLock;

import static com.geymaster.memes.storage.MemeStorage.MemeCategory.ALL;

@Getter
public class Lobby {
    private final String id;
    private final List<Player> players = new ArrayList<>();
    private final List<Round> rounds = new ArrayList<>();
    private Config config;
    private final boolean twitchRequired;
    private final ReentrantLock lock = new ReentrantLock();
    @Setter private ScheduledFuture<?> future;

    public Lobby(String id, boolean twitchRequired) {
        this.id = id;
        this.twitchRequired = twitchRequired;
    }

    public Round getLastRound() {
        return getRound().orElse(Round.builder().build());
    }

    public boolean isLastRoundExist() {
        return getRound().isPresent();
    }

    private Optional<Round> getRound() {
        return rounds.stream().filter(r -> r.getStatus() != Round.RoundStatus.GRADED).findFirst();
    }

    public boolean isAllMemesSubmitted() {
        return getLastRound().getMemes().values().stream().allMatch(Meme::isSubmitted);
    }

    public boolean isAllGradesSubmitted() {
        return getLastRound().getMemes().values().stream().allMatch(Meme::isGraded);
    }

    public Optional<Meme> getMemeToGrade() {
        return getLastRound().getMemes().values().stream()
                .filter(meme -> !meme.isGraded())
                .findFirst();
    }

    public Meme getMemeToGradeUnsafe() {
        return getMemeToGrade().orElseThrow();
    }

    public void init(Config config) {
        this.config = config;
        for (int i = 0; i < config.getRoundCount(); i++) {
            RoundBuilder round = Round.builder();
            Map<Player, Meme> memes = new HashMap<>();
            if (config.isOneMeme()) {
                Meme meme = MemeStorage.getRandomMeme(ALL).clone();
                players.forEach(
                        p -> {
                            meme.setOwner(p);
                            memes.put(p, meme);
                        });
            } else {
                players.forEach((p) -> {
                    Meme meme = MemeStorage.getRandomMeme(ALL).clone();
                    meme.setOwner(p);
                    memes.put(p, meme);
                });
            }
            round.memes(memes);
            rounds.add(round.build());
        }
    }

    public LobbyDto toDto() {
        return new LobbyDto(id, players.toArray(new Player[0]), getLastRound().toDto(), config);
    }

    public Player getPlayerById(String id) {
        return getPlayerByIdSafe(id).orElseThrow();
    }

    public boolean hasPlayer(String id) {
        return getPlayerByIdSafe(id).isPresent();
    }

    private Optional<Player> getPlayerByIdSafe(String id) {
        return players.stream().filter(player -> player.getId().equals(id)).findFirst();
    }

    public void checkLeader(Principal principal) {
        if (!players.get(0).getId().equals(principal.getName())) {
            throw new IllegalArgumentException("Запрос сделан не лидером");
        }
    }

    public void runInLock(Runnable runnable) {
        lock.lock();
        try {
            runnable.run();
        } finally {
            lock.unlock();
        }
    }
}
