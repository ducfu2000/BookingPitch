package com.example.datsan.repository;

import com.example.datsan.entity.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    @Query("select r from Role r where r.deleted = false and r.name = ?1")
    Role findRoleByName(String name);
}
