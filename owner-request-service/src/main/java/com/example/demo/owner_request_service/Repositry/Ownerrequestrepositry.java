package com.example.demo.owner_request_service.Repositry;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.owner_request_service.Model.Ownerrequestmodel;

public interface Ownerrequestrepositry extends JpaRepository<Ownerrequestmodel, Integer> {
}
