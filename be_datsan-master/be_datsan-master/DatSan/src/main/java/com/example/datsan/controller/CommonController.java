package com.example.datsan.controller;

import com.example.datsan.dto.request.*;
import com.example.datsan.dto.response.UserNotificationResponse;
import com.example.datsan.dto.response.UserResponse;
import com.example.datsan.entity.OtpSessionModel;
import com.example.datsan.entity.user.UserPrincipal;
import com.example.datsan.filter.JwtRequestFilter;
import com.example.datsan.filter.JwtUtil;
import com.example.datsan.service.TokenService;
import com.example.datsan.service.UserNotificationService;
import com.example.datsan.service.UserService;
import com.example.datsan.util.OtpUtils;
import com.example.datsan.util.SmsUtils;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping("/api/common")
@CrossOrigin(origins = "http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com:443")
public class CommonController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtRequestFilter filter;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private SmsUtils smsUtils;

    @GetMapping("/logout")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> logoutAccount(HttpServletRequest request, @RequestParam("token") String deviceToken) {
        Long id = filter.getUserIdFromToken(request);
        tokenService.deleteToken(id, deviceToken);

        JSONObject response = new JSONObject();
        response.put("message", "logout");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAccount(@RequestBody LoginRequest loginRequest) {
        JSONObject response = new JSONObject();
        String message = "";
        try {
            UserPrincipal userPrincipal = userService.findByPhone(loginRequest.getUsername());
            if (userPrincipal.isDeleted()) {
                response.put("message", "Tài khoản đã bị khoá");
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }
            if (!userPrincipal.isActived()) {
                response.put("message", "Tài khoản chưa được active");
                return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
            }
            if (null == loginRequest || !new BCryptPasswordEncoder().matches(loginRequest.getPassword(), userPrincipal.getPassword())) {
                response.put("message", "Số điện thoại hoặc mật khẩu không đúng");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            String token = jwtUtil.generateToken(userPrincipal);
            response.put("role", userPrincipal.getAuthorities());
            response.put("token", token);
        } catch (Exception ex) {
            message = ex.getMessage();
        }

        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signupAccount(@RequestBody SignupRequest signupRequest, HttpSession session) throws IOException {
        if (!signupRequest.getRole().equalsIgnoreCase("tenant") && !signupRequest.getRole().equalsIgnoreCase("owner"))
            return new ResponseEntity<>("AccessDenied", HttpStatus.BAD_REQUEST);
        JSONObject ret = new JSONObject();
        String message = "";

        if (userService.isPhoneExisted(signupRequest.getPhone())) {
            if (!userService.isPhoneNotActivate(signupRequest.getPhone())) {
                message = "PhoneExisted";
            } else {
                message = "RegisterSuccess";
                userService.modifyNotActiveAccount(signupRequest);
            }
        } else {
            message = "RegisterSuccess";
            userService.addNewAccount(signupRequest);
        }
        ret.put("message", message);

        if (!message.equalsIgnoreCase("PhoneExisted")) {
            String otp = OtpUtils.getRandomOtp();
            OtpSessionModel otpSessionModel = new OtpSessionModel();
            otpSessionModel.setTime(1);
            otpSessionModel.setOtp(otp);
            otpSessionModel.setPhone(signupRequest.getPhone());
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MINUTE, 1);
            otpSessionModel.setExpireTime(cal.getTime());
            session.setAttribute("otp_session", otpSessionModel);
            session.setMaxInactiveInterval(300);
            System.out.println("OTP:-----------------------------------------------------------------------------------------------" + otp + "---------" + signupRequest.getPhone());
            //gui otp
            smsUtils.sendGetJSON("Baotrixemay", signupRequest.getPhone(), otp, " la ma xac minh dang ky Baotrixemay cua ban");
            //message += otp;
        } else {
            ret.put("message", message);
            return new ResponseEntity<>(ret, HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(ret);

    }

    @GetMapping("/resend")
    public ResponseEntity<?> resendOtp(@RequestParam("phone") @Nullable String phone, HttpSession session) throws IOException {
        String message = "";
        if (!userService.isPhoneExisted(phone)) {
            message = "Số điện thoại chưa được đăng ký trong hệ thống";
        } else {
            //ham chay restart otp()
            OtpSessionModel otpSessionModel = (OtpSessionModel) session.getAttribute("otp_session");
            if (otpSessionModel != null) {
                otpSessionModel.setTime(otpSessionModel.getTime() + 1);

                if (otpSessionModel.getTime() > 3) {
                    message = "Vui lòng đợi!";
                } else {
                    String otp = OtpUtils.getRandomOtp();
                    otpSessionModel.setOtp(otp);
                    otpSessionModel.setPhone(phone);
                    Calendar cal = Calendar.getInstance();
                    cal.add(Calendar.MINUTE, 1);
                    otpSessionModel.setExpireTime(cal.getTime());
                    smsUtils.sendGetJSON("Baotrixemay", phone, otp, " la ma xac minh dang ky Baotrixemay cua ban");
                    //message += otp;
                }
            } else {
                String otp = OtpUtils.getRandomOtp();
                otpSessionModel = new OtpSessionModel();
                otpSessionModel.setTime(1);
                otpSessionModel.setOtp(otp);
                otpSessionModel.setPhone(phone);
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.MINUTE, 1);
                otpSessionModel.setExpireTime(cal.getTime());
                smsUtils.sendGetJSON("Baotrixemay", phone, otp, " la ma xac minh dang ky Baotrixemay cua ban");
                //message += otp;
            }
            session.setAttribute("otp_session", otpSessionModel);
            session.setMaxInactiveInterval(300);
        }

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody OtpRequest otpRequest) {

        if (!userService.isPhoneExisted(otpRequest.getPhone())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (userService.isAccountActivated(otpRequest.getPhone())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(true); // true == allow create
        OtpSessionModel otpSessionModel = (OtpSessionModel) session.getAttribute("otp_session");
        JSONObject ret = new JSONObject();
        String message = "";
        if (otpSessionModel == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (otpSessionModel.getOtp().equalsIgnoreCase(otpRequest.getOtp()) && otpSessionModel.getExpireTime().after(Calendar.getInstance().getTime())) {
            userService.activateAccount(otpRequest.getPhone());
            session.invalidate();
            message = "ActivatedSuccess";
        } else {
            message = "ActiveFailed";
        }

        ret.put("message", message);
        return ResponseEntity.ok(ret);
    }

    @PutMapping("/password/change")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> updatePassword(HttpServletRequest request, @RequestBody ChangePasswordRequest passwordRequest) {
        String message = "";

        Long id = filter.getUserIdFromToken(request);
        message = userService.updatePassword(id, passwordRequest);

        JSONObject response = new JSONObject();
        if (!message.trim().equals("success")) {
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/otp/confirm")
    public ResponseEntity<?> checkOtp(@RequestParam("otp") String otp) {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(true); // true == allow create
        OtpSessionModel otpSessionModel = (OtpSessionModel) session.getAttribute("otp_session");
        String message = "";
        JSONObject response = new JSONObject();
        if (otpSessionModel == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (otpSessionModel.getOtp().equalsIgnoreCase(otp) && otpSessionModel.getExpireTime().after(Calendar.getInstance().getTime())) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MINUTE, 4);
            OtpConfirmSession otpConfirm = new OtpConfirmSession(otpSessionModel.getPhone(), true, cal.getTime());
            session.invalidate();
            message = "success";
            session = attr.getRequest().getSession(true);
            session.setAttribute("is_otp_confirmed", otpConfirm);
            session.setMaxInactiveInterval(300);
        } else {
            message = "failed";
        }

        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token/add")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> addDeviceToken(HttpServletRequest request, @RequestBody TokenRequest tokenRequest) {
        Long id = filter.getUserIdFromToken(request);
        tokenService.addTokenDevice(id, tokenRequest);
        return ResponseEntity.ok("OKE");
    }

    @GetMapping("/user/existed")
    public ResponseEntity<?> checkUserExisted(@RequestParam("phone") String phone) {
        UserPrincipal userPrincipal = userService.findByPhone(phone);
        String message = "";
        if (userPrincipal != null) {
            message = "existed";
        } else {
            message = "non-existed";
        }

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/profile")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        Long id = filter.getUserIdFromToken(request);
        UserResponse userResponse = userService.getUserProfile(id);

        JSONObject response = new JSONObject();
        if (userResponse == null) {
            response.put("user", null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("user", userResponse);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/update")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> updateUserProfile(HttpServletRequest request, @RequestBody UserRequest userRequest) {
        Long id = filter.getUserIdFromToken(request);
        String message = userService.updateUser(id, userRequest);

        JSONObject response = new JSONObject();
        if (!message.trim().equals("success")) {
            response.put("message", "Có lỗi xảy ra trong quá trình cập nhật");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/phone/otp")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> sentOtpNewPhone(@RequestParam("phone") String phone, HttpSession session) throws IOException {
        String message = "";
        JSONObject ret = new JSONObject();
        if (userService.isPhoneExisted(phone)) {
            ret.put("message","Số điện thoại đã được đăng ký trong hệ thống");
            return new ResponseEntity<>(ret, HttpStatus.BAD_REQUEST);
        } else {
            //ham chay restart otp()
            String otp = OtpUtils.getRandomOtp();
            OtpSessionModel otpSessionModel = new OtpSessionModel();
            otpSessionModel.setTime(1);
            otpSessionModel.setOtp(otp);
            otpSessionModel.setPhone(phone);
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MINUTE, 1);
            otpSessionModel.setExpireTime(cal.getTime());
            session.setAttribute("otp_session", otpSessionModel);
            session.setMaxInactiveInterval(300);
            System.out.println("OTP:-------------------------" + otp + "---------" + phone);
            //gui otp
            smsUtils.sendGetJSON("Baotrixemay", phone, otp, " la ma xac minh dang ky Baotrixemay cua ban");
            //message += otp;
        }
        ret.put("message", message);

        session.setAttribute("otp_session", ret);
        session.setMaxInactiveInterval(120);

        return ResponseEntity.ok(ret);
    }

    @PutMapping("/user/phone/update")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> updateNewPhone(HttpServletRequest request, @RequestBody OtpRequest otpRequest) {
        Long id = filter.getUserIdFromToken(request);
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(true); // true == allow create
        OtpSessionModel otpSessionModel = (OtpSessionModel) session.getAttribute("otp_session");
        String message = "";
        if (otpSessionModel == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (otpSessionModel.getOtp().equalsIgnoreCase(otpRequest.getOtp()) && otpSessionModel.getExpireTime().after(Calendar.getInstance().getTime())) {
            session.invalidate();
            message = userService.updatePhoneUser(id, otpRequest.getPhone());
        } else {
            message = "failed";
        }

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password/new")
    public ResponseEntity<?> updateNewPassword(@RequestBody NewPasswordRequest request) {
        JSONObject response = new JSONObject();
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(true); // true == allow create
        OtpConfirmSession otpConfirmSession = (OtpConfirmSession) session.getAttribute("is_otp_confirmed");
        if(otpConfirmSession == null || !otpConfirmSession.getPhone().equals(request.getPhone()) || !otpConfirmSession.getIsOtpConfirm() || otpConfirmSession.getExpireTime().before(Calendar.getInstance().getTime())){
            response.put("message", "Người dùng không có quyền truy cập vào đường dẫn này");
            response.put("time", Calendar.getInstance().getTime());
            return new ResponseEntity<>(response, HttpStatus.NETWORK_AUTHENTICATION_REQUIRED);
        }
        String message = userService.updateNewPassword(request);

        if (!message.trim().equals("success")) {
            response.put("message", "Có lỗi xảy ra trong quá trình cập nhật mật khẩu mới");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        session.invalidate();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notifications")
    @PreAuthorize("hasAnyAuthority('OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> getNotifications(HttpServletRequest request, @RequestParam(value = "page", defaultValue = "1") Integer page) {
        Long id = filter.getUserIdFromToken(request);
        List<UserNotificationResponse> notifications = userNotificationService.getListNotifications(id, page);

        JSONObject response = new JSONObject();
        if (notifications == null || notifications.size() <= 0) {
            response.put("notifications", notifications);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("notifications", notifications);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/notification/read/{id}")
    @PreAuthorize("hasAnyAuthority('OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> readNotification(@PathVariable("id") Long id) {
        userNotificationService.markAsReadNotification(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
