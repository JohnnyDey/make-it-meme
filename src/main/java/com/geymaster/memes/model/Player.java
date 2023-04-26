package com.geymaster.memes.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class Player {
    private final String id;
    private final String name;
    private final String avatarId;
    private final String twitchId;
    private int score = 0;
    @Setter private boolean leader;

    public void addScore(Meme meme) {
        score += meme.getScore();
    }

    public static PlayerBuilder builder() {
        return new PlayerBuilder();
    }
}
