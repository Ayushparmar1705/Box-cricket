package com.city.city_service.Repositry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.city.city_service.Entity.Citymodel;

@Repository
public interface Staterepositry extends JpaRepository<Citymodel, Long> {

}
