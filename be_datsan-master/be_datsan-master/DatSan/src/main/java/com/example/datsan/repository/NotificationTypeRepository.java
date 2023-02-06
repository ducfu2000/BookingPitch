package com.example.datsan.repository;

import com.example.datsan.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationTypeRepository extends JpaRepository<NotificationType, Long> {

    @Query("select nt from NotificationType nt where nt.deleted = false and nt.code = ?1")
    NotificationType getNotificationType(String type);
}
