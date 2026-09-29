package staff_service.staff_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import staff_service.staff_service.model.StaffEntity;
import staff_service.staff_service.repository.StaffRepository;

import java.util.List;
import java.util.UUID;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Transactional
    public StaffEntity createStaff(StaffEntity request) {
        return staffRepository.save(request);
    }

    public StaffEntity getStaffById(UUID id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff record not found with id: " + id));
    }

    public List<StaffEntity> getStaffByOwner(Integer ownerId, Boolean isActive) {
        if (isActive != null) {
            return staffRepository.findByOwnerIdAndIsActive(ownerId, isActive);
        }
        return staffRepository.findByOwnerId(ownerId);
    }

    public List<StaffEntity> getStaffByVenue(Integer venueId, Boolean isActive) {
        if (isActive != null) {
            return staffRepository.findByVenueIdAndIsActive(venueId, isActive);
        }
        return staffRepository.findByVenueId(venueId);
    }

    public List<StaffEntity> getStaffByUser(Integer userId) {
        return staffRepository.findByUserId(userId);
    }

    public List<StaffEntity> getAllStaff(Boolean isActive) {
        if (isActive != null) {
            return staffRepository.findByIsActive(isActive);
        }
        return staffRepository.findAll();
    }

    @Transactional
    public StaffEntity changeStatus(UUID id, boolean status) {
        StaffEntity entity = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff record not found with id: " + id));
        entity.setActive(status);
        return staffRepository.save(entity);
    }
}
