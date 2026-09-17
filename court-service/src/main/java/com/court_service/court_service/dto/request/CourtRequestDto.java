package com.court_service.court_service.dto.request;

import com.court_service.court_service.model.SurfaceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtRequestDto {

    @NotNull(message = "Venue ID is required")
    private Integer venueId;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @NotBlank(message = "Court name is required")
    @Size(min = 2, max = 100, message = "Court name must be between 2 and 100 characters")
    private String courtName;

    @NotNull(message = "Surface type is required (TURF, MAT, CONCRETE)")
    private SurfaceType surfaceType;

    @NotNull(message = "Max players is required")
    @Min(value = 1, message = "Max players must be at least 1")
    private Integer maxPlayers;

    private String description;

    private Boolean isActive;
}
