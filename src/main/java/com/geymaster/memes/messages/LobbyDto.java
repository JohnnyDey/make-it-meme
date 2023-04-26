package com.geymaster.memes.messages;

import com.geymaster.memes.model.Config;
import com.geymaster.memes.model.Player;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;

@Setter
@Getter
@NoArgsConstructor

public class LobbyDto {
    private String id;
    private String leaderId;
    private Player[] players;
    private RoundDto round;
    private Config config;

    public LobbyDto(String id, Player[] players, RoundDto round, Config config) {
        this.id = id;
        this.players = players;
        this.round = round;
        this.config = config;
        Arrays.stream(players)
                .filter(Player::isLeader)
                .findFirst()
                .ifPresent(p -> leaderId = p.getId());
    }
}
