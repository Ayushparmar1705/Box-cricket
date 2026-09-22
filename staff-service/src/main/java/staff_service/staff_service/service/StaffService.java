package staff_service.staff_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import staff_service.staff_service.dto.request.StaffRequestDto;
import staff_service.staff_service.dto.response.StaffResponseDto;
import staff_service.staff_service.model.StaffEntity;
import staff_service.staff_service.repository.StaffRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Transactional
    public StaffResponseDto createStaff(StaffRequestDto request) {
        StaffEntity entity = StaffEntity.builder()
                .userId(request.getUserId())
                .ownerId(request.getOwnerId())
                .venueId(request.getVenueId())
                .designation(request.getDesignation())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        StaffEntity savedStaff = staffRepository.save(entity);
        return StaffResponseDto.fromEntity(savedStaff);
    }

    public StaffResponseDto getStaffById(UUID id) {
        StaffEntity entity = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff record not found with id: " + id));
        return StaffResponseDto.fromEntity(entity);
    }

    public List<StaffResponseDto> getStaffByOwner(Integer ownerId, Boolean isActive) {
        List<StaffEntity> list;
        if (isActive != null) {
            list = staffRepository.findByOwnerIdAndIsActive(ownerId, isActive);
        } else {
            list = staffRepository.findByOwnerId(ownerId);
        }
        return list.stream()
                .map(StaffResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<StaffResponseDto> getStaffByVenue(Integer venueId, Boolean isActive) {
        List<StaffEntity> list;
        if (isActive != null) {
            list = staffRepository.findByVenueIdAndIsActive(venueId, isActive);
        } else {
            list = staffRepository.findByVenueId(venueId);
        }
        return list.stream()
                .map(StaffResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<StaffResponseDto> getStaffByUser(Integer userId) {
        return staffRepository.findByUserId(userId).stream()
                .map(StaffResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<StaffResponseDto> getAllStaff(Boolean isActive) {
        List<StaffEntity> list;
        if (isActive != null) {
            list = staffRepository.findByIsActive(isActive);
        } else {
            list = staffRepository.findAll();
        }
        return list.stream()
                .map(StaffResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffResponseDto changeStatus(UUID id, boolean status) {
        StaffEntity entity = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff record not found with id: " + id));
        entity.setActive(status);
        StaffEntity updated = staffRepository.save(entity);
        return StaffResponseDto.fromEntity(updated);
    }
}
