package com.example.datsan.entity.pitch;

import com.example.datsan.entity.BaseEntity;
import com.example.datsan.entity.UnitPrice;
import com.example.datsan.entity.booking.Booking;
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
@Table(name = "pitch", schema = "datsan")
public class Pitch extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "grass")
    private String grass;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "type_id")
    private PitchType pitchType;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private PitchSystem pitchSystem;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "pitch_id")
    private Set<UnitPrice> unitPrices = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "pitch_id")
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "pitch_id")
    private Set<Image> images = new HashSet<>();
}
