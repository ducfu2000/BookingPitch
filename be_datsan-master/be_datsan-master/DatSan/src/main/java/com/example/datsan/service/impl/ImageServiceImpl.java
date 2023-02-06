package com.example.datsan.service.impl;

import com.example.datsan.dto.request.ImageRequest;
import com.example.datsan.entity.pitch.Image;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.repository.ImageRepository;
import com.example.datsan.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public void addImage(Long id, Pitch pitch, List<ImageRequest> images) {
        try {
            for (ImageRequest request : images) {
                Image image = new Image();
                image.setPitch(pitch);
                image.setUrl(request.getUrl());
                image.setCreatedBy(id);

                imageRepository.save(image);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void updateImage(Long id, Pitch pitch, List<ImageRequest> images) {
        try {
            for (ImageRequest request : images) {
                Image image = new Image();
                if(request.getId() != null) {
                    image = imageRepository.findImageById(request.getId());
                }
                image.setPitch(pitch);
                image.setUrl(request.getUrl());
                image.setUpdatedBy(id);
                imageRepository.save(image);
            }
        } catch (Exception ex) {

        }
    }
}
