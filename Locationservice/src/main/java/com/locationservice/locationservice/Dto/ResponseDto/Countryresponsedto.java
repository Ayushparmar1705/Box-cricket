package com.locationservice.locationservice.Dto.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Countryresponsedto {
    private int id;
    private String country_name;
    private String country_code;
    private boolean is_active;
}
