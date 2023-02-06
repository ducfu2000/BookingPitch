package com.example.datsan.service.impl;

import com.example.datsan.dto.response.ManagerResponse;
import com.example.datsan.dto.response.SystemResponse;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.user.PitchSystemManager;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.PitchSystemManagerRepository;
import com.example.datsan.service.PitchSystemManagerService;
import com.example.datsan.service.UnitPriceService;
import com.example.datsan.util.PitchUtils;
import com.example.datsan.util.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PitchSystemManagerServiceImpl implements PitchSystemManagerService {

    @Autowired
    private PitchSystemManagerRepository managerRepository;

    @Autowired
    private UnitPriceService priceService;

    @Override
    public PitchSystemManager addNewPitchSystem(User user, PitchSystem pitchSystem, Long adminId) {
        PitchSystemManager pitchSystemManager = new PitchSystemManager();
        pitchSystemManager.setUser(user);
        pitchSystemManager.setPitchSystem(pitchSystem);
        pitchSystemManager.setCreatedBy(adminId);
        pitchSystemManager.setDeleted(false);
        return managerRepository.save(pitchSystemManager);
    }

    @Override
    public PitchSystemManager findSystemOwner(Long id) {
        return managerRepository.findSystemOwner(id);
    }

    @Override
    public List<PitchSystemManager> findAllByUserId(Long id) {
        return managerRepository.findAllByUserId(id);
    }

    @Override
    public List<PitchSystemManager> findSystemManager(Long id) {
        return managerRepository.findSystemManager(id);
    }

    @Override
    public List<ManagerResponse> findSystemManagers(Long id) {
        try {
            List<PitchSystemManager> systemManagers = managerRepository.findSystemManager(id);
            List<User> users = new ArrayList<>();
            if (systemManagers != null && systemManagers.size() > 0) {
                for (PitchSystemManager systemManager : systemManagers) {
                    users.add(systemManager.getUser());
                }
            }
            if (users.size() > 0) {
                List<ManagerResponse> responses = new ArrayList<>();
                for (User user : users) {
                    List<SystemResponse> systems = new ArrayList<>();
                    LocalDateTime dateTime = null;
                    PitchSystemManager manager = managerRepository.findAllByManager(user.getId(), id);
                    if (manager != null) {
                        String price = priceService.getRangeOfPriceForSystem(manager.getPitchSystem().getId());
                        SystemResponse sr = PitchUtils.convertToSystemResponse(manager.getPitchSystem(), price);
                        systems.add(sr);
                        dateTime = manager.getCreatedAt();
                    }
                    ManagerResponse response = UserUtils.convertToManagerResponse(user, systems, dateTime);

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
