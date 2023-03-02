package com.geymaster.memes.messages;

import com.geymaster.memes.model.Config;
import com.geymaster.memes.model.Player;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class LobbyDto {
    private String id;
    private Player[] players;
    private RoundDto[] rounds;
    private Config config;

    public LobbyDto(String id, Player[] players, RoundDto[] rounds, Config config) {
        this.id = id;
        this.players = players;
        this.rounds = rounds;
        this.config = config;
    }
}
