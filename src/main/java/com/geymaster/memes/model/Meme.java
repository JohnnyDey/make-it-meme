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
    private MemeStatus status;


    public Meme() {
        lines = new ArrayList<>();
        grades = new ArrayList<>();
        status = MemeStatus.NEW;
    }

    public MemeDto toDto(){
        MemeDto memeDto = new MemeDto();
        memeDto.setCaps(caps.toArray(new Cap[0]));
        memeDto.setImg(img);
        memeDto.setGrades(grades.toArray(new Integer[0]));
        memeDto.setLines(lines.toArray(new String[0]));
        return memeDto;
    }

    public void submit(List<String> lines){
        this.lines.addAll(lines);
        status = MemeStatus.SUBMITTED;
    }

    public boolean grade(Integer grade, int lobbyCap) {
        grades.add(grade);
        if (grades.size() >= lobbyCap) {
            status = MemeStatus.GRADED;
            return true;
        }
        return false;
    }

    public boolean isSubmitted() {
        return status == MemeStatus.SUBMITTED;
    }

    public boolean isGraded() {
        return status == MemeStatus.GRADED;
    }

    enum MemeStatus{
        NEW,
        SUBMITTED,
        GRADED
    }
}
