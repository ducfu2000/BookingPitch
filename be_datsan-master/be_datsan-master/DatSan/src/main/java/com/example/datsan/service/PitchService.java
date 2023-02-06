package com.example.datsan.service;

import com.example.datsan.dto.request.PitchRequest;
import com.example.datsan.dto.response.PitchDetailResponse;
import com.example.datsan.entity.pitch.Pitch;

public interface PitchService {

    String addPitch(PitchRequest request, Long systemId, Long userId);

    Boolean isPitchExisted(Long id, String name);

    PitchDetailResponse getPitchDetail(Long systemId, Long id);

    String updatePitch(PitchRequest request, Long userId, Long id);

    void deletePitch(Long id);

    Pitch findPitchById(Long id);
}
