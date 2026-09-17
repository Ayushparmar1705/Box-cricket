package com.court_service.court_service.controller;

import com.court_service.court_service.dto.request.CourtRequestDto;
import com.court_service.court_service.dto.response.CourtResponseDto;
import com.court_service.court_service.model.SurfaceType;
import com.court_service.court_service.service.CourtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CourtControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CourtService courtService;

    @InjectMocks
    private CourtController courtController;

    private ObjectMapper objectMapper;
    private UUID courtId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(courtController).build();
        objectMapper = new ObjectMapper();
        courtId = UUID.randomUUID();
    }

    @Test
    void testCreateCourt_Success() throws Exception {
        CourtRequestDto requestDto = CourtRequestDto.builder()
                .venueId(10)
                .categoryId(3)
                .courtName("Indoor Turf Pitch A")
                .surfaceType(SurfaceType.TURF)
                .maxPlayers(12)
                .description("High grade synthetic turf")
                .isActive(true)
                .build();

        CourtResponseDto responseDto = CourtResponseDto.builder()
                .id(courtId)
                .venueId(10)
                .categoryId(3)
                .courtName("Indoor Turf Pitch A")
                .surfaceType(SurfaceType.TURF)
                .maxPlayers(12)
                .description("High grade synthetic turf")
                .isActive(true)
                .build();

        when(courtService.createCourt(any(CourtRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/court/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.message").value("Court created successfully"))
                .andExpect(jsonPath("$.data.id").value(courtId.toString()))
                .andExpect(jsonPath("$.data.courtName").value("Indoor Turf Pitch A"))
                .andExpect(jsonPath("$.data.surfaceType").value("TURF"))
                .andExpect(jsonPath("$.data.maxPlayers").value(12));
    }

    @Test
    void testCreateCourt_ValidationError_MissingCourtName() throws Exception {
        CourtRequestDto requestDto = CourtRequestDto.builder()
                .venueId(10)
                .categoryId(3)
                .courtName("") // Blank court name
                .surfaceType(SurfaceType.MAT)
                .maxPlayers(10)
                .build();

        mockMvc.perform(post("/api/court/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.courtName").exists());
    }

    @Test
    void testCreateCourt_ValidationError_InvalidMaxPlayers() throws Exception {
        CourtRequestDto requestDto = CourtRequestDto.builder()
                .venueId(10)
                .categoryId(3)
                .courtName("Court B")
                .surfaceType(SurfaceType.CONCRETE)
                .maxPlayers(0) // Min is 1
                .build();

        mockMvc.perform(post("/api/court/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.maxPlayers").exists());
    }

    @Test
    void testGetCourtById_Success() throws Exception {
        CourtResponseDto responseDto = CourtResponseDto.builder()
                .id(courtId)
                .venueId(10)
                .categoryId(3)
                .courtName("Court B")
                .surfaceType(SurfaceType.CONCRETE)
                .maxPlayers(8)
                .isActive(true)
                .build();

        when(courtService.getCourtById(courtId)).thenReturn(responseDto);

        mockMvc.perform(get("/api/court/" + courtId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.id").value(courtId.toString()))
                .andExpect(jsonPath("$.data.surfaceType").value("CONCRETE"));
    }
}
