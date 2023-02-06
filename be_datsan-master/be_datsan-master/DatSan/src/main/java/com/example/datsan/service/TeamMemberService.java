package com.example.datsan.service;

import com.example.datsan.dto.request.TeamRequest;
import com.example.datsan.dto.response.TeamMemberResponse;

import java.util.List;

public interface TeamMemberService {
    String addTeamMember(Long id, TeamRequest request);

    List<TeamMemberResponse> getTeamMember(Long tid, Long id);

    String leaveTeam(Long uid, Long tid);

    String isInsideTeam(Long tid, String phone);
}
