package com.locationservice.locationservice.Service;

import com.locationservice.locationservice.Dto.RequestDto.Countryrequestdto;
import com.locationservice.locationservice.Dto.RequestDto.Staterequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.ApiResponse;
import com.locationservice.locationservice.Dto.ResponseDto.Stateresponsedto;
import com.locationservice.locationservice.Exception.DuplicateResourceException;
import com.locationservice.locationservice.Mapper.StateMapper;
import com.locationservice.locationservice.Model.Countrymodel;
import com.locationservice.locationservice.Model.Statemodel;
import com.locationservice.locationservice.Repositry.Countryrepositry;
import com.locationservice.locationservice.Repositry.Staterepositry;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class Stateservice {
    private final Staterepositry rep;
    private final StateMapper mapper;
    private final Countryrepositry countryrep;

    public Stateservice(Staterepositry rep, StateMapper mapper, Countryrepositry countryrep) {
        this.rep = rep;
        this.mapper = mapper;
        this.countryrep = countryrep;
    }

    public ApiResponse<Void> create(Staterequestdto requestDto) {
        if (rep.existsByState_name(requestDto.getState_name())) {
            throw new DuplicateResourceException("State name already exists");
        }
        Countrymodel country = countryrep.findById(requestDto.getCountry())
                .orElseThrow(() -> new RuntimeException("Country not found"));
        Statemodel model = mapper.toEntity(requestDto, country);
        rep.save(model);

        return ApiResponse.success("State created successfully");
    }

    public ApiResponse<List<Stateresponsedto>> getAllStates(boolean status, int id) {

        List<Stateresponsedto> dto;

        if (id == 0) {

            List<Statemodel> responseList = rep.findByIsActive(status);

            dto = responseList.stream()
                    .map(mapper::toResponse)
                    .toList();

        } else {

            Optional<Statemodel> response = rep.findById(id);

            dto = response
                    .map(mapper::toResponse)
                    .map(List::of)
                    .orElse(List.of());
        }

        return ApiResponse.success("Data Found successfully", dto);
    }

    public ApiResponse<String> changeStatus(int id) {
        Statemodel model = rep.findById(id).get();
        model.set_active(!model.is_active());
        rep.save(model);
        return ApiResponse.success(
                model.is_active() ? "State activated successfully" : "Country deactivated successfully");

    }

    public ApiResponse<Void> updateState(Staterequestdto dto, int id) {

        Optional<Statemodel> model = rep.findById(id);
        if (model.isEmpty()) {
            return ApiResponse.success("State not exists");
        }
        dto.setState_name(dto.getState_name());
        dto.setState_code(dto.getState_code());
        Statemodel state = model.get();
        state.setState_name(dto.getState_name());
        state.setState_code(dto.getState_code());
        rep.save(state);
        return ApiResponse.success("State updated successfully");
    }

    public Optional<List<Statemodel>> filter(boolean status) {
        Optional<List<Statemodel>> model = Optional.ofNullable(rep.findByIsActive(status));
        return model;
    }
}
