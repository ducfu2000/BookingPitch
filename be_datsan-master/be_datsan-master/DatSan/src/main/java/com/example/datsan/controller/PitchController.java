package com.example.datsan.controller;

import com.example.datsan.dto.response.PitchDetailResponse;
import com.example.datsan.dto.response.SystemDetailResponse;
import com.example.datsan.dto.response.SystemResponse;
import com.example.datsan.filter.JwtRequestFilter;
import com.example.datsan.service.PitchService;
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
@RequestMapping("/api/pitch")
@PreAuthorize("hasAnyAuthority('ADMIN', 'OWNER', 'MANAGER', 'TENANT')")
public class PitchController {

    @Autowired
    private PitchService pitchService;

    @Autowired
    private PitchSystemService pitchSystemService;

    @Autowired
    private JwtRequestFilter filter;

    @GetMapping("/system/top")
    public ResponseEntity<?> getTopPitches() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("rate").descending());
        List<SystemResponse> pitchSystems = pitchSystemService.findTopPitches(pageable);
        JSONObject response = new JSONObject();
        if(pitchSystems == null || pitchSystems.size() <= 0){
            response.put("topPitches", pitchSystems);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("topPitches", pitchSystems);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/detail/{id}")
    public ResponseEntity<?> getPitchSystemDetail(HttpServletRequest request, @PathVariable("id") Long id,
                                                  @RequestParam("date") @Nullable String date,
                                                  @RequestParam("start") @Nullable String rentStart,
                                                  @RequestParam("end") @Nullable String rentEnd) {
        Long uid = filter.getUserIdFromToken(request);
        SystemDetailResponse system = pitchSystemService.getSystemDetailResponse(id, date, rentStart, rentEnd, uid);

        JSONObject response = new JSONObject();
        if(system == null){
            response.put("pitchSystem", null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("pitchSystem", system);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/system/find")
    public ResponseEntity<?> findPitchSystems(@RequestParam("city") @Nullable String city,
                                              @RequestParam("district") @Nullable String district,
                                              @RequestParam("ward") @Nullable String ward,
                                              @RequestParam("detail") @Nullable String addressDetail,
                                              @RequestParam("date") @Nullable String searchDate,
                                              @RequestParam("start") @Nullable String timeStart,
                                              @RequestParam("end") @Nullable String timeEnd,
                                              @RequestParam("system") @Nullable String systemName,
                                              @RequestParam("type") @Nullable String type) {
        List<SystemResponse> pitchSystems = pitchSystemService.findPitchSystems(city, district, ward, addressDetail, searchDate, timeStart, timeEnd, systemName, type);
        JSONObject response = new JSONObject();
        if(pitchSystems == null || pitchSystems.size() <= 0){
            response.put("pitchSystems", pitchSystems);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("pitchSystems", pitchSystems);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{systemId}/{id}")
    public ResponseEntity<?> getPitchDetail(@PathVariable("systemId") Long systemId, @PathVariable("id") Long id) {
        PitchDetailResponse pitchDetailResponse = pitchService.getPitchDetail(systemId, id);

        JSONObject response = new JSONObject();
        if(pitchDetailResponse == null){
            response.put("pitch", null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("pitch", pitchDetailResponse);
        return ResponseEntity.ok(response);
    }
}
