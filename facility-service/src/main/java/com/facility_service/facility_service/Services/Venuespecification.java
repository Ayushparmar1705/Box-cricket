package com.facility_service.facility_service.Services;

import com.facility_service.facility_service.Model.Venuemodel;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * Specification: Venuespecification
 * Description: Simple and clean filter for venues.
 *              Builds SQL queries dynamically based on provided filters.
 * ============================================================================
 */
public class Venuespecification {

    public static Specification<Venuemodel> filter(
            Integer ownerId,
            String city,
            Boolean isActive,
            String search,
            String name) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filter by Owner ID (if provided)
            if (ownerId != null) {
                predicates.add(cb.equal(root.get("owner_id"), ownerId));
            }

            // 2. Filter by City (if provided)
            if (city != null && !city.trim().isEmpty()) {
                String cityKeyword = "%" + city.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("city")), cityKeyword));
            }

            // 3. Filter by Active Status (if provided)
            if (isActive != null) {
                predicates.add(cb.equal(root.get("active"), isActive));
            }

            // 4. Search by Venue Name (if provided)
            String nameKeyword = search != null ? search : name;
            if (nameKeyword != null && !nameKeyword.trim().isEmpty()) {
                String namePattern = "%" + nameKeyword.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), namePattern));
            }

            // Combine all conditions with AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
