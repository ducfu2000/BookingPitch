package com.example.datsan.entity.booking;

import com.example.datsan.entity.BaseEntity;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "booking", schema = "datsan")
public class Booking extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "rent_date")
    private Date rentDate;

    @Column(name = "total_price")
    private Float totalPrice;

    @Column(name = "note")
    private String note;

    @Column(name = "rent_start")
    private Time rentStart;

    @Column(name = "rent_end")
    private Time rentEnd;

    @Column(name = "status")
    private String status;

    @Column(name = "code")
    private String code;

    @Column(name = "payment")
    private String payment;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pitch_id")
    private Pitch pitch;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "booking_id")
    private Set<BookingTeam> bookingTeams = new HashSet<>();
}
