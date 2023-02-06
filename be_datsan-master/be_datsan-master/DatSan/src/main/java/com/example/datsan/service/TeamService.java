package com.example.datsan.service;

import com.example.datsan.dto.response.TeamResponse;
import com.example.datsan.entity.user.Team;

import java.util.List;

public interface TeamService {
    Team addTeam(Long id, String name);

    List<TeamResponse> getTeamsByUser(Long id);

    Team findTeamById(Long id);

    void deleteTeam(Long id);
}
