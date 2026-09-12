package com.venue_service.venue_service.dto.request;

import java.security.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AmenitiesRequestdto {
    private int id;
    private String name;
    private boolean is_active;
    private Timestamp created_at;
    private Timestamp updated_at;

}
