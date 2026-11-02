package com.facility_service.facility_service.Model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

/**
 * ============================================================================
 * Entity: Pricingruleentity
 * Table:  pricing_rules
 * Description: Stores hourly/time-window pricing rules for each court.
 *
 * Database Columns:
 * 1. id         -> Integer (Primary Key, auto-increment)
 * 2. court_id   -> Foreign Key referencing courts(id)
 * 3. day_type   -> Enum: WEEKDAY, WEEKEND, HOLIDAY
 * 4. price      -> Price per hour/slot (DECIMAL 10,2)
 * 5. valid_from -> Effective start date (YYYY-MM-DD, optional)
 * 6. valid_to   -> Effective end date (YYYY-MM-DD, optional)
 * ============================================================================
 */
@Entity
@Table(name = "pricing_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pricingruleentity implements Serializable {

    private static final long serialVersionUID = 1L;

    // 1. Primary Key: Integer auto-incremented by database
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    @JsonProperty("id")
    private Integer id;

    // 2. Foreign Key: references courts(id)
    @NotNull(message = "Court ID is required")
    @Column(name = "court_id", nullable = false)
    @JsonProperty("court_id")
    @JsonAlias({"courtId", "court_id", "courtid"})
    private Integer courtId;

    // Optional JPA relationship back to the parent CourtEntity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", insertable = false, updatable = false)
    @JsonIgnore
    private CourtEntity court;

    // 3. Day Type: WEEKDAY, WEEKEND, or HOLIDAY
    @NotNull(message = "Day type is required (WEEKDAY, WEEKEND, or HOLIDAY)")
    @Enumerated(EnumType.STRING)
    @Column(name = "day_type", nullable = false, length = 20)
    @JsonProperty("day_type")
    @JsonAlias({"dayType", "day_type"})
    private Dayenum dayType;

    // 4. Price: Decimal with 2 decimal places (e.g. 800.00, 1250.50)
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", inclusive = true, message = "Price must be greater than 0")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    @JsonProperty("price")
    private BigDecimal price;

    // 5. Effective Start Date (optional): e.g. 2026-01-01
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "valid_from")
    @JsonProperty("valid_from")
    @JsonAlias({"validFrom", "valid_from"})
    private LocalDate validFrom;

    // 8. Effective End Date (optional): e.g. 2026-12-31
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "valid_to")
    @JsonProperty("valid_to")
    @JsonAlias({"validTo", "valid_to"})
    private LocalDate validTo;

    // 9. Soft Delete & Status Flag: true = Active, false = Soft-deleted / Deactivated
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    @JsonProperty("is_active")
    @JsonAlias({"isActive", "is_active", "active"})
    private Boolean isActive = Boolean.TRUE;

    public Boolean getIsActive() {
        return isActive != null ? isActive : Boolean.TRUE;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive != null ? isActive : Boolean.TRUE;
    }

    public boolean isActive() {
        return isActive != null && isActive;
    }

    public void setActive(boolean active) {
        this.isActive = active;
    }

    // Audit fields: auto-managed timestamp of record creation
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonProperty("created_at")
    private Date createdAt;

    // Audit fields: auto-managed timestamp of last update
    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private Date updatedAt;
}
