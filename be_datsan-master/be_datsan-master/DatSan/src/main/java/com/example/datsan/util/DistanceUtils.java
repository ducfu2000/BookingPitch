package com.example.datsan.util;


public class DistanceUtils {

    private static Double strToDouble(String num) throws NumberFormatException {
        Double ret = 0d;
        ret = Double.parseDouble(num);

        return ret;
    }

    private static Double degToRad(Double deg) {
        return deg * (Math.PI / 180);
    }

    public static Double calculateDistance(String lat1, String lng1, String lat2, String lng2) {
        Double latitude1 = strToDouble(lat1);
        Double latitude2 = strToDouble(lat2);
        Double longtitude1 = strToDouble(lng1);
        Double longtitude2 = strToDouble(lng2);

        Double dLat = degToRad(latitude1 - latitude2);
        Double dLng = degToRad(longtitude1 - longtitude2);

        Double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(degToRad(latitude1)) * Math.cos(degToRad(latitude2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        Double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        Double d = 6371 * c; //distance in km
        return d;

    }
}
