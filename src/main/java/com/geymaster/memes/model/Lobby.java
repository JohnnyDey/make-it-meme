package com.geymaster.memes.model;

import com.geymaster.memes.messages.LobbyDto;
import com.geymaster.memes.storage.MemeStorage;
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
    @Setter
    private ScheduledFuture<?> future;
    private final ReentrantLock lock = new ReentrantLock();

    public Lobby(String id) {
        this.id = id;
    }

    public Round getLastRound() {
        return getRound().orElse(new Round());
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
        return getLastRound().getMemes().values().stream().filter(meme -> !meme.isGraded())
                .findFirst();
    }

    public Meme getMemeToGradeUnsafe() {
        return getMemeToGrade().orElseThrow();
    }

    public void init(Config config) {
        this.config = config;
        for (int i = 0; i < config.getRoundCount(); i ++) {
            Round round = new Round();
            if (config.isOneMeme()) {
                round.init(players, MemeStorage.getRandomMeme(ALL));
            } else {
                players.forEach((p) -> round.init(p, MemeStorage.getRandomMeme(ALL)));
            }
            rounds.add(round);
        }
    }

    public LobbyDto toDto() {
        return new LobbyDto(id, players.toArray(new Player[0]), getLastRound().toDto(), config);
    }

    public Player getPlayerById(String id) {
        return getPlayerByIdSafe(id).orElseThrow();
    }

    public boolean hasPlayer(String id){
        return getPlayerByIdSafe(id).isPresent();
    }

    private Optional<Player> getPlayerByIdSafe(String id){
        return players.stream().filter(player -> player.getId().equals(id)).findFirst();
    }

    public void checkLeader(Principal principal) {
        if (!players.get(0).getId().equals(principal.getName())){
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
