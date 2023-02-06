package com.example.datsan.service.impl;

import com.example.datsan.dto.request.PitchRequest;
import com.example.datsan.dto.response.PitchDetailResponse;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.pitch.PitchType;
import com.example.datsan.entity.user.PitchSystemManager;
import com.example.datsan.repository.PitchRepository;
import com.example.datsan.repository.PitchSystemManagerRepository;
import com.example.datsan.repository.PitchSystemRepository;
import com.example.datsan.repository.PitchTypeRepository;
import com.example.datsan.service.ImageService;
import com.example.datsan.service.PitchService;
import com.example.datsan.service.UnitPriceService;
import com.example.datsan.util.PitchUtils;
import com.example.datsan.util.TimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;

@Service
public class PitchServiceImpl implements PitchService {

    @Autowired
    private PitchRepository pitchRepository;

    @Autowired
    private PitchSystemManagerRepository managerRepository;

    @Autowired
    private PitchSystemRepository systemRepository;

    @Autowired
    private PitchTypeRepository typeRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UnitPriceService priceService;

    @Override
    public String addPitch(PitchRequest request, Long systemId, Long userId) {
        String message = "";
        try {
            PitchSystem pitchSystem = systemRepository.findPitchSystemById(systemId);
            PitchType pitchType = typeRepository.findPitchTypeByName(request.getType());
            if(pitchRepository.getListPitchesBySystem(systemId).size() >= pitchSystem.getPitchLimited()){
                return "Số lượng sân con đã đạt giới hạn";
            }
            String priceValid = TimeUtils.isUnitPricesValid(request.getUnitPrices(), pitchSystem.getHiredStart(), pitchSystem.getHiredEnd()).trim();
            if(!priceValid.equals("valid")){
                return priceValid;
            }

            Pitch pitch = new Pitch();
            pitch.setPitchSystem(pitchSystem);
            pitch.setPitchType(pitchType);
            pitch.setName(request.getName());
            pitch.setGrass(request.getGrass());
            pitch.setCreatedBy(userId);

            Pitch p = pitchRepository.save(pitch);
            if (request.getUnitPrices().size() > 0) {
                priceService.addUnitPrices(request.getUnitPrices(), p, userId);
            }
            if (request.getImages().size() > 0) {
                imageService.addImage(userId, p, request.getImages());
            }

            message = "success";
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình thêm sân";
        }
        return message;
    }

    @Override
    public Boolean isPitchExisted(Long id, String name) {
        return pitchRepository.isPitchExisted(id, name.trim());
    }

    @Override
    public PitchDetailResponse getPitchDetail(Long systemId, Long id) {
        Pitch pitch = pitchRepository.findPitchById(id);
        PitchSystemManager manager = managerRepository.findSystemOwner(systemId);
        PitchDetailResponse pitchDetailResponse = PitchUtils.convertFromPitch(pitch, manager);

        return pitchDetailResponse;
    }

    @Override
    public String updatePitch(PitchRequest request, Long userId, Long id) {
        try {
            PitchType pitchType = typeRepository.findPitchTypeByName(request.getType());
            Pitch pitch = pitchRepository.findPitchById(id);
            PitchSystem pitchSystem = systemRepository.findPitchSystemById(pitch.getPitchSystem().getId());

            String priceValid = TimeUtils.isUnitPricesValid(request.getUnitPrices(), pitchSystem.getHiredStart(), pitchSystem.getHiredEnd()).trim();
            if(!priceValid.equals("valid")){
                return priceValid;
            }
            pitch.setPitchType(pitchType);
            pitch.setName(request.getName());
            pitch.setGrass(request.getGrass());
            pitch.setUpdatedBy(userId);
            if (request.getUnitPrices().size() > 0) {
                priceService.updateUnitPrice(userId, pitch, request.getUnitPrices());
            }
            if (request.getImages().size() > 0) {
                imageService.updateImage(userId, pitch, request.getImages());
            }

            pitchRepository.save(pitch);
            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public void deletePitch(Long id) {
        Pitch pitch = pitchRepository.findPitchById(id);
        pitch.setDeleted(true);
        pitchRepository.save(pitch);
    }

    @Override
    public Pitch findPitchById(Long id) {
        return pitchRepository.findPitchById(id);
    }
}
