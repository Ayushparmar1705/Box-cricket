package com.locationservice.locationservice.Dto.RequestDto;

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
