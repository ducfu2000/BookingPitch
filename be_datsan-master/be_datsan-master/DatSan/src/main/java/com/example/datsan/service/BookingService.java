package com.example.datsan.service;

import com.example.datsan.dto.request.BookingOfflineRequest;
import com.example.datsan.dto.request.BookingRequest;
import com.example.datsan.dto.request.PaymentImageRequest;
import com.example.datsan.dto.request.RejectBookingRequest;
import com.example.datsan.dto.response.BookingDetailResponse;
import com.example.datsan.dto.response.BookingResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    List<String> addBooking(BookingRequest request, Long userId, Long pitchId);

    String confirmBooking(Long userId, Long id);

    String rejectBooking(Long userId, RejectBookingRequest request);

    List<BookingResponse> getListBookings(Long id, Long sid, String status, String rentDate, Pageable pageable);

    BookingDetailResponse getBookingDetail(Long uid, Long id);

    List<BookingResponse> getBookingsByStatus(Long id, String status, Integer page, String condition);

    List<String> addBookingPayment(PaymentImageRequest request);

    Boolean checkBookingExisted(Long id, String rentDate, String rentStart, String rentEnd);

    List<BookingResponse> getBookingsForTenant(Long pId, String date);

    String addBookingOffline(BookingOfflineRequest request, Long uid, Long pid);

    List<String> getManagerTokensForBookingDetail(Long bid);

    List<String> getManagerTokensForAddBooking(Long bid);

    List<String> getTokensForAddPayment(String code);

    List<String> getTeamTokensForAddBooking(Long bid);

    List<String> getTokensForBookingDetail(Long bid);

    boolean checkBookingRejected(String code);
}
