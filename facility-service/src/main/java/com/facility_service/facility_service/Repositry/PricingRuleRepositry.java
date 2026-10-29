package com.facility_service.facility_service.Repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facility_service.facility_service.Model.Pricingruleentity;

@Repository
public interface PricingRuleRepositry extends JpaRepository<Pricingruleentity, Integer> {
    boolean existsBycourtid(int courtId);
    List<Pricingruleentity> findByCourtid(int courtId);
}

