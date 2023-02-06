package com.example.datsan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnitPriceRequest {
    private Long id;
    private String timeStart;
    private String timeEnd;
    private String price;
    private Boolean isWeekend;
}
