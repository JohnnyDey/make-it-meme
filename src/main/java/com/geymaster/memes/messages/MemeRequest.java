package com.geymaster.memes.messages;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MemeRequest {
    private final List<String> caps = new ArrayList<>();
    private String img;
    private String lobbyId;

}
