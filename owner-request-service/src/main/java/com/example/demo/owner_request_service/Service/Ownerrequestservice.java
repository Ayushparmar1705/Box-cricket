package com.example.demo.owner_request_service.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.owner_request_service.dto.UserDto;
import com.example.demo.owner_request_service.client.UserClientService;
import com.example.demo.owner_request_service.Status;
import com.example.demo.owner_request_service.Model.Ownerrequestmodel;
import com.example.demo.owner_request_service.Repositry.Ownerrequestrepositry;

@Service
public class Ownerrequestservice {

    @Autowired
    private Ownerrequestrepositry repo;

    @Autowired
    private UserClientService userClientService;

    public Ownerrequestmodel createOwnerRequest(Ownerrequestmodel data, Integer userId) {
        try {

            data.setStatus(Status.PENDING);
            return repo.save(data);
        } catch (Exception e) {
            throw new RuntimeException(e.getLocalizedMessage());
        }
    }

    public List<Ownerrequestmodel> getOwnerRequest() {
        try {
            return repo.findAll();
        } catch (Exception e) {
            throw new RuntimeException(e.getLocalizedMessage());
        }
    }

    public void Approveownerrequest(Integer id, String status, Integer adminId) {
        try {
            Ownerrequestmodel model = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("No owner request found"));
            // Update status based on provided status string
            model.setStatus(Status.valueOf(status));
            // Set approval metadata
            model.setApprovedAt(LocalDateTime.now());
            // Save changes
            repo.save(model);

            userClientService.changeUserRole(id, "owner");
        } catch (Exception e) {
            throw new RuntimeException(e.getLocalizedMessage());
        }
    }
}
