package com.axher.backend.infrastructure.quartz;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;

import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuartzSchedulerService {

    private final Scheduler scheduler;


    public void schedule(
        String jobName,
        String group,
        Class<? extends Job> jobClass,
        String dataKey,
        Integer id,
        Instant date
    ) throws SchedulerException {


        
        JobKey jobKey = JobKey.jobKey(
            jobName,
            group
        );


        TriggerKey triggerKey = TriggerKey.triggerKey(
            "trigger-" + jobName,
            group
        );

        


        Trigger trigger = TriggerBuilder
                .newTrigger()
                .withIdentity(triggerKey)
                .startAt(
                    Date.from(
                        date.atZone(
                            ZoneId.systemDefault()
                        ).toInstant()
                    )
                )
                .build();


        // Si ya existe el Job solamente actualizamos la fecha
        if(scheduler.checkExists(jobKey)){


            scheduler.rescheduleJob(
                triggerKey,
                trigger
            );

            return;
        }

        // Si no existe lo creamos
        JobDetail job = JobBuilder
                .newJob(jobClass)
                .withIdentity(jobKey)
                .usingJobData(dataKey, id)
                .build();
        scheduler.scheduleJob(
            job,
            trigger
        );
        
    }

    public void cancel(
        String jobName,
        String group
    ) throws SchedulerException {

        JobKey jobKey = JobKey.jobKey(
            jobName,
            group
        );

        if(scheduler.checkExists(jobKey)){

            scheduler.deleteJob(jobKey);
        }
    }
}