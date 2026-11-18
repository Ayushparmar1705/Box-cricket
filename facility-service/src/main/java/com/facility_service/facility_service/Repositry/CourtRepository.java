package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.CourtEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourtRepository extends JpaRepository<CourtEntity, Integer>, JpaSpecificationExecutor<CourtEntity> {

    boolean existsByCourtNameAndVenueId(String courtName, Integer venueId);

    boolean existsByCourtNameAndVenueIdAndIdNot(String courtName, Integer venueId, int id);

    List<CourtEntity> findByVenueId(Integer venueId);

    List<CourtEntity> findByVenueIdAndIsActive(Integer venueId, boolean isActive);

    List<CourtEntity> findByIsActiveTrue();

    // Find courts belonging to venues owned by a specific owner ID
    @Query("SELECT c FROM CourtEntity c WHERE c.venue.owner_id = :ownerId")
    List<CourtEntity> findByVenueOwner_id(@Param("ownerId") Integer ownerId);

}
