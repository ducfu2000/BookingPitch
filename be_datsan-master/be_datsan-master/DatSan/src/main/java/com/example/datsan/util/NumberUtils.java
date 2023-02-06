package com.example.datsan.util;

public class NumberUtils {
    public static Float roundToHalf(Float number) {
        Double afterRound = Math.round(number * 2) / 2.0;
        return Float.valueOf(String.valueOf(afterRound));
    }

    public static void main(String[] args) {
        System.out.println(roundToHalf((float) 2.7492321435));
    }
}
