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
    private RoundStatus status;

    public Player getPlayerMeme(String id) {
        return memes.keySet().stream().filter(p -> p.getName().equals(id)).findFirst().orElse(null);
    }

    public void init(List<Player> players, Meme meme) {
        status = RoundStatus.NEW;
        players.forEach(p -> {
            Meme memeClone = meme.clone();
            memeClone.setOwner(p);
            memes.put(p, memeClone);
        });
    }

    public void init(Player player, Meme meme) {
        status = RoundStatus.NEW;
        meme.setOwner(player);
        memes.put(player, meme.clone());
    }

    public void created() {
        status = RoundStatus.CREATED;
    }

    public void graded() {
        status = RoundStatus.GRADED;
    }

    public boolean isPlayerSubmit(String id) {
        return getPlayerMeme(id) != null;
    }

    public RoundDto toDto() {
        RoundDto roundDto = new RoundDto();
        MemeDto[] memeDtos = memes.entrySet().stream()
                .map((e) -> e.getValue().toDto(e.getKey().getId())).toList().toArray(new MemeDto[0]);
        roundDto.setMemes(memeDtos);
        return roundDto;
    }
    enum RoundStatus {
        NEW,
        CREATED,
        GRADED
    }
}
