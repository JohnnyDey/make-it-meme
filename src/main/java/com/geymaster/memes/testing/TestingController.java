package com.geymaster.memes.testing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class TestingController {

    @GetMapping("/test")
    public ModelAndView testing() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index_testing.html");
        return modelAndView;
    }
}
