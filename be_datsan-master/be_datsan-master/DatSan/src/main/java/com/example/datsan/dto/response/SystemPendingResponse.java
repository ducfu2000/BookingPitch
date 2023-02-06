package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemPendingResponse {
    private Long id;
    private String name;
    private UserResponse owner;
    private String city;
    private String district;
    private String ward;
    private String addressDetail;
    private String updatedAt;
    private String lat;
    private String lng;
}
