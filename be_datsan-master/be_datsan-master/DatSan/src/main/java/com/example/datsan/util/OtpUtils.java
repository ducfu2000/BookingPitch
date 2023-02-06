package com.example.datsan.util;

import java.util.Random;

public class OtpUtils {
    public static String getRandomOtp() {
        Random rnd = new Random();
        int number = rnd.nextInt(999999);
        return String.format("%06d", number);
    }
}
