package com.example.datsan.entity.user;

import com.example.datsan.entity.BaseEntity;
import com.example.datsan.entity.pitch.PitchSystem;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "pitch_system_manager", schema = "datsan")
public class PitchSystemManager extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private PitchSystem pitchSystem;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;
}
