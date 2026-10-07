package com.owner_verification.owner_verification.Model;

import com.owner_verification.owner_verification.Enums.DocumentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "owner_documents")
public class Ownerdocumentsmodel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id")
    private int user_id;

    @Column(name = "owner_request_id")
    private int owner_request_id;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType document_type; // ADHAR_CARD, PAN_CARD, GST_NUMBER

    @Column(name = "document_number")
    private String document_number;

    @Column(name = "document_url")
    private String document_url;

    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploaded_at;
}
