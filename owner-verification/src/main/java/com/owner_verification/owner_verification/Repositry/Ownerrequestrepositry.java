package com.owner_verification.owner_verification.Repositry;

import com.owner_verification.owner_verification.Model.Ownerrequestmodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface Ownerrequestrepositry extends JpaRepository<Ownerrequestmodel, Integer> {
    @Query("SELECT r FROM Ownerrequestmodel r WHERE r.user_id = :userId")
    Optional<Ownerrequestmodel> findByUserId(@Param("userId") int userId);

    @Query("SELECT COUNT(r) > 0 FROM Ownerrequestmodel r WHERE r.gstn_number = :gstnNumber")
    boolean existsByGstnNumber(@Param("gstnNumber") String gstnNumber);

    @Query("SELECT COUNT(r) > 0 FROM Ownerrequestmodel r WHERE r.business_name = :businessName")
    boolean existsByBusinessName(@Param("businessName") String businessName);
    @Query(value = """
    SELECT
        o.id,
        o.user_id,
        o.business_name,
        o.business_type,
        o.gstn_number,
        o.contact_number,
        o.contact_email,
        o.status,
        d.id,
        d.user_id,
        d.owner_request_id,
        d.document_type,
        d.document_url,
        d.uploaded_at
    FROM owner_requests o
    LEFT JOIN owner_documents d
        ON o.id = d.owner_request_id
    """, nativeQuery = true)
    List<Object[]> findOwnerRequestsWithDocuments();
}
