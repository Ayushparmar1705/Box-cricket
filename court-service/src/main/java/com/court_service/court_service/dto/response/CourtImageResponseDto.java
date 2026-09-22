package com.court_service.court_service.dto.response;

import com.court_service.court_service.model.CourtImageEntity;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtImageResponseDto {

    private Long id;
    private UUID courtId;
    private String imageUrl;
    private Date createdAt;

    public static CourtImageResponseDto fromEntity(CourtImageEntity entity) {
        if (entity == null) {
            return null;
        }
        return CourtImageResponseDto.builder()
                .id(entity.getId())
                .courtId(entity.getCourtId())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
