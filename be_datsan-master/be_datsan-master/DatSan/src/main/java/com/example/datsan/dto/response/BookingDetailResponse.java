package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDateTime;
import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailResponse {
    private Long id;
    private String tenant;
    private Long pitchId;
    private String pitchName;
    private Long systemId;
    private String systemName;
    private Date rentDate;
    private Time rentStart;
    private Time rentEnd;
    private Float totalPrice;
    private String note;
    private String status;
    private String code;
    private String payment;
    private List<TeamResponse> teams;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean enableRating;
}
