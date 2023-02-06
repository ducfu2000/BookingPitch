package com.example.datsan.service.impl;

import com.example.datsan.dto.request.RatingRequest;
import com.example.datsan.dto.response.RatingResponse;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.pitch.Rating;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.BookingRepository;
import com.example.datsan.repository.PitchSystemRepository;
import com.example.datsan.repository.RatingRepository;
import com.example.datsan.service.RatingService;
import com.example.datsan.service.UserService;
import com.example.datsan.util.NumberUtils;
import com.example.datsan.util.PitchUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PitchSystemRepository systemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public String addRating(Long id, Long pid, RatingRequest request) {
        try {
            Rating rating = new Rating();
            PitchSystem system = systemRepository.findPitchSystemById(pid);
            User user = userService.findUserById(id);
            rating.setUser(user);
            rating.setPitchSystem(system);
            rating.setRate(request.getRate());
            rating.setContent(request.getContent());
            rating.setDeleted(false);
            rating.setCreatedBy(id);
            ratingRepository.save(rating);

            if (ratingRepository.isRatingExisted(pid)) {
                Long numberOfRating = ratingRepository.countRatingsByPitchSystem(pid);
                Float totalRating = ratingRepository.getSumOfRating(pid);

                Float rate = totalRating / numberOfRating;
                Float avgRate = NumberUtils.roundToHalf(rate);
                system.setRate(avgRate);
                systemRepository.save(system);
            }
            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình đánh giá";
    }

    @Override
    public String updateRating(Long id, Long rid, RatingRequest request) {
        try {
            Rating rating = ratingRepository.findRatingById(rid);
            rating.setRate(request.getRate());
            rating.setContent(request.getContent());
            rating.setUpdatedBy(id);
            ratingRepository.save(rating);

            if (ratingRepository.isRatingExisted(rating.getPitchSystem().getId())) {
                Long numberOfRating = ratingRepository.countRatingsByPitchSystem(rating.getPitchSystem().getId());
                Float totalRating = ratingRepository.getSumOfRating(rating.getPitchSystem().getId());

                Float rate = totalRating / numberOfRating;
                Float avgRate = NumberUtils.roundToHalf(rate);
                PitchSystem system = systemRepository.findPitchSystemById(rating.getPitchSystem().getId());
                system.setRate(avgRate);
                systemRepository.save(system);
            }
            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình cập nhật đánh giá";
    }

    @Override
    public String deleteRating(Long id, Long rid) {
        try {
            Rating rating = ratingRepository.findRatingById(rid);
            rating.setDeleted(true);
            rating.setUpdatedBy(id);
            ratingRepository.save(rating);

            if (ratingRepository.isRatingExisted(rating.getPitchSystem().getId())) {
                Long numberOfRating = ratingRepository.countRatingsByPitchSystem(rating.getPitchSystem().getId());
                Float totalRating = ratingRepository.getSumOfRating(rating.getPitchSystem().getId());

                Float rate = totalRating / numberOfRating;
                Float avgRate = NumberUtils.roundToHalf(rate);
                PitchSystem system = systemRepository.findPitchSystemById(rating.getPitchSystem().getId());
                system.setRate(avgRate);
                systemRepository.save(system);
            }
            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình xoá đánh giá";
    }

    @Override
    public List<RatingResponse> getListRating(Long id, Long uid) {
        try {
            List<Rating> ratings = ratingRepository.getRatingsByPitchSystem(id);
            if (ratings.size() > 0) {
                List<RatingResponse> responses = new ArrayList<>();
                for (Rating rating : ratings) {
                    boolean enableEditing = false;
                    if(uid != null) {
                        enableEditing = ratingRepository.checkRatingEnableEditing(rating.getId(), uid);
                    }
                    RatingResponse response = PitchUtils.convertToRatingResponse(rating, enableEditing);
                    responses.add(response);
                }
                return responses;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public String checkUserRated(Long uid, Long sid) {
        try{
            Date currentDate = Calendar.getInstance().getTime();
            java.sql.Date sqlDate = new java.sql.Date(currentDate.getTime());
            Time currentTime = Time.valueOf(LocalTime.now());
            long numberOfBookings = bookingRepository.countBookingsByUser(uid, sid, sqlDate, currentTime);
            long numberOfRatings = ratingRepository.countRatingByUser(uid, sid);
            if(numberOfBookings == 0){
                return "Bạn chưa thể đánh giá hệ thông sân này do chưa đá ở đây";
            }
            if(numberOfRatings < numberOfBookings){
                return "enable";
            } else {
                return "disable";
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return null;
    }
}
