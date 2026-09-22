package com.court_service.court_service.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.court_service.court_service.dto.request.PricingRequestDto;
import com.court_service.court_service.model.Pricingruleentity;
import com.court_service.court_service.repository.PricingRuleRepositry;

@Service
public class PricingruleService {

    private final PricingRuleRepositry rep;

    public PricingruleService(PricingRuleRepositry rep) {
        this.rep = rep;
    }

    @Transactional
    public Pricingruleentity createPricing(PricingRequestDto pricingdto) {
        if (pricingdto.getStartTime() == null || pricingdto.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }

        if (!pricingdto.getStartTime().isBefore(pricingdto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (pricingdto.getPrice() == null || pricingdto.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }

        if (pricingdto.getValidFrom() != null && pricingdto.getValidTo() != null) {
            if (pricingdto.getValidFrom().isAfter(pricingdto.getValidTo())) {
                throw new IllegalArgumentException("Valid from date must be before or equal to valid to date");
            }
        }

        LocalDateTime validFromTime = pricingdto.getValidFrom() != null
                ? LocalDateTime.of(pricingdto.getValidFrom(), LocalTime.MIN)
                : null;

        LocalDateTime validToTime = pricingdto.getValidTo() != null
                ? LocalDateTime.of(pricingdto.getValidTo(), LocalTime.MAX)
                : null;

        if (rep.existsBycourtid(pricingdto.getCourtId()) == true) {
            throw new IllegalArgumentException("Pricing rule already exists for court id: " + pricingdto.getCourtId());
        }

        Pricingruleentity entity = Pricingruleentity.builder()
                .courtid(pricingdto.getCourtId())
                .day_type(pricingdto.getDayType())
                .start_time(pricingdto.getStartTime())
                .end_time(pricingdto.getEndTime())
                .price(pricingdto.getPrice())
                .valid_from(pricingdto.getValidFrom())
                .valid_to(pricingdto.getValidTo())
                .build();

        return rep.save(entity);
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
