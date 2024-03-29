package com.geymaster.memes.messages;

import com.geymaster.memes.model.Cap;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemeDto {
    private String[] lines;
    private Cap[] caps;
    private String img;
    private Integer[] grades;
    private Integer score;
    private String playerId;
    private int plusMeme;
    private int plusBuddy;
    private int plusHasBuddy;
}
