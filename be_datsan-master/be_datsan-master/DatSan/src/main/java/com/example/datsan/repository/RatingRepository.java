package com.example.datsan.repository;

import com.example.datsan.entity.pitch.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("select sum(r.rate) from Rating r where r.deleted = false and r.pitchSystem.id = ?1")
    float getSumOfRating(Long id);

    @Query("select count(r) from Rating r where r.deleted = false and r.pitchSystem.id = ?1")
    long countRatingsByPitchSystem(Long id);

    @Query("select (count(r) > 0) from Rating r where r.deleted = false and r.pitchSystem.id = ?1")
    boolean isRatingExisted(Long id);

    @Query("select r from Rating r where r.deleted = false and r.id = ?1")
    Rating findRatingById(Long id);

    @Query("select r from Rating r where r.deleted = false and r.pitchSystem.id = ?1")
    List<Rating> getRatingsByPitchSystem(Long id);

    @Query("select (count(r) > 0) from Rating r where r.deleted = false and r.id = ?1 and r.user.id = ?2")
    boolean checkRatingEnableEditing(Long rid, Long uid);

    @Query("select count(r) from Rating r where r.deleted = false and r.user.id = ?1 and r.pitchSystem.id = ?2")
    long countRatingByUser(Long uid, Long sid);
}
