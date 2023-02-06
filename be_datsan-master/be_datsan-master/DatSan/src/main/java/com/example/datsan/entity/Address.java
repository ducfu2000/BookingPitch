package com.example.datsan.entity;

import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "address", schema = "datsan")
public class Address extends BaseEntity {

    @Column(name = "ward")
    private String ward;

    @Column(name = "district")
    private String district;

    @Column(name = "city")
    private String city;

    @Column(name = "address_detail")
    private String addressDetail;

    @Column(name = "latitude")
    private String lat;

    @Column(name = "longtitude")
    private String lng;

    @OneToOne(mappedBy = "address")
    @JsonIgnore
    private PitchSystem pitchSystem;

    @OneToOne(mappedBy = "address")
    @JsonIgnore
    private User user;
}
