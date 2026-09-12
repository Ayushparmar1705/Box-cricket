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
public class StateRequestDto {

    @NotBlank(message = "State name is required")
    @Size(max = 100, message = "State name cannot exceed 100 characters")
    private String name;

    @NotNull(message = "Country ID is required")
    private Long countryId;

    @JsonProperty("is_active")
    @Builder.Default
    private Boolean active = true;
}
