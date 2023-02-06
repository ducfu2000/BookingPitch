package com.example.datsan.repository;

import com.example.datsan.entity.Address;
import com.example.datsan.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select u from User u where u.phone = ?1")
    User findUserByPhone(String phone);

    @Query("select (count(u) > 0) from User u where u.phone = ?1 and u.deleted = false")
    boolean existsByPhone(String phone);

    @Transactional
    @Modifying
    @Query("update User u set u.Otp = ?1 where u.phone = ?2")
    int setOtp(String Otp, String phone);

    @Query("select u from User u where u.deleted = false and u.id = ?1")
    User findUserById(Long id);

    @Query("select u from User u where u.deleted = false and u.address = ?1")
    User findUserByAddress(Address address);

    @Query("select u from User u where u.deleted = false and u.phone = ?1")
    User getUserByPhone(String phone);
}
