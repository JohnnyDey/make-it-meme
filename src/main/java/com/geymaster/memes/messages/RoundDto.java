package com.geymaster.memes.messages;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoundDto {
    private MemeDto[] memes;
    private boolean completed;
}
