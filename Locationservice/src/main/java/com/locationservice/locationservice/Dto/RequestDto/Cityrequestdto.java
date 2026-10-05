package com.locationservice.locationservice.Dto.RequestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cityrequestdto {

    private int state;
    private String city_name;
    private String city_code;

}
