package com.example.datsan.service;

import com.example.datsan.dto.response.TeamResponse;
import com.example.datsan.entity.booking.Booking;
import com.example.datsan.entity.user.User;

import java.util.List;

public interface BookingTeamService {
    void addBookingTeam(Long id, Booking booking, List<Long> ids);

    List<User> getTeamMembers(Long id);

    List<TeamResponse> getListBookingTeams(Long bid);
}
