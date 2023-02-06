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
public class PitchDetailResponse {
    private Long id;
    private String name;
    private List<ImageResponse> images;
    private String grass;
    private String type;
    private List<UnitPriceResponse> unitPrices;
    private String systemName;
    private String owner;
}
