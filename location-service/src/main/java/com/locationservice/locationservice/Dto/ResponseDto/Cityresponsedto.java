package com.locationservice.locationservice.Dto.ResponseDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cityresponsedto {
    private int id;
    private String city_name;
    private String city_code;

    private String state_name;
    @JsonProperty("is_active")
    private boolean is_active;

    @Override
    public String toString() {
        return "Cityresponsedto{" +
                "id=" + id +
                ", city_name='" + city_name + '\'' +
                ", city_code='" + city_code + '\'' +
                ", state_name=" + state_name +
                ", is_active=" + is_active +
                '}';
    }
}
