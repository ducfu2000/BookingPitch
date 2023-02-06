package com.example.datsan.service.impl;

import com.example.datsan.dto.intermediate.PitchSystemDistance;
import com.example.datsan.dto.request.ApproveSystemRequest;
import com.example.datsan.dto.request.PitchSystemRequest;
import com.example.datsan.dto.response.*;
import com.example.datsan.entity.Address;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.user.PitchSystemManager;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.BookingRepository;
import com.example.datsan.repository.PitchSystemRepository;
import com.example.datsan.repository.dao.PitchDAO;
import com.example.datsan.repository.dao.PitchSystemDAO;
import com.example.datsan.service.*;
import com.example.datsan.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class PitchSystemServiceImpl implements PitchSystemService {

    @Autowired
    private PitchSystemRepository pitchSystemRepository;

    @Autowired
    private PitchSystemManagerService managerService;

    @Autowired
    private PitchSystemDAO pitchSystemDAO;

    @Autowired
    private AddressService addressService;

    @Autowired
    private UnitPriceService priceService;

    @Autowired
    private UserService userService;

    @Autowired
    private PitchDAO pitchDAO;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public String addNewPitchSystem(PitchSystemRequest request, Long id) {
        String message = "";
        try {
            Address address = addressService.findAddress(request.getCity(),
                    request.getDistrict(),
                    request.getWard(),
                    request.getAddressDetail());
            if (address == null) {
                address = addressService.addNewAddress(id, request.getCity(),
                        request.getDistrict(),
                        request.getWard(),
                        request.getAddressDetail(), request.getLat(), request.getLng());
            } else {
                User user = userService.findUserByAddress(address);
                if (user == null) {
                    return "Địa chỉ đã tồn tại";
                }
                if (id != user.getId()) {
                    return "Địa chỉ đã tồn tại";
                } else {
                    if (pitchSystemRepository.isAddressAlreadyUsed(id, address)) {
                        return "Địa chỉ đã được bạn sử dụng cho hệ thống sân khác";
                    }
                    ;
                }
            }
            PitchSystem pitchSystem = new PitchSystem();
            pitchSystem.setName(request.getName());
            pitchSystem.setDescription(request.getDescription());
            pitchSystem.setHiredStart(TimeUtils.convertToTime(request.getHiredStart()));
            pitchSystem.setHiredEnd(TimeUtils.convertToTime(request.getHiredEnd()));
            pitchSystem.setStatus("Pending");
            pitchSystem.setAddress(address);
            pitchSystem.setDeleted(false);
            pitchSystem.setRate((float) 0);
            pitchSystem.setCreatedBy(id);

            pitchSystemRepository.save(pitchSystem);

            message = "success";
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình thêm hệ thống sân";
        }
        return message;
    }

    @Override
    public SystemDetailResponse getSystemDetailResponse(Long id, String date, String rentStart, String rentEnd, Long uid) {
        try {
            PitchSystem ps = pitchSystemRepository.findPitchSystemById(id);
            PitchSystemManager manager = managerService.findSystemOwner(id);
            SystemDetailResponse response;
            String price = priceService.getRangeOfPriceForSystem(id);
            List<PitchResponse> pitchResponses = new ArrayList<>();
            List<Pitch> pitches = pitchDAO.getListPitches(id, date, rentStart, rentEnd);
            for (Pitch p : pitches) {
                String pitchPrice = priceService.getRangeOfPriceForPitch(p.getId());
                PitchResponse pitch = PitchUtils.convertToPitchResponse(p, pitchPrice);
                pitchResponses.add(pitch);
            }
            Date currentDate = Calendar.getInstance().getTime();
            java.sql.Date sqlDate = new java.sql.Date(currentDate.getTime());
            Time currentTime = Time.valueOf(LocalTime.now());
            boolean enableRating = bookingRepository.isBookingCompleted(id, uid, sqlDate, currentTime);
            List<RatingResponse> ratings = ratingService.getListRating(id, uid);
            response = PitchUtils.convertToSystemDetailResponse(ps, manager, price, pitchResponses, ratings, enableRating);

            return response;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<SystemResponse> findPitchSystems(String city, String district, String ward, String addressDetail, String searchDate, String timeStart, String timeEnd, String systemName, String type) {
        try {
            List<PitchSystem> pitchSystems = pitchSystemDAO.findPitchSystems(city, district, ward, addressDetail, searchDate, timeStart, timeEnd, systemName, type);
            List<SystemResponse> responses = new ArrayList<>();

            for (PitchSystem ps : pitchSystems) {
                String price = priceService.getRangeOfPriceForSystem(ps.getId());
                SystemResponse systemResponse = PitchUtils.convertToSystemResponse(ps, price);

                responses.add(systemResponse);
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<SystemResponse> findLocalPitchSystems(String city, String district, String lat, String lng) {
        try {
            List<PitchSystem> pitchSystems = pitchSystemDAO.findPitchSystems(city, district, null, null, null, null, null, null, null);
            List<SystemResponse> systemResponses = new ArrayList<>();
            List<PitchSystemDistance> pitchSystemDistances = new ArrayList<>();

            for (PitchSystem ps : pitchSystems) {
                String price = priceService.getRangeOfPriceForSystem(ps.getId());
                if (ps.getPitches() != null && ps.getPitches().size() > 0) {
                    SystemResponse systemResponse = PitchUtils.convertToSystemResponse(ps, price);
                    Double distance = DistanceUtils.calculateDistance(ps.getAddress().getLat(), ps.getAddress().getLng(), lat, lng);
                    pitchSystemDistances.add(new PitchSystemDistance(ps.getId(), distance));
                    systemResponses.add(systemResponse);
                }
            }
            List<SystemResponse> responses = new ArrayList<>();
            List<PitchSystemDistance> top5 = SortUtils.sortTop5(pitchSystemDistances);
            for (PitchSystemDistance psd : top5) {
                for (SystemResponse psr : systemResponses) {
                    if (psr.getId() == psd.getId()) {
                        psr.setDistance(String.format("%,.2f", psd.getDistance()) + " km");
                        responses.add(psr);
                        break;
                    }
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<SystemResponse> findTopPitches(Pageable pageable) {
        try {
            List<PitchSystem> pitchSystems = pitchSystemRepository.findTopPitches(pageable);
            List<SystemResponse> responses = new ArrayList<>();
            if (pitchSystems.size() > 0) {
                for (PitchSystem ps : pitchSystems) {
                    String price = priceService.getRangeOfPriceForSystem(ps.getId());
                    SystemResponse systemResponse = PitchUtils.convertToSystemResponse(ps, price);

                    responses.add(systemResponse);
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public void deletePitchSystem(Long id) {
        PitchSystem pitchSystem = pitchSystemRepository.findPitchSystemById(id);
        pitchSystem.setDeleted(true);
        pitchSystemRepository.save(pitchSystem);
    }

    @Override
    public Boolean isPitchSystemExisted(Long id, String name) {
        return pitchSystemRepository.isPitchSystemExisted(id, name);
    }

    @Override
    public String updatePitchSystem(PitchSystemRequest request, Long userId, Long id) {
        String message = "";
        try {
            PitchSystem pitchSystem = pitchSystemRepository.findPitchSystemById(id);
            pitchSystem.setName(request.getName());
            pitchSystem.setDescription(request.getDescription());
            pitchSystem.setHiredStart(Time.valueOf(request.getHiredStart()));
            pitchSystem.setHiredEnd(Time.valueOf(request.getHiredEnd()));
            pitchSystem.setUpdatedBy(userId);

            pitchSystemRepository.save(pitchSystem);
            message = "success";
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình cập nhật hệ thống sân";
        }

        return message;
    }

    @Override
    public List<SystemPendingResponse> getListSystemsPending(Pageable pageable) {
        try {
            List<PitchSystem> systems = pitchSystemRepository.getSystemPending(pageable);
            List<SystemPendingResponse> responses = new ArrayList<>();
            if (systems.size() > 0) {
                for (PitchSystem ps : systems) {
                    User user = userService.findUserById(ps.getCreatedBy());
                    UserResponse owner = UserUtils.convertToUserResponse(user);
                    SystemPendingResponse response = PitchUtils.convertToSystemPending(ps, owner);
                    responses.add(response);
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public String approvePitchSystem(Long adminId, Long id, ApproveSystemRequest request) {
        String message = "";
        try {
            PitchSystem ps = pitchSystemRepository.getSystemPendingById(id);
            ps.getAddress().setCity(request.getCity());
            ps.getAddress().setDistrict(request.getDistrict());
            ps.getAddress().setWard(request.getWard());
            ps.getAddress().setAddressDetail(request.getAddressDetail());
            ps.getAddress().setLat(request.getLat());
            ps.getAddress().setLng(request.getLng());
            ps.setPitchLimited(request.getPitchLimit());
            ps.setStatus("Approved");
            ps.setUpdatedBy(adminId);

            pitchSystemRepository.save(ps);
            Long ownerId = ps.getCreatedBy();
            User user = userService.findUserById(ownerId);

            managerService.addNewPitchSystem(user, ps, adminId);
            message = "success";
        } catch (Exception ex) {
            message = ex.getMessage();
        }

        return message;
    }

    @Override
    public List<SystemManagerResponse> getAllSystemForManager(Long id) {
        try {
            List<PitchSystemManager> managers = managerService.findAllByUserId(id);
            List<PitchSystem> pitchSystems = new ArrayList<>();
            List<SystemManagerResponse> responses = new ArrayList<>();

            if (managers.size() > 0) {
                for (PitchSystemManager m : managers) {
                    PitchSystem p = m.getPitchSystem();
                    pitchSystems.add(p);
                }
            }

            if (pitchSystems.size() > 0) {
                for (PitchSystem ps : pitchSystems) {
                    PitchSystemManager owner = managerService.findSystemOwner(ps.getId());
                    OwnerResponse ownerResponse = UserUtils.convertToOwnerResponse(owner.getUser());
                    SystemManagerResponse response = PitchUtils.convertToSystemManager(ps, ownerResponse);
                    responses.add(response);
                }
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    @Override
    public SystemManagerDetailResponse getSystemDetailForManager(Long id) {
        try {
            String price = priceService.getRangeOfPriceForSystem(id);
            PitchSystem system = pitchSystemRepository.findPitchSystemById(id);
            PitchSystemManager manager = managerService.findSystemOwner(id);
            SystemManagerDetailResponse managerResponse;
            List<PitchDetailResponse> pitchDetailResponses = new ArrayList<>();
            for (Pitch p : system.getPitches()) {
                if (!p.isDeleted()) {
                    PitchDetailResponse response = PitchUtils.convertFromPitch(p, manager);
                    pitchDetailResponses.add(response);
                }
            }
            List<ManagerResponse> managerResponses = managerService.findSystemManagers(id);
            OwnerResponse ownerResponse = UserUtils.convertToOwnerResponse(manager.getUser());
            List<RatingResponse> ratings = ratingService.getListRating(id, null);
            managerResponse = PitchUtils.convertToSystemManagerDetail(system, price, pitchDetailResponses, managerResponses, ownerResponse, ratings);
            return managerResponse;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<SystemOwnerResponse> getAllSystemForOwner(Long id) {
        try {
            List<PitchSystemManager> managers = managerService.findAllByUserId(id);
            List<PitchSystem> pitchSystems = new ArrayList<>();
            List<SystemOwnerResponse> responses = new ArrayList<>();

            for (PitchSystemManager m : managers) {
                PitchSystem p = m.getPitchSystem();
                pitchSystems.add(p);
            }

            for (PitchSystem ps : pitchSystems) {
                List<ManagerResponse> managerResponses = managerService.findSystemManagers(ps.getId());
                SystemOwnerResponse response = PitchUtils.convertToSystemOwner(ps, managerResponses);
                responses.add(response);
            }

            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    @Override
    public SystemOwnerDetailResponse getSystemDetailForOwner(Long id) {
        try {
            SystemOwnerDetailResponse response;
            PitchSystem system = pitchSystemRepository.findPitchSystemById(id);
            String price = priceService.getRangeOfPriceForSystem(id);
            PitchSystemManager owner = managerService.findSystemOwner(id);
            List<PitchDetailResponse> pitchDetailResponses = new ArrayList<>();
            for (Pitch p : system.getPitches()) {
                if (!p.isDeleted()) {
                    PitchDetailResponse ps = PitchUtils.convertFromPitch(p, owner);
                    pitchDetailResponses.add(ps);
                }
            }
            List<RatingResponse> ratings = ratingService.getListRating(system.getId(), null);
            List<ManagerResponse> managerResponses = managerService.findSystemManagers(system.getId());
            response = PitchUtils.convertToSystemOwnerDetail(system, price, pitchDetailResponses, managerResponses, ratings);
            return response;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public SystemPendingResponse getSystemPendingDetail(Long id) {
        try {
            SystemPendingResponse response;
            PitchSystem system = pitchSystemRepository.getSystemPending(id);
            User user = userService.findUserById(system.getCreatedBy());
            UserResponse owner = UserUtils.convertToUserResponse(user);
            response = PitchUtils.convertToSystemPending(system, owner);

            return response;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public List<SystemPendingResponse> getListSystemPending(Long id) {
        try {
            List<PitchSystem> pitchSystems = pitchSystemRepository.getListSystemPending(id);
            if(pitchSystems != null && pitchSystems.size() > 0){
                User user = userService.findUserById(id);
                UserResponse owner = UserUtils.convertToUserResponse(user);
                List<SystemPendingResponse> responses = new ArrayList<>();
                for(PitchSystem ps : pitchSystems){
                    SystemPendingResponse response = new SystemPendingResponse();
                    response = PitchUtils.convertToSystemPending(ps, owner);
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
