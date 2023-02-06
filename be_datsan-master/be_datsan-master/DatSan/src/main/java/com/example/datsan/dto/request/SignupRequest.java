package com.example.datsan.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String name;
    private String phone;
    private String password;
    private String role;
}
