package com.example.datsan.repository;

import com.example.datsan.entity.user.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    @Query("select t from Team t join t.teamMembers tm where t.deleted = false and tm.deleted = false and tm.member.id = ?1")
    List<Team> getTeamsByUser(Long id);

    @Query("select t from Team t where t.deleted = false and t.id = ?1")
    Team findTeamById(Long id);

    @Query("select (count(t) > 0) from Team t where t.deleted = false and t.createdBy = ?1 and t.id = ?2")
    boolean isAdminOfTeam(Long uid, Long tid);
}
