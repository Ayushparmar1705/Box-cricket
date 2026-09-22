package com.court_service.court_service.dto.response;

import com.court_service.court_service.model.CourtEntity;
import com.court_service.court_service.model.CourtImageEntity;
import com.court_service.court_service.model.SurfaceType;
import lombok.*;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private List<CourtImageResponseDto> images;
    private Date createdAt;
    private Date updatedAt;

    public static CourtResponseDto fromEntity(CourtEntity entity) {
        return fromEntity(entity, Collections.emptyList());
    }

    public static CourtResponseDto fromEntity(CourtEntity entity, List<CourtImageEntity> imageEntities) {
        if (entity == null) {
            return null;
        }
        List<CourtImageResponseDto> imageDtos = (imageEntities != null)
                ? imageEntities.stream().map(CourtImageResponseDto::fromEntity).collect(Collectors.toList())
                : Collections.emptyList();

        return CourtResponseDto.builder()
                .id(entity.getId())
                .venueId(entity.getVenueId())
                .categoryId(entity.getCategoryId())
                .courtName(entity.getCourtName())
                .surfaceType(entity.getSurfaceType())
                .maxPlayers(entity.getMaxPlayers())
                .description(entity.getDescription())
                .isActive(entity.isActive())
                .images(imageDtos)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
