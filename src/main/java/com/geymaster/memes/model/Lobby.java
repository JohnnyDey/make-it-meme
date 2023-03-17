package com.geymaster.memes.model;

import com.geymaster.memes.messages.LobbyDto;
import com.geymaster.memes.messages.RoundDto;
import com.geymaster.memes.storage.MemeStorage;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Lobby {
    private final String id;
    private final List<Player> players = new ArrayList<>();
    private final List<Round> rounds = new ArrayList<>();
    private Config config;

    public Lobby(String id) {
        this.id = id;
    }

    public Round getLastRound(){
        return rounds.get(rounds.size() - 1);
    }

    public void init(Config config) {
        this.config = config;
        Round round = new Round();
        round.init(players, MemeStorage.getRandomMeme());
        rounds.add(round);
    }

    public LobbyDto toDto(){
        List<RoundDto> roundDtos = rounds.stream().map(Round::toDto).toList();
        return new LobbyDto(id, players.toArray(new Player[0]), roundDtos.toArray(new RoundDto[0]), config);
    }

    public Player getPlayerById(String id){
        return players.stream().filter(player -> player.getId().equals(id)).findFirst().orElseThrow();
    }

}
