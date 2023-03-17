package com.geymaster.memes.messages;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MemeRequest {
    private String[] caps;
    private String img;
    private String lobbyId;

}
