package com.example.datsan.repository;

import com.example.datsan.entity.user.PitchSystemManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PitchSystemManagerRepository extends JpaRepository<PitchSystemManager, Long> {

    @Query("select pm from PitchSystemManager pm where pm.deleted = false and pm.user.role.name = 'OWNER' and pm.pitchSystem.id = ?1")
    PitchSystemManager findSystemOwner(Long id);

    @Query("select pm from PitchSystemManager pm where pm.deleted = false and pm.pitchSystem.deleted = false and pm.pitchSystem.status = 'Approved' and pm.user.id = ?1")
    List<PitchSystemManager> findAllByUserId(Long id);

    @Query("select pm from PitchSystemManager pm where pm.deleted = false and pm.pitchSystem.deleted = false and pm.pitchSystem.id = ?1 and (pm.user.role.name = 'MANAGER' or pm.user.isManager = true)")
    List<PitchSystemManager> findSystemManager(Long id);

    @Query("select pm from PitchSystemManager pm where pm.deleted = false and pm.pitchSystem.deleted = false and pm.user.id = :mid and pm.pitchSystem.id = :id")
    PitchSystemManager findAllByManager(@Param("mid") Long mid, @Param("id") Long id);

    @Query("select (count(pm) > 0) from PitchSystemManager pm where pm.deleted = false and pm.pitchSystem.id = ?1 and pm.user.phone = ?2")
    boolean isManagerExisted(Long sid, String phone);
}
