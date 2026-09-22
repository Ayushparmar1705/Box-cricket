package com.court_service.court_service.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

import com.court_service.court_service.Enums.Dayenum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricingResponseDto {
    private Integer id;
    private int courtId;
    private Dayenum dayType;
    private LocalTime startTime;
    private LocalTime endTime;
    private Double price;
    private LocalDate validFrom;
    private LocalDate validTo;
    private Date createdAt;
    private Date updatedAt;
}
