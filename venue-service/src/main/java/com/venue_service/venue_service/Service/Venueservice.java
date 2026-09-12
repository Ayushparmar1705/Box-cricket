package com.venue_service.venue_service.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.venue_service.venue_service.Entity.Venueentity;
import com.venue_service.venue_service.Repositry.Venuerepositry;
import com.venue_service.venue_service.dto.request.Requestdto;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class Venueservice {

	private final Venuerepositry rep;
	private final Cloudinary cloudinary;
	public Venueservice(Venuerepositry rep, Cloudinary cloudinary) {
		this.rep = rep;
		this.cloudinary = cloudinary;
	}

	public String uploadImage(MultipartFile file) {
		try {
			Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
					"resource_type", "auto"));
			return (String) uploadResult.get("secure_url");
		} catch (IOException e) {
			throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage(), e);
		}
	}

	public Venueentity addVenue(Requestdto obj, MultipartFile imageFile) {
		boolean isExists = rep.existsByVenueName(obj.getVenueName());
		if (isExists) {
			throw new RuntimeException("The venue already exists");
		}

		if (imageFile != null && !imageFile.isEmpty()) {
			String imageUrl = uploadImage(imageFile);
			obj.setImageUrl(imageUrl);
		}
		Venueentity venue = new Venueentity(obj.getOwnerId(),obj.getCityId(),obj.getVenueName(),obj.getAddress(),obj.getLongitude(),obj.getLatitude(),obj.getGoogleMapLink(),obj.getContactNumber(),obj.getEmail(),obj.getOpeningTime(),obj.getClosingTime(),obj.getCancellationPolicy(),obj.getImageUrl());
		return rep.save(venue);
	}
	public List<Venueentity> viewVenues(Boolean isActive){
		return rep.findByIsActive(isActive);
	}


	public Venueentity updateVenue(int id, Requestdto obj, MultipartFile imageFile) {
		Venueentity venue = rep.findById(id)
				.orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));

		if (obj != null) {
			if (obj.getVenueName() != null && !obj.getVenueName().trim().isEmpty()) {
				if (rep.existsByVenueNameAndIdNot(obj.getVenueName(), id)) {
					throw new RuntimeException("The venue with name '" + obj.getVenueName() + "' already exists");
				}
				venue.setVenueName(obj.getVenueName());
			}

			if (obj.getOwnerId() != null) {
				venue.setOwnerId(obj.getOwnerId());
			}
			if (obj.getCityId() != null) {
				venue.setCityId(obj.getCityId());
			}
			if (obj.getAddress() != null) {
				venue.setAddress(obj.getAddress());
			}
			if (obj.getLongitude() != null) {
				venue.setLongitude(obj.getLongitude());
			}
			if (obj.getLatitude() != null) {
				venue.setLatitude(obj.getLatitude());
			}
			if (obj.getGoogleMapLink() != null) {
				venue.setGoogleMapLink(obj.getGoogleMapLink());
			}
			if (obj.getContactNumber() != null) {
				venue.setContactNumber(obj.getContactNumber());
			}
			if (obj.getEmail() != null) {
				venue.setEmail(obj.getEmail());
			}
			if (obj.getOpeningTime() != null) {
				venue.setOpeningTime(obj.getOpeningTime());
			}
			if (obj.getClosingTime() != null) {
				venue.setClosingTime(obj.getClosingTime());
			}
			if (obj.getCancellationPolicy() != null) {
				venue.setCancellationPolicy(obj.getCancellationPolicy());
			}
			if (obj.getIsActive() != null) {
				venue.setActive(obj.getIsActive());
			}
			if (obj.getImageUrl() != null && !obj.getImageUrl().trim().isEmpty()) {
				venue.setImageUrl(obj.getImageUrl());
			}
		}

		if (imageFile != null && !imageFile.isEmpty()) {
			String imageUrl = uploadImage(imageFile);
			venue.setImageUrl(imageUrl);
		}

		return rep.save(venue);
	}

	public Venueentity changeStatus(int id, boolean status) {
		Venueentity venue = rep.findById(id).orElseThrow(() -> new RuntimeException("venue not found"));
		venue.setActive(status);
		return rep.save(venue);
	}
}