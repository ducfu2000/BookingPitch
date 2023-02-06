package com.example.datsan.dto.request;

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
public class OtpConfirmSession {
    private String phone;
    private Boolean isOtpConfirm;
    private Date expireTime;
}
