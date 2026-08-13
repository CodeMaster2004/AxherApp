package com.axher.backend.search.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.search.entities.SearchHistory;
import com.axher.backend.search.repositories.SearchHistoryRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.users.entities.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SearchHistoryService {

    private final SearchHistoryRepository repository;

    //==============================
    //OBTENER HISTORIAL
    //==============================
    public Page<SearchHistory> getHistory(Pageable pageable){
        
        Users user = getCurrentUser();

        return repository.findByUser_UserIdOrderBySearchedAtDesc(
            user.getUserId(), pageable
        );
    }

    //==============================
    //GUARDAR HISTORIAL
    //==============================
    public SearchHistory save(String term){

        Users user = getCurrentUser();

        if(term == null || term.isBlank()){
            throw new IllegalArgumentException(
                "El término de búsqueda no puede estar vacío"
            );
        }

        String normalizedTerm = term.trim();

        Optional<SearchHistory> existing =
            repository.findByUser_UserIdAndTerm(
                user.getUserId(),
                normalizedTerm
            );

        if(existing.isPresent()){

            SearchHistory history = existing.get();

            history.setSearchedAt(java.time.LocalDateTime.now());

            return repository.save(history);
        }

        SearchHistory history = new SearchHistory();

        history.setUser(user);
        history.setTerm(normalizedTerm);
        history.setSearchedAt(java.time.LocalDateTime.now());

        return repository.save(history);
    }

    //==============================
    //EIMINAR UNA BUSQUEDA DEL HISTORIAL
    //==============================
    public void delete(Long searchId){

        Users user = getCurrentUser();

        long deleted = repository.deleteBySearchIdAndUser_UserId(
            searchId,
            user.getUserId()
        );

        if(deleted == 0){
            throw new ResourceNotFoundException(
                "Búsqueda no encontrada: " + searchId
            );
        }
    }

    //==============================
    //LIMPIAR HISTORIAL
    //==============================
    public void clearHistory(){
        Users user = getCurrentUser();

        repository.deleteByUser_UserId(user.getUserId());
    }

    //==============================
    //USUARIO AUTENTICADO
    //==============================
    private Users getCurrentUser() {
        return (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
    
}
