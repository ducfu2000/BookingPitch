package com.example.datsan.controller;

import com.example.datsan.dto.request.RatingRequest;
import com.example.datsan.dto.request.TeamRequest;
import com.example.datsan.dto.response.*;
import com.example.datsan.filter.JwtRequestFilter;
import com.example.datsan.service.*;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/tenant")
@PreAuthorize("hasAnyAuthority('TENANT', 'MANAGER')")
public class TenantController {

    @Autowired
    private PitchSystemService pitchSystemService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtRequestFilter filter;

    @Autowired
    private TeamMemberService memberService;

    @Autowired
    private TeamService teamService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserService userService;

    @GetMapping("/home")
    public ResponseEntity<?> initScreen() {
        JSONObject response = new JSONObject();
        response.put("message", "tenant");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nearest")
    public ResponseEntity<?> getNearest5Pitch(@RequestParam("city") @Nullable String city,
                                              @RequestParam("district") @Nullable String district,
                                              @RequestParam("lat") @Nullable String lat,
                                              @RequestParam("lng") @Nullable String lng) {
        List<SystemResponse> pitchSystemList = pitchSystemService.findLocalPitchSystems(city, district, lat, lng);
        JSONObject response = new JSONObject();
        if(pitchSystemList == null || pitchSystemList.size() <= 0){
            response.put("nearest", pitchSystemList);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("message", "a");
        response.put("nearest", pitchSystemList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/team/add")
    public ResponseEntity<?> addTeam(HttpServletRequest request, @RequestBody TeamRequest teamRequest) {
        String message = "";
        Long id = filter.getUserIdFromToken(request);
        message = memberService.addTeamMember(id, teamRequest);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/team/all")
    public ResponseEntity<?> getTeams(HttpServletRequest request) {
        Long id = filter.getUserIdFromToken(request);
        List<TeamResponse> responses = teamService.getTeamsByUser(id);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("teams", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("teams", responses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/history")
    public ResponseEntity<?> getBookingByStatus(HttpServletRequest request, @RequestParam("status") @Nullable String status,
                                                @RequestParam(value = "page", defaultValue = "1") Integer page,
                                                @RequestParam("condition") @Nullable String condition) {
        Long id = filter.getUserIdFromToken(request);
        List<BookingResponse> responses = bookingService.getBookingsByStatus(id, status, page, condition);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("bookings", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("bookings", responses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/all")
    public ResponseEntity<?> getAllBooking(@RequestParam("pid") @Nullable Long pitchId,
                                           @RequestParam("date") @Nullable String date) {
        List<BookingResponse> responses = bookingService.getBookingsForTenant(pitchId, date);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("bookings", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("bookings", responses);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/rating/add/{id}")
    public ResponseEntity<?> addRating(HttpServletRequest request, @PathVariable("id") Long pid, @RequestBody RatingRequest ratingRequest) {
        Long id = filter.getUserIdFromToken(request);
        String message = ratingService.addRating(id, pid, ratingRequest);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/rating/update/{id}")
    public ResponseEntity<?> updateRating(HttpServletRequest request, @PathVariable("id") Long pid, @RequestBody RatingRequest ratingRequest) {
        Long id = filter.getUserIdFromToken(request);
        String message = ratingService.updateRating(id, pid, ratingRequest);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/rating/delete/{id}")
    public ResponseEntity<?> deleteRating(HttpServletRequest request, @PathVariable("id") Long rid) {
        Long id = filter.getUserIdFromToken(request);
        String message = ratingService.deleteRating(id, rid);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/team/user/info")
    public ResponseEntity<?> getUserForTeam(@RequestParam("phone") String phone){
        UserResponse user = userService.findUserByPhone(phone);
        JSONObject response = new JSONObject();
        if(user != null){
            if(user.getRole().equals("ADMIN") || user.getRole().equals("OWNER") || user.getRole().equals("MANAGER")){
                response.put("warning", "Quyền hạn của tài khoản này không hợp lệ");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            } else {
                response.put("user", user);
            }
        } else {
            response.put("error", "Số điện thoại chưa đăng ký ứng dụng này");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/team/members/{id}")
    public ResponseEntity<?> getAllTeamMember(HttpServletRequest request, @PathVariable("id") Long tid){
        Long id = filter.getUserIdFromToken(request);
        List<TeamMemberResponse> responses = memberService.getTeamMember(tid, id);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("members", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("members", responses);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/team/leave/{id}")
    public ResponseEntity<?> leaveTeam(HttpServletRequest request, @PathVariable("id") Long tid){
        Long id = filter.getUserIdFromToken(request);
        String message = memberService.leaveTeam(id, tid);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rating/enable/{id}")
    public ResponseEntity<?> checkEnableRating(HttpServletRequest request, @PathVariable("id") Long sid){
        Long id = filter.getUserIdFromToken(request);
        String message = ratingService.checkUserRated(id, sid);

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/team/member/existed")
    public ResponseEntity<?> checkTeamMember(@RequestParam("tid") Long tid, @RequestParam("phone") String phone){
        String message = memberService.isInsideTeam(tid, phone);

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
