package com.example.datsan.controller;

import com.example.datsan.dto.request.ApproveSystemRequest;
import com.example.datsan.dto.response.SystemPendingResponse;
import com.example.datsan.filter.JwtRequestFilter;
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
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
@CrossOrigin(origins = "http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com:443")
public class AdminController {

    @Autowired
    private PitchSystemService systemService;

    @Autowired
    private JwtRequestFilter filter;

    @GetMapping("/logout")
    public ResponseEntity<?> initScreen() {
        JSONObject response = new JSONObject();
        response.put("message", "admin");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/pending")
    public ResponseEntity<?> getSystemsPending(@RequestParam("page") @Nullable Integer page) {
        Pageable pageable;
        if(page != null){
            pageable = PageRequest.of(page - 1, 9, Sort.by("updatedAt").descending());
        } else {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("updatedAt").descending());
        }
        List<SystemPendingResponse> responses = systemService.getListSystemsPending(pageable);

        JSONObject response = new JSONObject();
        if(responses == null || responses.size() <= 0){
            response.put("pending", responses);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("pending", responses);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/system/approve/{id}")
    public ResponseEntity<?> approveSystem(HttpServletRequest request, @PathVariable(name = "id") Long id, @RequestBody ApproveSystemRequest approveSystemRequest) {
        Long adminId = filter.getUserIdFromToken(request);

        String message = systemService.approvePitchSystem(adminId, id, approveSystemRequest);
        JSONObject response = new JSONObject();
        if(!message.trim().equals("success")){
            response.put("message", message);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/pending/{id}")
    public ResponseEntity<?> getSystemPendingDetail(@PathVariable("id") Long id){
        SystemPendingResponse system = systemService.getSystemPendingDetail(id);

        JSONObject response = new JSONObject();
        if(system == null){
            response.put("pending", null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("pending", system);
        return ResponseEntity.ok(response);
    }
}
