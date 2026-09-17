package com.court_service.court_service.service;

import com.court_service.court_service.dto.request.CourtRequestDto;
import com.court_service.court_service.dto.response.CourtResponseDto;
import com.court_service.court_service.model.CourtEntity;
import com.court_service.court_service.model.SurfaceType;
import com.court_service.court_service.repository.CourtRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourtServiceTest {

    @Mock
    private CourtRepository courtRepository;

    @InjectMocks
    private CourtService courtService;

    private CourtRequestDto requestDto;
    private CourtEntity courtEntity;
    private UUID courtId;

    @BeforeEach
    void setUp() {
        courtId = UUID.randomUUID();

        requestDto = CourtRequestDto.builder()
                .venueId(1)
                .categoryId(2)
                .courtName("Grand Turf 1")
                .surfaceType(SurfaceType.TURF)
                .maxPlayers(14)
                .description("High quality indoor artificial grass turf")
                .isActive(true)
                .build();

        courtEntity = CourtEntity.builder()
                .id(courtId)
                .venueId(1)
                .categoryId(2)
                .courtName("Grand Turf 1")
                .surfaceType(SurfaceType.TURF)
                .maxPlayers(14)
                .description("High quality indoor artificial grass turf")
                .isActive(true)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
    }

    @Test
    void testCreateCourt_Success() {
        when(courtRepository.save(any(CourtEntity.class))).thenReturn(courtEntity);

        CourtResponseDto response = courtService.createCourt(requestDto);

        assertNotNull(response);
        assertEquals(courtId, response.getId());
        assertEquals(1, response.getVenueId());
        assertEquals(2, response.getCategoryId());
        assertEquals("Grand Turf 1", response.getCourtName());
        assertEquals(SurfaceType.TURF, response.getSurfaceType());
        assertEquals(14, response.getMaxPlayers());
        assertEquals("High quality indoor artificial grass turf", response.getDescription());
        assertTrue(response.isActive());

        verify(courtRepository, times(1)).save(any(CourtEntity.class));
    }

    @Test
    void testCreateCourt_DefaultIsActiveTrueWhenNull() {
        requestDto.setIsActive(null);
        when(courtRepository.save(any(CourtEntity.class))).thenAnswer(invocation -> {
            CourtEntity saved = invocation.getArgument(0);
            saved.setId(courtId);
            return saved;
        });

        CourtResponseDto response = courtService.createCourt(requestDto);

        assertNotNull(response);
        assertTrue(response.isActive());
        verify(courtRepository, times(1)).save(any(CourtEntity.class));
    }

    @Test
    void testGetCourtById_Success() {
        when(courtRepository.findById(courtId)).thenReturn(Optional.of(courtEntity));

        CourtResponseDto response = courtService.getCourtById(courtId);

        assertNotNull(response);
        assertEquals(courtId, response.getId());
        assertEquals("Grand Turf 1", response.getCourtName());
    }

    @Test
    void testGetCourtById_NotFound() {
        when(courtRepository.findById(courtId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            courtService.getCourtById(courtId);
        });

        assertTrue(exception.getMessage().contains("Court not found"));
    }
}
