package com.example.datsan.repository;

import com.example.datsan.entity.Banking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankingRepository extends JpaRepository<Banking, Long> {

    @Query("select b from Banking b where b.deleted = false and b.user.id = ?1")
    List<Banking> findBankingByUserId(Long id);

    @Query("select b from Banking b where b.deleted = false and b.id = ?1")
    Banking findBankingById(Long id);

    @Query("select (count(b) > 0) from Banking b where b.deleted = false and b.user.id = ?1 and b.name = ?2 and b.bankingNumber = ?3")
    boolean isBankingExisted(Long id, String name, String bankNumber);
}
