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
     */
    List<Pricingruleentity> findByCourtId(Integer courtId);

    /**
     * Find pricing rules for a court filtered by active status.
     */
    List<Pricingruleentity> findByCourtIdAndIsActive(Integer courtId, boolean isActive);

    /**
     * Find all pricing rules filtered by active status.
     */
    List<Pricingruleentity> findByIsActive(boolean isActive);

    /**
     * Find pricing rules for a court filtered by day type (e.g., WEEKDAY, WEEKEND).
     */
    List<Pricingruleentity> findByCourtIdAndDayType(Integer courtId, Dayenum dayType);

    /**
     * Find active pricing rules for a court filtered by day type.
     */
    List<Pricingruleentity> findByCourtIdAndDayTypeAndIsActive(Integer courtId, Dayenum dayType, boolean isActive);

    /**
     * Check if at least one active pricing rule exists for a specific court.
     */
    boolean existsByCourtIdAndIsActive(Integer courtId, boolean isActive);

    /**
     * Check if at least one pricing rule exists for a specific court.
     */
    boolean existsByCourtId(Integer courtId);
}
