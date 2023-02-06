package com.example.datsan.util;

import com.example.datsan.dto.response.*;
import com.example.datsan.entity.UnitPrice;
import com.example.datsan.entity.booking.Booking;
import com.example.datsan.entity.pitch.Image;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.pitch.Rating;
import com.example.datsan.entity.user.PitchSystemManager;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class PitchUtils {

    public static PitchDetailResponse convertFromPitch(Pitch pitch, PitchSystemManager manager) {
        PitchDetailResponse pitchDetailResponse = new PitchDetailResponse();
        pitchDetailResponse.setId(pitch.getId());
        pitchDetailResponse.setName(pitch.getName());
        pitchDetailResponse.setGrass(pitch.getGrass());
        pitchDetailResponse.setImages(convertFromImages(pitch.getImages()));
        pitchDetailResponse.setType(pitch.getPitchType().getName());
        pitchDetailResponse.setUnitPrices(convertFromUnitPrices(pitch.getUnitPrices()));
        pitchDetailResponse.setSystemName(pitch.getPitchSystem().getName());
        pitchDetailResponse.setOwner(manager.getUser().getName());

        return pitchDetailResponse;
    }

    public static SystemDetailResponse convertToSystemDetailResponse(PitchSystem pitchSystem, PitchSystemManager manager, String price, List<PitchResponse> pitches, List<RatingResponse> ratings, boolean enableRating) {
        SystemDetailResponse response = new SystemDetailResponse();
        response.setId(pitchSystem.getId());
        response.setName(pitchSystem.getName());
        if (manager != null) {
            response.setOwner(manager.getUser().getName());
            response.setOwnerPhone(manager.getUser().getPhone());
        }
        if (pitches != null && pitches.size() > 0) {
            response.setPitches(pitches);
            if (pitches.get(0).getImage() != null) {
                response.setImage(pitches.get(0).getImage());
            } else {
                response.setImage(null);
            }
        } else {
            response.setPitches(null);
            response.setImage(null);
        }
        response.setHiredStart(pitchSystem.getHiredStart());
        response.setHiredEnd(pitchSystem.getHiredEnd());
        response.setPrice(price);
        response.setRate(pitchSystem.getRate());
        if (ratings != null && ratings.size() > 0) {
            response.setRatings(ratings);
        } else {
            response.setRatings(null);
        }
        response.setDescription(pitchSystem.getDescription());
        response.setDistance("5km");
        response.setAddressDetail(pitchSystem.getAddress().getAddressDetail());
        response.setCity(pitchSystem.getAddress().getCity());
        response.setDistrict(pitchSystem.getAddress().getDistrict());
        response.setWard(pitchSystem.getAddress().getWard());
        response.setEnableRating(enableRating);

        return response;
    }

    public static List<UnitPriceResponse> convertFromUnitPrices(Set<UnitPrice> unitPrices) {
        List<UnitPriceResponse> unitPriceResponses = new ArrayList<>();
        for (UnitPrice up : unitPrices) {
            UnitPriceResponse unitPriceResponse = new UnitPriceResponse();
            unitPriceResponse.setId(up.getId());
            unitPriceResponse.setTimeStart(up.getTimeStart());
            unitPriceResponse.setTimeEnd(up.getTimeEnd());
            unitPriceResponse.setPrice(up.getPrice());
            unitPriceResponse.setIsWeekend(up.getIsWeekend());

            unitPriceResponses.add(unitPriceResponse);
        }

        return unitPriceResponses;
    }

    public static BookingDetailResponse convertToBookingDetail(Booking booking, boolean enableRating, List<TeamResponse> teams) {
        BookingDetailResponse response = new BookingDetailResponse();
        response.setId(booking.getId());
        response.setTenant(booking.getUser().getName());
        response.setPitchId(booking.getPitch().getId());
        response.setPitchName(booking.getPitch().getName());
        response.setSystemId(booking.getPitch().getPitchSystem().getId());
        response.setSystemName(booking.getPitch().getPitchSystem().getName());
        response.setRentDate(booking.getRentDate());
        response.setRentStart(booking.getRentStart());
        response.setRentEnd(booking.getRentEnd());
        response.setTotalPrice(booking.getTotalPrice());
        response.setNote(booking.getNote());
        response.setStatus(booking.getStatus());
        response.setCode(booking.getCode());
        response.setPayment(booking.getPayment());
        if(teams != null && teams.size() > 0){
            response.setTeams(teams);
        } else {
            response.setTeams(null);
        }
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        response.setEnableRating(enableRating);

        return response;
    }

    public static String generateBookingCode(String systemName, Long id) {
        try {
            String name = systemName.trim();
            String[] t = name.split(" ");
            String code = "DS-";

            for (String s : t) {
                if (s != null && !s.isEmpty()) {
                    String key = String.valueOf(s.charAt(0)).toUpperCase();
                    code = code.concat(key);
                }
            }
            code = code.concat(RandomStringUtils.randomNumeric(4));
            code = code.concat("BC");
            code = code.concat(id.toString());
            return code;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static List<ImageResponse> convertFromImages(Set<Image> images) {
        List<ImageResponse> responses = new ArrayList<>();
        for (Image i : images) {
            ImageResponse response = new ImageResponse();
            response.setId(i.getId());
            response.setUrl(i.getUrl());

            responses.add(response);
        }
        return responses;
    }

    public static SystemManagerDetailResponse convertToSystemManagerDetail(PitchSystem pitchSystem, String price, List<PitchDetailResponse> pitches, List<ManagerResponse> managers, OwnerResponse owner, List<RatingResponse> ratings) {
        SystemManagerDetailResponse response = new SystemManagerDetailResponse();
        response.setId(pitchSystem.getId());
        response.setName(pitchSystem.getName());
        response.setOwner(owner);
        if (managers != null && managers.size() > 0) {
            response.setManagers(managers);
        }
        if (pitches != null && pitches.size() > 0) {
            response.setPitches(pitches);
            if (pitches.get(0).getImages() != null) {
                if (pitches.get(0).getImages() != null && pitches.get(0).getImages().size() > 0) {
                    response.setImage(pitches.get(0).getImages().get(0).getUrl());
                } else {
                    response.setImage(null);
                }
            } else {
                response.setImage(null);
            }
        } else {
            response.setPitches(null);
            response.setImage(null);
        }
        response.setHiredStart(pitchSystem.getHiredStart());
        response.setHiredEnd(pitchSystem.getHiredEnd());
        response.setPrice(price);
        response.setRate(pitchSystem.getRate());
        if (ratings != null && ratings.size() > 0) {
            response.setRatings(ratings);
        } else {
            response.setRatings(null);
        }
        response.setDescription(pitchSystem.getDescription());
        response.setDistance("5km");
        response.setAddressDetail(pitchSystem.getAddress().getAddressDetail());
        response.setCity(pitchSystem.getAddress().getCity());
        response.setDistrict(pitchSystem.getAddress().getDistrict());
        response.setWard(pitchSystem.getAddress().getWard());

        return response;
    }

    public static SystemResponse convertToSystemResponse(PitchSystem pitchSystem, String price) {
        SystemResponse response = new SystemResponse();
        response.setId(pitchSystem.getId());
        response.setName(pitchSystem.getName());
        if (pitchSystem.getAddress() != null) {
            response.setCity(pitchSystem.getAddress().getCity());
            response.setDistrict(pitchSystem.getAddress().getDistrict());
            response.setWard(pitchSystem.getAddress().getWard());
            response.setAddressDetail(pitchSystem.getAddress().getAddressDetail());
        }
        response.setPrice(price);
        if (pitchSystem.getPitches() != null && pitchSystem.getPitches().size() > 0) {
            List<Pitch> pitches = new ArrayList<>(pitchSystem.getPitches());
            if (pitches.get(0).getImages() != null && pitches.get(0).getImages().size() > 0) {
                List<Image> images = new ArrayList<>(pitches.get(0).getImages());
                response.setImage(images.get(0).getUrl());
            } else {
                response.setImage(null);
            }
        } else {
            response.setImage(null);
        }
        return response;
    }

    public static SystemOwnerResponse convertToSystemOwner(PitchSystem pitchSystem, List<ManagerResponse> managers) {
        SystemOwnerResponse response = new SystemOwnerResponse();
        response.setId(pitchSystem.getId());
        response.setName(pitchSystem.getName());
        response.setManagers(managers);
        response.setRate(pitchSystem.getRate());
        response.setPitchLimit(pitchSystem.getPitchLimited());
        return response;
    }

    public static SystemOwnerDetailResponse convertToSystemOwnerDetail(PitchSystem pitchSystem, String price, List<PitchDetailResponse> pitches, List<ManagerResponse> managers, List<RatingResponse> ratings) {
        SystemOwnerDetailResponse response = new SystemOwnerDetailResponse();
        response.setId(pitchSystem.getId());
        response.setName(pitchSystem.getName());
        if (managers != null && managers.size() > 0) {
            response.setManagers(managers);
        }
        if (pitches != null && pitches.size() > 0) {
            response.setPitches(pitches);
            if (pitches.get(0).getImages() != null) {
                if (pitches.get(0).getImages() != null && pitches.get(0).getImages().size() > 0) {
                    response.setImage(pitches.get(0).getImages().get(0).getUrl());
                } else {
                    response.setImage(null);
                }
            } else {
                response.setImage(null);
            }
            response.setPitchQuantity(pitchSystem.getPitches().size());
        } else {
            response.setPitchQuantity(0);
            response.setPitches(null);
            response.setImage(null);
        }
        response.setHiredStart(pitchSystem.getHiredStart());
        response.setHiredEnd(pitchSystem.getHiredEnd());
        response.setPrice(price);
        response.setRate(pitchSystem.getRate());
        if (ratings != null && ratings.size() > 0) {
            response.setRatings(ratings);
        } else {
            response.setRatings(null);
        }
        response.setDescription(pitchSystem.getDescription());
        response.setAddressDetail(pitchSystem.getAddress().getAddressDetail());
        response.setCity(pitchSystem.getAddress().getCity());
        response.setDistrict(pitchSystem.getAddress().getDistrict());
        response.setWard(pitchSystem.getAddress().getWard());
        if(pitchSystem.getPitchLimited() > 0){
            response.setPitchLimit(pitchSystem.getPitchLimited());
        } else {
            response.setPitchLimit(0);
        }

        return response;
    }

    public static RatingResponse convertToRatingResponse(Rating rating, boolean enableEditing) {
        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setUser(rating.getUser().getName());
        response.setRate(rating.getRate());
        response.setContent(rating.getContent());
        response.setCreatedAt(rating.getCreatedAt());
        response.setUpdatedAt(rating.getUpdatedAt());
        response.setEnableEditing(enableEditing);

        return response;
    }

    public static SystemManagerResponse convertToSystemManager(PitchSystem pitchSystem, OwnerResponse owner) {
        SystemManagerResponse response = new SystemManagerResponse();
        response.setId(pitchSystem.getId());
        response.setName(pitchSystem.getName());
        response.setOwner(owner);
        response.setRate(pitchSystem.getRate());
        if(pitchSystem.getAddress() != null){
            response.setCity(pitchSystem.getAddress().getCity());
            response.setDistrict(pitchSystem.getAddress().getDistrict());
            response.setWard(pitchSystem.getAddress().getWard());
            response.setAddressDetail(pitchSystem.getAddress().getAddressDetail());
        }
        return response;
    }

    public static BookingResponse convertToBookingResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setPitch(booking.getPitch().getName() + " (" + booking.getPitch().getPitchSystem().getName() + ")");
        response.setRentDate(booking.getRentDate());
        response.setUpdatedAt(booking.getUpdatedAt());
        response.setTime(booking.getRentStart() + " - " + booking.getRentEnd());
        response.setPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());
        return response;
    }

    public static PitchResponse convertToPitchResponse(Pitch pitch, String price) {
        PitchResponse response = new PitchResponse();
        response.setId(pitch.getId());
        response.setName(pitch.getName());
        response.setType(pitch.getPitchType().getName());
        response.setGrass(pitch.getGrass());
        response.setPrice(price);
        if (pitch.getImages() != null && pitch.getImages().size() > 0) {
            List<Image> images = new ArrayList<>(pitch.getImages());
            response.setImage(images.get(0).getUrl());
        } else {
            response.setImage(null);
        }
        return response;
    }

    public static SystemPendingResponse convertToSystemPending(PitchSystem ps, UserResponse owner){
        SystemPendingResponse response = new SystemPendingResponse();
        response.setId(ps.getId());
        response.setName(ps.getName());
        response.setOwner(owner);
        if(ps.getAddress() != null) {
            response.setCity(ps.getAddress().getCity());
            response.setDistrict(ps.getAddress().getDistrict());
            response.setWard(ps.getAddress().getWard());
            response.setAddressDetail(ps.getAddress().getAddressDetail());
            response.setLat(ps.getAddress().getLat());
            response.setLng(ps.getAddress().getLng());
        }
        response.setUpdatedAt(TimeUtils.convertToDateTime(ps.getUpdatedAt()));
        return response;
    }
}
