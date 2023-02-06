package com.example.datsan.repository;

import com.example.datsan.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query("select t from Token t where t.deleted = false and t.user.id = ?1")
    List<Token> findTokenByUserId(Long id);

    @Query("select (count(t) > 0) from Token t where t.deleted = false and t.token = ?1")
    boolean checkTokenExisted(String token);

    @Query("select t from Token t where t.deleted = false and t.user.id = ?1 and t.token = ?2")
    Token findDeviceToken(Long id, String token);


}
