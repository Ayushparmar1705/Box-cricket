package com.location.location_service.Dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CountryResponseDto {

    private Long id;
    private String name;
    private String code;

    @JsonProperty("is_active")
    private boolean active;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date created_at;

    private List<StateResponseDto> states;
}
