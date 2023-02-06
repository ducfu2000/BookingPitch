package com.example.datsan.entity.pitch;

import com.example.datsan.entity.Address;
import com.example.datsan.entity.BaseEntity;
import com.example.datsan.entity.Revenue;
import com.example.datsan.entity.user.PitchSystemManager;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pitch_system", schema = "datsan")
public class PitchSystem extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "rate")
    private Float rate;

    @Column(name = "hired_start")
    private Time hiredStart;

    @Column(name = "hired_end")
    private Time hiredEnd;

    @Column(name = "status")
    private String status;

    @Column(name = "pitch_limited")
    private Integer pitchLimited;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private Set<Pitch> pitches = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private Set<PitchSystemManager> pitchSystemManagers = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private Set<Rating> ratings = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private Set<Revenue> revenues = new HashSet<>();
}
