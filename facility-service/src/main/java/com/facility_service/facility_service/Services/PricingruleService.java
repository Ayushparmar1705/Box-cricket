package com.facility_service.facility_service.Services;

import com.facility_service.facility_service.Model.Pricingruleentity;
import com.facility_service.facility_service.Repositry.CourtRepository;
import com.facility_service.facility_service.Repositry.PricingRuleRepositry;
import com.facility_service.facility_service.Exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * ============================================================================
 * Service Layer: PricingruleService
 * Description: Contains business logic and validation for Court Pricing Rules.
 * ============================================================================
 */
@Service
public class PricingruleService {

    private final PricingRuleRepositry pricingRepository;
    private final CourtRepository courtRepository;

    // Constructor Injection (recommended for Spring Boot)
    public PricingruleService(PricingRuleRepositry pricingRepository, CourtRepository courtRepository) {
        this.pricingRepository = pricingRepository;
        this.courtRepository = courtRepository;
    }

    /**
     * 1. Create a new Pricing Rule
     * Performs validations before saving:
     * - Parent Court exists in database
     * - price is greater than 0
     * - valid_from is before or equal to valid_to
     */
    @Transactional
    public Pricingruleentity createPricingRule(Pricingruleentity pricing) {
        // Step 1: Validate Court Existence
        if (pricing.getCourtId() == null) {
            throw new IllegalArgumentException("Court ID is required");
        }
        if (!courtRepository.existsById(pricing.getCourtId())) {
            throw new ResourceNotFoundException("Court not found with id: " + pricing.getCourtId());
        }

        // Step 2: Validate Price
        if (pricing.getPrice() == null || pricing.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be a positive number greater than zero");
        }

        // Step 3: Validate Effective Date Range (if provided)
        if (pricing.getValidFrom() != null && pricing.getValidTo() != null) {
            if (pricing.getValidFrom().isAfter(pricing.getValidTo())) {
                throw new IllegalArgumentException("valid_from date (" + pricing.getValidFrom()
                        + ") cannot be after valid_to date (" + pricing.getValidTo() + ")");
            }
        }

        // Step 5: Save record into database and return saved entity with generated
        // Integer ID
        return pricingRepository.save(pricing);
    }

    /**
     * 2. Get Pricing Rules with optional isActive filter
     */
    @Transactional(readOnly = true)
    public List<Pricingruleentity> getAllPricingRules(Boolean isActive) {
        if (isActive != null) {
            return pricingRepository.findByIsActive(isActive);
        }
        return pricingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Pricingruleentity> getAllPricingRules() {
        return getAllPricingRules(null);
    }

    /**
     * 3. Get Pricing Rule by Integer Primary Key
     */
    @Transactional(readOnly = true)
    public Pricingruleentity getPricingRuleById(Integer id) {
        return pricingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule not found with id: " + id));
    }

    /**
     * 4. Get Pricing Rules for a specific Court with optional isActive filter
     */
    @Transactional(readOnly = true)
    public List<Pricingruleentity> getPricingRulesByCourtId(Integer courtId, Boolean isActive) {
        if (!courtRepository.existsById(courtId)) {
            throw new ResourceNotFoundException("Court not found with id: " + courtId);
        }
        if (isActive != null) {
            return pricingRepository.findByCourtIdAndIsActive(courtId, isActive);
        }
        return pricingRepository.findByCourtId(courtId);
    }

    @Transactional(readOnly = true)
    public List<Pricingruleentity> getPricingRulesByCourtId(Integer courtId) {
        return getPricingRulesByCourtId(courtId, null);
    }

    /**
     * 5. Update an existing Pricing Rule by Integer ID
     */
    @Transactional
    public Pricingruleentity updatePricingRule(Integer id, Pricingruleentity updatedData) {
        // Find existing record
        Pricingruleentity existingRule = getPricingRuleById(id);

        // Update fields if new values are provided
        if (updatedData.getDayType() != null) {
            existingRule.setDayType(updatedData.getDayType());
        }

        if (updatedData.getPrice() != null) {
            if (updatedData.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Price must be greater than zero");
            }
            existingRule.setPrice(updatedData.getPrice());
        }

        if (updatedData.getValidFrom() != null) {
            existingRule.setValidFrom(updatedData.getValidFrom());
        }

        if (updatedData.getValidTo() != null) {
            existingRule.setValidTo(updatedData.getValidTo());
        }

        existingRule.setActive(updatedData.isActive());
        if (updatedData.getIsActive() != null) {
            existingRule.setIsActive(updatedData.getIsActive());
        }

        return pricingRepository.save(existingRule);
    }

    /**
     * 6. Soft Delete a Pricing Rule by Integer ID (sets is_active = false)
     */
    @Transactional
    public Pricingruleentity deletePricingRule(Integer id) {
        Pricingruleentity existingRule = getPricingRuleById(id);
        existingRule.setActive(false);
        return pricingRepository.save(existingRule);
    }

    /**
     * 7. Change Status / Restore Pricing Rule (sets is_active = status)
     */
    @Transactional
    public Pricingruleentity changeStatus(Integer id, boolean status) {
        Pricingruleentity existingRule = getPricingRuleById(id);
        existingRule.setActive(status);
        return pricingRepository.save(existingRule);
    }

    // Backward-compatibility aliases for existing controller methods
    @Transactional
    public Pricingruleentity createPricing(Pricingruleentity pricing) {
        return createPricingRule(pricing);
    }

    @Transactional(readOnly = true)
    public List<Pricingruleentity> getPricingByCourtId(int courtId) {
        return getPricingRulesByCourtId(courtId);
    }

    @Transactional(readOnly = true)
    public Pricingruleentity getPricingById(Integer id) {
        return getPricingRuleById(id);
    }

    @Transactional
    public void deletePricing(Integer id) {
        deletePricingRule(id);
    }
}