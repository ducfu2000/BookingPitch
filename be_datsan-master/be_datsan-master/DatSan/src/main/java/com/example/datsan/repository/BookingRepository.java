package com.example.datsan.repository;

import com.example.datsan.entity.booking.Booking;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("select b from Booking b where b.deleted = false and b.id = ?1")
    Booking findBookingById(Long id);

    @Query("select b from Booking b join b.pitch p join p.pitchSystem ps join ps.pitchSystemManagers psm" +
            " where b.deleted = false and p.deleted = false and ps.deleted = false" +
            " and psm.user.id = :id and (:sid is null or psm.pitchSystem.id = :sid) and (:status is null or b.status = :status) and (cast(:date as timestamp) is null or cast(b.updatedAt as date) = :date)")
    List<Booking> getListBookings(@Param("id") Long id, @Param("sid") Long sid, @Param("status") String status, @Param("date") Date bookingDate, Pageable pageable);

    @Query("select b from Booking b where b.deleted = false and b.code = ?1")
    Booking findBookingByCode(String code);

    @Query("select b from Booking b where b.user.id = :id and (:status is null or b.status = :status)")
    List<Booking> getBookingHistory(@Param("id") Long id, @Param("status") String status, Pageable pageable);

    @Query("select b from Booking b where b.deleted = false and b.user.id = ?1 and b.status = ?2 and (b.rentDate > ?3 or (b.rentDate = ?3 and b.rentStart > ?4))")
    List<Booking> getFutureBooking(Long id, String status, Date date, Time currentTime, Pageable pageable);

    @Query("select b from Booking b where b.deleted = false and b.user.id = ?1 and b.status = ?2 and (b.rentDate < ?3 or (b.rentDate = ?3 and b.rentEnd < ?4))")
    List<Booking> getPastBooking(Long id, String status, Date date, Time currentTime, Pageable pageable);

    @Query("select (count(b) > 0) from Booking b where b.deleted = false and b.status <> 'Rejected' and b.pitch.id = ?1 and b.rentDate = ?2 and " +
            "((b.rentStart <= ?3 and b.rentEnd >= ?4) or (b.rentStart > ?3 and b.rentEnd < ?4) or" +
            "(b.rentStart >= ?3 and b.rentStart < ?4) or (b.rentEnd > ?3 and b.rentEnd <= ?4))")
    boolean isBookingExisted(Long id, Date rentDate, Time rentStart, Time rentEnd);

    @Query("select b from Booking b where b.deleted = false and b.status <> 'Rejected' and " +
            "(:pid is null or b.pitch.id = :pid) and (cast(:date as timestamp) is null or b.rentDate = :date)")
    List<Booking> getBookingsForTenant(@Param("pid") Long pitchId, @Param("date") Date date);

    @Query("select (count(b) > 0) from Booking b where b.deleted = false and b.status = 'Confirmed'" +
            " and b.pitch.pitchSystem.id = ?1 and b.user.id = ?2 and ((b.rentDate < ?3) or (b.rentDate = ?3 and b.rentEnd <= ?4))")
    boolean isBookingCompleted(Long sid, Long uid, Date currentDate, Time currentTime);

    @Query("select count(b) from Booking b where b.deleted = false and b.status = 'Confirmed'" +
            " and b.user.id = ?1 and b.pitch.pitchSystem.id = ?2 and ((b.rentDate < ?3) or (b.rentDate = ?3 and b.rentEnd <= ?4))")
    long countBookingsByUser(Long uid, Long sid, Date currentDate, Time currentTime);

    @Query("select (count(b) > 0) from Booking b where b.deleted = false and b.status = 'Confirmed'" +
            " and b.id = ?1 and b.user.id = ?2 and ((b.rentDate < ?3) or (b.rentDate = ?3 and b.rentEnd <= ?4))")
    boolean isBookingEnableRating(Long sid, Long uid, Date currentDate, Time currentTime);
}
