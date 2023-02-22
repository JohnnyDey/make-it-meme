package com.geymaster.memes.model;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class Meme {
    private final List<String> caps = new ArrayList<>();
    private final String img;

    public Meme(String img) {
        this.img = img;
    }
}
