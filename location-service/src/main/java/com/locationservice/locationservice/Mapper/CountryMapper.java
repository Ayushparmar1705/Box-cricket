package com.locationservice.locationservice.Mapper;

import com.locationservice.locationservice.Dto.RequestDto.Countryrequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.Countryresponsedto;
import com.locationservice.locationservice.Model.Countrymodel;
import org.springframework.stereotype.Component;

@Component
public class CountryMapper {

    public Countrymodel toEntity(Countryrequestdto dto) {
        Countrymodel model = new Countrymodel();
        model.setCountry_name(dto.getCountry_name());
        model.setCountry_code(dto.getCountry_code());
        return model;
    }

    public Countryresponsedto toResponse(Countrymodel entity) {
        return Countryresponsedto.builder()
                .id(entity.getId())
                .country_name(entity.getCountry_name())
                .country_code(entity.getCountry_code())
                .is_active(entity.is_active())
                .build();
    }
}
