package com.locationservice.locationservice.Mapper;

import com.locationservice.locationservice.Dto.RequestDto.Staterequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.Stateresponsedto;
import com.locationservice.locationservice.Model.Countrymodel;
import com.locationservice.locationservice.Model.Statemodel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StateMapper {

    private final CountryMapper countryMapper;

    public Statemodel toEntity(Staterequestdto dto, Countrymodel country) {

        Statemodel model = new Statemodel();

        model.setState_name(dto.getState_name());
        model.setState_code(dto.getState_code());
        model.setCountry(country);

        return model;
    }

    public Stateresponsedto toResponse(Statemodel entity) {

        return Stateresponsedto.builder()
                .id(entity.getId())
                .state_name(entity.getState_name())
                .state_code(entity.getState_code())
                .country_name(entity.getCountry() != null ? entity.getCountry().getCountry_name() : null)
                .is_active(entity.is_active())
                .build();
    }
}