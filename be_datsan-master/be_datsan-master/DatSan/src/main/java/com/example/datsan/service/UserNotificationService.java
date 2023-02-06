package com.example.datsan.service;

import com.example.datsan.dto.response.UserNotificationResponse;
import com.example.datsan.entity.Notification;
import com.example.datsan.entity.user.User;

import java.util.List;

public interface UserNotificationService {

    void addUserNotification(User user, Notification notification);

    List<UserNotificationResponse> getListNotifications(Long uid, Integer page);

    void markAsReadNotification(Long id);
}
