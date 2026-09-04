package com.axher.backend.infrastructure.quartz;

import java.time.Instant;

import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentPublicationScheduler {
    
    private final QuartzSchedulerService quartz;

    public void schedule(Integer contentId, Instant date) throws SchedulerException{

        quartz.schedule(
            "publish-content-" + contentId,
            "content",
            PublishContentJob.class,
            "contentId",
            contentId,
            date
        );
    }

    public void cancel(Integer contentId) throws SchedulerException{
        quartz.cancel(
            "publish-content-" + contentId,
            "content"
        );
    }
}
