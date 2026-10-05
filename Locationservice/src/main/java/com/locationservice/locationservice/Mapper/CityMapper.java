package com.locationservice.locationservice.Mapper;

import com.locationservice.locationservice.Dto.RequestDto.Cityrequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.Cityresponsedto;
import com.locationservice.locationservice.Model.Citymodel;
import com.locationservice.locationservice.Model.Statemodel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CityMapper {

    public Citymodel toEntity(Cityrequestdto dto, Statemodel state) {
        Citymodel model = new Citymodel();
        model.setCity_name(dto.getCity_name());
        model.setCity_code(dto.getCity_code());
        model.setState(state);
        return model;
    }

    public Cityresponsedto toResponse(Citymodel entity) {
        return Cityresponsedto.builder()
                .id(entity.getId())
                .city_name(entity.getCity_name())
                .city_code(entity.getCity_code())
                .state_name(entity.getState() != null ? entity.getState().getState_name() : null)
                .is_active(entity.is_active())
                .build();
    }
}
