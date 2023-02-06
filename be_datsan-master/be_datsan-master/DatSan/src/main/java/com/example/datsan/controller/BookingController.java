package com.example.datsan.controller;

import com.example.datsan.dto.request.BookingRequest;
import com.example.datsan.dto.request.PaymentImageRequest;
import com.example.datsan.dto.request.RejectBookingRequest;
import com.example.datsan.dto.response.BankingResponse;
import com.example.datsan.dto.response.BookingDetailResponse;
import com.example.datsan.dto.response.NotificationResponse;
import com.example.datsan.dto.response.OwnerManagerResponse;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.user.PitchSystemManager;
import com.example.datsan.entity.user.User;
import com.example.datsan.filter.JwtRequestFilter;
import com.example.datsan.service.*;
import com.example.datsan.util.UserUtils;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/booking")
@PreAuthorize("hasAuthority('TENANT')")
public class BookingController {

    @Autowired
    private JwtRequestFilter filter;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UnitPriceService priceService;

    @Autowired
    private PitchSystemManagerService managerService;

    @Autowired
    private PitchService pitchService;

    @Autowired
    private BankingService bankingService;

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/add/{id}")
    public ResponseEntity<?> bookPitch(HttpServletRequest request, @PathVariable("id") Long pitchId, @RequestBody BookingRequest bookingRequest) {
        Long id = filter.getUserIdFromToken(request);
        List<String> messages = bookingService.addBooking(bookingRequest, id, pitchId);
        JSONObject response = new JSONObject();
        if(!messages.get(0).equals("success")){
            response.put("message", messages);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.put("message", messages);
            String sid = messages.get(1);
            Long bid = Long.parseLong(sid);

            List<String> managerTokens = bookingService.getManagerTokensForAddBooking(bid);
            if (managerTokens != null && managerTokens.size() > 0) {
                response.put("mTokens", managerTokens);
            }
            List<String> teamTokens = bookingService.getTeamTokensForAddBooking(bid);
            if(teamTokens != null && teamTokens.size() > 0){
                response.put("tTokens", teamTokens);
            }
            List<NotificationResponse> notifications = notificationService.getListAddBookingNotifications(bid);
            if(notifications != null && notifications.size() > 0){
                response.put("notifications", notifications);
            }
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/reject")
    @PreAuthorize("hasAnyAuthority('OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> confirmBooking(HttpServletRequest request, @RequestBody RejectBookingRequest rejectRequest) {
        Long id = filter.getUserIdFromToken(request);
        String message = bookingService.rejectBooking(id, rejectRequest);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        List<NotificationResponse> notifications = notificationService.getListRejectBookingNotifications(id, rejectRequest.getId());
        if(notifications != null && notifications.size() > 0){
            response.put("notifications", notifications);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/price/{id}")
    @PreAuthorize("hasAnyAuthority('OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> getTotalPrice(@PathVariable(name = "id") Long pitchId,
                                           @RequestParam("date") @Nullable String date,
                                           @RequestParam("start") @Nullable String start,
                                           @RequestParam("end") @Nullable String end) {
        String message = "";
        JSONObject response = new JSONObject();
        if (start != null && end != null) {
            message = priceService.getTotalPrice(date, start, end, pitchId);
        } else {
            response.put("message", "Vui lòng nhập đủ giờ bắt đầu và kết thúc");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payment/add")
    public ResponseEntity<?> addImagePayment(@RequestBody PaymentImageRequest request) {
        List<String> messages = bookingService.addBookingPayment(request);
        List<String> tokens = bookingService.getTokensForAddPayment(request.getCode());

        JSONObject response = new JSONObject();
        if(!messages.get(0).trim().equals("success")){
            response.put("message", messages.get(0));
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", messages.get(0));
        if(messages.size() > 1) {
            if (tokens != null && tokens.size() > 0) {
                response.put("mTokens", tokens);
            }
            Long bid = Long.parseLong(messages.get(1));
            List<NotificationResponse> notifications = notificationService.getListAddPaymentNotifications(bid);
            if(notifications != null && notifications.size() > 0){
                response.put("notifications", notifications);
            }
        } else {
            response.put("message", "Có lỗi xảy ra trong quá trình thêm ảnh thanh toán");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> bookingDetail(HttpServletRequest request, @PathVariable("id") Long id) {
        Long uid = filter.getUserIdFromToken(request);
        BookingDetailResponse bookingDetailResponse = bookingService.getBookingDetail(uid, id);
        List<String> mTokens = bookingService.getManagerTokensForBookingDetail(id);

        JSONObject response = new JSONObject();
        if(bookingDetailResponse == null){
            response.put("message", "Chi tiết đơn đặt sân trống");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if (mTokens != null && mTokens.size() > 0) {
            response.put("mTokens", mTokens);
        }
        List<String> tokens = bookingService.getTokensForBookingDetail(id);
        if(tokens != null && tokens.size() > 0){
            response.put("tokens", tokens);
        }
        List<String> teamTokens = bookingService.getTeamTokensForAddBooking(id);
        if(teamTokens != null && teamTokens.size() > 0){
            response.put("tTokens", teamTokens);
        }
        response.put("booking", bookingDetailResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/payment/banking/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> getBankingOwnerInfo(@RequestParam("id") Long pitchId) {
        try {
            Pitch pitch = pitchService.findPitchById(pitchId);
            PitchSystemManager manager = managerService.findSystemOwner(pitch.getPitchSystem().getId());
            List<BankingResponse> responses = bankingService.getBankings(manager.getUser().getId());
            List<User> users = new ArrayList<>();
            users.add(manager.getUser());

            JSONObject response = new JSONObject();
            if(responses == null || responses.size() <= 0){
                List<PitchSystemManager> managers = managerService.findSystemManager(pitch.getPitchSystem().getId());
                if(managers != null && managers.size() > 0){
                    for(PitchSystemManager m : managers){
                        users.add(m.getUser());
                    }
                }
                List<OwnerManagerResponse> managerInfo = UserUtils.convertToOwnerManager(users);
                response.put("managers", managerInfo);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            response.put("bankings", responses);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @GetMapping("/time/existed")
    @PreAuthorize("hasAnyAuthority('OWNER', 'MANAGER', 'TENANT')")
    public ResponseEntity<?> checkBookingExisted(@RequestParam("id") Long pitchId,
                                                 @RequestParam("date") String date,
                                                 @RequestParam("start") String rentStart,
                                                 @RequestParam("end") String rentEnd) {
        String message = "";
        if (bookingService.checkBookingExisted(pitchId, date, rentStart, rentEnd)) {
            message = "existed";
        } else {
            message = "non-existed";
        }
        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rejected")
    public ResponseEntity<?> checkBookingRejected(@RequestParam("code") String code) {
        String message = "";
        if (bookingService.checkBookingRejected(code)) {
            message = "Đơn đặt sân của bạn vừa bị huỷ";
        } else {
            message = "valid";
        }
        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
