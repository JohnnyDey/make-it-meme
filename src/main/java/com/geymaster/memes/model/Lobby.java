package com.geymaster.memes.model;

import com.geymaster.memes.messages.LobbyDto;
import com.geymaster.memes.messages.RoundDto;
import com.geymaster.memes.storage.MemeStorage;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.locks.ReentrantLock;

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
        return rounds.get(rounds.size() - 1);
    }

    public boolean isAllMemesSubmitted() {
        return getLastRound().getMemes().values().stream().allMatch(Meme::isSubmitted);
    }

    public Optional<Meme> getMemeToGrade() {
        return getLastRound().getMemes().values().stream().filter(meme -> !meme.isGraded())
                .findFirst();
    }

    public void init(Config config) {
        this.config = config;
        Round round = new Round();
        round.init(players, MemeStorage.getRandomMeme());
        rounds.add(round);
    }

    public LobbyDto toDto() {
        List<RoundDto> roundDtos = rounds.stream().map(Round::toDto).toList();
        return new LobbyDto(id, players.toArray(new Player[0]), roundDtos.toArray(new RoundDto[0]), config);
    }

    public Player getPlayerById(String id) {
        return players.stream().filter(player -> player.getId().equals(id)).findFirst().orElseThrow();
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
