package com.example.datsan.service.impl;

import com.example.datsan.dto.request.UnitPriceRequest;
import com.example.datsan.entity.UnitPrice;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.repository.PitchRepository;
import com.example.datsan.repository.UnitPriceRepository;
import com.example.datsan.service.UnitPriceService;
import com.example.datsan.util.TimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class UnitPriceServiceImpl implements UnitPriceService {

    @Autowired
    private UnitPriceRepository unitPriceRepository;

    @Autowired
    private PitchRepository pitchRepository;

    @Override
    public void addUnitPrices(List<UnitPriceRequest> requests, Pitch pitch, Long userId) {
        try {
            for (UnitPriceRequest request : requests) {
                UnitPrice unitPrice = new UnitPrice();
                unitPrice.setPitch(pitch);
                unitPrice.setTimeStart(Time.valueOf(request.getTimeStart()));
                unitPrice.setTimeEnd(Time.valueOf(request.getTimeEnd()));
                unitPrice.setPrice(Float.valueOf(request.getPrice()));
                unitPrice.setIsWeekend(request.getIsWeekend());
                unitPrice.setCreatedBy(userId);

                unitPriceRepository.save(unitPrice);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void updateUnitPrice(Long userId, Pitch pitch, List<UnitPriceRequest> unitPrices) {
        try {
            for (UnitPriceRequest request : unitPrices) {
                UnitPrice unitPrice = new UnitPrice();
                if (request.getId() != null) {
                    unitPrice = unitPriceRepository.findUnitPriceById(request.getId());
                }
                unitPrice.setPitch(pitch);
                unitPrice.setTimeStart(Time.valueOf(request.getTimeStart()));
                unitPrice.setTimeEnd(Time.valueOf(request.getTimeEnd()));
                unitPrice.setPrice(Float.valueOf(request.getPrice()));
                unitPrice.setIsWeekend(request.getIsWeekend());
                unitPrice.setUpdatedBy(userId);

                unitPriceRepository.save(unitPrice);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public String getRangeOfPriceForSystem(Long systemId) {
        Float min = unitPriceRepository.findMinPriceBySystemId(systemId);
        Float max = unitPriceRepository.findMaxPriceBySystemId(systemId);
        return min + " - " + max;
    }

    @Override
    public String getTotalPrice(String date, String start, String end, Long id) {
        String message = "";
        Boolean isWeekend = false;
        Double totalPrice;

        try {
            Pitch pitch = pitchRepository.findPitchById(id);
            if(TimeUtils.convertToTime(start).after(TimeUtils.convertToTime(end))) {
                return "Vui lòng nhập giờ bắt đầu bé hơn giờ kết thúc";
            }
            if(TimeUtils.convertToTime(start).before(pitch.getPitchSystem().getHiredStart())){
                return "Giờ bắt đầu hiện tại bạn nhập bé hơn giờ mở cửa của sân";
            }
            if(TimeUtils.convertToTime(end).after(pitch.getPitchSystem().getHiredEnd())){
                return "Giờ kết thúc hiện tại bạn nhập lớn hơn giờ đóng cửa của sân";
            }
            Date d = TimeUtils.convertToSqlDate(date);
            LocalDate localDate = d.toLocalDate();
            DayOfWeek day = localDate.getDayOfWeek();
            if (day.getValue() == DayOfWeek.SATURDAY.getValue() || day.getValue() == DayOfWeek.SUNDAY.getValue()) {
                isWeekend = true;
            }

            UnitPrice unitPrice1 = unitPriceRepository.getUnitPriceByRentStart(id, TimeUtils.convertToTime(start), isWeekend);
            UnitPrice unitPrice2 = unitPriceRepository.getUnitPriceByRentEnd(id, TimeUtils.convertToTime(end), isWeekend);
            UnitPrice up1;
            UnitPrice up2;

            if (unitPrice1 != null && unitPrice2 != null) {
                if (unitPrice1.getId() != unitPrice2.getId()) {
                    Double a = TimeUtils.getRangeTime(start, unitPrice1.getTimeEnd().toString());
                    Double b = TimeUtils.getRangeTime(unitPrice2.getTimeStart().toString(), end);

                    totalPrice = a * unitPrice1.getPrice() + b * unitPrice2.getPrice();
                } else {
                    totalPrice = TimeUtils.getRangeTime(start, end) * unitPrice1.getPrice();
                }
            } else if (unitPrice1 == null && unitPrice2 != null) {
                up1 = unitPriceRepository.getPriceCustom(id, TimeUtils.convertToTime(start), isWeekend);
                if (up1.getId() != unitPrice2.getId()) {
                    Double a = TimeUtils.getRangeTime(start, up1.getTimeEnd().toString());
                    Double b = TimeUtils.getRangeTime(unitPrice2.getTimeStart().toString(), end);

                    totalPrice = a * up1.getPrice() + b * unitPrice2.getPrice();
                } else {
                    totalPrice = TimeUtils.getRangeTime(start, end) * up1.getPrice();
                }
            } else if (unitPrice1 != null) {
                up2 = unitPriceRepository.getPriceCustom(id, TimeUtils.convertToTime(end), isWeekend);
                if (unitPrice1.getId() != up2.getId()) {
                    Double a = TimeUtils.getRangeTime(start, unitPrice1.getTimeEnd().toString());
                    Double b = TimeUtils.getRangeTime(up2.getTimeStart().toString(), end);

                    totalPrice = a * unitPrice1.getPrice() + b * up2.getPrice();
                } else {
                    totalPrice = TimeUtils.getRangeTime(start, end) * unitPrice1.getPrice();
                }
            } else {
                up1 = unitPriceRepository.getPriceCustom(id, TimeUtils.convertToTime(start), isWeekend);
                up2 = unitPriceRepository.getPriceCustom(id, TimeUtils.convertToTime(end), isWeekend);
                if (up1 == null && isWeekend) {
                    up1 = unitPriceRepository.getPriceCustom(id, TimeUtils.convertToTime(start), false);
                }
                if (up2 == null && isWeekend) {
                    up2 = unitPriceRepository.getPriceCustom(id, TimeUtils.convertToTime(start), false);
                }
                if (up1.getId() != up2.getId()) {
                    Double a = TimeUtils.getRangeTime(start, up1.getTimeEnd().toString());
                    Double b = TimeUtils.getRangeTime(up2.getTimeStart().toString(), end);

                    totalPrice = a * up1.getPrice() + b * up2.getPrice();
                } else {
                    totalPrice = TimeUtils.getRangeTime(start, end) * up1.getPrice();
                }
            }
            message = totalPrice.toString();
        } catch (Exception ex) {
            message = "Lỗi xảy ra trong quá trình tính giá tiền sân";
        }

        return message;
    }

    @Override
    public String getRangeOfPriceForPitch(Long pid) {
        Float min = unitPriceRepository.findMinPrice(pid);
        Float max = unitPriceRepository.findMaxPrice(pid);
        return min + " - " + max;
    }
}
