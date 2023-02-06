package com.example.datsan.repository;

import com.example.datsan.entity.Revenue;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface RevenueRepository extends JpaRepository<Revenue, Long> {

    @Query("select r from Revenue r where r.deleted = false and r.system.id = ?1 and r.bookingDate = ?2")
    Revenue findRevenue(Long sid, Date bookingDate);

    @Query("select r from Revenue r join r.system rs join rs.pitchSystemManagers rsm where r.deleted = false" +
            " and rsm.user.id = :id and (:sid is null or r.system.id = :sid)" +
            " and (cast(:date as date) is null or r.bookingDate = :date)" +
            " and (cast(:start as date) is null or r.bookingDate >= :start)" +
            " and (cast(:to as date) is null or r.bookingDate <= :to)")
    List<Revenue> getListRevenue(@Param("id") Long uid, @Param("sid") Long sid, @Param("date") Date date, @Param("start") Date from, @Param("to") Date to, Pageable pageable);
}
