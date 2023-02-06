package com.example.datsan.util;

import com.example.datsan.dto.request.UnitPriceRequest;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TimeUtils {
    public static Double getRangeTime(String start, String end) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm");
        Date dStart = simpleDateFormat.parse(start);
        Date dEnd = simpleDateFormat.parse(end);

        Float rangeOfTime = Float.valueOf(Math.abs(dStart.getTime() - dEnd.getTime()));
        Float rangeHour = (rangeOfTime / 3600000) % 24;
        Double rangeTime = Math.ceil(rangeHour * 10) / 10;

        return rangeTime;
    }

    public static Time convertToTime(String time) {
        Date date;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
            if (time != null && !time.trim().isEmpty()) {
                date = sdf.parse(time);
                return new Time(date.getTime());
            } else {
                return null;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static java.sql.Date convertToSqlDate(String date) {
        Date dateTime;
        java.sql.Date sqlDate;
        try {
            if(date != null && !date.trim().isEmpty()) {
                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                dateTime = sdf.parse(date);
                sqlDate = new java.sql.Date(dateTime.getTime());
                return sqlDate;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static String convertToDateTime(LocalDateTime date) {
        if(date != null) {
            return date.format(DateTimeFormatter
                    .ofPattern("dd/MM/yyyy HH:mm:ss"));
        }
        return null;
    }

    public static String convertToDateString(java.sql.Date date) {
        if(date != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            return sdf.format(date);
        }
        return null;
    }

    public static Time getMinTimeOfUnitPrice(List<UnitPriceRequest> unitPrices){
        Time time = Time.valueOf("23:59:59");
        for(UnitPriceRequest unitPrice : unitPrices){
            if(convertToTime(unitPrice.getTimeStart()).before(time)){
                time = convertToTime(unitPrice.getTimeStart());
            }
        }
        return time;
    }

    public static Time getMaxTimeOfUnitPrice(List<UnitPriceRequest> unitPrices){
        Time time = Time.valueOf("00:00:00");
        for(UnitPriceRequest unitPrice : unitPrices){
            if(convertToTime(unitPrice.getTimeEnd()).after(time)){
                time = convertToTime(unitPrice.getTimeEnd());
            }
        }
        return time;
    }

    public static boolean isUnitPriceValid(UnitPriceRequest up1, UnitPriceRequest up2){
        Time start1 = convertToTime(up1.getTimeStart());
        Time end1 = convertToTime(up1.getTimeEnd());
        Time start2 = convertToTime(up2.getTimeStart());
        Time end2 = convertToTime(up2.getTimeEnd());
        if(start1.after(end1) || start2.after(end2)){
            return false;
        }
        if(start1.after(start2) && start1.before(end2)){
            return false;
        }
        if(start1.before(start2) && end1.after(start2)){
            return false;
        }
        if(start1.equals(start2) || end1.equals(end2)){
            return false;
        }
        return true;
    }

    public static String isUnitPricesValid(List<UnitPriceRequest> requests, Time hiredStart, Time hiredEnd){
        try {
            if(requests.size() <= 0){
                return "Vui lòng điền giá theo khung giờ từ " + hiredStart + " (giờ mở sân) đến " + hiredEnd + " (giờ đóng sân)";
            }
            if(requests.size() == 1){
                UnitPriceRequest request = requests.get(0);
                if(!convertToTime(request.getTimeStart()).equals(hiredStart) || !convertToTime(request.getTimeEnd()).equals(hiredEnd)){
                    return "Khung giờ bạn điền không phù hợp theo giờ mở, đóng sân";
                }
            }
            if(requests.size() > 1){
                List<UnitPriceRequest> prices = new ArrayList<>();
                List<UnitPriceRequest> pricesWeekend = new ArrayList<>();
                for(UnitPriceRequest request : requests){
                    if(request.getIsWeekend()){
                        pricesWeekend.add(request);
                    } else {
                        prices.add(request);
                    }
                }

                if(prices.size() == 1){
                    UnitPriceRequest request = prices.get(0);
                    if(!convertToTime(request.getTimeStart()).equals(hiredStart) || !convertToTime(request.getTimeEnd()).equals(hiredEnd)){
                        return "Khung giờ với các ngày trong tuần bạn điền không phù hợp theo giờ mở, đóng sân";
                    }
                }

                if(prices.size() > 1){
                    Time min = getMinTimeOfUnitPrice(prices);
                    Time max = getMaxTimeOfUnitPrice(prices);
                    if(!min.equals(hiredStart) || !max.equals(hiredEnd)){
                        return "Khung giờ với các ngày trong tuần bạn điền không phù hợp theo giờ mở, đóng sân";
                    }
                    for(int i = 0; i < prices.size() - 1; i++){
                        for(int j = i + 1; j < prices.size(); j++){
                            if(!isUnitPriceValid(prices.get(i), prices.get(j))){
                                return "Khung giờ với các ngày trong tuần bạn thêm đang bị trùng";
                            }
                        }
                    }
                    Double rangeTimes = Double.valueOf(0);
                    for(UnitPriceRequest price : prices){
                        rangeTimes += getRangeTime(price.getTimeStart(), price.getTimeEnd());
                    }
                    Double rangeTime = getRangeTime(hiredStart.toString(), hiredEnd.toString());
                    if(rangeTimes < rangeTime){
                        return "Khung giờ với các ngày trong tuần bạn điền không đủ";
                    }
                }

                if(pricesWeekend.size() == 1){
                    UnitPriceRequest request = pricesWeekend.get(0);
                    if(!convertToTime(request.getTimeStart()).equals(hiredStart) || !convertToTime(request.getTimeEnd()).equals(hiredEnd)){
                        return "Khung giờ với ngày cuối tuần bạn điền không phù hợp theo giờ mở, đóng sân";
                    }
                }

                if(pricesWeekend.size() > 1){
                    Time min = getMinTimeOfUnitPrice(pricesWeekend);
                    Time max = getMaxTimeOfUnitPrice(pricesWeekend);
                    if(!min.equals(hiredStart) || !max.equals(hiredEnd)){
                        return "Khung giờ với ngày cuối tuần bạn điền không phù hợp theo giờ mở, đóng sân";
                    }
                    for(int i = 0; i < pricesWeekend.size() - 1; i++){
                        for(int j = i + 1; j < pricesWeekend.size(); j++){
                            if(!isUnitPriceValid(pricesWeekend.get(i), pricesWeekend.get(j))){
                                return "Khung giờ với ngày cuối tuần bạn thêm đang bị trùng";
                            }
                        }
                    }
                    Double rangeTimes = Double.valueOf(0);
                    for(UnitPriceRequest price : pricesWeekend){
                        rangeTimes += getRangeTime(price.getTimeStart(), price.getTimeEnd());
                    }
                    Double rangeTime = getRangeTime(hiredStart.toString(), hiredEnd.toString());
                    if(rangeTimes < rangeTime){
                        return "Khung giờ với ngày cuối tuần bạn điền không đủ";
                    }
                }
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return "valid";
    }
}
