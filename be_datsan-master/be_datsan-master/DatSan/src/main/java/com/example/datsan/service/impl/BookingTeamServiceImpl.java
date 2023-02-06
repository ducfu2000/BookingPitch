package com.example.datsan.service.impl;

import com.example.datsan.dto.response.TeamResponse;
import com.example.datsan.entity.booking.Booking;
import com.example.datsan.entity.booking.BookingTeam;
import com.example.datsan.entity.user.Team;
import com.example.datsan.entity.user.TeamMember;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.BookingRepository;
import com.example.datsan.repository.BookingTeamRepository;
import com.example.datsan.service.BookingTeamService;
import com.example.datsan.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class BookingTeamServiceImpl implements BookingTeamService {

    @Autowired
    private BookingTeamRepository bookingTeamRepository;

    @Autowired
    private TeamService teamService;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public void addBookingTeam(Long id, Booking booking, List<Long> ids) {
        try {
            for (Long tid : ids) {
                BookingTeam bookingTeam = new BookingTeam();
                bookingTeam.setBooking(booking);
                Team team = teamService.findTeamById(tid);
                bookingTeam.setTeam(team);
                bookingTeam.setDeleted(false);
                bookingTeam.setCreatedBy(id);
                bookingTeamRepository.save(bookingTeam);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public List<User> getTeamMembers(Long id) {
        try {
            List<BookingTeam> bookingTeams = bookingTeamRepository.getBookingTeamByBookingId(id);
            List<Team> teams = new ArrayList<>();
            List<User> users = new ArrayList<>();
            Booking booking = bookingRepository.findBookingById(id);
            if (bookingTeams != null && bookingTeams.size() > 0) {
                for (BookingTeam bookingTeam : bookingTeams) {
                    teams.add(bookingTeam.getTeam());
                }
            }
            if (teams.size() > 0) {
                for (Team team : teams) {
                    if (team.getTeamMembers() != null && team.getTeamMembers().size() > 0) {
                        for (TeamMember teamMember : team.getTeamMembers()) {
                            if (!users.contains(teamMember.getMember()) && !Objects.equals(teamMember.getMember().getId(), booking.getUser().getId())) {
                                users.add(teamMember.getMember());
                            }
                        }
                    }
                }
                return users;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<TeamResponse> getListBookingTeams(Long bid) {
        try {
            List<BookingTeam> bookingTeams = bookingTeamRepository.getBookingTeamByBookingId(bid);
            if(bookingTeams != null && bookingTeams.size() > 0){
                List<TeamResponse> responses = new ArrayList<>();

                for(BookingTeam bookingTeam : bookingTeams){
                    TeamResponse response = new TeamResponse();
                    response.setId(bookingTeam.getTeam().getId());
                    response.setName(bookingTeam.getTeam().getName());

                    responses.add(response);
                }

                return responses;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
