package com.geymaster.memes.model;

import lombok.Getter;
import lombok.Setter;

@Getter
public class Player {
    private final String id;
    private final String name;
    @Setter
    private int score;

    public Player(String id, String name) {
        this.id = id;
        this.name = name;
    }
}
