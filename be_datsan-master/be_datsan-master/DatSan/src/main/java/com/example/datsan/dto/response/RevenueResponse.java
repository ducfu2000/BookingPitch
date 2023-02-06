package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevenueResponse {
    private Long systemId;
    private String systemName;
    private Date bookingDate;
    private Integer bookingQuantity;
    private Integer confirmedQuantity;
    private Integer rejectedQuantity;
    private Float revenue;
}
