package com.example.datsan.service.impl;

import com.example.datsan.dto.response.TeamResponse;
import com.example.datsan.entity.user.Team;
import com.example.datsan.repository.TeamRepository;
import com.example.datsan.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeamServiceImpl implements TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Override
    public Team addTeam(Long id, String name) {
        try {
            Team team = new Team();
            team.setName(name);
            team.setCreatedBy(id);
            team.setDeleted(false);

            return teamRepository.save(team);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<TeamResponse> getTeamsByUser(Long id) {
        try {
            List<Team> teams = teamRepository.getTeamsByUser(id);
            List<TeamResponse> responses = new ArrayList<>();
            for (Team t : teams) {
                TeamResponse response = new TeamResponse();
                response.setId(t.getId());
                response.setName(t.getName());
                if(teamRepository.isAdminOfTeam(id, t.getId())){
                    response.setEnableCreating(true);
                } else {
                    response.setEnableCreating(false);
                }

                responses.add(response);
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    @Override
    public Team findTeamById(Long id) {
        return teamRepository.findTeamById(id);
    }

    @Override
    public void deleteTeam(Long id) {
        try{
            Team team = teamRepository.findTeamById(id);
            teamRepository.delete(team);
        } catch (Exception ex){
            ex.printStackTrace();
        }
    }
}
