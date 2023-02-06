package com.example.datsan.repository.dao;

import com.example.datsan.entity.booking.Booking;
import com.example.datsan.entity.pitch.Pitch;
import com.example.datsan.entity.pitch.PitchSystem;
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
public class PitchDAO {

    @PersistenceContext
    private EntityManager em;

    public List<Pitch> getListPitches(Long id, String date, String rentStart, String rentEnd){
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Pitch> cq = cb.createQuery(Pitch.class);

        Root<Pitch> pitch = cq.from(Pitch.class);
        Join<Pitch, PitchSystem> pitchSystem = pitch.join("pitchSystem");
        List<Predicate> pds = new ArrayList<>();

        if (rentStart != null && rentEnd != null) {
            List<Pitch> pitches = getPitchHasBooking(id, date, rentStart, rentEnd);
            List<Long> ids = new ArrayList<>();
            if (pitches != null && pitches.size() > 0) {
                for (Pitch p : pitches) {
                    ids.add(p.getId());
                }
                pds.add(cb.not(pitch.get("id").in(ids)));
            }
        }
        pds.add(cb.equal(pitchSystem.get("id"), id));

        pds.add(cb.equal(pitch.get("deleted"), false));

        cq.select(pitch).where(pds.toArray(new Predicate[0])).distinct(true);
        TypedQuery<Pitch> result = em.createQuery(cq);
        List<Pitch> pitches = result.getResultList();

        return pitches;
    }

    public List<Pitch> getPitchHasBooking(Long id, String date, String rentStart, String rentEnd) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Pitch> cq = cb.createQuery(Pitch.class);

        Root<Pitch> pitch = cq.from(Pitch.class);
        Join<Pitch, Booking> booking = pitch.join("bookings", JoinType.LEFT);
        Join<Pitch, PitchSystem> pitchSystem = pitch.join("pitchSystem", JoinType.LEFT);
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
        pds.add(cb.equal(pitchSystem.get("id"), id));

        pds.add(cb.equal(pitch.get("deleted"), false));

        cq.select(pitch).where(pds.toArray(new Predicate[0])).distinct(true);
        TypedQuery<Pitch> result = em.createQuery(cq);
        List<Pitch> pitches = result.getResultList();

        return pitches;
    }
}
