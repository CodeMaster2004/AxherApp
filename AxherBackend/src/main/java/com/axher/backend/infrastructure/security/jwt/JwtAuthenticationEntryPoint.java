package com.axher.backend.infrastructure.security.jwt;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint{
    
    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        if(Boolean.TRUE.equals(request.getAttribute("ACCESS_TOKEN_EXPIRED"))){
            response.getWriter().write("""
                {
                    "code": "ACCESS_TOKEN_EXPIRED",
                    "message": "Access token expired"
                }
                """);
            return;
        }

        if(Boolean.TRUE.equals(request.getAttribute("INVALID_ACCESS_TOKEN"))){
            response.getWriter().write("""
                {
                    "code": "INVALID_ACCESS_TOKEN",
                    "message": "Invalid access token"
                }
                """);
            return;
        }
        response.getWriter().write("""
            {
                "code": "UNAUTHORIZED",
                "message": "Authentication required"
            }
            """);
    }
}

