package com.axher.backend.infrastructure.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
        
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:3000" , "http://10.147.54.128:3000") // Especifica aquí tus origenes especificos
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    /*public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                //.allowedOrigins("http://localhost:8080") // Direccion del frontend Angular pero ahora nextjs
                .allowedOrigins("http://192.168.154.23:3000") // Dirección de tu frontend Angular
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos permitidos
                .allowedHeaders("*");
    }*/
             
    @Value("${app.upload-dir}")
    private String uploadDir;

    @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {

                registry.addResourceHandler("/episodes/**")
                                .addResourceLocations("file:" + uploadDir + "/episodes/");

        registry.addResourceHandler("/movies/**")
                .addResourceLocations("file:" + uploadDir + "/movies/");

        registry.addResourceHandler("/posters/**")
                .addResourceLocations("file:" + uploadDir + "/posters/");

        registry.addResourceHandler("/trailers/**")
                .addResourceLocations("file:" + uploadDir + "/trailers/");

        registry.addResourceHandler("/banners/**")
                .addResourceLocations("file:" + uploadDir + "/banners/");
        
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:" + uploadDir + "/avatars/");

        // ✅ Perfiles por defecto
        registry.addResourceHandler("/profile_pictures/**")
                .addResourceLocations("file:" + uploadDir + "/profile_pictures/");

        registry.addResourceHandler("/backdrop/**")
                .addResourceLocations("file:" + uploadDir + "/backdrop/");
       

        registry.addResourceHandler("/profile_banners/**")
                .addResourceLocations("file:" + uploadDir + "/profile_banners/");

        registry.addResourceHandler("/hero-banners/**")
                .addResourceLocations("file:" + uploadDir + "/hero-banners/");
        }


             

}
