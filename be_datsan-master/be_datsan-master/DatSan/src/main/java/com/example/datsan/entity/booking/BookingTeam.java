package com.example.datsan.entity.booking;

import com.example.datsan.entity.BaseEntity;
import com.example.datsan.entity.user.Team;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "booking_team", schema = "datsan")
public class BookingTeam extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "team_id")
    private Team team;
}
