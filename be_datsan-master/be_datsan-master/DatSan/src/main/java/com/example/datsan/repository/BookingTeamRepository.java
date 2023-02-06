package com.example.datsan.repository;

import com.example.datsan.entity.booking.BookingTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingTeamRepository extends JpaRepository<BookingTeam, Long> {

    @Query("select bt from BookingTeam bt where bt.deleted = false and bt.booking.id = ?1")
    List<BookingTeam> getBookingTeamByBookingId(Long id);
}
