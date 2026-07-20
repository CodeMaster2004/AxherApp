package com.axher.backend.infrastructure.email;

import java.security.SecureRandom;
import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final StringRedisTemplate redisTemplate;

    private static final String CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final int OTP_LENGTH = 6;          // longitud del OTP
    private final int OTP_TTL_MINUTES = 1;     // expiración OTP
    private final int MAX_ATTEMPTS = 5;        // intentos máximos
    private final int MAX_RESENDS = 3;         // reenvíos máximos

    private final SecureRandom secureRandom = new SecureRandom();

    /** Genera OTP alfanumérico y lo guarda en Redis **/
    public String generateOtp(Long userId, String type) {
        String otp = generateAlphanumericOtp(OTP_LENGTH);
        String key = "otp:" + type + ":user:" + userId;
        redisTemplate.opsForValue().set(key, otp, Duration.ofMinutes(OTP_TTL_MINUTES));
        redisTemplate.opsForValue().set(key + ":attempts", "0", Duration.ofMinutes(OTP_TTL_MINUTES));
        redisTemplate.opsForValue().set(key + ":resends", "0", Duration.ofMinutes(OTP_TTL_MINUTES));
        return otp;
    }

    /** Reenviar OTP **/
    public String resendOtp(Long userId, String type) {
        String key = "otp:" + type + ":user:" + userId;
        String resendKey = key + ":resends";

        String resendsStr = redisTemplate.opsForValue().get(resendKey);
        int resends = resendsStr == null ? 0 : Integer.parseInt(resendsStr);

        if (resends >= MAX_RESENDS) {
            throw new RuntimeException("Máximo de reenvíos alcanzado, contacta soporte.");
        }

        String otp = generateAlphanumericOtp(OTP_LENGTH);
        redisTemplate.opsForValue().set(key, otp, Duration.ofMinutes(OTP_TTL_MINUTES));
        redisTemplate.opsForValue().set(key + ":attempts", "0", Duration.ofMinutes(OTP_TTL_MINUTES));
        redisTemplate.opsForValue().set(resendKey, String.valueOf(resends + 1), Duration.ofMinutes(OTP_TTL_MINUTES));

        return otp;
    }

    /** Validar OTP **/
    public boolean validateOtp(Long userId, String inputOtp, String type) {
        String key = "otp:" + type + ":user:" + userId;
        String storedOtp = (String) redisTemplate.opsForValue().get(key);
        if (storedOtp == null) return false;

        String attemptsStr = redisTemplate.opsForValue().get(key + ":attempts");
        int attempts = attemptsStr == null ? 0 : Integer.parseInt(attemptsStr);

        if (attempts >= MAX_ATTEMPTS) {
            cleanupOtp(userId, type);
            return false;
        }

        if (storedOtp.equalsIgnoreCase(inputOtp)) {
            cleanupOtp(userId, type);
            return true;
        } else {
            redisTemplate.opsForValue().increment(key + ":attempts");
            return false;
        }
    }

    /** Limpiar OTP y contador **/
    public void cleanupOtp(Long userId, String type) {
        String key = "otp:" + type + ":user:" + userId;
        redisTemplate.delete(key);
        redisTemplate.delete(key + ":attempts");
        redisTemplate.delete(key + ":resends");
    }

    /** Generar OTP alfanumérico **/
    private String generateAlphanumericOtp(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHAR_POOL.charAt(secureRandom.nextInt(CHAR_POOL.length())));
        }
        return sb.toString();
    }
}

