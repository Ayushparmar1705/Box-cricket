package com.court_service.court_service.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.court_service.court_service.model.Pricingruleentity;
import com.court_service.court_service.repository.PricingRuleRepositry;

@Service
public class PricingruleService {

    private final PricingRuleRepositry rep;

    public PricingruleService(PricingRuleRepositry rep) {
        this.rep = rep;
    }

    @Transactional
    public Pricingruleentity createPricing(Pricingruleentity pricing) {
        if (pricing.getStart_time() == null || pricing.getEnd_time() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }

        if (!pricing.getStart_time().isBefore(pricing.getEnd_time())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (pricing.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }

        if (pricing.getValid_from() != null && pricing.getValid_to() != null) {
            if (pricing.getValid_from().isAfter(pricing.getValid_to())) {
                throw new IllegalArgumentException("Valid from date must be before or equal to valid to date");
            }
        }

        if (rep.existsBycourtid(pricing.getCourtid())) {
            throw new IllegalArgumentException("Pricing rule already exists for court id: " + pricing.getCourtid());
        }

        return rep.save(pricing);
    }

    public List<Pricingruleentity> getPricingByCourtId(int courtId) {
        return rep.findByCourtid(courtId);
    }

    public Pricingruleentity getPricingById(int id) {
        return rep.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pricing rule not found with id: " + id));
    }

    @Transactional
    public void deletePricing(int id) {
        if (!rep.existsById(id)) {
            throw new IllegalArgumentException("Pricing rule not found with id: " + id);
        }
        rep.deleteById(id);
    }
}
