package com.axher.backend.infrastructure.ai;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.retry.RetryPolicy;
import org.springframework.core.retry.RetryTemplate;

@Configuration
public class RetryDiagnosticConfig {

    @Bean
    public RetryTemplate googleGenAiRetryTemplate() {

        RetryPolicy policy = RetryPolicy.builder()
                .maxRetries(0)
                .build();

        return new RetryTemplate(policy);
    }
}