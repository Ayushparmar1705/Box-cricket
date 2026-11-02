package com.facility_service.facility_service.Mapper;

import com.facility_service.facility_service.Model.SlotEntity;
import com.facility_service.facility_service.dto.Requestdto.SlotRequestDto;
import com.facility_service.facility_service.dto.Requestdto.UpdateSlotRequestDto;
import com.facility_service.facility_service.dto.Responsedto.SlotResponseDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * ============================================================================
 * Mapper: SlotMapper
 * Description: Converts between SlotEntity and Slot DTOs.
 * Simple, clean, and fresher-level friendly.
 * ============================================================================
 */
@Component
public class SlotMapper {

    /**
     * Map Request DTO -> Database Entity
     */
    public SlotEntity toEntity(SlotRequestDto dto) {
        if (dto == null) {
            return null;
        }

        SlotEntity entity = new SlotEntity();
        entity.setCourtId(dto.getCourtId());
        entity.setSlotDate(dto.getSlotDate());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setPrice(dto.getPrice());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE");
        entity.setCreatedAt(LocalDateTime.now());

        return entity;
    }

    /**
     * Map Database Entity -> Response DTO
     */
    public SlotResponseDto toResponseDto(SlotEntity entity) {
        if (entity == null) {
            return null;
        }

        SlotResponseDto dto = new SlotResponseDto();
        dto.setId(entity.getId());
        dto.setCourtId(entity.getCourtId());
        dto.setSlotDate(entity.getSlotDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setPrice(entity.getPrice());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus() : "AVAILABLE");
        dto.setBookedByName(entity.getBookedByName());
        dto.setBookedByPhone(entity.getBookedByPhone());
        dto.setLockedBy(entity.getLockedBy());
        dto.setLockedUntil(entity.getLockedUntil());
        dto.setCreatedAt(entity.getCreatedAt());

        return dto;
    }

    /**
     * Map List of Entities -> List of Response DTOs
     */
    public List<SlotResponseDto> toResponseDtoList(List<SlotEntity> entities) {
        if (entities == null || entities.isEmpty()) {
            return Collections.emptyList();
        }

        List<SlotResponseDto> dtoList = new ArrayList<>();
        for (SlotEntity entity : entities) {
            if (entity != null) {
                dtoList.add(toResponseDto(entity));
            }
        }
        return dtoList;
    }

    /**
     * Partially update an existing SlotEntity from UpdateSlotRequestDto
     */
    public void updateEntityFromDto(SlotEntity entity, UpdateSlotRequestDto dto) {
        if (entity == null || dto == null) {
            return;
        }

        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            entity.setStatus(dto.getStatus());
        }
        if (dto.getPrice() != null) {
            entity.setPrice(dto.getPrice());
        }
        if (dto.getBookedByName() != null) {
            entity.setBookedByName(dto.getBookedByName());
        }
        if (dto.getBookedByPhone() != null) {
            entity.setBookedByPhone(dto.getBookedByPhone());
        }
        if (dto.getLockedBy() != null) {
            entity.setLockedBy(dto.getLockedBy());
        }
        if (dto.getLockedUntil() != null) {
            entity.setLockedUntil(dto.getLockedUntil());
        }
    }
}

