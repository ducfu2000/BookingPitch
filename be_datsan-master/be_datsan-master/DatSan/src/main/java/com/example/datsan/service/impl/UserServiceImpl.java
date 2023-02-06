package com.example.datsan.service.impl;

import com.example.datsan.dto.request.ChangePasswordRequest;
import com.example.datsan.dto.request.NewPasswordRequest;
import com.example.datsan.dto.request.SignupRequest;
import com.example.datsan.dto.request.UserRequest;
import com.example.datsan.dto.response.UserResponse;
import com.example.datsan.entity.Address;
import com.example.datsan.entity.user.Role;
import com.example.datsan.entity.user.User;
import com.example.datsan.entity.user.UserPrincipal;
import com.example.datsan.repository.RoleRepository;
import com.example.datsan.repository.UserRepository;
import com.example.datsan.service.AddressService;
import com.example.datsan.service.UserService;
import com.example.datsan.util.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AddressService addressService;

    @Override
    public UserPrincipal findByPhone(String username) {
        User user = userRepository.findUserByPhone(username);
        UserPrincipal userPrincipal = new UserPrincipal();
        if (null != user) {
            List<String> authorities = new ArrayList<>();
            if (user.getRole() != null) {
                authorities.add(user.getRole().getName());
                if (user.getIsManager() && user.getRole().getName().equals("TENANT")) {
                    authorities.add("MANAGER");
                }
            }
            if (user.getIsActived() == true) {
                userPrincipal.setActived(true);
            }
            if (user.isDeleted() == true) {
                userPrincipal.setDeleted(true);
            }
            userPrincipal.setUserId(user.getId());
            userPrincipal.setUsername(user.getPhone());
            userPrincipal.setPassword(user.getPassword());
            userPrincipal.setAuthorities(authorities);
        }
        return userPrincipal;
    }

    @Override
    public boolean isPhoneExisted(String phone) {
        boolean ret = userRepository.existsByPhone(phone);
        return ret;
    }

    @Override
    public boolean isPhoneNotActivate(String phone) {
        User u = userRepository.findUserByPhone(phone);
        return !u.getIsActived();
    }

    @Override
    public void addNewAccount(SignupRequest request) {

        String encodedPass = new BCryptPasswordEncoder().encode(request.getPassword());
        Role role = roleRepository.findRoleByName(request.getRole());

        User userReq = new User();
        userReq.setName(request.getName());
        userReq.setPassword(encodedPass);
        userReq.setPhone(request.getPhone());
        userReq.setIsActived(false);
        userReq.setDeleted(false);
        userReq.setIsManager(false);
        userReq.setRole(role);
        userRepository.save(userReq);
    }

    @Override
    public void modifyNotActiveAccount(SignupRequest request) {
        Role role = roleRepository.findRoleByName(request.getRole());
        User user = userRepository.findUserByPhone(request.getPhone());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setIsActived(false);
        user.setRole(role);

        userRepository.save(user);
    }

    @Override
    public boolean isAccountActivated(String phone) {
        User u = userRepository.findUserByPhone(phone);
        return u.getIsActived();
    }

    @Override
    public void activateAccount(String phone) {
        User user = userRepository.findUserByPhone(phone);
        user.setIsActived(true);
        user.setCreatedBy(user.getId());
        user.setUpdatedBy(user.getId());
        user.setOtp(null);

        userRepository.save(user);
    }

    @Override
    public String updatePassword(Long id, ChangePasswordRequest request) {
        String message = "";
        try {
            User user = userRepository.findUserById(id);
            if (request.getOldPass() == null) {
                return "Vui lòng nhập mật khẩu cũ";
            }
            if (request.getNewPass() == null) {
                return "Vui lòng nhập mật khẩu mới";
            }
            if (request.getOldPass().equals(request.getNewPass())) {
                return "Mật khẩu mới vui lòng khác với mật khẩu cũ";
            }
            if(!BCrypt.checkpw(request.getOldPass(), user.getPassword())){
                return "Mật khẩu cũ không chính xác, vui lòng nhập lại";
            }
            String encodePass = new BCryptPasswordEncoder().encode(request.getNewPass());
            user.setPassword(encodePass);
            user.setUpdatedBy(id);

            userRepository.save(user);
            message = "success";
        } catch (Exception ex) {
            message = ex.getMessage();
        }

        return message;
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findUserById(id);
    }

    @Override
    public User findUserByAddress(Address address) {
        return userRepository.findUserByAddress(address);
    }

    @Override
    public UserResponse findUserByPhone(String phone) {
        try {
            User user = userRepository.getUserByPhone(phone);
            if (user != null) {
                UserResponse response = UserUtils.convertToUserResponse(user);
                return response;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public UserResponse getUserProfile(Long id) {
        try {
            User user = userRepository.findUserById(id);
            return UserUtils.convertToUserResponse(user);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public String updateUser(Long id, UserRequest request) {
        String message = "";
        try {
            User user = userRepository.findUserById(id);
            user.setName(request.getName());
            Address address = addressService.findAddress(request.getCity(),
                    request.getDistrict(),
                    request.getWard(),
                    request.getAddressDetail());
            if (address == null) {
                address = addressService.addNewAddress(id, request.getCity(),
                        request.getDistrict(),
                        request.getWard(),
                        request.getAddressDetail(), request.getLat(), request.getLng());
            }
            user.setAddress(address);
            user.setUpdatedBy(id);

            userRepository.save(user);
            message = "success";
        } catch (Exception ex) {
            message = ex.getMessage();
        }
        return message;
    }

    @Override
    public String updatePhoneUser(Long id, String phone) {
        String message = "";
        try {
            User user = userRepository.findUserById(id);
            user.setPhone(phone);
            user.setUpdatedBy(id);
            userRepository.save(user);
            message = "success";
        } catch (Exception ex) {
            message = ex.getMessage();
        }
        return message;
    }

    @Override
    public User addNewManager(Long id, String phone, String name, String password) {
        User user = new User();
        user.setName(name);
        user.setPhone(phone);
        user.setCreatedBy(id);
        user.setDeleted(false);
        user.setIsActived(true);
        user.setIsManager(true);
        user.setRole(roleRepository.findRoleByName("MANAGER"));
        user.setPassword(new BCryptPasswordEncoder().encode(password));

        return userRepository.save(user);
    }

    @Override
    public User findUser(String phone) {
        return userRepository.getUserByPhone(phone);
    }

    @Override
    public String updateNewPassword(NewPasswordRequest request) {
        try {
            if(request.getPhone() == null){
                return "Vui lòng nhập số điện thoại";
            }
            if(request.getPassword() == null){
                return "Vui lòng nhập mật khẩu mới";
            }
            User user = userRepository.findUserByPhone(request.getPhone());
            if (user != null) {
                String password = new BCryptPasswordEncoder().encode(request.getPassword());
                user.setPassword(password);
                user.setUpdatedBy(user.getId());
                userRepository.save(user);
                return "success";
            }
            return "Có lỗi xảy ra";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
