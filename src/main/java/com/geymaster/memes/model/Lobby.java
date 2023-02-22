package com.geymaster.memes.model;

import com.geymaster.memes.messages.LobbyDto;
import com.geymaster.memes.messages.RoundDto;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Lobby {
    private final String id;
    private final List<Player> players = new ArrayList<>();
    private final List<Round> rounds = new ArrayList<>();

    public Lobby(String id) {
        this.id = id;
    }

    public Round getLastRound(){
        return rounds.get(rounds.size() - 1);
    }

    public LobbyDto toDto(){
        List<RoundDto> roundDtos = rounds.stream().map(Round::toDto).toList();
        return new LobbyDto(id, players.toArray(new Player[0]), roundDtos.toArray(new RoundDto[0]));
    }

}
