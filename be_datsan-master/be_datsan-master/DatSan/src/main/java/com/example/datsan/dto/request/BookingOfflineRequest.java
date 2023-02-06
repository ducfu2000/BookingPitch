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
public class BookingOfflineRequest {
    private String phone;
    private String rentDate;
    private String rentStart;
    private String rentEnd;
    private Float totalPrice;
    private String note;
    private String payment;
    private List<Long> teams;
}
