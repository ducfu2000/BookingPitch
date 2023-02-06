package com.example.datsan.entity;

import com.example.datsan.entity.user.UserNotification;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification", schema = "datsan")
public class Notification extends BaseEntity{

    @Column(name = "title")
    private String title;

    @Column(name = "body")
    private String body;

    @Column(name = "booking_id")
    private Long bookingId;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "notification_id")
    private Set<UserNotification> userNotifications = new HashSet<>();

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "type_id")
    private NotificationType type;
}
