package com.geymaster.memes.messages;

import com.geymaster.memes.model.Meme;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MemeRequest {
    private String[] caps;
    private String img;
    private String lobbyId;

    public MemeRequest(Meme meme) {
        img = meme.getImg();
        caps = meme.getLines().toArray(new String[0]);
    }

}
