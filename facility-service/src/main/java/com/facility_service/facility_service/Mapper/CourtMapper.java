package com.facility_service.facility_service.Mapper;

import com.facility_service.facility_service.Model.CourtEntity;
import com.facility_service.facility_service.Model.CourtImageEntity;
import com.facility_service.facility_service.Model.Pricingruleentity;
import com.facility_service.facility_service.Repositry.PricingRuleRepositry;
import com.facility_service.facility_service.dto.Requestdto.CourtRequestDto;
import com.facility_service.facility_service.dto.Requestdto.UpdateCourtRequestDto;
import com.facility_service.facility_service.dto.Responsedto.CourtImageResponseDto;
import com.facility_service.facility_service.dto.Responsedto.CourtResponseDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * ============================================================================
 * Mapper: CourtMapper
 * Description: Simple and easy-to-read mapper that converts between
 *              CourtEntity and Court DTOs.
 * ============================================================================
 */
@Component
public class CourtMapper {

    private final CourtImageMapper courtImageMapper;
    private final PricingRuleRepositry pricingRuleRepository;

    public CourtMapper(CourtImageMapper courtImageMapper, PricingRuleRepositry pricingRuleRepository) {
        this.courtImageMapper = courtImageMapper;
        this.pricingRuleRepository = pricingRuleRepository;
    }

    /**
     * Convert CourtRequestDto -> CourtEntity
     */
    public CourtEntity toEntity(CourtRequestDto dto) {
        if (dto == null) {
            return null;
        }

        CourtEntity entity = new CourtEntity();
        entity.setVenueId(dto.getVenueId());
        entity.setCategoryId(dto.getCategoryId());
        entity.setCourtName(dto.getCourtName());
        entity.setSurfaceType(dto.getSurfaceType());
        entity.setMaxPlayers(dto.getMaxPlayers());
        entity.setDescription(dto.getDescription());
        entity.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : Boolean.TRUE);

        return entity;
    }

    /**
     * Convert CourtEntity -> CourtResponseDto
     * Simple step-by-step logic:
     * 1. Copy basic court fields.
     * 2. Copy court images.
     * 3. Attach pricing rules and calculate min/max price for easy display.
     */
    public CourtResponseDto toResponseDto(CourtEntity entity) {
        if (entity == null) {
            return null;
        }

        CourtResponseDto dto = new CourtResponseDto();

        // 1. Basic fields
        dto.setId(entity.getId());
        dto.setVenueId(entity.getVenueId());
        dto.setCategoryId(entity.getCategoryId());
        dto.setCourtName(entity.getCourtName());
        dto.setSurfaceType(entity.getSurfaceType());
        dto.setMaxPlayers(entity.getMaxPlayers());
        dto.setDescription(entity.getDescription());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        // Venue name
        if (entity.getVenue() != null) {
            dto.setVenueName(entity.getVenue().getName());
        }

        // 2. Court Images
        if (entity.getImages() != null && !entity.getImages().isEmpty()) {
            List<CourtImageResponseDto> imageDtos = courtImageMapper.toResponseDtoList(entity.getImages());
            dto.setImages(imageDtos);

            List<String> urls = new ArrayList<>();
            for (CourtImageEntity img : entity.getImages()) {
                if (img != null && img.getImageUrl() != null) {
                    urls.add(img.getImageUrl());
                }
            }
            dto.setImageUrls(urls);
        } else {
            dto.setImages(new ArrayList<>());
            dto.setImageUrls(new ArrayList<>());
        }

        // 3. Pricing Rules for Booking
        List<Pricingruleentity> rules = null;

        // If rules are already loaded with the entity, use active ones
        if (entity.getPricingRules() != null && !entity.getPricingRules().isEmpty()) {
            rules = new ArrayList<>();
            for (Pricingruleentity rule : entity.getPricingRules()) {
                if (rule != null && Boolean.TRUE.equals(rule.getIsActive())) {
                    rules.add(rule);
                }
            }
        } else if (entity.getId() != null && pricingRuleRepository != null) {
            // Otherwise, fetch active rules from repository
            rules = pricingRuleRepository.findByCourtIdAndIsActive(entity.getId(), true);
        }

        if (rules != null && !rules.isEmpty()) {
            dto.setPricingRules(rules);

            // Calculate min and max price using simple for-loop
            double min = Double.MAX_VALUE;
            double max = 0.0;
            boolean hasPrice = false;

            for (Pricingruleentity rule : rules) {
                if (rule.getPrice() != null) {
                    double price = rule.getPrice().doubleValue();
                    if (price < min) {
                        min = price;
                    }
                    if (price > max) {
                        max = price;
                    }
                    hasPrice = true;
                }
            }

            if (hasPrice) {
                dto.setMinPrice(min);
                dto.setMaxPrice(max);
            }
        } else {
            dto.setPricingRules(new ArrayList<>());
        }

        return dto;
    }

    /**
     * Convert List of CourtEntity -> List of CourtResponseDto
     */
    public List<CourtResponseDto> toResponseDtoList(List<CourtEntity> entities) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }

        List<CourtResponseDto> dtoList = new ArrayList<>();
        for (CourtEntity entity : entities) {
            if (entity != null) {
                dtoList.add(toResponseDto(entity));
            }
        }
        return dtoList;
    }

    /**
     * Update existing CourtEntity from UpdateCourtRequestDto
     */
    public void updateEntityFromDto(CourtEntity entity, UpdateCourtRequestDto dto) {
        if (entity == null || dto == null) {
            return;
        }

        if (dto.getCourtName() != null && !dto.getCourtName().isBlank()) {
            entity.setCourtName(dto.getCourtName());
        }
        if (dto.getCategoryId() != null) {
            entity.setCategoryId(dto.getCategoryId());
        }
        if (dto.getSurfaceType() != null) {
            entity.setSurfaceType(dto.getSurfaceType());
        }
        if (dto.getMaxPlayers() != null) {
            entity.setMaxPlayers(dto.getMaxPlayers());
        }
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription());
        }
        if (dto.getIsActive() != null) {
            entity.setIsActive(dto.getIsActive());
        }
    }
}
