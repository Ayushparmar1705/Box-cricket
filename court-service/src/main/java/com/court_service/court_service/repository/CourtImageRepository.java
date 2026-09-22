package com.court_service.court_service.repository;

import com.court_service.court_service.model.CourtImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourtImageRepository extends JpaRepository<CourtImageEntity, Long> {

    List<CourtImageEntity> findByCourtId(UUID courtId);

    void deleteByCourtId(UUID courtId);
}
