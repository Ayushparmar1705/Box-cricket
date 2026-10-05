package com.locationservice.locationservice.Service;

import com.locationservice.locationservice.Dto.RequestDto.Countryrequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.ApiResponse;
import com.locationservice.locationservice.Dto.ResponseDto.Countryresponsedto;
import com.locationservice.locationservice.Dto.ResponseDto.Stateresponsedto;
import com.locationservice.locationservice.Exception.DuplicateResourceException;
import com.locationservice.locationservice.Mapper.CountryMapper;
import com.locationservice.locationservice.Model.Countrymodel;
import com.locationservice.locationservice.Repositry.Countryrepositry;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class Countryservice {

    private final Countryrepositry rep;
    private final CountryMapper mapper;

    public Countryservice(Countryrepositry rep, CountryMapper mapper) {
        this.rep = rep;
        this.mapper = mapper;
    }

    public ApiResponse<Void> create(Countryrequestdto requestDto) {
        if (rep.existsByCountry_name(requestDto.getCountry_name())) {
            throw new DuplicateResourceException("Country name already exists");
        }

        Countrymodel model = mapper.toEntity(requestDto);
        rep.save(model);

        return ApiResponse.success("Country created successfully");
    }

    public ApiResponse<List<Countryresponsedto>> getAllCountries(boolean status, int id) {

        List<Countryresponsedto> dto;

        if (id == 0) {

            List<Countrymodel> responseList = rep.findByIsActive(status);

            dto = responseList.stream()
                    .map(mapper::toResponse)
                    .toList();

        } else {

            Optional<Countrymodel> response = rep.findById(id);

            dto = response
                    .map(mapper::toResponse)
                    .map(List::of)
                    .orElse(List.of());
        }

        return ApiResponse.success("Data Found successfully", dto);
    }

    public ApiResponse<String> changeStatus(int id) {
        Countrymodel model = rep.findById(id).get();
        model.set_active(!model.is_active());
        rep.save(model);
        return ApiResponse.success(
                model.is_active() ? "Country activated successfully" : "Country deactivated successfully");

    }

    public ApiResponse<Void> updateCountry(Countryrequestdto dto, int id){

        Optional<Countrymodel> model = rep.findById(id);
        if(model.isEmpty()){
            return ApiResponse.success("Country not exists");
        }
        dto.setCountry_name(dto.getCountry_name());
        dto.setCountry_code(dto.getCountry_code());
        Countrymodel country =  model.get();
        country.setCountry_name(dto.getCountry_name());
        country.setCountry_code(dto.getCountry_code());
        rep.save(country);
        return ApiResponse.success("Country updated successfully");
    }
    public Optional<List<Countrymodel>> filter(boolean status){
        Optional<List<Countrymodel>> model = Optional.ofNullable(rep.findByIsActive(status));
        return model;
    }
}
