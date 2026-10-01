package com.locationservice.locationservice.Dto.ResponseDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Countryresponsedto {
    private int id;
    private String country_name;
    private String country_code;

    @JsonProperty("is_active")
    private boolean is_active;


    @Override
    public String toString() {
        return "Countryresponsedto{" +
                "id=" + id +
                ", country_name='" + country_name + '\'' +
                ", country_code='" + country_code + '\'' +
                ", is_active=" + is_active +
                '}';
    }
}
