package com.location.location_service.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CountryRequestDto {

    @NotBlank(message = "Country name is required")
    @Size(max = 100, message = "Country name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Country code is required")
    @Size(min = 2, max = 10, message = "Country code must be between 2 and 10 characters")
    private String code;

    @JsonProperty("is_active")
    @Builder.Default
    private Boolean active = true;
}
