package com.geymaster.memes.model;

import com.geymaster.memes.messages.MemeDto;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Getter
public class Meme implements Cloneable {
    private final List<String> lines;
    private final List<Cap> caps = new ArrayList<>();
    private final List<Player> buddies;
    private final Map<Player, Integer> grades;
    private String img;
    private MemeStatus status;
    private Integer score = 0;
    private int plusMeme;
    private int plusBuddy;
    private int plusHasBuddy;

    @Setter
    private Player owner;

    public Meme() {
        lines = new ArrayList<>();
        grades = new HashMap<>();
        buddies = new ArrayList<>();
        status = MemeStatus.NEW;
    }

    public MemeDto toDto(String playerId){
        MemeDto memeDto = new MemeDto();
        memeDto.setCaps(caps.toArray(new Cap[0]));
        memeDto.setImg(img);
        memeDto.setLines(lines.toArray(new String[0]));
        memeDto.setPlayerId(playerId);
        memeDto.setScore(this.score);
        memeDto.setPlusMeme(this.plusMeme);
        memeDto.setPlusBuddy(this.plusBuddy);
        memeDto.setPlusHasBuddy(this.plusHasBuddy);
        return memeDto;
    }

    public void submit(List<String> lines){
        this.lines.addAll(lines);
        status = MemeStatus.SUBMITTED;
    }

    public void grade(Integer grade, Player player) {
        grades.put(player, grade);
    }

    public void buddy(Player player){
        buddies.add(player);
    }

    public void calculateTotalScore(Player player, Round round) {
        calculateBuddyScore(player, round);
        score += plusBuddy;
        calculateHasBuddy();
        score += plusHasBuddy;
    }

    public void calculatePreliminaryScore() {
        AtomicInteger result = new AtomicInteger();
        grades.values().stream().filter(g -> g == 1).forEach(g -> result.addAndGet(100));
        grades.values().stream().filter(g -> g == -1).forEach(g -> result.addAndGet(-100));
        plusMeme = result.get();
        score += plusMeme;
    }

    private void calculateBuddyScore(Player player, Round round) {
        round.getMemes().values().stream().filter(m -> m.getBuddies().contains(player)).findFirst()
                .ifPresent((m) -> this.plusBuddy = m.getPlusMeme() / 2);
    }

    private void calculateHasBuddy() {
        plusHasBuddy = buddies.size() * 10;
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
