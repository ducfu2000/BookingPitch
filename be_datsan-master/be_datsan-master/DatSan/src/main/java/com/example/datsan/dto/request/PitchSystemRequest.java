package com.example.datsan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PitchSystemRequest {

    private String name;
    private String city;
    private String district;
    private String ward;
    private String addressDetail;
    private String lat;
    private String lng;
    private String description;
    private String hiredStart;
    private String hiredEnd;
}
