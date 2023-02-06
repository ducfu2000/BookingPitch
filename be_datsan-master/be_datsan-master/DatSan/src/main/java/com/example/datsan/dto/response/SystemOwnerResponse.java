package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemOwnerResponse {
    private Long id;
    private String name;
    private List<ManagerResponse> managers;
    private Float rate;
    private Integer pitchLimit;
}
