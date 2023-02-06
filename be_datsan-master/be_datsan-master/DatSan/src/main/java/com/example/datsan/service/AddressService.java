package com.example.datsan.service;

import com.example.datsan.entity.Address;

public interface AddressService {
    Address addNewAddress(Long id, String city, String district, String ward, String addressDetail, String lat, String lng);

    Address findAddress(String city, String district, String ward, String addressDetail);

    Address findUserAddress(String city, String district, String ward, String addressDetail, Long id);
}
