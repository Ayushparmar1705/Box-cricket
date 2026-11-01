package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.Dayenum;
import com.facility_service.facility_service.Model.Pricingruleentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ============================================================================
 * Repository: PricingRuleRepositry
 * Description: Data access layer for pricing_rules table.
 * Primary Key type: Integer
 * ============================================================================
 */
@Repository
public interface PricingRuleRepositry extends JpaRepository<Pricingruleentity, Integer> {

    /**
     * Find all pricing rules configured for a specific court.
     * SQL equivalent: SELECT * FROM pricing_rules WHERE court_id = ?
     */
    List<Pricingruleentity> findByCourtId(Integer courtId);

    /**
     * Find pricing rules for a court filtered by day type (e.g., WEEKDAY, WEEKEND).
     * SQL equivalent: SELECT * FROM pricing_rules WHERE court_id = ? AND day_type = ?
     */
    List<Pricingruleentity> findByCourtIdAndDayType(Integer courtId, Dayenum dayType);

    /**
     * Check if at least one pricing rule exists for a specific court.
     */
    boolean existsByCourtId(Integer courtId);
}
