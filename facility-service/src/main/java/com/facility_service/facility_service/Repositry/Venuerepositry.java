package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.Venuemodel;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Venuerepositry extends JpaRepository<Venuemodel, Integer> {
    boolean existsByName(String name);

    @Query("SELECT v FROM Venuemodel v WHERE v.owner_id = :ownerId AND is_active = :status")
    List<Venuemodel> findByOwnerId(@Param("ownerId") int ownerId, @Param("status") boolean status);
}
