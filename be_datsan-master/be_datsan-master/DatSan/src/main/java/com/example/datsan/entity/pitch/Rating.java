package com.example.datsan.entity.pitch;

import com.example.datsan.entity.BaseEntity;
import com.example.datsan.entity.user.User;
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
@Table(name = "rating", schema = "datsan")
public class Rating extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pitch_system_id")
    private PitchSystem pitchSystem;

    @Column(name = "rate")
    private Integer rate;

    @Column(name = "content")
    private String content;
}
