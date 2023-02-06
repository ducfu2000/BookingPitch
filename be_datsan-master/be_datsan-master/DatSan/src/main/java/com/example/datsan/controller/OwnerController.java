package com.example.datsan.controller;

import com.example.datsan.dto.request.BankingRequest;
import com.example.datsan.dto.request.PitchRequest;
import com.example.datsan.dto.request.PitchSystemRequest;
import com.example.datsan.dto.request.SignupRequest;
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
@RequestMapping("/api/owner")
@PreAuthorize("hasAuthority('OWNER')")
public class OwnerController {

    @Autowired
    private PitchSystemService pitchSystemService;

    @Autowired
    private JwtRequestFilter requestFilter;

    @Autowired
    private PitchService pitchService;

    @Autowired
    private BankingService bankingService;

    @Autowired
    private ManagerService managerService;

    @Autowired
    private UserService userService;

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/home")
    public ResponseEntity<?> initScreen() {
        JSONObject response = new JSONObject();
        response.put("message", "owner");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/system/add")
    public ResponseEntity<?> addPitchSystem(HttpServletRequest request, @RequestBody PitchSystemRequest pitchSystemRequest) {
        String message = "";

        Long id = requestFilter.getUserIdFromToken(request);
        message = pitchSystemService.addNewPitchSystem(pitchSystemRequest, id);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pitch/add/{id}")
    public ResponseEntity<?> addPitch(HttpServletRequest request, @RequestBody PitchRequest pitchRequest, @PathVariable("id") Long systemId) {
        String message = "";

        JSONObject response = new JSONObject();
        try {
            if (pitchService.isPitchExisted(systemId, pitchRequest.getName())) {
                response.put("message", "Sân đã tồn tại");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            Long userId = requestFilter.getUserIdFromToken(request);
            message = pitchService.addPitch(pitchRequest, systemId, userId);
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình thêm sân";
        }

        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pitch/existed")
    public ResponseEntity<?> isPitchExisted(@RequestParam("id") @Nullable Long systemId, @RequestParam(name = "name") @Nullable String pitchName) {
        String message = "";
        boolean isExisted = pitchService.isPitchExisted(systemId, pitchName);
        if (isExisted) {
            message = "existed";
        } else {
            message = "non-existed";
        }

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/existed")
    public ResponseEntity<?> isPitchSystemExisted(HttpServletRequest request, @RequestParam("name") @Nullable String systemName) {
        String message = "";
        try {
            Long userId = requestFilter.getUserIdFromToken(request);
            boolean isExisted = pitchSystemService.isPitchSystemExisted(userId, systemName);
            if (isExisted) {
                message = "existed";
            } else {
                message = "non-existed";
            }
        } catch (Exception ex) {
            message = ex.getMessage();
        }

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/system/update/{id}")
    public ResponseEntity<?> updatePitchSystem(HttpServletRequest request, @PathVariable("id") Long id, @RequestBody PitchSystemRequest systemRequest) {
        String message = "";
        try {
            Long userId = requestFilter.getUserIdFromToken(request);
            message = pitchSystemService.updatePitchSystem(systemRequest, userId, id);
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình cập nhật hệ thống sân";
        }

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/pitch/update/{id}")
    public ResponseEntity<?> updatePitch(HttpServletRequest request, @PathVariable("id") Long id, @RequestBody PitchRequest pitchRequest) {
        String message = "";
        try {
            Long userId = requestFilter.getUserIdFromToken(request);
            message = pitchService.updatePitch(pitchRequest, userId, id);
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình cập nhật sân";
        }

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/system/delete/{id}")
    public ResponseEntity<?> deletePitchSystem(@PathVariable("id") Long id) {
        String message = "";
        try {
            pitchSystemService.deletePitchSystem(id);
            message = "success";
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình xoá hệ thống sân";
        }

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/pitch/delete/{id}")
    public ResponseEntity<?> deletePitch(@PathVariable("id") Long id) {
        String message = "";
        try {
            pitchService.deletePitch(id);
            message = "success";
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình xoá sân";
        }

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/banking/add")
    public ResponseEntity<?> addBankingInfo(HttpServletRequest request, @RequestBody BankingRequest bankingRequest) {
        Long id = requestFilter.getUserIdFromToken(request);
        String message = bankingService.addBankingInfo(id, bankingRequest);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/banking/all")
    public ResponseEntity<?> getBankings(HttpServletRequest request) {
        Long id = requestFilter.getUserIdFromToken(request);
        List<BankingResponse> responses = bankingService.getBankings(id);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("bankings", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("bankings", responses);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/banking/update/{id}")
    public ResponseEntity<?> updateBankingInfo(HttpServletRequest request, @PathVariable("id") Long bankingId, @RequestBody BankingRequest bankingRequest) {
        Long id = requestFilter.getUserIdFromToken(request);
        String message = bankingService.updateBanking(id, bankingId, bankingRequest);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/banking/delete/{id}")
    public ResponseEntity<?> deleteBankingInfo(HttpServletRequest request, @PathVariable("id") Long bankingId) {
        Long id = requestFilter.getUserIdFromToken(request);
        String message = bankingService.deleteBanking(id, bankingId);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/banking/existed")
    public ResponseEntity<?> isBankingExisted(HttpServletRequest request, @RequestParam("name") String name, @RequestParam("bankNumber") String bankNumber) {
        String message = "";
        Long id = requestFilter.getUserIdFromToken(request);
        if (bankingService.isBankingExisted(id, name, bankNumber)) {
            message = "existed";
        } else {
            message = "non-existed";
        }

        JSONObject response = new JSONObject();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/manager/all")
    public ResponseEntity<?> getListManagers(HttpServletRequest request) {
        Long id = requestFilter.getUserIdFromToken(request);
        List<ManagerResponse> managerResponses = managerService.getListManagers(id);

        JSONObject response = new JSONObject();
        if(managerResponses == null || managerResponses.size() <= 0){
            response.put("managers", managerResponses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("managers", managerResponses);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/manager/add/{id}")
    public ResponseEntity<?> addManager(HttpServletRequest request, @PathVariable("id") Long pitchId, @RequestBody SignupRequest signupRequest) {
        Long id = requestFilter.getUserIdFromToken(request);
        String message = managerService.addManager(id, pitchId, signupRequest.getName(), signupRequest.getPhone());

        JSONObject response = new JSONObject();
        if(!message.trim().startsWith("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/manager/delete/{sid}/{mid}")
    public ResponseEntity<?> deleteManager(HttpServletRequest request, @PathVariable("sid") Long systemId, @PathVariable("mid") Long managerId) {
        Long id = requestFilter.getUserIdFromToken(request);
        String message = managerService.deleteManager(id, systemId, managerId);

        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pitch/systems")
    public ResponseEntity<?> getAllPitchSystems(HttpServletRequest request) {
        Long id = requestFilter.getUserIdFromToken(request);
        List<SystemOwnerResponse> responses = pitchSystemService.getAllSystemForOwner(id);
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
        SystemOwnerDetailResponse managerResponse = pitchSystemService.getSystemDetailForOwner(systemId);

        JSONObject response = new JSONObject();
        if(managerResponse == null){
            response.put("system", null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("system", managerResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/manager/info")
    public ResponseEntity<?> getUserByPhone(@RequestParam("phone") String phone) {
        UserResponse user = userService.findUserByPhone(phone);
        JSONObject response = new JSONObject();
        if (user != null) {
            if(user.getRole().equals("MANAGER") || user.getRole().equals("TENANT")) {
                response.put("user", user);
            } else {
                response.put("warning", "Quyền hạn của người dùng này không phù hợp");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } else {
            response.put("message", "Số điện thoại chưa đăng ký ứng dụng này");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/revenue")
    public ResponseEntity<?> getBookingRevenue(HttpServletRequest request,
                                               @RequestParam(value = "sid", required = false) @Nullable Long sid,
                                               @RequestParam(value = "date", required = false) @Nullable String date,
                                               @RequestParam(value = "from", required = false) @Nullable String from,
                                               @RequestParam(value = "to", required = false) @Nullable String to){
        Long id = requestFilter.getUserIdFromToken(request);
        List<RevenueResponse> responses = revenueService.getRevenues(id, sid, date, from, to);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("revenue", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("revenue", responses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/pending")
    public ResponseEntity<?> getListSystemPending(HttpServletRequest request){
        Long id = requestFilter.getUserIdFromToken(request);
        List<SystemPendingResponse> responses = pitchSystemService.getListSystemPending(id);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("systems", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("systems", responses);
        return ResponseEntity.ok(response);
    }
}
