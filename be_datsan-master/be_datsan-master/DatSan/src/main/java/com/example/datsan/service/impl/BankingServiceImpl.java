package com.example.datsan.service.impl;

import com.example.datsan.dto.request.BankingRequest;
import com.example.datsan.dto.response.BankingResponse;
import com.example.datsan.entity.Banking;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.BankingRepository;
import com.example.datsan.service.BankingService;
import com.example.datsan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BankingServiceImpl implements BankingService {

    @Autowired
    private BankingRepository bankingRepository;

    @Autowired
    private UserService userService;

    @Override
    public String addBankingInfo(Long id, BankingRequest request) {
        String message = "";
        try {
            User user = userService.findUserById(id);
            Banking banking = new Banking();
            banking.setName(request.getName());
            banking.setCode(request.getCode());
            banking.setBin(request.getBin());
            banking.setShortName(request.getShortName());
            banking.setLogo(request.getLogo());
            banking.setBankingNumber(request.getBankingNumber());
            banking.setUser(user);
            banking.setCreatedBy(id);
            banking.setDeleted(false);

            bankingRepository.save(banking);
            message = "success";
        } catch (Exception ex) {
            message = "Có lỗi xảy ra trong quá trình thêm thông tin ngân hàng";
        }
        return message;
    }

    @Override
    public List<BankingResponse> getBankings(Long id) {
        try {
            List<Banking> bankings = bankingRepository.findBankingByUserId(id);
            List<BankingResponse> responses = new ArrayList<>();
            for (Banking b : bankings) {
                BankingResponse response = new BankingResponse();
                response.setId(b.getId());
                response.setName(b.getName());
                response.setCode(b.getCode());
                response.setBin(b.getBin());
                response.setShortName(b.getShortName());
                response.setLogo(b.getLogo());
                response.setBankingNumber(b.getBankingNumber());
                response.setUser(b.getUser().getName());

                responses.add(response);
            }
            return responses;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    @Override
    public String updateBanking(Long id, Long bankingId, BankingRequest request) {
        try {
            Banking banking = bankingRepository.findBankingById(bankingId);
            banking.setName(request.getName());
            banking.setCode(request.getCode());
            banking.setBin(request.getBin());
            banking.setShortName(request.getShortName());
            banking.setLogo(request.getLogo());
            banking.setBankingNumber(request.getBankingNumber());
            banking.setUpdatedBy(id);

            bankingRepository.save(banking);
            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình cập nhật thông tin ngân hàng";
    }

    @Override
    public String deleteBanking(Long id, Long bankingId) {
        try {
            Banking banking = bankingRepository.findBankingById(bankingId);
            banking.setDeleted(true);
            banking.setUpdatedBy(id);
            bankingRepository.save(banking);

            return "success";
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return "Có lỗi xảy ra trong quá trình xoá thông tin ngân hàng";
    }

    @Override
    public Boolean isBankingExisted(Long id, String name, String bankNumber) {
        return bankingRepository.isBankingExisted(id, name, bankNumber);
    }
}
