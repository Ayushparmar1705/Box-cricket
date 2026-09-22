package staff_service.staff_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import staff_service.staff_service.model.StaffEntity;

import java.util.List;
import java.util.UUID;

@Repository
public interface StaffRepository extends JpaRepository<StaffEntity, UUID> {

    List<StaffEntity> findByOwnerId(Integer ownerId);

    List<StaffEntity> findByVenueId(Integer venueId);

    List<StaffEntity> findByUserId(Integer userId);

    List<StaffEntity> findByOwnerIdAndIsActive(Integer ownerId, boolean isActive);

    List<StaffEntity> findByVenueIdAndIsActive(Integer venueId, boolean isActive);

    List<StaffEntity> findByIsActive(boolean isActive);
}
