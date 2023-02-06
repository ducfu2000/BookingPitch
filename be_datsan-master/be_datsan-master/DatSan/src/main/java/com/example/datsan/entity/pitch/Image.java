package com.example.datsan.entity.pitch;

import com.example.datsan.entity.BaseEntity;
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
@Table(name = "image", schema = "datsan")
public class Image extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pitch_id")
    private Pitch pitch;

    @Column(name = "url")
    private String url;
}
