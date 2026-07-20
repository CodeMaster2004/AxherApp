package com.axher.backend.content.ratings.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.ratings.DTOs.RatingRequestDto;
import com.axher.backend.content.ratings.DTOs.RatingSummaryDto;
import com.axher.backend.content.ratings.entities.Ratings;
import com.axher.backend.content.ratings.entities.TargetTypeEnum;
import com.axher.backend.content.ratings.repositories.RatingsRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UsersRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class RatingsService {

    private final RatingsRepository repository;
    private final UsersRepository usersRepository;

    public Page<Ratings> getByUserId(Integer userId, Pageable pageable){ 
        return repository.findByUser_UserId(userId, pageable);
    }

    public Page<Ratings> getByTargetType(TargetTypeEnum targetType, Pageable pageable){
        return repository.findByTargetType(targetType, pageable);
    }

    public Ratings findById(Integer ratingId){
        return repository.findById(ratingId)
            .orElseThrow(() -> new ResourceNotFoundException("Calificación no encontrada: " + ratingId));
    }

    public Ratings create(RatingRequestDto dto) {


        if(dto.getUserId() == null){
            throw new IllegalArgumentException("Usuario requerido");
        }

        validateRating(dto.getRatingValue());

        Users user = usersRepository.findById(dto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        
        Optional<Ratings> existing = repository
            .findByUser_UserIdAndTargetTypeAndTargetId(
                dto.getUserId(),
                dto.getTargetType(),
                dto.getTargetId()
            );
        
        if(existing.isPresent()){
            Ratings rating = existing.get();

            rating.setRatingValue(dto.getRatingValue());
            rating.setComment(dto.getComment());

            return repository.save(rating);
        }
        
        Ratings rating = new Ratings();
        rating.setUser(user);
        rating.setTargetType(dto.getTargetType());
        rating.setTargetId(dto.getTargetId());
        rating.setRatingValue(dto.getRatingValue());
        rating.setComment(dto.getComment());
        rating.setRatedAt(java.time.LocalDateTime.now());

        return repository.save(rating);
    }

    public Ratings update(Integer ratingId, RatingRequestDto dto) {

        Ratings rating = repository.findById(ratingId)
            .orElseThrow(() -> new ResourceNotFoundException("Calificación no encontrada: " + ratingId));

        if (dto.getRatingValue() != null) {
            validateRating(dto.getRatingValue());
            rating.setRatingValue(dto.getRatingValue());
        }

        if (dto.getComment() != null) {
            rating.setComment(dto.getComment());
        }

        return repository.save(rating);
    }

    public void delete(Integer ratingId) {
        Ratings rating = repository.findById(ratingId)
            .orElseThrow(() -> new ResourceNotFoundException("Calificación no encontrada: " + ratingId));

        repository.delete(rating);
    }

    private void validateRating(Integer value) {
        if (value == null || value < 1 || value > 5) {
            throw new IllegalArgumentException("Rating debe ser entre 1 y 5");
        }
    }


    public Ratings findUserRating(
            Integer userId,
            TargetTypeEnum targetType,
            Integer targetId
    ){

        return repository
            .findByUser_UserIdAndTargetTypeAndTargetId(
                userId,
                targetType,
                targetId
            )
            .orElseThrow(() -> 
                new ResourceNotFoundException("Sin calificación")
            );
    }

    public RatingSummaryDto getSymmary(TargetTypeEnum type, Integer targetId){
        
        Double average = repository.findAverageRating(type, targetId);

        Long total = repository.countByTargetTypeAndTargetId(type, targetId);

        if(average == null){
            average = 0.0;
        }

        return new RatingSummaryDto(
            Math.round(average * 10.0) / 10.0, // Round to 1 decimal place
            total
        );
    }

}

