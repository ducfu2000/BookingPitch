package com.example.datsan.util;

import com.example.datsan.dto.intermediate.PitchSystemDistance;

import java.util.ArrayList;
import java.util.List;

public class SortUtils {
    public static List<PitchSystemDistance> sortTop5(List<PitchSystemDistance> unSortedList) {
        int min;
        int n = unSortedList.size();
        List<PitchSystemDistance> ret = new ArrayList<>();
        if (n > 5) {
            for (int i = 0; i < 5; i++) {
                min = i;
                for (int j = i + 1; j < n; j++) {
                    if (unSortedList.get(j).getDistance() < unSortedList.get(min).getDistance()) {
                        min = j;
                    }
                }
                PitchSystemDistance temp = unSortedList.get(min);
                unSortedList.set(min, unSortedList.get(i));
                unSortedList.set(i, temp);
            }

            for (int i = 0; i < 5; i++) {
                ret.add(unSortedList.get(i));
            }
        } else {
            for (int i = 0; i < n; i++) {
                min = i;
                for (int j = i + 1; j < n; j++) {
                    if (unSortedList.get(j).getDistance() < unSortedList.get(min).getDistance()) {
                        min = j;
                    }
                }
                PitchSystemDistance temp = unSortedList.get(min);
                unSortedList.set(min, unSortedList.get(i));
                unSortedList.set(i, temp);
            }
            ret = unSortedList;
        }
        return ret;
    }

}
