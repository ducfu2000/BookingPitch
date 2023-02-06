package com.example.datsan.repository;

import com.example.datsan.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    @Query("select a from Address a where a.city = ?1 and a.district = ?2 and a.ward = ?3 and a.addressDetail = ?4")
    Address findAddress(String city, String district, String ward, String addressDetail);

    @Query("select a from Address a where a.deleted = false and a.city = ?1 and a.district = ?2 and a.ward = ?3 and a.addressDetail = ?4 and a.user.id = ?5")
    Address findUserAddress(String city, String district, String ward, String addressDetail, Long id);
}
