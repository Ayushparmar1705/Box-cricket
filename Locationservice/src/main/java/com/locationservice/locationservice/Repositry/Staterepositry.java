package com.locationservice.locationservice.Repositry;

import com.locationservice.locationservice.Model.Countrymodel;

import java.util.List;

import com.locationservice.locationservice.Model.Statemodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface Staterepositry extends JpaRepository<Statemodel, Integer> {
    @Query("""
    SELECT CASE
        WHEN COUNT(c) > 0 THEN true
        ELSE false
    END
    FROM Statemodel c
    WHERE LOWER(c.state_name) = LOWER(:stateName)
""")
    boolean existsByState_name(@Param("stateName") String stateName);

    @Query("""
    SELECT s
    FROM Statemodel s
    WHERE s.is_active = :status
""")
    List<Statemodel> findByIsActive(@Param("status") boolean status);
}
