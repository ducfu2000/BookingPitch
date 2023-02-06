package com.example.datsan.service;

import com.example.datsan.dto.request.UnitPriceRequest;
import com.example.datsan.entity.pitch.Pitch;

import java.util.List;

public interface UnitPriceService {

    void addUnitPrices(List<UnitPriceRequest> requests, Pitch pitch, Long userId);

    void updateUnitPrice(Long userId, Pitch pitch, List<UnitPriceRequest> unitPrices);

    String getRangeOfPriceForSystem(Long systemId);

    String getTotalPrice(String date, String start, String end, Long id);

    String getRangeOfPriceForPitch(Long pid);
}
