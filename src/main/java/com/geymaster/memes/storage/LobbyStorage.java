package com.geymaster.memes.storage;

import com.geymaster.memes.model.Lobby;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.WeakHashMap;

@Repository
public class LobbyStorage {
    private final Map<String, Lobby> lobbies = new WeakHashMap<>();

    public Lobby create(boolean twitchRequired) {
        String id = generateId();
        Lobby lobby = new Lobby(id, twitchRequired);
        lobbies.put(id, lobby);
        return lobby;
    }

    public Lobby getLobby(String id) {
        return lobbies.get(id);
    }

    private String generateId() {
        while (true) {
            String randomString = RandomStringUtils.random(5, "ABCDEFHIJKLMNOPQRSTVWXYZ");
            if (lobbies.get(randomString) == null) {
                return randomString;
            }
        }
    }
}
