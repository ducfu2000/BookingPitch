package com.example.datsan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserNotificationResponse {
    private Long id;
    private Long bookingId;
    private String code;
    private String title;
    private String body;
    private LocalDateTime createdAt;
    private Boolean isRead;
}
