package com.axher.backend.infrastructure.security.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.axher.backend.auth.service.AuthService;
import com.axher.backend.users.entities.Users;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AuthService usersService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        String token = null;

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    System.out.println("🔍 Token encontrado en cookie: " + 
                    (token != null ? token.substring(0, Math.min(10, token.length())) + "..." : "null"));
                    break;
                }
            }
        }else{
            System.out.println("🍪 No hay cookies en la petición");
        }
        // 2. Si no hay token, limpiamos contexto y seguimos
        if (token == null) {
            System.out.println("⚠️ No se encontró accessToken. Limpiando contexto de seguridad.");
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (jwtService.validateToken(token)) {
                System.out.println("✅ Token válido. Procediendo a autenticar.");

                Integer userId = jwtService.getUserIdFromToken(token);

                Users user = usersService.findById(userId);
                
                var permissions = usersService.getPermissions(user);

                var authorities = permissions.stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList();

                var roleAuthorities = jwtService.getRolesFromToken(token)
                        .stream()
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                        .toList();

                var allAuthorities = new java.util.ArrayList<SimpleGrantedAuthority>();

                allAuthorities.addAll(authorities);
                allAuthorities.addAll(roleAuthorities);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                allAuthorities
                        );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("🔐 Autenticación establecida para usuario ID: " + userId);
                var authContext = SecurityContextHolder.getContext().getAuthentication();
                if (authContext != null) {
                    System.out.println("---- Granted authorities:");
                    authContext.getAuthorities().forEach(a -> System.out.println("  " + a.getAuthority()));
                }
            }else{
                SecurityContextHolder.clearContext();
                if(jwtService.isTokenExpired(token)){
                    System.out.println("⏰ Token expirado. Limpiando contexto.");
                    request.setAttribute(
                        "ACCESS_TOKEN_EXPIRED",
                        true
                    );
                }else {
                    System.out.println("❌ Token inválido. Limpiando contexto.");
                    request.setAttribute(
                        "INVALID_ACCESS_TOKEN",
                        true
                    );
                }
            }
        } catch (Exception e) {
            
            // Limpia contexto de seguridad si hay error
            SecurityContextHolder.clearContext();
                    System.out.println(
                    "💥 Error procesando access token: "
                    + e.getClass().getSimpleName()
            );

            request.setAttribute(
                    "INVALID_ACCESS_TOKEN",
                    true
            );
        }

        // ⚡ Muy importante: pasar al siguiente filtro
        filterChain.doFilter(request, response);
    }

    
}
