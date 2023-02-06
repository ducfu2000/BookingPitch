package com.example.datsan.repository;

import com.example.datsan.entity.pitch.PitchType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PitchTypeRepository extends JpaRepository<PitchType, Long> {
    PitchType findPitchTypeByName(String name);
}
