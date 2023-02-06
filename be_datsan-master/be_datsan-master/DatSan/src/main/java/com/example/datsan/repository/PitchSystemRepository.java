package com.example.datsan.repository;

import com.example.datsan.entity.Address;
import com.example.datsan.entity.pitch.PitchSystem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PitchSystemRepository extends JpaRepository<PitchSystem, Long> {

    @Query("select ps from PitchSystem ps where ps.deleted = false and ps.pitches.size > 0 and ps.status = 'Approved'")
    List<PitchSystem> findTopPitches(Pageable pageable);

    @Query("select ps from PitchSystem ps where ps.deleted = false and ps.status = 'Approved' and ps.id = ?1")
    PitchSystem findPitchSystemById(Long id);

    @Query("select (count(ps) > 0) from PitchSystem ps join ps.pitchSystemManagers psm where ps.deleted = false and ps.status = 'Approved' and psm.user.id = ?1 and ps.name = ?2")
    boolean isPitchSystemExisted(Long id, String name);

    @Query("select (count(ps) > 0) from PitchSystem ps join ps.pitchSystemManagers psm where ps.deleted = false and psm.user.id = ?1 and ps.address = ?2")
    boolean isAddressAlreadyUsed(Long id, Address address);

    @Query("select ps from PitchSystem ps where ps.deleted = false and ps.status = 'Pending'")
    List<PitchSystem> getSystemPending(Pageable pageable);

    @Query("select ps from PitchSystem ps where ps.deleted = false and ps.id = ?1")
    PitchSystem getSystemPendingById(Long id);

    @Query("select ps from PitchSystem ps where ps.deleted = false and ps.status = 'Pending' and ps.id = ?1")
    PitchSystem getSystemPending(Long id);

    @Query("select ps from PitchSystem ps where ps.deleted = false and ps.status = 'Pending' and ps.createdBy = ?1")
    List<PitchSystem> getListSystemPending(Long id);
}
