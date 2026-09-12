package com.location.location_service.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CityRequestDto {

    @NotBlank(message = "City name is required")
    @Size(max = 100, message = "City name cannot exceed 100 characters")
    private String name;

    @NotNull(message = "State ID is required")
    private Long stateId;

    @JsonProperty("is_active")
    @Builder.Default
    private Boolean active = true;
}
