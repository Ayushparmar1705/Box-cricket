package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.CourtImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourtImageRepository extends JpaRepository<CourtImageEntity, Integer> {

    List<CourtImageEntity> findByCourtId(int courtId);

    void deleteByCourtId(int courtId);
}

