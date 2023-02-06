package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemResponse {
    private Long id;
    private String name;
    private String price;
    private String image;
    private String city;
    private String district;
    private String ward;
    private String addressDetail;
    private String distance;
}
