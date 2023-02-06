package com.example.datsan.service.impl;

import com.example.datsan.dto.response.ManagerResponse;
import com.example.datsan.dto.response.SystemResponse;
import com.example.datsan.entity.Notification;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.user.PitchSystemManager;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.PitchSystemManagerRepository;
import com.example.datsan.repository.PitchSystemRepository;
import com.example.datsan.service.*;
import com.example.datsan.util.PitchUtils;
import com.example.datsan.util.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ManagerServiceImpl implements ManagerService {

    @Autowired
    private PitchSystemManagerRepository managerRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PitchSystemRepository systemRepository;

    @Autowired
    private UnitPriceService priceService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserNotificationService userNotificationService;

    @Override
    public List<ManagerResponse> getListManagers(Long id) {
        try {
            List<PitchSystemManager> systemManagers = managerRepository.findAllByUserId(id);
            List<User> users = new ArrayList<>();
            List<Long> ids = new ArrayList<>();
            if (systemManagers != null && systemManagers.size() > 0) {
                for (PitchSystemManager systemManager : systemManagers) {
                    ids.add(systemManager.getPitchSystem().getId());
                    List<PitchSystemManager> managers = managerRepository.findSystemManager(systemManager.getPitchSystem().getId());
                    if (managers != null && managers.size() > 0) {
                        for (PitchSystemManager manager : managers) {
                            if (!UserUtils.isContains(users, manager.getUser())) {
                                users.add(manager.getUser());
                            }
                        }
                    }
                }
            }
            if (users.size() > 0) {
                List<ManagerResponse> responses = new ArrayList<>();
                for (User user : users) {
                    List<SystemResponse> systems = new ArrayList<>();
                    LocalDateTime dateTime = null;
                    for (Long pid : ids) {
                        PitchSystemManager manager = managerRepository.findAllByManager(user.getId(), pid);
                        if (manager != null) {
                            String price = priceService.getRangeOfPriceForSystem(manager.getPitchSystem().getId());
                            SystemResponse sr = PitchUtils.convertToSystemResponse(manager.getPitchSystem(), price);
                            systems.add(sr);
                            dateTime = manager.getCreatedAt();
                        }
                    }
                    ManagerResponse response = UserUtils.convertToManagerResponse(user, systems, dateTime);

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
    public String addManager(Long id, Long systemId, String name, String phone) {
        try {
            if(managerRepository.isManagerExisted(systemId, phone)){
                return "Quản lý này đã có trong hệ thống của bạn";
            }
            String message = "success";
            User user;
            if (userService.isPhoneExisted(phone)) {
                user = userService.findUser(phone);
                if (user.getRole().getName().equals("TENANT")) {
                    user.setIsManager(true);
                    user.setUpdatedBy(id);
                }
                if(user.getRole().getName().equals("OWNER") || user.getRole().getName().equals("ADMIN")){
                    return "Quyền hạn của tài khoản này không phù hợp";
                }
            } else {
                String password = UserUtils.generatePassword(systemId);
                User owner = userService.findUserById(id);
                user = userService.addNewManager(id, phone, name, password);
                message = message.concat(".");
                Notification notification = notificationService.addNotificationAddManager(phone, password);
                message = message.concat(notification.getBody());
                userNotificationService.addUserNotification(owner, notification);
            }
            PitchSystem pitchSystem = systemRepository.findPitchSystemById(systemId);
            PitchSystemManager manager = new PitchSystemManager();
            if (user != null) {
                manager.setPitchSystem(pitchSystem);
                manager.setUser(user);
                manager.setCreatedBy(id);
                manager.setDeleted(false);

                managerRepository.save(manager);
            }
            return message;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình thêm quản lý sân";
    }

    @Override
    public String deleteManager(Long id, Long systemId, Long managerId) {
        try {
            PitchSystemManager manager = managerRepository.findAllByManager(managerId, systemId);
            manager.setDeleted(true);
            manager.setUpdatedBy(id);
            managerRepository.save(manager);
            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình xoá quyền quản lý sân";
    }
}
