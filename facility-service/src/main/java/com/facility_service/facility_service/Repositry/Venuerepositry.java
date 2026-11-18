package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.Venuemodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Venuerepositry extends JpaRepository<Venuemodel, Integer>, JpaSpecificationExecutor<Venuemodel> {
    boolean existsByName(String name);

    @Query("SELECT DISTINCT v FROM Venuemodel v LEFT JOIN FETCH v.venue_amenities WHERE v.owner_id=:ownerId AND v.active=:status")
    List<Venuemodel> findByOwnerId(@Param("ownerId") int ownerId, @Param("status") boolean status);

    List<Venuemodel> findByNameContainingIgnoreCase(String search);

    // Find all active venues that belong to a specific category
    // We JOIN venue_categories list (from Venuemodel) and filter by categoryId
    @Query("SELECT DISTINCT v FROM Venuemodel v JOIN v.venue_categories vc WHERE vc.categoryId = :categoryId AND v.active = true")
    List<Venuemodel> findByCategoryId(@Param("categoryId") int categoryId);
}
