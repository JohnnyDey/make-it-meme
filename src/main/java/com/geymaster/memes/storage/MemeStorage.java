package com.geymaster.memes.storage;

import com.geymaster.memes.model.Meme;
import com.google.gson.Gson;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.concurrent.ThreadLocalRandom;

public class MemeStorage {

    public static Meme getRandomMeme(MemeCategory... categories) {
        MemeCategory category = getRandomCategory(categories);
        int memeNumber = getRandomMeme(category);
        String pathString = String.format("static/memes/meme%s/config.json", memeNumber);
        try (Reader reader =
                new InputStreamReader(new ClassPathResource(pathString).getInputStream())) {
            return new Gson().fromJson(reader, Meme.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static MemeCategory getRandomCategory(MemeCategory... categories) {
        if (categories.length > 1) {
            int i = ThreadLocalRandom.current().nextInt(0, categories.length);
            return categories[i];
        }
        return categories[0];
    }

    private static int getRandomMeme(MemeCategory categorie) {
        return ThreadLocalRandom.current().nextInt(categorie.start, categorie.end);
    }

    public enum MemeCategory {
        CARTOON(100, 200),
        ALL(100, 200);

        final int start;
        final int end;

        MemeCategory(int start, int end) {
            this.start = start;
            this.end = end;
        }
    }
}
