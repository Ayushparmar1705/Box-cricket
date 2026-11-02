package com.facility_service.facility_service.dto.Requestdto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * ============================================================================
 * Request DTO: CourtImageRequestDto
 * Description: Data transfer object for adding an image URL to a court.
 * Easy to understand for fresher level: contains just court_id and image_url.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtImageRequestDto {

    @NotNull(message = "Court ID is required")
    @JsonProperty("court_id")
    @JsonAlias({"courtId", "court_id"})
    private Integer courtId;

    @NotBlank(message = "Image URL is required")
    @JsonProperty("image_url")
    @JsonAlias({"imageUrl", "image_url"})
    private String imageUrl;
}

