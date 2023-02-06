package com.example.datsan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BankingRequest {
    private String name;
    private String code;
    private String bin;
    private String shortName;
    private String logo;
    private String bankingNumber;
}
