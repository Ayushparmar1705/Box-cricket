package com.facility_service.facility_service.dto.Responsedto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

/**
 * ============================================================================
 * Response DTO: CourtImageResponseDto
 * Description: Data returned to clients representing an uploaded court image.
 * ============================================================================
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtImageResponseDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("court_id")
    private Integer courtId;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("created_at")
    private Date createdAt;
}

