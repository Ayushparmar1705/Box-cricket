package com.category.category_service.Repositry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.category.category_service.Entity.Categoryentity;

@Repository
public interface Categoryrepositry extends JpaRepository<Categoryentity, Integer> {
    @Query("SELECT COUNT(c) > 0 FROM Categoryentity c WHERE c.category_name = :name")
    boolean existsByName(@Param("name") String name);
}
