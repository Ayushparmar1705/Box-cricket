package com.locationservice.locationservice.Dto.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Countryrequestdto {

    @NotBlank(message = "Country name is required")
    private String country_name;
    @NotBlank(message = "Country code is required")
    @Size(min = 2, max = 10)
    private String country_code;
}
