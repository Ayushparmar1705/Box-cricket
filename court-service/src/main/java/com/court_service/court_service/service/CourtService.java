package com.court_service.court_service.service;

import com.court_service.court_service.dto.request.CourtRequestDto;
import com.court_service.court_service.dto.response.CourtResponseDto;
import com.court_service.court_service.model.CourtEntity;
import com.court_service.court_service.repository.CourtRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourtService {

    private final CourtRepository courtRepository;

    public CourtService(CourtRepository courtRepository) {
        this.courtRepository = courtRepository;
    }

    @Transactional
    public CourtResponseDto createCourt(CourtRequestDto request) {
        CourtEntity entity = CourtEntity.builder()
                .venueId(request.getVenueId())
                .categoryId(request.getCategoryId())
                .courtName(request.getCourtName().trim())
                .surfaceType(request.getSurfaceType())
                .maxPlayers(request.getMaxPlayers())
                .description(request.getDescription())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        CourtEntity savedCourt = courtRepository.save(entity);
        return CourtResponseDto.fromEntity(savedCourt);
    }

    public CourtResponseDto getCourtById(UUID id) {
        CourtEntity entity = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found with id: " + id));
        return CourtResponseDto.fromEntity(entity);
    }

    public List<CourtResponseDto> getCourtsByVenueId(Integer venueId, Boolean isActive) {
        List<CourtEntity> list;
        if (isActive != null) {
            list = courtRepository.findByVenueIdAndIsActive(venueId, isActive);
        } else {
            list = courtRepository.findByVenueId(venueId);
        }
        return list.stream()
                .map(CourtResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CourtResponseDto> getAllCourts(Boolean isActive) {
        List<CourtEntity> list;
        if (isActive != null) {
            list = courtRepository.findByIsActive(isActive);
        } else {
            list = courtRepository.findAll();
        }
        return list.stream()
                .map(CourtResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
