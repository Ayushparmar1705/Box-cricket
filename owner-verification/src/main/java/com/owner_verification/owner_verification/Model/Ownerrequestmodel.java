package com.owner_verification.owner_verification.Model;

import com.owner_verification.owner_verification.Enums.BusinessType;
import com.owner_verification.owner_verification.Enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "owner_requests")
public class Ownerrequestmodel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id")
    private int user_id;

    @Column(name = "business_name", nullable = false)
    private String business_name;

    @Column(name = "gstn_number", nullable = false)
    private String gstn_number;

    @Column(name = "contact_number", nullable = false)
    private String contact_number;

    @Column(name = "contact_email", nullable = false)
    private String contact_email;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type")
    private BusinessType business_type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VerificationStatus status = VerificationStatus.PENDING;

    @Column(name = "admin_remark")
    private String admin_remark;

    @Column(name = "approved_by")
    private int approved_by;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}
