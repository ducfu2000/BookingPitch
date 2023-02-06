package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String phone;
    private String password;
    private String name;
    private String role;
    private String city;
    private String district;
    private String ward;
    private String addressDetail;
}
