package com.owner_verification.owner_verification.Repositry;

import com.owner_verification.owner_verification.Model.Ownerrequestmodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface Ownerrequestrepositry extends JpaRepository<Ownerrequestmodel, Integer> {
    @Query("SELECT r FROM Ownerrequestmodel r WHERE r.user_id = :userId")
    Optional<Ownerrequestmodel> findByUserId(@Param("userId") int userId);

    @Query("SELECT COUNT(r) > 0 FROM Ownerrequestmodel r WHERE r.gstn_number = :gstnNumber")
    boolean existsByGstnNumber(@Param("gstnNumber") String gstnNumber);

    @Query("SELECT COUNT(r) > 0 FROM Ownerrequestmodel r WHERE r.business_name = :businessName")
    boolean existsByBusinessName(@Param("businessName") String businessName);
}
