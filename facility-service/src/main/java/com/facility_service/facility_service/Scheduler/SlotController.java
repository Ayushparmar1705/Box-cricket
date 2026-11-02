package com.facility_service.facility_service.Scheduler;

import com.facility_service.facility_service.Services.SlotGenerateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SlotController {

    @Autowired
    private SlotGenerateService service;

    @Scheduled(cron = "0 10 0 * * *")
    public void generateDailySlot() {
        service.generateSlotForNext30Days();
    }
}
