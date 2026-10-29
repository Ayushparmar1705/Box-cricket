package com.facility_service.facility_service.Model;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pricing_rules")
public class Pricingruleentity implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "court_id", nullable = false)
    private int courtid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", insertable = false, updatable = false)
    @JsonIgnore
    private CourtEntity court;

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

