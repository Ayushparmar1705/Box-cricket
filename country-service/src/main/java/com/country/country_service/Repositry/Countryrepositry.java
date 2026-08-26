package com.country.country_service.Repositry;

import com.country.country_service.Model.Countrymodel;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface Countryrepositry extends JpaRepository<Countrymodel, Long> {
    Optional<Countrymodel> findById(Long id);
}
