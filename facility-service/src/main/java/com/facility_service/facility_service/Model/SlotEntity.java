package com.facility_service.facility_service.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * ============================================================================
 * Entity: SlotEntity
 * Table:  slots
 * Description: Stores generated booking slots for courts with pricing & status.
 * ============================================================================
 */
@Entity
@Table(name = "slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlotEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Integer id;

    @Column(name = "court_id", nullable = false)
    private Integer courtId;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "price")
    private Double price;

    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "AVAILABLE";

    @Column(name = "booked_by_name")
    private String bookedByName;

    @Column(name = "booked_by_phone")
    private String bookedByPhone;

    @Column(name = "locked_by")
    private Integer lockedBy;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Backward-compatibility getters/setters for snake_case
    public Integer getCourt_id() {
        return this.courtId;
    }

    public void setCourt_id(Integer courtId) {
        this.courtId = courtId;
    }

    public LocalDate getSlot_date() {
        return this.slotDate;
    }

    public void setSlot_date(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public LocalTime getStart_time() {
        return this.startTime;
    }

    public void setStart_time(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEnd_time() {
        return this.endTime;
    }

    public void setEnd_time(LocalTime endTime) {
        this.endTime = endTime;
    }
}
