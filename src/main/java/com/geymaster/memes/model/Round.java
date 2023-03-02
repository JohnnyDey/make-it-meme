package com.geymaster.memes.model;

import com.geymaster.memes.messages.MemeDto;
import com.geymaster.memes.messages.RoundDto;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
public class Round {
    private final Map<Player, Meme> memes = new HashMap<>();

    public Player getPlayerMeme(String id) {
        return memes.keySet().stream().filter(p -> p.getName().equals(id)).findFirst().orElse(null);
    }

    public void init(List<Player> players, Meme meme) {
        players.forEach(p -> memes.put(p, meme));
    }

    public boolean isPlayerSubmit(String id) {
        return getPlayerMeme(id) != null;
    }

    public RoundDto toDto() {
        RoundDto roundDto = new RoundDto();
        roundDto.setMemes(memes.values().stream().map(Meme::toDto).toList().toArray(new MemeDto[0]));
        return roundDto;
    }
}
