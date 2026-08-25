package com.axher.backend.infrastructure.security.config;

import java.util.Locale;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

@Configuration
public class LanguageWebConfig implements WebMvcConfigurer{

    public LocaleResolver localeResolver() {

        AcceptHeaderLocaleResolver resolver =
                new AcceptHeaderLocaleResolver();

        resolver.setDefaultLocale(Locale.forLanguageTag("es"));

        return resolver;
    }
    
}
