package com.example.datsan.service;

import com.example.datsan.dto.request.ApproveSystemRequest;
import com.example.datsan.dto.request.PitchSystemRequest;
import com.example.datsan.dto.response.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PitchSystemService {

    String addNewPitchSystem(PitchSystemRequest request, Long id);

    SystemDetailResponse getSystemDetailResponse(Long id, String date, String rentStart, String rentEnd, Long uid);

    List<SystemResponse> findPitchSystems(String city, String district, String ward, String addressDetail, String searchDate, String timeStart, String timeEnd, String systemName, String type);

    List<SystemResponse> findLocalPitchSystems(String city, String district, String lat, String lng);

    List<SystemResponse> findTopPitches(Pageable pageable);

    void deletePitchSystem(Long id);

    Boolean isPitchSystemExisted(Long id, String name);

    String updatePitchSystem(PitchSystemRequest request, Long userId, Long id);

    List<SystemPendingResponse> getListSystemsPending(Pageable pageable);

    String approvePitchSystem(Long adminId, Long id, ApproveSystemRequest request);

    List<SystemManagerResponse> getAllSystemForManager(Long id);

    SystemManagerDetailResponse getSystemDetailForManager(Long id);

    List<SystemOwnerResponse> getAllSystemForOwner(Long id);

    SystemOwnerDetailResponse getSystemDetailForOwner(Long id);

    SystemPendingResponse getSystemPendingDetail(Long id);

    List<SystemPendingResponse> getListSystemPending(Long id);
}
