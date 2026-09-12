package com.location.location_service.Repositry;

import com.location.location_service.Entity.Countryentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Countryrepositry extends JpaRepository<Countryentity, Long> {

    Optional<Countryentity> findById(Long id);

    boolean existsByName(String name);

    boolean existsByCode(String code);

    boolean existsByNameAndIdNot(String name, Long id);

    boolean existsByCodeAndIdNot(String code, Long id);

    List<Countryentity> findByActive(boolean active);

    List<Countryentity> findByNameContainingIgnoreCase(String name);
}
