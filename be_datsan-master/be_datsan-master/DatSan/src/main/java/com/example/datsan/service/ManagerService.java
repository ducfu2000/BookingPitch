package com.example.datsan.service;

import com.example.datsan.dto.response.ManagerResponse;

import java.util.List;

public interface ManagerService {
    List<ManagerResponse> getListManagers(Long id);

    String addManager(Long id, Long systemId, String name, String phone);

    String deleteManager(Long id, Long systemId, Long managerId);
}
