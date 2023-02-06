package com.example.datsan.repository.dao;

import com.example.datsan.entity.Address;
import com.example.datsan.entity.booking.Booking;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.pitch.PitchSystem;
import com.example.datsan.entity.pitch.PitchType;
import com.example.datsan.util.TimeUtils;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PitchSystemDAO {

    @PersistenceContext
    private EntityManager em;

    public List<PitchSystem> findPitchSystems(String city, String district, String ward, String addressDetail, String searchDate, String timeStart, String timeEnd, String systemName, String type) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<PitchSystem> cq = cb.createQuery(PitchSystem.class);

        Root<PitchSystem> pitchSystem = cq.from(PitchSystem.class);
        Join<PitchSystem, Pitch> pitch = pitchSystem.join("pitches", JoinType.LEFT);
        Join<PitchSystem, Address> address = pitchSystem.join("address");
        Join<Pitch, PitchType> pitchType = pitch.join("pitchType", JoinType.LEFT);
        List<Predicate> predicates = new ArrayList<>();

        if (city != null && !city.trim().isEmpty()) {
            predicates.add(cb.like(address.get("city"), "%" + city.trim() + "%"));
        }
        if (district != null && !district.trim().isEmpty()) {
            predicates.add(cb.like(address.get("district"), "%" + district.trim() + "%"));
        }
        if (ward != null && !ward.trim().isEmpty()) {
            predicates.add(cb.like(address.get("ward"), "%" + ward.trim() + "%"));
        }
        if (addressDetail != null && !addressDetail.trim().isEmpty()) {
            predicates.add(cb.like(address.get("addressDetail"), "%" + addressDetail.trim() + "%"));
        }
        if (timeStart != null || timeEnd != null) {
            List<Pitch> pitches = getSystemHasBooking(searchDate, timeStart, timeEnd);
            List<Long> ids = new ArrayList<>();
            if (pitches != null && pitches.size() > 0) {
                for (Pitch p : pitches) {
                    ids.add(p.getId());
                }
                predicates.add(cb.not(pitch.get("id").in(ids)));
            }
        }
        if (systemName != null && !systemName.isEmpty()) {
            predicates.add(cb.like(cb.upper(pitchSystem.get("name")), "%" + systemName.trim().toUpperCase() + "%"));
        }
        if (type != null && !type.isEmpty()) {
            predicates.add(cb.equal(pitchType.get("name"), type.trim()));
        }
        predicates.add(cb.equal(pitchSystem.get("deleted"), false));
        predicates.add(cb.equal(pitchSystem.get("status"), "Approved"));

        cq.select(pitchSystem).where(predicates.toArray(new Predicate[0])).distinct(true);
        TypedQuery<PitchSystem> result = em.createQuery(cq);
        List<PitchSystem> pitchSystems = result.getResultList();

        return pitchSystems;
    }

    public List<Pitch> getSystemHasBooking(String date, String rentStart, String rentEnd) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Pitch> cq = cb.createQuery(Pitch.class);

        Root<Pitch> pitch = cq.from(Pitch.class);
        Join<Pitch, Booking> booking = pitch.join("bookings", JoinType.LEFT);
        List<Predicate> pds = new ArrayList<>();

        SimpleDateFormat format = new SimpleDateFormat("HH:mm");
        try {
            if (!rentStart.trim().isEmpty() && !rentEnd.trim().isEmpty()) {
                Predicate p1 = cb.lessThanOrEqualTo(booking.get("rentStart"), format.parse(rentStart));
                Predicate p2 = cb.greaterThanOrEqualTo(booking.get("rentStart"), format.parse(rentStart));
                Predicate p3 = cb.lessThanOrEqualTo(booking.get("rentEnd"), format.parse(rentEnd));
                Predicate p4 = cb.greaterThanOrEqualTo(booking.get("rentEnd"), format.parse(rentEnd));
                Predicate p6 = cb.greaterThanOrEqualTo(booking.get("rentEnd"), format.parse(rentStart));
                Predicate p7 = cb.lessThanOrEqualTo(booking.get("rentStart"), format.parse(rentEnd));

                Predicate p5 = cb.equal(booking.get("rentDate"), TimeUtils.convertToSqlDate(date));
                Predicate p8 = cb.notEqual(booking.get("status"), "Rejected");

                Predicate p14 = cb.and(p1, p4);
                Predicate p27 = cb.and(p2, p7);
                Predicate p36 = cb.and(p3, p6);
                Predicate p23 = cb.and(p2, p3);

                Predicate p = cb.or(p14, p27, p23, p36);

                pds.add(cb.and(p, p5, p8));
            } else if (!rentStart.trim().isEmpty()) {
                Predicate p1 = cb.lessThanOrEqualTo(booking.get("rentStart"), format.parse(rentStart));
                Predicate p5 = cb.equal(booking.get("rentDate"), TimeUtils.convertToSqlDate(date));
                Predicate p8 = cb.notEqual(booking.get("status"), "Rejected");
                pds.add(cb.and(p1, p5, p8));
            } else if (!rentEnd.trim().isEmpty()) {
                Predicate p4 = cb.greaterThanOrEqualTo(booking.get("rentEnd"), format.parse(rentEnd));
                Predicate p5 = cb.equal(booking.get("rentDate"), TimeUtils.convertToSqlDate(date));
                Predicate p8 = cb.notEqual(booking.get("status"), "Rejected");
                pds.add(cb.and(p4, p5, p8));
            } else {
                return null;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        pds.add(cb.equal(pitch.get("deleted"), false));

        cq.select(pitch).where(pds.toArray(new Predicate[0])).distinct(true);
        TypedQuery<Pitch> result = em.createQuery(cq);
        List<Pitch> pitches = result.getResultList();

        return pitches;
    }
}
