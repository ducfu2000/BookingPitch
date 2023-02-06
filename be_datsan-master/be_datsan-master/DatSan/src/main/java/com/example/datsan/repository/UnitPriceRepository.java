package com.example.datsan.repository;

import com.example.datsan.entity.UnitPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Time;

@Repository
public interface UnitPriceRepository extends JpaRepository<UnitPrice, Long> {

    @Query("select up from UnitPrice up where up.deleted = false and up.id = ?1")
    UnitPrice findUnitPriceById(Long id);

    @Query("select min(up.price) from UnitPrice up where up.deleted = false and up.pitch.id = ?1")
    Float findMinPrice(Long id);

    @Query("select max(up.price) from UnitPrice up where up.deleted = false and up.pitch.id = ?1")
    Float findMaxPrice(Long id);

    @Query("select min(up.price) from UnitPrice up where up.deleted = false and up.pitch.pitchSystem.id = ?1")
    Float findMinPriceBySystemId(Long systemId);

    @Query("select max(up.price) from UnitPrice up where up.deleted = false and up.pitch.pitchSystem.id = ?1")
    Float findMaxPriceBySystemId(Long systemId);

    @Query("select up from UnitPrice up where up.deleted = false and up.pitch.id = ?1 and up.timeStart <= ?2 and up.timeEnd >= ?2 and up.isWeekend = ?3")
    UnitPrice getPriceCustom(Long id, Time time, Boolean isWeekend);

    @Query("select up from UnitPrice up where up.deleted = false and up.pitch.id = ?1 and up.timeStart = ?2 and up.isWeekend = ?3")
    UnitPrice getUnitPriceByRentStart(Long id, Time time, Boolean isWeekend);

    @Query("select up from UnitPrice up where up.deleted = false and up.pitch.id = ?1 and up.timeEnd = ?2 and up.isWeekend = ?3")
    UnitPrice getUnitPriceByRentEnd(Long id, Time time, Boolean isWeekend);
}
