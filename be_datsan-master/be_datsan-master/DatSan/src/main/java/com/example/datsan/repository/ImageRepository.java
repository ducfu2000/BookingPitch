package com.example.datsan.repository;

import com.example.datsan.entity.pitch.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("select i from Image i where i.id = ?1")
    Image findImageById(Long id);
}
