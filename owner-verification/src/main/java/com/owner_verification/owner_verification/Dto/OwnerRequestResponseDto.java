package com.owner_verification.owner_verification.Dto;
import com.owner_verification.owner_verification.Dto.Requestdto.OwnerRegistrationRequestDto;
import com.owner_verification.owner_verification.Dto.Requestdto.Ownerdocumentrequestdto;

import java.util.List;

public class OwnerRequestResponseDto {

    private OwnerRegistrationRequestDto ownerRequest;
    private List<Ownerdocumentrequestdto> documents;

    public OwnerRequestResponseDto() {
    }

    public OwnerRequestResponseDto(
            OwnerRegistrationRequestDto ownerRequest,
            List<Ownerdocumentrequestdto> documents) {

        this.ownerRequest = ownerRequest;
        this.documents = documents;
    }

    public OwnerRegistrationRequestDto getOwnerRequest() {
        return ownerRequest;
    }

    public void setOwnerRequest(OwnerRegistrationRequestDto ownerRequest) {
        this.ownerRequest = ownerRequest;
    }

    public List<Ownerdocumentrequestdto> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Ownerdocumentrequestdto> documents) {
        this.documents = documents;
    }
}