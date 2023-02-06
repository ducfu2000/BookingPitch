package com.example.datsan.util;

import com.example.datsan.dto.response.*;
import com.example.datsan.entity.user.User;
import org.apache.commons.lang3.RandomStringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserUtils {
    public static UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setPassword("********");
        response.setRole(user.getRole().getName());
        if (user.getAddress() != null) {
            response.setCity(user.getAddress().getCity());
            response.setDistrict(user.getAddress().getDistrict());
            response.setWard(user.getAddress().getWard());
            response.setAddressDetail(user.getAddress().getAddressDetail());
        }

        return response;
    }

    public static ManagerResponse convertToManagerResponse(User user, List<SystemResponse> systems, LocalDateTime dateTime) {
        ManagerResponse response = new ManagerResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setCreatedDate(dateTime);
        response.setSystems(systems);
        if (user.getAddress() != null) {
            response.setCity(user.getAddress().getCity());
            response.setDistrict(user.getAddress().getDistrict());
            response.setWard(user.getAddress().getWard());
            response.setAddressDetail(user.getAddress().getAddressDetail());
        }
        return response;
    }

    public static Boolean isContains(List<User> users, User user) {
        for (User u : users) {
            if (u.getId() == user.getId()) {
                return true;
            }
        }
        return false;
    }

    public static String generatePassword(Long id) {
        String password = RandomStringUtils.randomAlphanumeric(5);
        password = password.concat("Ds");
        password = password.concat(id.toString());
        return password;
    }

    public static OwnerResponse convertToOwnerResponse(User user) {
        OwnerResponse response = new OwnerResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        if (user.getAddress() != null) {
            response.setCity(user.getAddress().getCity());
            response.setDistrict(user.getAddress().getDistrict());
            response.setWard(user.getAddress().getWard());
            response.setAddressDetail(user.getAddress().getAddressDetail());
        }
        return response;
    }

    public static TeamMemberResponse convertToTeamMember(User user, Long id) {
        TeamMemberResponse response = new TeamMemberResponse();
        response.setId(user.getId());
        if(user.getId() != id) {
            response.setName(user.getName());
        } else {
            response.setName("Tôi");
        }
        response.setPhone(user.getPhone());
        return response;
    }

    public static List<OwnerManagerResponse> convertToOwnerManager(List<User> users){
        List<OwnerManagerResponse> responses = new ArrayList<>();
        for(User user : users){
            OwnerManagerResponse response = new OwnerManagerResponse();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setPhone(user.getPhone());

            responses.add(response);
        }
        return responses;
    }
}
