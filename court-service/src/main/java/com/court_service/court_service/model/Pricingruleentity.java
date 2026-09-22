package com.court_service.court_service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.court_service.court_service.Enums.Dayenum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Pricingruleentity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pricing_rules")
public class Pricingruleentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "court_id", nullable = false)
    private int courtid;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_type", nullable = false)
    private Dayenum day_type;

    @Column(name = "start_time", nullable = false)
    private LocalTime start_time;

    @Column(name = "end_time", nullable = false)
    private LocalTime end_time;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "valid_from")
    private LocalDate valid_from;

    @Column(name = "valid_to")
    private LocalDate valid_to;
}