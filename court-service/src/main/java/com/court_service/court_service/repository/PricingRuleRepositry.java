package com.court_service.court_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.court_service.court_service.model.Pricingruleentity;

@Repository
public interface PricingRuleRepositry extends JpaRepository<Pricingruleentity, Integer> {
    boolean existsBycourtid(int courtId);
    List<Pricingruleentity> findByCourtid(int courtId);
}
