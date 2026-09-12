package com.location.location_service.Repositry;

import com.location.location_service.Entity.Cityentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Cityrepositry extends JpaRepository<Cityentity, Long> {

    List<Cityentity> findByActive(boolean active);

    @Query("SELECT c FROM Cityentity c WHERE c.state.id = :stateId")
    List<Cityentity> findByStateId(@Param("stateId") Long stateId);

    @Query("SELECT c FROM Cityentity c WHERE c.state.id = :stateId AND c.active = :active")
    List<Cityentity> findByStateIdAndActive(@Param("stateId") Long stateId, @Param("active") boolean active);

    @Query("SELECT COUNT(c) > 0 FROM Cityentity c WHERE LOWER(c.name) = LOWER(:name) AND c.state.id = :stateId")
    boolean existsByNameAndStateId(@Param("name") String name, @Param("stateId") Long stateId);

    @Query("SELECT COUNT(c) > 0 FROM Cityentity c WHERE LOWER(c.name) = LOWER(:name) AND c.state.id = :stateId AND c.id <> :id")
    boolean existsByNameAndStateIdAndIdNot(@Param("name") String name, @Param("stateId") Long stateId, @Param("id") Long id);

    @Query("SELECT c FROM Cityentity c JOIN FETCH c.state s JOIN FETCH s.country WHERE c.id = :id")
    Cityentity findByIdWithHierarchy(@Param("id") Long id);

    List<Cityentity> findByNameContainingIgnoreCase(String name);
}
