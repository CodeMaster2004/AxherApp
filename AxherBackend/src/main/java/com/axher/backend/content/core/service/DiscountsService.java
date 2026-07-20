package com.axher.backend.content.core.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Discounts;
import com.axher.backend.content.core.repositories.DiscountsRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.DateValidator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DiscountsService {

   private final DiscountsRepository repository;

    public Page<Discounts> findAll(Pageable pageable, String search){

        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.findByDiscountTypeContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search, pageable);
    }

    public Discounts findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Descuento no encontrado: " + id));
    }

    public Discounts create(Discounts discount){

        DateValidator.validateDateRange(discount.getStartDate(), discount.getEndDate());

        return repository.save(discount);

    }

    public Discounts update(Integer id, Discounts discount) {

        Discounts existing = findById(id);

        // 🔹 Tipo de descuento
        if (discount.getDiscountType() != null) {
            if (discount.getDiscountType().isBlank()) {
                throw new IllegalArgumentException(
                    "El tipo de descuento no puede estar vacío"
                );
            }
            existing.setDiscountType(discount.getDiscountType());
        }

        // 🔹 Monto
        if (discount.getAmount() != null) {
            existing.setAmount(discount.getAmount());
        }

        // 🔹 Fechas (solo si alguna viene)
        if (discount.getStartDate() != null || discount.getEndDate() != null) {

            LocalDate start = discount.getStartDate() != null
                    ? discount.getStartDate()
                    : existing.getStartDate();

            LocalDate end = discount.getEndDate() != null
                    ? discount.getEndDate()
                    : existing.getEndDate();

            DateValidator.validateDateRange(start, end);

            existing.setStartDate(start);
            existing.setEndDate(end);
        }

        // 🔹 Descripción
        if (discount.getDescription() != null) {
            existing.setDescription(discount.getDescription());
        }

        return repository.save(existing);
    }


    public void delete(Integer id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Descuento no encontrado: " + id);
        }
        repository.deleteById(id);
    }
}

