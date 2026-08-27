package com.state.state_service.Repositry;

import com.state.state_service.Model.Statemodel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface Staterepositry extends JpaRepository<Statemodel, Long> {
    Optional<Statemodel> findById(Long id);
}
