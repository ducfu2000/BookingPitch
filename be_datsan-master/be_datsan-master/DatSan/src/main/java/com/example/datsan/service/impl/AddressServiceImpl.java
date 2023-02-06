package com.example.datsan.service.impl;

import com.example.datsan.entity.Address;
import com.example.datsan.repository.AddressRepository;
import com.example.datsan.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Address addNewAddress(Long id, String city, String district, String ward, String addressDetail, String lat, String lng) {
        Address address = new Address();
        address.setCity(city);
        address.setDistrict(district);
        address.setWard(ward);
        address.setAddressDetail(addressDetail);
        address.setLat(lat);
        address.setLng(lng);
        address.setCreatedBy(id);
        return addressRepository.save(address);
    }

    @Override
    public Address findAddress(String city, String district, String ward, String addressDetail) {
        return addressRepository.findAddress(city, district, ward, addressDetail);
    }

    @Override
    public Address findUserAddress(String city, String district, String ward, String addressDetail, Long id) {
        return addressRepository.findUserAddress(city, district, ward, addressDetail, id);
    }
}
