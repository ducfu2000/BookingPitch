package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ManagerResponse {
    private Long id;
    private String phone;
    private String name;
    private LocalDateTime createdDate;
    private List<SystemResponse> systems;
    private String city;
    private String district;
    private String ward;
    private String addressDetail;
}
