package com.example.datsan.service.impl;

import com.example.datsan.dto.response.NotificationResponse;
import com.example.datsan.entity.Notification;
import com.example.datsan.entity.NotificationType;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.NotificationRepository;
import com.example.datsan.repository.NotificationTypeRepository;
import com.example.datsan.repository.UserNotificationRepository;
import com.example.datsan.repository.UserRepository;
import com.example.datsan.service.NotificationService;
import com.example.datsan.util.TimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationTypeRepository notificationTypeRepository;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Notification addNotification(String userName, Long bid, String pitchName, String systemName,
                                        LocalDateTime createdTime, String reason, Date rentDate, Time start, Time end, String type, String role) {
        try {
            Notification notification = new Notification();
            NotificationType notiType = notificationTypeRepository.getNotificationType(type);
            notification.setType(notiType);
            if (role.trim().equals("MANAGER")) {
                String createdDateTime = TimeUtils.convertToDateTime(createdTime);
                String body;
                switch (type) {
                    case "ADDBOOKING":
                        notification.setTitle(notiType.getName());
                        body = "Khách hàng " + userName + " vừa đặt sân " + pitchName + " tại hệ thống " + systemName + " của bạn vào " + createdDateTime + ".";
                        notification.setBody(body);
                        break;
                    case "REJECTBOOKING":
                        notification.setTitle("Đơn đặt sân " + notiType.getName());
                        body = "Khách hàng " + userName + " vừa huỷ sân đã đặt với lí do " + reason + ".";
                        notification.setBody(body);
                        break;
                    case "ADDPAYMENT":
                        notification.setTitle("Đơn đặt sân " + notiType.getName());
                        body = "Khách hàng vừa thanh toán đơn đặt sân. Hãy vào kiểm tra";
                        notification.setBody(body);
                        break;
                    default:
                        return null;
                }
            }
            if (role.trim().equals("TEAM")) {
                String createdDateTime = TimeUtils.convertToDateTime(createdTime);
                String body;
                switch (type) {
                    case "ADDBOOKING":
                        notification.setTitle(notiType.getName());
                        body = userName + " vừa đặt sân cho nhóm có bạn vào ngày " + TimeUtils.convertToDateString(rentDate) + ", thời gian đá " + start + " - " + end + ".";
                        notification.setBody(body);
                        break;
                    case "REJECTBOOKING":
                        notification.setTitle("Đơn đặt sân " + notiType.getName());
                        body = userName + " vừa huỷ sân đã đặt với lí do " + reason;
                        notification.setBody(body);
                        break;
                    case "CONFIRMBOOKING":
                        notification.setTitle("Đơn đặt sân " + notiType.getName());
                        body = "Đơn đặt sân cho nhóm của bạn đã được duyệt vào lúc " + createdDateTime + ".";
                        notification.setBody(body);
                        break;
                    default:
                        return null;
                }
            }
            if (role.trim().equals("TENANT")) {
                String createdDateTime = TimeUtils.convertToDateTime(createdTime);
                String body;
                switch (type) {
                    case "REJECTBOOKING":
                        notification.setTitle("Đơn đặt sân " + notiType.getName());
                        body = "Quản lý vừa huỷ đơn đặt sân với lí do " + reason;
                        notification.setBody(body);
                        break;
                    case "CONFIRMBOOKING":
                        notification.setTitle("Đơn đặt sân " + notiType.getName());
                        body = "Đơn đặt sân " + pitchName + " đã được duyệt vào lúc " + createdDateTime + ".";
                        notification.setBody(body);
                        break;
                    default:
                        return null;
                }
            }
            notification.setBookingId(bid);
            notification.setDeleted(false);
            return notificationRepository.save(notification);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<NotificationResponse> getListAddBookingNotifications(Long bid) {
        try {
            List<Notification> notifications = notificationRepository.getListAddBookingNotifications(bid);
            if (notifications != null && notifications.size() > 0) {
                List<NotificationResponse> responses = new ArrayList<>();

                for (Notification notification : notifications) {
                    NotificationResponse response = new NotificationResponse();
                    response.setId(notification.getId());
                    response.setBookingId(bid);
                    response.setTitle(notification.getTitle());
                    response.setBody(notification.getBody());
                    response.setCode(notification.getType().getCode());
                    response.setCreatedAt(TimeUtils.convertToDateTime(notification.getCreatedAt()));
                    if (userNotificationRepository.isNotificationForManager(notification.getId())) {
                        response.setReceiver("Manager");
                    } else {
                        response.setReceiver("Team");
                    }

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
    public List<NotificationResponse> getListRejectBookingNotifications(Long uid, Long bid) {
        try {
            List<Notification> notifications = notificationRepository.getListRejectBookingNotifications(bid);
            User user = userRepository.findUserById(uid);
            if (notifications != null && notifications.size() > 0) {
                List<NotificationResponse> responses = new ArrayList<>();

                for (Notification notification : notifications) {
                    NotificationResponse response = new NotificationResponse();
                    response.setId(notification.getId());
                    response.setBookingId(bid);
                    response.setTitle(notification.getTitle());
                    response.setBody(notification.getBody());
                    response.setCode(notification.getType().getCode());
                    response.setCreatedAt(TimeUtils.convertToDateTime(notification.getCreatedAt()));
                    if (user.getRole().getName().equals("TENANT")) {
                        if (userNotificationRepository.isNotificationForManager(notification.getId())) {
                            response.setReceiver("Manager");
                        } else {
                            response.setReceiver("Team");
                        }
                    } else {
                        response.setReceiver("Tenant");
                    }

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
    public List<NotificationResponse> getListConfirmBookingNotifications(Long bid) {
        try {
            List<Notification> notifications = notificationRepository.getListConfirmBookingNotifications(bid);
            if (notifications != null && notifications.size() > 0) {
                List<NotificationResponse> responses = new ArrayList<>();

                for (Notification notification : notifications) {
                    NotificationResponse response = new NotificationResponse();
                    response.setId(notification.getId());
                    response.setBookingId(bid);
                    response.setTitle(notification.getTitle());
                    response.setBody(notification.getBody());
                    response.setCode(notification.getType().getCode());
                    response.setCreatedAt(TimeUtils.convertToDateTime(notification.getCreatedAt()));
                    if (notification.getBody().trim().startsWith("Đơn đặt sân cho nhóm của bạn")) {
                        response.setReceiver("Team");
                    } else {
                        response.setReceiver("Tenant");
                    }

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
    public List<NotificationResponse> getListAddPaymentNotifications(Long bid) {
        try {
            List<Notification> notifications = notificationRepository.getListAddPaymentNotifications(bid);
            if (notifications != null && notifications.size() > 0) {
                List<NotificationResponse> responses = new ArrayList<>();

                for (Notification notification : notifications) {
                    NotificationResponse response = new NotificationResponse();
                    response.setId(notification.getId());
                    response.setBookingId(bid);
                    response.setTitle(notification.getTitle());
                    response.setBody(notification.getBody());
                    response.setCode(notification.getType().getCode());
                    response.setCreatedAt(TimeUtils.convertToDateTime(notification.getCreatedAt()));
                    response.setReceiver("Manager");

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
    public Notification addNotificationAddManager(String phone, String password) {
        try {
            Notification notification = new Notification();
            NotificationType type = notificationTypeRepository.getNotificationType("ADDMANAGER");
            notification.setType(type);
            notification.setBookingId(0L);
            String title = "Thêm quản lý mới";
            String body = type.getName() + " số " + phone + " làm quản lý mới, mật khẩu của tài khoản này là " + password;
            notification.setTitle(title);
            notification.setBody(body);
            return notificationRepository.save(notification);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
