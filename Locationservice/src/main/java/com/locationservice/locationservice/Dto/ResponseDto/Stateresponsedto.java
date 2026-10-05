package com.locationservice.locationservice.Dto.ResponseDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.locationservice.locationservice.Model.Countrymodel;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stateresponsedto {
    private int id;
    private String state_name;
    private String state_code;

    private String country_name;
    @JsonProperty("is_active")
    private boolean is_active;


    @Override
    public String toString() {
        return "Stateresponsedto{" +
                "id=" + id +
                ", state_name='" + state_name + '\'' +
                ", state_code='" + state_code + '\'' +
                ", country_name=" + country_name +
                ", is_active=" + is_active +
                '}';
    }
}
