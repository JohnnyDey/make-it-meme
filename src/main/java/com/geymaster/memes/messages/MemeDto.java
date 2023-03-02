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
}
