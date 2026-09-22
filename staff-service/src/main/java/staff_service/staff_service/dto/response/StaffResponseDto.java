package staff_service.staff_service.dto.response;

import lombok.*;
import staff_service.staff_service.model.Designation;
import staff_service.staff_service.model.StaffEntity;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffResponseDto {

    private UUID id;
    private Integer userId;
    private Integer ownerId;
    private Integer venueId;
    private Designation designation;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;

    public static StaffResponseDto fromEntity(StaffEntity entity) {
        if (entity == null) {
            return null;
        }
        return StaffResponseDto.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .ownerId(entity.getOwnerId())
                .venueId(entity.getVenueId())
                .designation(entity.getDesignation())
                .isActive(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
