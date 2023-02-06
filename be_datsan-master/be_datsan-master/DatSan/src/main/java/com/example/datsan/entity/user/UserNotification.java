package com.example.datsan.entity.user;

import com.example.datsan.entity.BaseEntity;
import com.example.datsan.entity.Notification;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_notification", schema = "datsan")
public class UserNotification extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @Column(name = "is_read")
    private Boolean isRead;
}
