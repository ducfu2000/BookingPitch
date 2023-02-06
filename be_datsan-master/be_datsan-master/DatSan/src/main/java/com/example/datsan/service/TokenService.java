package com.example.datsan.service;

import com.example.datsan.dto.request.TokenRequest;

import java.util.List;

public interface TokenService {
    void addTokenDevice(Long id, TokenRequest request);

    List<String> getTokenByUserId(Long id);

    void deleteToken(Long id, String token);
}
