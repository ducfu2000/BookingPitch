package com.example.datsan.service.impl;

import com.example.datsan.dto.request.TeamRequest;
import com.example.datsan.dto.response.TeamMemberResponse;
import com.example.datsan.entity.user.Team;
import com.example.datsan.entity.user.TeamMember;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.TeamMemberRepository;
import com.example.datsan.repository.UserRepository;
import com.example.datsan.service.TeamMemberService;
import com.example.datsan.service.TeamService;
import com.example.datsan.util.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeamMemberServiceImpl implements TeamMemberService {

    @Autowired
    private TeamMemberRepository memberRepository;

    @Autowired
    private TeamService teamService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String addTeamMember(Long id, TeamRequest request) {
        String message = "";
        try {
            Team team;
            if (request.getTid() != null) {
                team = teamService.findTeamById(request.getTid());
            } else {
                if (request.getName() != null && !request.getName().trim().isEmpty()) {
                    team = teamService.addTeam(id, request.getName());
                } else {
                    return "Vui lòng nhập tên của nhóm";
                }
            }
            if (team.getCreatedBy() != id) {
                return "Chỉ quản trị viên mới có quyền thêm thành viên cho nhóm này";
            }
            if (request.getPhones() != null && request.getPhones().size() > 0) {
                for (String p : request.getPhones()) {
                    User user = userRepository.findUserByPhone(p);
                    if (user != null && user.getRole().getName().trim().equals("TENANT")) {
                        if (!memberRepository.isTeamMember(team.getId(), user.getId())) {
                            TeamMember teamMember = new TeamMember();
                            teamMember.setMember(user);
                            teamMember.setTeam(team);
                            teamMember.setDeleted(false);
                            teamMember.setCreatedBy(id);
                            memberRepository.save(teamMember);
                        }
                    }
                }
            }
            User user = userRepository.findUserById(id);
            if (!memberRepository.isTeamMember(team.getId(), user.getId())) {
                TeamMember teamMember = new TeamMember();
                teamMember.setTeam(team);
                teamMember.setMember(user);
                teamMember.setDeleted(false);
                teamMember.setCreatedBy(id);
                memberRepository.save(teamMember);
            }
            message = "success";
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình thêm đội";
        }
        return message;
    }

    @Override
    public List<TeamMemberResponse> getTeamMember(Long tid, Long id) {
        try {
            List<TeamMember> teamMembers = memberRepository.getListTeamMember(tid);
            List<TeamMemberResponse> responses = new ArrayList<>();
            if (teamMembers != null && teamMembers.size() > 0) {
                for (TeamMember member : teamMembers) {
                    TeamMemberResponse response = UserUtils.convertToTeamMember(member.getMember(), id);
                    responses.add(response);
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public String leaveTeam(Long uid, Long tid) {
        try {
            String message = "";
            TeamMember teamMember = memberRepository.getTeamMemberByUserAndId(uid, tid);
            if (teamMember != null) {
                teamMember.setDeleted(true);
                teamMember.setUpdatedBy(uid);
                memberRepository.save(teamMember);
                message = "success";
                if(!memberRepository.isTeamNotBlank(tid)){
                    teamService.deleteTeam(tid);
                }
            } else {
                return "Bạn không ở trong nhóm này";
            }
            return message;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình rời đội";
    }

    @Override
    public String isInsideTeam(Long tid, String phone) {
        try {
            User user = userRepository.findUserByPhone(phone);
            if(user == null){
                return "Người dùng chưa đăng ký tài khoản trong ứng dụng này";
            }
            if(!user.getRole().getName().equals("TENANT")){
                return "Quyền hạn của tài khoản này không hợp lệ";
            }
            if (memberRepository.isTeamMember(tid, user.getId())) {
                return "Thành viên đã ở trong đội này";
            } else {
                return "valid";
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
