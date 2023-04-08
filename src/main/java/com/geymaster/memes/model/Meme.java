package com.geymaster.memes.model;

import com.geymaster.memes.messages.MemeDto;
import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Getter
public class Meme implements Cloneable {
    private final List<String> lines;
    private final List<Cap> caps = new ArrayList<>();
    private String img;
    private final Map<Player, Integer> grades;
    private MemeStatus status;
    private Integer score = 0;

    public Meme() {
        lines = new ArrayList<>();
        grades = new HashMap<>();
        status = MemeStatus.NEW;
    }

    public MemeDto toDto(String playerId){
        MemeDto memeDto = new MemeDto();
        memeDto.setCaps(caps.toArray(new Cap[0]));
        memeDto.setImg(img);
        memeDto.setLines(lines.toArray(new String[0]));
        memeDto.setPlayerId(playerId);
        memeDto.setScore(this.score);
        return memeDto;
    }

    public void submit(List<String> lines){
        this.lines.addAll(lines);
        status = MemeStatus.SUBMITTED;
    }

    public void grade(Integer grade, Player player) {
        grades.put(player, grade);
    }

    public void calculateScore() {
        AtomicInteger result = new AtomicInteger();
        grades.values().stream().filter(g -> g == 1).forEach(g -> result.addAndGet(100));
        grades.values().stream().filter(g -> g == -1).forEach(g -> result.addAndGet(-100));
        score = result.get();
    }

    public void grading() {
        status = MemeStatus.GRADING;
    }

    public void grade() {
        status = MemeStatus.GRADED;
    }

    public boolean isSubmitted() {
        return status == MemeStatus.SUBMITTED;
    }

    public boolean isGrading() {
        return status == MemeStatus.GRADING;
    }

    public boolean isGraded() {
        return status == MemeStatus.GRADED;
    }

    @Override
    public Meme clone() {
        try {
            return (Meme) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    enum MemeStatus{
        NEW,
        SUBMITTED,
        GRADING,
        GRADED
    }
}
