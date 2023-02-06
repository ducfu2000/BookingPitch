package com.example.datsan.repository;

import com.example.datsan.entity.user.UserNotification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {

    @Query("select un from UserNotification un where un.deleted = false and un.user.id = ?1")
    List<UserNotification> getUserNotifications(Long id, Pageable pageable);

    @Query("select (count(un) > 0) from UserNotification un where un.deleted = false and un.notification.id = ?1 and " +
            "(un.user.role.name = 'OWNER' or un.user.role.name = 'MANAGER')")
    boolean isNotificationForManager(Long nid);

    @Query("select un from UserNotification un where un.deleted = false and un.id = ?1")
    UserNotification findUserNotificationById(Long id);
}
