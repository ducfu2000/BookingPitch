package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnitPriceResponse {
    private Long id;
    private Time timeStart;
    private Time timeEnd;
    private Float price;
    private Boolean isWeekend;
    private Boolean isRented;
}
