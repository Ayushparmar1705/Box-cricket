package com.owner_documents_service.Repositry;

import com.owner_documents_service.Model.Ownerdocumentmodel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Ownerdocumentsrepositry extends JpaRepository<Ownerdocumentmodel, Integer> {

    List<Ownerdocumentmodel> findByRequestId(int requestId);

}
