package com.example.datsan.service.impl;

import com.example.datsan.dto.response.UserNotificationResponse;
import com.example.datsan.entity.Notification;
import com.example.datsan.entity.user.User;
import com.example.datsan.entity.user.UserNotification;
import com.example.datsan.repository.UserNotificationRepository;
import com.example.datsan.service.UserNotificationService;
import com.example.datsan.util.TimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserNotificationServiceImpl implements UserNotificationService {

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Override
    public void addUserNotification(User user, Notification notification) {
        try {
            UserNotification userNotification = new UserNotification();
            userNotification.setUser(user);
            userNotification.setNotification(notification);
            userNotification.setDeleted(false);
            userNotification.setIsRead(false);
            userNotificationRepository.save(userNotification);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public List<UserNotificationResponse> getListNotifications(Long uid, Integer page) {
        try {
            Pageable pageable = PageRequest.of(page - 1, 9, Sort.by("createdAt").descending());
            List<UserNotification> userNotifications = userNotificationRepository.getUserNotifications(uid, pageable);
            if (userNotifications != null && userNotifications.size() > 0) {
                List<UserNotificationResponse> responses = new ArrayList<>();

                for (UserNotification userNotification : userNotifications) {
                    UserNotificationResponse response = new UserNotificationResponse();
                    response.setId(userNotification.getId());
                    response.setBookingId(userNotification.getNotification().getBookingId());
                    response.setCode(userNotification.getNotification().getType().getCode());
                    response.setTitle(userNotification.getNotification().getTitle());
                    response.setBody(userNotification.getNotification().getBody());
                    response.setCreatedAt(userNotification.getCreatedAt());
                    response.setIsRead(userNotification.getIsRead());

                    responses.add(response);
                }

                return responses;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public void markAsReadNotification(Long id) {
        try {
            UserNotification userNotification = userNotificationRepository.findUserNotificationById(id);
            userNotification.setIsRead(true);
            userNotificationRepository.save(userNotification);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
