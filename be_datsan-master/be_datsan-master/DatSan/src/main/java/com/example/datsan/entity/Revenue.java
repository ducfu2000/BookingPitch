package com.example.datsan.entity;

import com.example.datsan.entity.pitch.PitchSystem;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "revenue", schema = "datsan")
public class Revenue extends BaseEntity{

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private PitchSystem system;

    @Column(name = "booking_date")
    private Date bookingDate;

    @Column(name = "booking_quantity")
    private Integer bookingQuantity;

    @Column(name = "confirmed_quantity")
    private Integer confirmedQuantity;

    @Column(name = "rejected_quantity")
    private Integer rejectedQuantity;

    @Column(name = "revenue")
    private Float revenue;
}
