package com.facility_service.facility_service.Services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.facility_service.facility_service.Exception.ResourceNotFoundException;
import com.facility_service.facility_service.Model.CourtEntity;
import com.facility_service.facility_service.Model.CourtImageEntity;
import com.facility_service.facility_service.Repositry.CourtImageRepository;
import com.facility_service.facility_service.Repositry.CourtRepository;
import com.facility_service.facility_service.Repositry.Venuerepositry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class CourtService {

    private final CourtRepository courtRepository;
    private final CourtImageRepository courtImageRepository;
    private final Venuerepositry venuerepositry;
    private final Cloudinary cloudinary;

    public CourtService(CourtRepository courtRepository,
            CourtImageRepository courtImageRepository,
            Venuerepositry venuerepositry,
            Cloudinary cloudinary) {
        this.courtRepository = courtRepository;
        this.courtImageRepository = courtImageRepository;
        this.venuerepositry = venuerepositry;
        this.cloudinary = cloudinary;
    }

    public String uploadToCloudinary(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "box-cricket/courts",
                    "resource_type", "auto"));
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
        }
    }

    private List<CourtImageEntity> uploadAndSaveImages(int courtId, List<MultipartFile> files) {
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
    public CourtEntity createCourt(CourtEntity request, List<MultipartFile> files) {
        if (request.getVenueId() != null && !venuerepositry.existsById(request.getVenueId())) {
            throw new ResourceNotFoundException("Venue not found with id: " + request.getVenueId());
        }

        if (courtRepository.existsByCourtNameAndVenueId(request.getCourtName().trim(), request.getVenueId())) {
            throw new RuntimeException("Court with name '" + request.getCourtName() + "' already exists for venue id: "
                    + request.getVenueId());
        }

        CourtEntity savedCourt = courtRepository.save(request);
        if (files != null && !files.isEmpty()) {
            uploadAndSaveImages(savedCourt.getId(), files);
        }
        return savedCourt;
    }

    public CourtEntity getCourtById(int id) {
        return courtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + id));
    }

    public List<CourtEntity> getCourtsByVenueId(Integer venueId, Boolean isActive) {
        if (isActive != null) {
            return courtRepository.findByVenueIdAndIsActive(venueId, isActive);
        }
        return courtRepository.findByVenueId(venueId);
    }

    public Page<CourtEntity> getAllCourts(Integer venueId, Boolean isActive, String search, String court_name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<CourtEntity> specification = Courtspecification.filter(venueId, isActive, search, court_name);
        return courtRepository.findAll(specification, pageable);
    }

    @Transactional
    public CourtEntity updateCourt(int id, CourtEntity request, List<MultipartFile> files) {
        CourtEntity court = courtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + id));

        if (request != null) {
            if (request.getCourtName() != null && !request.getCourtName().trim().isEmpty()) {
                String newName = request.getCourtName().trim();
                Integer targetVenueId = request.getVenueId() != null ? request.getVenueId() : court.getVenueId();
                if (courtRepository.existsByCourtNameAndVenueIdAndIdNot(newName, targetVenueId, id)) {
                    throw new RuntimeException(
                            "Court with name '" + newName + "' already exists for venue id: " + targetVenueId);
                }
                court.setCourtName(newName);
            }

            if (request.getVenueId() != null) {
                if (!venuerepositry.existsById(request.getVenueId())) {
                    throw new ResourceNotFoundException("Venue not found with id: " + request.getVenueId());
                }
                court.setVenueId(request.getVenueId());
            }
            if (request.getCategoryId() != null)
                court.setCategoryId(request.getCategoryId());
            if (request.getSurfaceType() != null)
                court.setSurfaceType(request.getSurfaceType());
            if (request.getMaxPlayers() != null)
                court.setMaxPlayers(request.getMaxPlayers());
            if (request.getDescription() != null)
                court.setDescription(request.getDescription());
            court.setActive(request.isActive());
        }

        CourtEntity updatedCourt = courtRepository.save(court);
        if (files != null && !files.isEmpty()) {
            uploadAndSaveImages(updatedCourt.getId(), files);
        }
        return updatedCourt;
    }

    @Transactional
    public CourtEntity changeStatus(int id, boolean status) {
        CourtEntity court = courtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + id));
        court.setActive(status);
        return courtRepository.save(court);
    }

}
