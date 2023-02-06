package com.example.datsan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PitchRequest {
    private String name;
    private List<ImageRequest> images;
    private List<UnitPriceRequest> unitPrices;
    private String grass;
    private String type;
}
