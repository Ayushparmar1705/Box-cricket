package com.facility_service.facility_service.Services;

import com.facility_service.facility_service.Model.CourtEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class Courtspecification {
    public static Specification<CourtEntity> filter(Boolean isActive, String search, String courtname) {
        List<Predicate> predicate = new ArrayList<>();
        return (root, query, cb) -> {
            if (isActive != null) {
                predicate.add(
                        cb.equal(root.get("isActive"), isActive)
                );
            }
            if (courtname != null && !courtname.isBlank()) {
                predicate.add(
                        cb.like(
                                cb.lower(root.get("courtName")),
                                "%" + courtname.trim().toLowerCase() + "%"
                        )
                );
            }
            if (search != null && !search.isBlank()) {
                String keyword = "%" + search.trim().toLowerCase() + "%";
                predicate.add(cb.or(
                        cb.like(cb.lower(root.get("courtName")), keyword)
                ));
            }
            return cb.and(predicate.toArray(new Predicate[0]));
        };
    }
}

