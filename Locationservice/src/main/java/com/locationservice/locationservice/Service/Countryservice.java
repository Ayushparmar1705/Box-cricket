package com.locationservice.locationservice.Service;

import com.locationservice.locationservice.Dto.RequestDto.Countryrequestdto;
import com.locationservice.locationservice.Dto.ResponseDto.ApiResponse;
import com.locationservice.locationservice.Dto.ResponseDto.Countryresponsedto;
import com.locationservice.locationservice.Exception.DuplicateResourceException;
import com.locationservice.locationservice.Mapper.CountryMapper;
import com.locationservice.locationservice.Model.Countrymodel;
import com.locationservice.locationservice.Repositry.Countryrepositry;

import java.util.List;

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

    public ApiResponse<List<Countryresponsedto>> getAllCountries(boolean status) {
        List<Countrymodel> responseList = rep.findByIsActive(status);
        System.out.println("Inside response list = "+responseList);
        List<Countryresponsedto> dto = responseList.stream().map(mapper::toResponse).toList();

        return ApiResponse.success("Data Found successfully", dto);
    }

    public ApiResponse<String> changeStatus(int id) {
        Countrymodel model = rep.findById(id).get();
        model.set_active(!model.is_active());
        rep.save(model);
        return ApiResponse.success(
                model.is_active() ? "Country activated successfully" : "Country deactivated successfully");

    }
}
