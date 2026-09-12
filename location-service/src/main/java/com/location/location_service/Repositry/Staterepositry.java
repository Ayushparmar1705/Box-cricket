package com.location.location_service.Repositry;

import com.location.location_service.Entity.Stateentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Staterepositry extends JpaRepository<Stateentity, Long> {

    List<Stateentity> findByActive(boolean active);

    @Query("SELECT s FROM Stateentity s WHERE s.country.id = :countryId")
    List<Stateentity> findByCountryId(@Param("countryId") Long countryId);

    @Query("SELECT s FROM Stateentity s WHERE s.country.id = :countryId AND s.active = :active")
    List<Stateentity> findByCountryIdAndActive(@Param("countryId") Long countryId, @Param("active") boolean active);

    @Query("SELECT COUNT(s) > 0 FROM Stateentity s WHERE LOWER(s.name) = LOWER(:name) AND s.country.id = :countryId")
    boolean existsByNameAndCountryId(@Param("name") String name, @Param("countryId") Long countryId);

    @Query("SELECT COUNT(s) > 0 FROM Stateentity s WHERE LOWER(s.name) = LOWER(:name) AND s.country.id = :countryId AND s.id <> :id")
    boolean existsByNameAndCountryIdAndIdNot(@Param("name") String name, @Param("countryId") Long countryId, @Param("id") Long id);

    @Query("SELECT s FROM Stateentity s JOIN FETCH s.country WHERE s.id = :id")
    Stateentity findByIdWithCountry(@Param("id") Long id);
}
