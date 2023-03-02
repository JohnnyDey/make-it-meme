package com.geymaster.memes.model;

import com.geymaster.memes.messages.MemeDto;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Meme {
    private final List<String> lines = new ArrayList<>();
    private final List<Cap> caps = new ArrayList<>();
    private final String img;

    public Meme(String img) {
        this.img = img;
    }

    public MemeDto toDto(){
        MemeDto memeDto = new MemeDto();
        memeDto.setCaps(caps.toArray(new Cap[0]));
        memeDto.setImg(img);
        return memeDto;
    }
}
