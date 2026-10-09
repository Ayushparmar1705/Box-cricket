package com.example.demo.auth_service.Repositry;

import com.example.demo.auth_service.Model.Role;
import com.example.demo.auth_service.Model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@Repository
public interface Rolerepositry extends JpaRepository<Roles, Integer> {
    
    Optional<Roles> findByName(Role name);
    
    boolean existsByName(Role name);
    
    Set<Roles> findByNameIn(Collection<Role> names);
}
