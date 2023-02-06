package com.example.datsan.entity;

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
@Table(name = "banking", schema = "datsan")
public class Banking extends BaseEntity{

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "bin")
    private String bin;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "logo")
    private String logo;

    @Column(name = "banking_number")
    private String bankingNumber;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;
}
