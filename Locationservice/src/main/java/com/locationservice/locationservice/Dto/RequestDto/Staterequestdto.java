package com.locationservice.locationservice.Dto.RequestDto;

import com.locationservice.locationservice.Model.Countrymodel;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Staterequestdto {

    private int country;
    private String state_name;
    private String state_code;

}
