package com.owner_verification.owner_verification.Repositry;

import com.owner_verification.owner_verification.Model.Ownerdocumentsmodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Ownerdocumentrepositry extends JpaRepository<Ownerdocumentsmodel, Integer> {
    @Query("SELECT d FROM Ownerdocumentsmodel d WHERE d.owner_request_id = :ownerRequestId")
    List<Ownerdocumentsmodel> findByOwnerRequestId(@Param("ownerRequestId") int ownerRequestId);

    @Query("SELECT d FROM Ownerdocumentsmodel d WHERE d.user_id = :userId")
    List<Ownerdocumentsmodel> findByUserId(@Param("userId") int userId);
}
