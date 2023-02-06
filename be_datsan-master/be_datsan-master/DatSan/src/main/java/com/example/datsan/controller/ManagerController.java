package com.example.datsan.controller;

import com.example.datsan.dto.request.BookingOfflineRequest;
import com.example.datsan.dto.request.BookingRequest;
import com.example.datsan.dto.response.*;
import com.example.datsan.filter.JwtRequestFilter;
import com.example.datsan.service.BookingService;
import com.example.datsan.service.NotificationService;
import com.example.datsan.service.PitchSystemService;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasAnyAuthority('OWNER','MANAGER')")
public class ManagerController {

    @Autowired
    private JwtRequestFilter filter;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PitchSystemService systemService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/home")
    public ResponseEntity<?> initScreen() {
        JSONObject response = new JSONObject();
        response.put("message", "manager");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/booking/confirm/{id}")
    public ResponseEntity<?> confirmBooking(HttpServletRequest request, @PathVariable(name = "id") Long bookingId) {
        String message = "";
        Long id = filter.getUserIdFromToken(request);
        message = bookingService.confirmBooking(id, bookingId);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        List<NotificationResponse> notifications = notificationService.getListConfirmBookingNotifications(bookingId);
        if(notifications != null && notifications.size() > 0){
            response.put("notifications", notifications);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/all")
    public ResponseEntity<?> getListBookings(HttpServletRequest request, @RequestParam("sid") @Nullable Long sid, @RequestParam("status") @Nullable String status, @RequestParam("date") @Nullable String bookingDate,
                                             @RequestParam(value = "page") @Nullable Integer page) {
        Pageable pageable;
        if(page != null) {
            pageable = PageRequest.of(page - 1, 9, Sort.by("updatedAt").ascending());
        } else {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("updatedAt").ascending());
        }
        Long id = filter.getUserIdFromToken(request);
        List<BookingResponse> bookings = bookingService.getListBookings(id, sid, status, bookingDate, pageable);

        JSONObject response = new JSONObject();
        if(bookings == null || bookings.size() <= 0){
            response.put("booking", bookings);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("booking", bookings);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pitch/systems")
    public ResponseEntity<?> getAllPitchSystems(HttpServletRequest request) {
        Long id = filter.getUserIdFromToken(request);
        List<SystemManagerResponse> responses = systemService.getAllSystemForManager(id);
        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("pitchSystems", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("pitchSystems", responses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/detail/{id}")
    public ResponseEntity<?> getSystemDetail(@PathVariable("id") Long systemId) {
        SystemManagerDetailResponse managerResponse = systemService.getSystemDetailForManager(systemId);

        JSONObject response = new JSONObject();
        if(managerResponse == null){
            response.put("system", null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("system", managerResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/booking/add/{id}")
    public ResponseEntity<?> addBooking(HttpServletRequest request, @PathVariable("id") Long pid, @RequestBody BookingOfflineRequest bookingRequest){
        Long id = filter.getUserIdFromToken(request);
        String message = bookingService.addBookingOffline(bookingRequest, id, pid);

        JSONObject response = new JSONObject();
        if(message == null || !message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
