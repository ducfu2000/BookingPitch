package com.example.datsan.entity;

import com.example.datsan.entity.pitch.Pitch;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "unit_price", schema = "datsan")
public class UnitPrice extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pitch_id")
    private Pitch pitch;

    @Column(name = "time_start")
    private Time timeStart;

    @Column(name = "time_end")
    private Time timeEnd;

    @Column(name = "unit_price")
    private Float price;

    @Column(name = "is_weekend")
    private Boolean isWeekend;
}
