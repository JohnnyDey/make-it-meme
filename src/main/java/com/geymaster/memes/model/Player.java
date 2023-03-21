package com.geymaster.memes.model;

import lombok.Getter;
import lombok.Setter;

@Getter
public class Player {
    private final String id;
    private final String name;
    @Setter
    private int score;
    @Setter
    private boolean leader;

    public Player(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public Player(String id, String name, boolean leader) {
        this.id = id;
        this.name = name;
        this.leader = leader;
    }
}
