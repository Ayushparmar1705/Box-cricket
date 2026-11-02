package com.facility_service.facility_service.Repositry;

import com.facility_service.facility_service.Model.SlotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface SlotRepositry extends JpaRepository<SlotEntity, Integer> {

    boolean existsByCourtIdAndSlotDateAndStartTime(Integer courtId, LocalDate slotDate, LocalTime startTime);

    List<SlotEntity> findByCourtIdAndSlotDate(Integer courtId, LocalDate slotDate);

    List<SlotEntity> findByCourtIdAndSlotDateOrderByStartTimeAsc(Integer courtId, LocalDate slotDate);
}
