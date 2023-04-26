package com.geymaster.memes.model;

import com.geymaster.memes.messages.MemeDto;
import com.geymaster.memes.messages.RoundDto;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class Round {
    @Default
    private Map<Player, Meme> memes = new HashMap<>();
    @Default
    private RoundStatus status = RoundStatus.NEW;

    public Player getPlayerMeme(String id) {
        return memes.keySet().stream().filter(p -> p.getName().equals(id)).findFirst().orElse(null);
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
        MemeDto[] memeDtos =
                memes.entrySet().stream()
                        .map((e) -> e.getValue().toDto(e.getKey().getId()))
                        .toList()
                        .toArray(new MemeDto[0]);
        roundDto.setMemes(memeDtos);
        return roundDto;
    }

    enum RoundStatus {
        NEW,
        CREATED,
        GRADED
    }
}
