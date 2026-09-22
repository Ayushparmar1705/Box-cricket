package com.court_service.court_service.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.court_service.court_service.dto.request.CourtRequestDto;
import com.court_service.court_service.dto.response.CourtImageResponseDto;
import com.court_service.court_service.dto.response.CourtResponseDto;
import com.court_service.court_service.model.CourtEntity;
import com.court_service.court_service.model.CourtImageEntity;
import com.court_service.court_service.repository.CourtImageRepository;
import com.court_service.court_service.repository.CourtRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourtService {

    private final CourtRepository courtRepository;
    private final CourtImageRepository courtImageRepository;
    private final Cloudinary cloudinary;

    public CourtService(CourtRepository courtRepository,
                        CourtImageRepository courtImageRepository,
                        Cloudinary cloudinary) {
        this.courtRepository = courtRepository;
        this.courtImageRepository = courtImageRepository;
        this.cloudinary = cloudinary;
    }

    public String uploadToCloudinary(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto"));
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }

    private List<CourtImageEntity> uploadAndSaveImages(UUID courtId, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return Collections.emptyList();
        }
        List<CourtImageEntity> savedImages = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                String imageUrl = uploadToCloudinary(file);
                CourtImageEntity imageEntity = CourtImageEntity.builder()
                        .courtId(courtId)
                        .imageUrl(imageUrl)
                        .build();
                savedImages.add(courtImageRepository.save(imageEntity));
            }
        }
        return savedImages;
    }

    @Transactional
    public CourtResponseDto createCourt(CourtRequestDto request, List<MultipartFile> files) {
        if (courtRepository.existsByCourtNameAndVenueId(request.getCourtName().trim(), request.getVenueId())) {
            throw new RuntimeException("Court with name '" + request.getCourtName() + "' already exists for venue id: " + request.getVenueId());
        }

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
        List<CourtImageEntity> savedImages = uploadAndSaveImages(savedCourt.getId(), files);
        return CourtResponseDto.fromEntity(savedCourt, savedImages);
    }

    public CourtResponseDto getCourtById(UUID id) {
        CourtEntity entity = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found with id: " + id));
        List<CourtImageEntity> images = courtImageRepository.findByCourtId(id);
        return CourtResponseDto.fromEntity(entity, images);
    }

    public List<CourtResponseDto> getCourtsByVenueId(Integer venueId, Boolean isActive) {
        List<CourtEntity> list = (isActive != null)
                ? courtRepository.findByVenueIdAndIsActive(venueId, isActive)
                : courtRepository.findByVenueId(venueId);

        return list.stream()
                .map(court -> CourtResponseDto.fromEntity(court, courtImageRepository.findByCourtId(court.getId())))
                .collect(Collectors.toList());
    }

    public List<CourtResponseDto> getCourtsByCategoryId(Integer categoryId) {
        List<CourtEntity> list = courtRepository.findByCategoryId(categoryId);
        return list.stream()
                .map(court -> CourtResponseDto.fromEntity(court, courtImageRepository.findByCourtId(court.getId())))
                .collect(Collectors.toList());
    }

    public List<CourtResponseDto> getAllCourts(Boolean isActive) {
        List<CourtEntity> list = (isActive != null)
                ? courtRepository.findByIsActive(isActive)
                : courtRepository.findAll();

        return list.stream()
                .map(court -> CourtResponseDto.fromEntity(court, courtImageRepository.findByCourtId(court.getId())))
                .collect(Collectors.toList());
    }

    @Transactional
    public CourtResponseDto updateCourt(UUID id, CourtRequestDto request, List<MultipartFile> files) {
        CourtEntity court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found with id: " + id));

        if (request != null) {
            if (request.getCourtName() != null && !request.getCourtName().trim().isEmpty()) {
                String newName = request.getCourtName().trim();
                Integer targetVenueId = request.getVenueId() != null ? request.getVenueId() : court.getVenueId();
                if (courtRepository.existsByCourtNameAndVenueIdAndIdNot(newName, targetVenueId, id)) {
                    throw new RuntimeException("Court with name '" + newName + "' already exists for venue id: " + targetVenueId);
                }
                court.setCourtName(newName);
            }

            if (request.getVenueId() != null) court.setVenueId(request.getVenueId());
            if (request.getCategoryId() != null) court.setCategoryId(request.getCategoryId());
            if (request.getSurfaceType() != null) court.setSurfaceType(request.getSurfaceType());
            if (request.getMaxPlayers() != null) court.setMaxPlayers(request.getMaxPlayers());
            if (request.getDescription() != null) court.setDescription(request.getDescription());
            if (request.getIsActive() != null) court.setActive(request.getIsActive());
        }

        CourtEntity updatedCourt = courtRepository.save(court);
        if (files != null && !files.isEmpty()) {
            uploadAndSaveImages(updatedCourt.getId(), files);
        }
        List<CourtImageEntity> images = courtImageRepository.findByCourtId(id);
        return CourtResponseDto.fromEntity(updatedCourt, images);
    }

    @Transactional
    public List<CourtImageResponseDto> addImagesToCourt(UUID courtId, List<MultipartFile> files) {
        if (!courtRepository.existsById(courtId)) {
            throw new RuntimeException("Court not found with id: " + courtId);
        }
        List<CourtImageEntity> saved = uploadAndSaveImages(courtId, files);
        return saved.stream().map(CourtImageResponseDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public CourtResponseDto changeStatus(UUID id, boolean status) {
        CourtEntity court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found with id: " + id));
        court.setActive(status);
        CourtEntity updatedCourt = courtRepository.save(court);
        List<CourtImageEntity> images = courtImageRepository.findByCourtId(id);
        return CourtResponseDto.fromEntity(updatedCourt, images);
    }

    @Transactional
    public void deleteCourt(UUID id) {
        if (!courtRepository.existsById(id)) {
            throw new RuntimeException("Court not found with id: " + id);
        }
        courtImageRepository.deleteByCourtId(id);
        courtRepository.deleteById(id);
    }

    @Transactional
    public void deleteCourtImage(Long imageId) {
        if (!courtImageRepository.existsById(imageId)) {
            throw new RuntimeException("Court image not found with id: " + imageId);
        }
        courtImageRepository.deleteById(imageId);
    }
}
