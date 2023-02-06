package com.example.datsan.service.impl;

import com.example.datsan.dto.response.RevenueResponse;
import com.example.datsan.entity.Revenue;
import com.example.datsan.entity.booking.Booking;
import com.example.datsan.repository.BookingRepository;
import com.example.datsan.repository.RevenueRepository;
import com.example.datsan.service.RevenueService;
import com.example.datsan.util.TimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RevenueServiceImpl implements RevenueService {

    @Autowired
    private RevenueRepository revenueRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public void updateRevenueForAddBooking(Long bid) {
        try {
            Booking booking = bookingRepository.findBookingById(bid);
            Revenue revenue = revenueRepository.findRevenue(booking.getPitch().getPitchSystem().getId(), booking.getRentDate());
            if (revenue == null) {
                revenue = new Revenue();
                revenue.setSystem(booking.getPitch().getPitchSystem());
                revenue.setBookingDate(booking.getRentDate());
                revenue.setBookingQuantity(1);
                revenue.setConfirmedQuantity(0);
                revenue.setRejectedQuantity(0);
                revenue.setRevenue((float) 0);
                revenue.setDeleted(false);
                revenueRepository.save(revenue);
            } else {
                revenue.setBookingQuantity(revenue.getBookingQuantity() + 1);
                revenueRepository.save(revenue);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void updateRevenueForConfirmBooking(Long bid) {
        try {
            Booking booking = bookingRepository.findBookingById(bid);
            Revenue revenue = revenueRepository.findRevenue(booking.getPitch().getPitchSystem().getId(), booking.getRentDate());
            if (revenue != null) {
                revenue.setConfirmedQuantity(revenue.getConfirmedQuantity() + 1);
                revenue.setRevenue(revenue.getRevenue() + booking.getTotalPrice());
                revenueRepository.save(revenue);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void updateRevenueForRejectBooking(Long bid) {
        try {
            Booking booking = bookingRepository.findBookingById(bid);
            Revenue revenue = revenueRepository.findRevenue(booking.getPitch().getPitchSystem().getId(), booking.getRentDate());
            if (revenue != null) {
                revenue.setRejectedQuantity(revenue.getRejectedQuantity() + 1);
                revenueRepository.save(revenue);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public List<RevenueResponse> getRevenues(Long id, Long sid, String date, String from, String to) {
        try {
            Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("bookingDate").ascending());
            List<Revenue> revenues = revenueRepository.getListRevenue(id, sid, TimeUtils.convertToSqlDate(date), TimeUtils.convertToSqlDate(from), TimeUtils.convertToSqlDate(to), pageable);
            if(revenues != null && revenues.size() > 0){
                List<RevenueResponse> responses = new ArrayList<>();
                for(Revenue revenue : revenues){
                    RevenueResponse response = new RevenueResponse();
                    response.setSystemId(revenue.getSystem().getId());
                    response.setSystemName(revenue.getSystem().getName());
                    response.setBookingDate(revenue.getBookingDate());
                    response.setBookingQuantity(revenue.getBookingQuantity());
                    response.setConfirmedQuantity(revenue.getConfirmedQuantity());
                    response.setRejectedQuantity(revenue.getRejectedQuantity());
                    response.setRevenue(revenue.getRevenue());

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
