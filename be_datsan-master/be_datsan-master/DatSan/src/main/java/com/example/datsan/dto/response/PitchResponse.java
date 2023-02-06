package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PitchResponse {
    private Long id;
    private String name;
    private String image;
    private String price;
    private String type;
    private String grass;
}
