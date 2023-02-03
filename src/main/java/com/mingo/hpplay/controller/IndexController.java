package com.mingo.hpplay.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * <p></p>
 *
 * @author HuMingAn
 * @version 1.0
 **/
@Controller
public class IndexController {

    @RequestMapping
    public String index () {
        return "index";
    }
}
