package com.example.datsan.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequest {
    private String phone;
    private String otp;
}
