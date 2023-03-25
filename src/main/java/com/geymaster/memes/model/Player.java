package com.geymaster.memes.model;

import lombok.Getter;
import lombok.Setter;

@Getter
public class Player {
    private final String id;
    private final String name;
    private final String avatarId;
    @Setter
    private int score;
    @Setter
    private boolean leader;

    public Player(String id, String name, String avatarId) {
        this.id = id;
        this.name = name;
        this.avatarId = avatarId;
    }

    public Player(String id, String name, String avatarId, boolean leader) {
        this.id = id;
        this.name = name;
        this.leader = leader;
        this.avatarId = avatarId;
    }
}
