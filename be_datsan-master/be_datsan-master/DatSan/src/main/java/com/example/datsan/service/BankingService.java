package com.example.datsan.service;

import com.example.datsan.dto.request.BankingRequest;
import com.example.datsan.dto.response.BankingResponse;

import java.util.List;

public interface BankingService {
    String addBankingInfo(Long id, BankingRequest request);

    List<BankingResponse> getBankings(Long id);

    String updateBanking(Long id, Long bankingId, BankingRequest request);

    String deleteBanking(Long id, Long bankingId);

    Boolean isBankingExisted(Long id, String name, String bankNumber);
}
