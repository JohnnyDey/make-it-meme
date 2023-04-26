package com.geymaster.memes.messages;

import com.geymaster.memes.model.Cap;
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
    private String[] lines;
    private Cap[] caps;
    private String img;
    private String lobbyId;
    private String ownerId;
    private boolean asLeader;

    public MemeRequest(Meme meme, String lobbyId, boolean asLeader) {
        this.img = meme.getImg();
        this.caps = meme.getCaps().toArray(new Cap[0]);
        this.lines = meme.getLines().toArray(new String[0]);
        this.lobbyId = lobbyId;
        this.ownerId = meme.getOwner().getId();
        this.asLeader = asLeader;
    }
}
