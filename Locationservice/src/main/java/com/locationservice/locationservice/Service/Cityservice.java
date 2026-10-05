package com.locationservice.locationservice.Service;

import com.locationservice.locationservice.Dto.RequestDto.Cityrequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.ApiResponse;
import com.locationservice.locationservice.Dto.ResponseDto.Cityresponsedto;
import com.locationservice.locationservice.Exception.DuplicateResourceException;
import com.locationservice.locationservice.Mapper.CityMapper;
import com.locationservice.locationservice.Model.Citymodel;
import com.locationservice.locationservice.Model.Statemodel;
import com.locationservice.locationservice.Repositry.Cityrepositry;
import com.locationservice.locationservice.Repositry.Staterepositry;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class Cityservice {
    private final Cityrepositry rep;
    private final CityMapper mapper;
    private final Staterepositry staterep;

    public Cityservice(Cityrepositry rep, CityMapper mapper, Staterepositry staterep) {
        this.rep = rep;
        this.mapper = mapper;
        this.staterep = staterep;
    }

    public ApiResponse<Void> create(Cityrequestdto requestDto) {
        if (rep.existsByCity_name(requestDto.getCity_name())) {
            throw new DuplicateResourceException("City name already exists");
        }
        Statemodel state = staterep.findById(requestDto.getState())
                .orElseThrow(() -> new RuntimeException("State not found"));
        Citymodel model = mapper.toEntity(requestDto, state);
        rep.save(model);

        return ApiResponse.success("City created successfully");
    }

    public ApiResponse<List<Cityresponsedto>> getAllCities(boolean status, int id) {
        List<Cityresponsedto> dto;

        if (id == 0) {
            List<Citymodel> responseList = rep.findByIsActive(status);

            dto = responseList.stream()
                    .map(mapper::toResponse)
                    .toList();
        } else {
            Optional<Citymodel> response = rep.findById(id);

            dto = response
                    .map(mapper::toResponse)
                    .map(List::of)
                    .orElse(List.of());
        }

        return ApiResponse.success("Data Found successfully", dto);
    }

    public ApiResponse<String> changeStatus(int id) {
        Statemodel model = null;
        Optional<Citymodel> cityOpt = rep.findById(id);
        if (cityOpt.isEmpty()) {
            return ApiResponse.success("City does not exist");
        }
        Citymodel city = cityOpt.get();
        city.set_active(!city.is_active());
        rep.save(city);
        return ApiResponse.success(
                city.is_active() ? "City activated successfully" : "City deactivated successfully");
    }

    public ApiResponse<Void> updateCity(Cityrequestdto dto, int id) {
        Optional<Citymodel> model = rep.findById(id);
        if (model.isEmpty()) {
            return ApiResponse.success("City not exists");
        }
        Citymodel city = model.get();
        if (dto.getCity_name() != null && !dto.getCity_name().isBlank()) {
            city.setCity_name(dto.getCity_name());
        }
        if (dto.getCity_code() != null && !dto.getCity_code().isBlank()) {
            city.setCity_code(dto.getCity_code());
        }
        if (dto.getState() > 0) {
            Statemodel state = staterep.findById(dto.getState())
                    .orElseThrow(() -> new RuntimeException("State not found"));
            city.setState(state);
        }
        rep.save(city);
        return ApiResponse.success("City updated successfully");
    }

    public Optional<List<Citymodel>> filter(boolean status) {
        Optional<List<Citymodel>> model = Optional.ofNullable(rep.findByIsActive(status));
        return model;
    }
}
