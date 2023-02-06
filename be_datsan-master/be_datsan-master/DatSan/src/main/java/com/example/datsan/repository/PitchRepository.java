package com.example.datsan.repository;

import com.example.datsan.entity.pitch.Pitch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PitchRepository extends JpaRepository<Pitch, Long> {

    @Query("select (count(p) > 0) from Pitch p where p.deleted = false and p.pitchSystem.id = ?1 and p.name = ?2")
    boolean isPitchExisted(Long id, String name);

    @Query("select p from Pitch p where p.deleted = false and p.id = ?1")
    Pitch findPitchById(Long id);

    @Query("select p from Pitch p where p.deleted = false and p.pitchSystem.id = ?1")
    List<Pitch> getListPitchesBySystem(Long sid);
}
