package com.facility_service.facility_service.dto.Requestdto;

import com.facility_service.facility_service.Model.SurfaceType;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * ============================================================================
 * Request DTO: UpdateCourtRequestDto
 * Description: Data transfer object used when updating an existing Court.
 * All fields are optional to allow partial updates.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCourtRequestDto {

    @JsonProperty("court_name")
    @JsonAlias({"courtName", "court_name"})
    private String courtName;

    @JsonProperty("category_id")
    @JsonAlias({"categoryId", "category_id"})
    private Integer categoryId;

    @JsonProperty("surface_type")
    @JsonAlias({"surfaceType", "surface_type"})
    private SurfaceType surfaceType;

    @JsonProperty("max_players")
    @JsonAlias({"maxPlayers", "max_players"})
    private Integer maxPlayers;

    @JsonProperty("description")
    private String description;

    @JsonProperty("is_active")
    @JsonAlias({"isActive", "is_active", "active"})
    private Boolean isActive;
}

