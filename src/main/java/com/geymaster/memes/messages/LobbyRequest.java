package com.geymaster.memes.messages;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LobbyRequest {
    private String lobbyId;
    private LobbyDto lobby;
    private String name;
    private String avatarId;

    public LobbyRequest(LobbyDto lobby) {
        this.lobby = lobby;
    }
}
