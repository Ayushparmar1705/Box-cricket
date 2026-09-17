package com.court_service.court_service.repository;

import com.court_service.court_service.model.CourtEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourtRepository extends JpaRepository<CourtEntity, UUID> {

    List<CourtEntity> findByVenueId(Integer venueId);

    List<CourtEntity> findByCategoryId(Integer categoryId);

    List<CourtEntity> findByVenueIdAndIsActive(Integer venueId, boolean isActive);

    List<CourtEntity> findByIsActive(boolean isActive);
}
