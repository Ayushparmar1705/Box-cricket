package com.locationservice.locationservice.Repositry;

import com.locationservice.locationservice.Model.Citymodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Cityrepositry extends JpaRepository<Citymodel, Integer> {
    @Query("""
    SELECT CASE
        WHEN COUNT(c) > 0 THEN true
        ELSE false
    END
    FROM Citymodel c
    WHERE LOWER(c.city_name) = LOWER(:cityName)
""")
    boolean existsByCity_name(@Param("cityName") String cityName);

    @Query("""
    SELECT c
    FROM Citymodel c
    WHERE c.is_active = :status
""")
    List<Citymodel> findByIsActive(@Param("status") boolean status);
}
