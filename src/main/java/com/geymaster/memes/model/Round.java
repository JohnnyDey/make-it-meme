package com.geymaster.memes.model;

import com.geymaster.memes.messages.RoundDto;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class Round {
    private final Map<Player, Meme> memes = new HashMap<>();

    public Player getPlayerMeme(String id) {
        return memes.keySet().stream().filter(p -> p.getName().equals(id)).findFirst().orElse(null);
    }

    public boolean isPlayerSubmit(String id) {
        return getPlayerMeme(id) != null;
    }

    public RoundDto toDto() {
        return new RoundDto();
    }
}
