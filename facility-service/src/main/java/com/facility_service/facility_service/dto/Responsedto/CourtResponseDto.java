package com.facility_service.facility_service.dto.Responsedto;

import com.facility_service.facility_service.Model.SurfaceType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * ============================================================================
 * Response DTO: CourtResponseDto
 * Description: Data returned to clients containing full court details,
 * including venue info and list of court images.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtResponseDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("venue_id")
    private Integer venueId;

    @JsonProperty("venue_name")
    private String venueName;

    @JsonProperty("category_id")
    private Integer categoryId;

    @JsonProperty("court_name")
    private String courtName;

    @JsonProperty("surface_type")
    private SurfaceType surfaceType;

    @JsonProperty("max_players")
    private Integer maxPlayers;

    @JsonProperty("description")
    private String description;

    @JsonProperty("is_active")
    private Boolean isActive;

    @JsonProperty("images")
    @Builder.Default
    private List<CourtImageResponseDto> images = new ArrayList<>();

    // Convenience list of image URLs for frontend display
    @JsonProperty("image_urls")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @JsonProperty("created_at")
    private Date createdAt;

    @JsonProperty("updated_at")
    private Date updatedAt;
}

