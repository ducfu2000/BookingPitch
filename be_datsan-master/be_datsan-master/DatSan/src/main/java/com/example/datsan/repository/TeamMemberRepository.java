package com.example.datsan.repository;

import com.example.datsan.entity.user.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    @Query("select (count(tm) > 0) from TeamMember tm where tm.deleted = false and tm.team.id = ?1 and tm.member.id = ?2")
    boolean isTeamMember(Long tid, Long mid);

    @Query("select tm from TeamMember tm where tm.deleted = false and tm.team.id = ?1")
    List<TeamMember> getListTeamMember(Long tid);

    @Query("select tm from TeamMember tm where tm.deleted = false and tm.member.id = ?1 and tm.team.id = ?2")
    TeamMember getTeamMemberByUserAndId(Long uid, Long tid);

    @Query("select (count(tm) > 0) from TeamMember tm where tm.team.id = ?1")
    boolean isTeamNotBlank(Long tid);
}
