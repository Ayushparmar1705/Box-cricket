package com.locationservice.locationservice.Repositry;

import com.locationservice.locationservice.Model.Countrymodel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface Countryrepositry extends JpaRepository<Countrymodel, Integer> {
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Countrymodel c WHERE LOWER(c.country_name) = LOWER(:countryName)")
    boolean existsByCountry_name(@Param("countryName") String countryName);

    @Query("SELECT c FROM Countrymodel c WHERE c.is_active = :status")
    List<Countrymodel> findByIsActive(@Param("status") boolean status);
}
