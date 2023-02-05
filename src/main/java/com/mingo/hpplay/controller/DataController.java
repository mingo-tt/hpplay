package com.mingo.hpplay.controller;

import com.mingo.hpplay.ChatMessageRepository;
import com.mingo.hpplay.object.dto.User;
import com.mingo.hpplay.object.entity.ChatMessage;
import com.mingo.hpplay.object.vo.ChatMessageVO;
import com.mingo.hpplay.util.CommonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class DataController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @PostMapping("/login/info")
    public String login (User user, HttpServletResponse response) {
        boolean rightPassword = CommonUtil.rightPassword(user.getName(), user.getPassword());
        if (rightPassword) {
            Cookie cookie = new Cookie(user.getName(), user.getPassword());
            cookie.setMaxAge(24 * 60 * 60 * 30);
            cookie.setPath("/");
            response.addCookie(cookie);
            return "success";
        }else {
            return "fail";
        }
    }

    @GetMapping("/message/list")
    public List<ChatMessageVO> messageList() {
        List<ChatMessage> messageList = chatMessageRepository.findAll(Sort.by(Sort.Direction.ASC, "messageId"));
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return messageList.stream().map(message -> {
            ChatMessageVO messageVO = new ChatMessageVO();
            messageVO.setMessageId(message.getMessageId());
            messageVO.setUserName(message.getUserName());
            messageVO.setContent(message.getContent());
            messageVO.setCreateTime(dateFormat.format(message.getCreateTime()));
            return messageVO;
        }).collect(Collectors.toList());
    }

}
