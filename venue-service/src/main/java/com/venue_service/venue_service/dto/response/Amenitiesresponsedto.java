package com.venue_service.venue_service.dto.response;

import java.time.LocalDateTime;

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
public class Amenitiesresponsedto {
    private int id;
    private String name;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private boolean is_active;
}
