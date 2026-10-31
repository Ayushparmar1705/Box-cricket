package com.facility_service.facility_service.Services;

import com.facility_service.facility_service.Model.CourtEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class Courtspecification {

    public static Specification<CourtEntity> filter(
            Integer venueId,
            Boolean isActive,
            String search,
            String courtname) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filter by venue ID
            if (venueId != null) {
                predicates.add(cb.equal(root.get("venueId"), venueId));
            }

            // 2. Filter by active / inactive status
            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            // 3. Filter by court name (partial, case-insensitive match)
            if (courtname != null && !courtname.trim().isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("courtName")),
                        "%" + courtname.trim().toLowerCase() + "%"
                ));
            }

            // 4. Keyword search across court name and description
            if (search != null && !search.trim().isEmpty()) {
                String keyword = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("courtName")), keyword);
                Predicate descMatch = cb.like(cb.lower(cb.coalesce(root.get("description"), "")), keyword);
                predicates.add(cb.or(nameMatch, descMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
