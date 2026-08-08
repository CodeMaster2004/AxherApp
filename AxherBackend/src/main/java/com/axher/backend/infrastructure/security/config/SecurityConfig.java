package com.axher.backend.infrastructure.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.axher.backend.infrastructure.security.jwt.JwtAccessDeniedHandler;
import com.axher.backend.infrastructure.security.jwt.JwtAuthenticationEntryPoint;
import com.axher.backend.infrastructure.security.jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authEntryPoint;
    private final JwtAccessDeniedHandler accessDeniedHandler;
    
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) // habilita CORS usando tu WebConfig
            .csrf(csrf -> csrf.disable())    // deshabilita CSRF temporalmente

            // JWT no usa sesiones
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // permite registro/login

                //Archivos publicos
                .requestMatchers("/profile_pictures/**").permitAll()
                .requestMatchers("/profile_banners/**").permitAll()
                .requestMatchers("/posters/**").permitAll()
                .requestMatchers("/backdrop/**").permitAll()
                .requestMatchers("/episodes/**").permitAll()
                .requestMatchers("/trailers/**").permitAll()
                .requestMatchers("/hero-banners/**").permitAll()


                // Catalogo publico
                .requestMatchers("/api/contents/**").permitAll()
                .requestMatchers("/api/series/**").permitAll()

                 //Contenido privado streaming
                 .requestMatchers("/api/media/**").authenticated()

                 //Admin endpoints
                .requestMatchers("/api/admin/**").authenticated()

                 //Otros endpoints publicos
                .requestMatchers("/api/popularity/**").permitAll()
                .requestMatchers("/api/hero/**").permitAll()
                
                .anyRequest().authenticated()               // resto requiere auth
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint)
        
        .accessDeniedHandler(accessDeniedHandler))
            //registrar filtro JWT
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

