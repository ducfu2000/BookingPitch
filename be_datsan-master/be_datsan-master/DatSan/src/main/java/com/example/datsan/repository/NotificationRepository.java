package com.example.datsan.repository;

import com.example.datsan.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("select n from Notification n where n.deleted = false and n.bookingId = ?1 and n.type.code = 'ADDBOOKING'")
    List<Notification> getListAddBookingNotifications(Long bid);

    @Query("select n from Notification n where n.deleted = false and n.bookingId = ?1 and n.type.code = 'REJECTBOOKING'")
    List<Notification> getListRejectBookingNotifications(Long bid);

    @Query("select n from Notification n where n.deleted = false and n.bookingId = ?1 and n.type.code = 'CONFIRMBOOKING'")
    List<Notification> getListConfirmBookingNotifications(Long bid);

    @Query("select n from Notification n where n.deleted = false and n.bookingId = ?1 and n.type.code = 'ADDPAYMENT'")
    List<Notification> getListAddPaymentNotifications(Long bid);
}
