package com.example.datsan.service;

import com.example.datsan.dto.request.ChangePasswordRequest;
import com.example.datsan.dto.request.NewPasswordRequest;
import com.example.datsan.dto.request.SignupRequest;
import com.example.datsan.dto.request.UserRequest;
import com.example.datsan.dto.response.UserResponse;
import com.example.datsan.entity.Address;
import com.example.datsan.entity.user.User;
import com.example.datsan.entity.user.UserPrincipal;

public interface UserService {

    UserPrincipal findByPhone(String username);

    boolean isPhoneExisted(String phone);

    boolean isPhoneNotActivate(String phone);

    void addNewAccount(SignupRequest request);

    void modifyNotActiveAccount(SignupRequest request);

    boolean isAccountActivated(String phone);

    void activateAccount(String phone);

    String updatePassword(Long id, ChangePasswordRequest request);

    User findUserById(Long id);

    User findUserByAddress(Address address);

    UserResponse findUserByPhone(String phone);

    UserResponse getUserProfile(Long id);

    String updateUser(Long id, UserRequest request);

    String updatePhoneUser(Long id, String phone);

    User addNewManager(Long id, String phone, String name, String password);

    User findUser(String phone);

    String updateNewPassword(NewPasswordRequest request);
}
