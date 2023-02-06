package com.example.datsan.service;

import com.example.datsan.dto.request.RatingRequest;
import com.example.datsan.dto.response.RatingResponse;

import java.util.List;

public interface RatingService {
    String addRating(Long id, Long pid, RatingRequest request);

    String updateRating(Long id, Long rid, RatingRequest request);

    String deleteRating(Long id, Long rid);

    List<RatingResponse> getListRating(Long id, Long uid);

    String checkUserRated(Long uid, Long sid);
}
