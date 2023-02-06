package com.example.datsan.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Date;

@AllArgsConstructor
@Component
@Scope("session")
@Getter
@Setter
public class OtpSessionModel {
    private String phone;
    private String otp;
    private Date expireTime;
    private int time;

    public OtpSessionModel() {
        time = 0;
    }
}
