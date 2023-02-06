package com.example.datsan.service;

import com.example.datsan.dto.request.ImageRequest;
import com.example.datsan.entity.pitch.Pitch;

import java.util.List;

public interface ImageService {

    void addImage(Long id, Pitch pitch, List<ImageRequest> images);

    void updateImage(Long id, Pitch pitch, List<ImageRequest> images);
}
