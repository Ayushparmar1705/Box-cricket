package com.facility_service.facility_service.Mapper;

import com.facility_service.facility_service.Model.Venueamenitiesmodel;
import com.facility_service.facility_service.Model.Venuemodel;
import com.facility_service.facility_service.dto.Requestdto.Venuerequestdto;
import com.facility_service.facility_service.dto.Responsedto.Venueresponsedto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class VenueMapper {

    /**
     * Map Request DTO -> Database Entity
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
        model.setAddress(dto.getAddress());
        model.setLongitude(dto.getLongitude());
        model.setLatitude(dto.getLatitude());
        model.setGoogle_map_link(dto.getGoogle_map_link());
        model.setPhone_number(dto.getPhone_number());
        model.setEmail(dto.getEmail());
        model.setImageUrl(dto.getImageUrl());
        model.setOpening_time(dto.getOpening_time());
        model.setClosing_time(dto.getClosing_time());

        // Split comma-separated amenities string into individual Venueamenitiesmodel
        // entities
        // e.g. "WiFi, Parking, Restrooms" -> [WiFi, Parking, Restrooms]
        if (dto.getVenue_amenities() != null && !dto.getVenue_amenities().isBlank()) {
            List<Venueamenitiesmodel> amenitiesList = new ArrayList<>();
            String[] parts = dto.getVenue_amenities().split(",");
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    amenitiesList.add(new Venueamenitiesmodel(model, trimmed));
                }
            }
            model.setVenue_amenities(amenitiesList);
        }

        model.setCancellation_policy(dto.getCancellation_policy());
        model.setCreated_at(LocalDateTime.now());
        model.setUpdated_at(LocalDateTime.now());

        return model;
    }

    /**
     * Map Database Entity -> Response DTO
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
        responseDto.setAddress(model.getAddress());
        responseDto.setLongitude(model.getLongitude());
        responseDto.setLatitude(model.getLatitude());
        responseDto.setGoogle_map_link(model.getGoogle_map_link());
        responseDto.setPhone_number(model.getPhone_number());
        responseDto.setEmail(model.getEmail());
        responseDto.setImageUrl(model.getImageUrl());

        // Map List<Venueamenitiesmodel> -> List<String> (just the amenity names)
        if (model.getVenue_amenities() != null) {
            List<String> amenityNames = new ArrayList<>();
            for (Venueamenitiesmodel amenity : model.getVenue_amenities()) {
                if (amenity != null && amenity.getVenue_amenity() != null) {
                    amenityNames.add(amenity.getVenue_amenity());
                }
            }
            responseDto.setVenue_amenities(amenityNames);
        }

        responseDto.setOpening_time(model.getOpening_time());
        responseDto.setClosing_time(model.getClosing_time());
        responseDto.setCancellation_policy(model.getCancellation_policy());
        responseDto.set_active(model.is_active());
        responseDto.setCreated_at(model.getCreated_at());
        responseDto.setUpdated_at(model.getUpdated_at());

        return responseDto;
    }

    /**
     * Update an existing Database Entity from Request DTO
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
        if (dto.getCity() != null && !dto.getCity().isBlank()) {
            model.setCity(dto.getCity());
        }
        if (dto.getDescription() != null) {
            model.setDescription(dto.getDescription());
        }
        if (dto.getAddress() != null) {
            model.setAddress(dto.getAddress());
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
        if (dto.getImageUrl() != null) {
            model.setImageUrl(dto.getImageUrl());
        }
        if (dto.getOpening_time() != null) {
            model.setOpening_time(dto.getOpening_time());
        }
        if (dto.getClosing_time() != null) {
            model.setClosing_time(dto.getClosing_time());
        }

        // Split comma-separated amenities string into individual Venueamenitiesmodel
        // entities
        if (dto.getVenue_amenities() != null && !dto.getVenue_amenities().isBlank()) {
            List<Venueamenitiesmodel> amenitiesList = new ArrayList<>();
            String[] parts = dto.getVenue_amenities().split(",");
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    amenitiesList.add(new Venueamenitiesmodel(model, trimmed));
                }
            }
            model.setVenue_amenities(amenitiesList);
        }

        if (dto.getCancellation_policy() != null) {
            model.setCancellation_policy(dto.getCancellation_policy());
        }

        model.setUpdated_at(LocalDateTime.now());
    }
}
