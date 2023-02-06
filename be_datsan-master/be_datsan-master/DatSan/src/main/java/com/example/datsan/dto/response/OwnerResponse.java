package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OwnerResponse {
    private Long id;
    private String phone;
    private String name;
    private String city;
    private String district;
    private String ward;
    private String addressDetail;
}
