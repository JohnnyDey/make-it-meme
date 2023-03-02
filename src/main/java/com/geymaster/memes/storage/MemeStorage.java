package com.geymaster.memes.storage;

import com.geymaster.memes.model.Meme;
import com.google.gson.Gson;
import org.springframework.util.ResourceUtils;

import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;

public class MemeStorage {

    public static Meme getRandomMeme() {
        Gson gson = new Gson();
        int memeNumber = 6;
        String path = String.format("%sstatic/memes/meme%s/config.json", ResourceUtils.CLASSPATH_URL_PREFIX, memeNumber);
        try (Reader reader = Files.newBufferedReader(ResourceUtils.getFile(path).toPath())) {
            return gson.fromJson(reader, Meme.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
