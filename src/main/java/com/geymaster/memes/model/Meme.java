package com.geymaster.memes.model;

import com.geymaster.memes.messages.MemeDto;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Meme {
    private final List<String> lines;
    private final List<Cap> caps = new ArrayList<>();
    private String img;
    private final List<Integer> grades;


    public Meme() {
        lines = new ArrayList<>();
        grades = new ArrayList<>();
    }

    public MemeDto toDto(){
        MemeDto memeDto = new MemeDto();
        memeDto.setCaps(caps.toArray(new Cap[0]));
        memeDto.setImg(img);
        memeDto.setGrades(grades.toArray(new Integer[0]));
        memeDto.setLines(lines.toArray(new String[0]));
        return memeDto;
    }
}
