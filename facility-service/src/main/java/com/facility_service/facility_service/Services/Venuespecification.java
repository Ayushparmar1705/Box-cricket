package com.facility_service.facility_service.Services;

import com.facility_service.facility_service.Model.Venuemodel;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * Specification: Venuespecification
 * Description: Dynamic JPA query filter for venues.
 *              Supports filtering by owner, city, active status, name,
 *              and keyword search across multiple fields.
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

            // 1. Filter by Owner ID
            if (ownerId != null) {
                predicates.add(cb.equal(root.get("owner_id"), ownerId));
            }

            // 2. Filter by City (case-insensitive partial match)
            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("city")),
                        "%" + city.trim().toLowerCase() + "%"
                ));
            }

            // 3. Filter by Active status (is_active)
            if (isActive != null) {
                predicates.add(cb.equal(root.get("active"), isActive));
            }

            // 4. Filter by Venue Name (case-insensitive partial match)
            if (name != null && !name.trim().isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("name")),
                        "%" + name.trim().toLowerCase() + "%"
                ));
            }

            // 5. Keyword search across name, city, address, and description
            if (search != null && !search.trim().isEmpty()) {
                String keyword = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(cb.coalesce(root.get("name"), "")), keyword);
                Predicate cityMatch = cb.like(cb.lower(cb.coalesce(root.get("city"), "")), keyword);
                Predicate addressMatch = cb.like(cb.lower(cb.coalesce(root.get("address"), "")), keyword);
                Predicate descMatch = cb.like(cb.lower(cb.coalesce(root.get("description"), "")), keyword);
                predicates.add(cb.or(nameMatch, cityMatch, addressMatch, descMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

