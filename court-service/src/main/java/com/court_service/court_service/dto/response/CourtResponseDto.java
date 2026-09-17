package com.court_service.court_service.dto.response;

import com.court_service.court_service.model.CourtEntity;
import com.court_service.court_service.model.SurfaceType;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtResponseDto {

    private UUID id;
    private Integer venueId;
    private Integer categoryId;
    private String courtName;
    private SurfaceType surfaceType;
    private Integer maxPlayers;
    private String description;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;

    public static CourtResponseDto fromEntity(CourtEntity entity) {
        if (entity == null) {
            return null;
        }
        return CourtResponseDto.builder()
                .id(entity.getId())
                .venueId(entity.getVenueId())
                .categoryId(entity.getCategoryId())
                .courtName(entity.getCourtName())
                .surfaceType(entity.getSurfaceType())
                .maxPlayers(entity.getMaxPlayers())
                .description(entity.getDescription())
                .isActive(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
