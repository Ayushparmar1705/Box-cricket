package com.facility_service.facility_service.Mapper;

import com.facility_service.facility_service.Model.CourtEntity;
import com.facility_service.facility_service.Model.CourtImageEntity;
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
 * Description: Converts between CourtEntity and Court DTOs.
 * Simple, clean, and fresher-level friendly.
 * ============================================================================
 */
@Component
public class CourtMapper {

    private final CourtImageMapper courtImageMapper;

    public CourtMapper(CourtImageMapper courtImageMapper) {
        this.courtImageMapper = courtImageMapper;
    }

    /**
     * Map Request DTO -> Database Entity
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
     * Map Database Entity -> Response DTO
     */
    public CourtResponseDto toResponseDto(CourtEntity entity) {
        if (entity == null) {
            return null;
        }

        CourtResponseDto dto = new CourtResponseDto();
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

        // Venue name (if relationship is loaded)
        if (entity.getVenue() != null) {
            dto.setVenueName(entity.getVenue().getName());
        }

        // Map images list and collect image URLs
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

        return dto;
    }

    /**
     * Map List of Entities -> List of Response DTOs
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
     * Partially update an existing CourtEntity from UpdateCourtRequestDto
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

