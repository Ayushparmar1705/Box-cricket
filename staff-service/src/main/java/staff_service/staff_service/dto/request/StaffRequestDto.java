package staff_service.staff_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import staff_service.staff_service.model.Designation;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffRequestDto {

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Owner ID is required")
    private Integer ownerId;

    private Integer venueId;

    @NotNull(message = "Designation is required (MANAGER, RECEPTIONIST, GROUND_STAFF)")
    private Designation designation;

    private Boolean isActive;
}
