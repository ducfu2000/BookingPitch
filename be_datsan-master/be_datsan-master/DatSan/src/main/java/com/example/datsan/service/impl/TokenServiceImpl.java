package com.example.datsan.service.impl;

import com.example.datsan.dto.request.TokenRequest;
import com.example.datsan.entity.Token;
import com.example.datsan.entity.user.User;
import com.example.datsan.repository.TokenRepository;
import com.example.datsan.service.TokenService;
import com.example.datsan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TokenServiceImpl implements TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserService userService;

    @Override
    public void addTokenDevice(Long id, TokenRequest request) {
        try {
            if (!tokenRepository.checkTokenExisted(request.getToken())) {
                Token token = new Token();
                User user = userService.findUserById(id);
                token.setUser(user);
                token.setToken(request.getToken());
                token.setDeleted(false);
                token.setCreatedBy(id);
                tokenRepository.save(token);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public List<String> getTokenByUserId(Long id) {
        List<String> tokens = new ArrayList<>();
        List<Token> tokenList = tokenRepository.findTokenByUserId(id);
        if(tokenList != null && tokenList.size() > 0) {
            for (Token t : tokenList) {
                String token = t.getToken();
                tokens.add(token);
            }
        }
        return tokens;
    }

    @Override
    public void deleteToken(Long id, String token) {
        try {
            Token deviceToken = tokenRepository.findDeviceToken(id, token);
            if(token != null){
                tokenRepository.delete(deviceToken);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
