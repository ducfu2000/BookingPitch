package com.example.datsan.service;

import com.example.datsan.dto.response.RevenueResponse;

import java.util.List;

public interface RevenueService {
    void updateRevenueForAddBooking(Long bid);

    void updateRevenueForConfirmBooking(Long bid);

    void updateRevenueForRejectBooking(Long bid);

    List<RevenueResponse> getRevenues(Long id, Long sid, String date, String from, String to);
}
