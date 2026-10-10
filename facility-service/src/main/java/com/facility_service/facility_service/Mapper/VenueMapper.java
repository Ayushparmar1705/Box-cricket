package com.facility_service.facility_service.Mapper;

import com.facility_service.facility_service.Model.Venuemodel;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class VenueMapper {

    /**
     * Map Venuerequestdto to Venuemodel entity
     */
    public Venuemodel toEntity(Venuerequestdto dto) {
        if (dto == null) {
            return null;
        }

        Venuemodel model = new Venuemodel();
        model.setOwner_id(dto.getOwner_id());
        model.setName(dto.getName());
        model.setCity(dto.getCity());
        model.setDescription(dto.getDescription());
        model.setLongitude(dto.getLongitude());
        model.setLatitude(dto.getLatitude());
        model.setGoogle_map_link(dto.getGoogle_map_link());
        model.setPhone_number(dto.getPhone_number());
        model.setEmail(dto.getEmail());
        model.setOpening_time(dto.getOpening_time());
        model.setClosing_time(dto.getClosing_time());
        model.setVenue_amenities(dto.getVenue_amenities());
        model.setCancellation_policy(dto.getCancellation_policy());
        model.setCreated_at(LocalDateTime.now());
        model.setUpdated_at(LocalDateTime.now());

        return model;
    }

    /**
     * Map Venuemodel entity to Venueresponsedto
     */
    public Venueresponsedto toResponseDto(Venuemodel model) {
        if (model == null) {
            return null;
        }

        Venueresponsedto responseDto = new Venueresponsedto();
        responseDto.setId(model.getId());
        responseDto.setOwner_id(model.getOwner_id());
        responseDto.setName(model.getName());
        responseDto.setCity(model.getCity());
        responseDto.setDescription(model.getDescription());
        responseDto.setLongitude(model.getLongitude());
        responseDto.setLatitude(model.getLatitude());
        responseDto.setGoogle_map_link(model.getGoogle_map_link());
        responseDto.setPhone_number(model.getPhone_number());
        responseDto.setEmail(model.getEmail());
        responseDto.setVenue_amenities(model.getVenue_amenities());
        responseDto.setOpening_time(model.getOpening_time());
        responseDto.setClosing_time(model.getClosing_time());
        responseDto.setCancellation_policy(model.getCancellation_policy());
        responseDto.setCreated_at(model.getCreated_at());
        responseDto.setUpdated_at(model.getUpdated_at());

        return responseDto;
    }

    /**
     * Update an existing Venuemodel entity from Venuerequestdto
     */
    public void updateEntityFromDto(Venuerequestdto dto, Venuemodel model) {
        if (dto == null || model == null) {
            return;
        }

        if (dto.getOwner_id() != 0) {
            model.setOwner_id(dto.getOwner_id());
        }
        if (dto.getName() != null) {
            model.setName(dto.getName());
        }
        if (dto.getCity() != 0) {
            model.setCity(dto.getCity());
        }
        if (dto.getDescription() != null) {
            model.setDescription(dto.getDescription());
        }
        if (dto.getLongitude() != 0.0) {
            model.setLongitude(dto.getLongitude());
        }
        if (dto.getLatitude() != 0.0) {
            model.setLatitude(dto.getLatitude());
        }
        if (dto.getGoogle_map_link() != null) {
            model.setGoogle_map_link(dto.getGoogle_map_link());
        }
        if (dto.getPhone_number() != null) {
            model.setPhone_number(dto.getPhone_number());
        }
        if (dto.getEmail() != null) {
            model.setEmail(dto.getEmail());
        }
        if (dto.getOpening_time() != null) {
            model.setOpening_time(dto.getOpening_time());
        }
        if (dto.getClosing_time() != null) {
            model.setClosing_time(dto.getClosing_time());
        }
        if (dto.getVenue_amenities() != null) {
            model.setVenue_amenities(dto.getVenue_amenities());
        }
        if (dto.getCancellation_policy() != null) {
            model.setCancellation_policy(dto.getCancellation_policy());
        }

        model.setUpdated_at(LocalDateTime.now());
    }
}
