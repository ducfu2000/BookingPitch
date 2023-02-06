package com.example.datsan.service;

import com.example.datsan.dto.response.ManagerResponse;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.user.PitchSystemManager;
import com.example.datsan.entity.user.User;

import java.util.List;

public interface PitchSystemManagerService {
    PitchSystemManager addNewPitchSystem(User user, PitchSystem pitchSystem, Long adminId);

    PitchSystemManager findSystemOwner(Long id);

    List<PitchSystemManager> findAllByUserId(Long id);

    List<PitchSystemManager> findSystemManager(Long id);

    List<ManagerResponse> findSystemManagers(Long id);
}
