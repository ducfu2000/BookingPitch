package com.example.datsan.service;

import com.example.datsan.dto.response.NotificationResponse;
import com.example.datsan.entity.Notification;

import java.sql.Time;
import java.time.LocalDateTime;
import java.sql.Date;
import java.util.List;

public interface NotificationService {

    Notification addNotification(String userName, Long bid, String pitchName, String systemName,
                                 LocalDateTime createdTime, String reason, Date rentDate, Time start, Time end, String type, String role);

    List<NotificationResponse> getListAddBookingNotifications(Long bid);

    List<NotificationResponse> getListRejectBookingNotifications(Long uid, Long bid);

    List<NotificationResponse> getListConfirmBookingNotifications(Long bid);

    List<NotificationResponse> getListAddPaymentNotifications(Long bid);

    Notification addNotificationAddManager(String phone, String password);
}
