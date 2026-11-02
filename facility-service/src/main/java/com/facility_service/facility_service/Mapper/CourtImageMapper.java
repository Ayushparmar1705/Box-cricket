package com.facility_service.facility_service.Mapper;

import com.facility_service.facility_service.Model.CourtImageEntity;
import com.facility_service.facility_service.dto.Requestdto.CourtImageRequestDto;
import com.facility_service.facility_service.dto.Responsedto.CourtImageResponseDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * ============================================================================
 * Mapper: CourtImageMapper
 * Description: Converts between CourtImageEntity and CourtImage DTOs.
 * Simple, clean, fresher-friendly design with null-safety checks.
 * ============================================================================
 */
@Component
public class CourtImageMapper {

    /**
     * Map Request DTO -> Database Entity
     */
    public CourtImageEntity toEntity(CourtImageRequestDto dto) {
        if (dto == null) {
            return null;
        }

        CourtImageEntity entity = new CourtImageEntity();
        if (dto.getCourtId() != null) {
            entity.setCourtId(dto.getCourtId());
        }
        entity.setImageUrl(dto.getImageUrl());
        return entity;
    }

    /**
     * Map Database Entity -> Response DTO
     */
    public CourtImageResponseDto toResponseDto(CourtImageEntity entity) {
        if (entity == null) {
            return null;
        }

        CourtImageResponseDto dto = new CourtImageResponseDto();
        dto.setId(entity.getId());
        dto.setCourtId(entity.getCourtId());
        dto.setImageUrl(entity.getImageUrl());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    /**
     * Map List of Entities -> List of Response DTOs
     */
    public List<CourtImageResponseDto> toResponseDtoList(List<CourtImageEntity> entities) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }

        List<CourtImageResponseDto> dtoList = new ArrayList<>();
        for (CourtImageEntity entity : entities) {
            if (entity != null) {
                dtoList.add(toResponseDto(entity));
            }
        }
        return dtoList;
    }
}

