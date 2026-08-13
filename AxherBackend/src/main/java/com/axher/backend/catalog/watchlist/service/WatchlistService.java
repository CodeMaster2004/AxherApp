package com.axher.backend.catalog.watchlist.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.axher.backend.catalog.watchlist.entities.Watchlist;
import com.axher.backend.catalog.watchlist.repositories.WatchlistRepository;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.users.entities.Users;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WatchlistService {

    private final WatchlistRepository repository;
    private final ContentRepository contentRepository;

    // ==============================
    //LISTAR LISTA DEL USUARIO
    // ==============================
    public Page<Watchlist> findByUserId(
        Pageable pageable
    ){

        Users user = getCurrentUser();
        return repository.findByUser_UserIdOrderByAddedAtDesc(
            user.getUserId(), pageable
        );
    }

    // ==============================
    // OBTENER ELEMENTO DE LA LISTA POR ID
    // ==============================
    public Watchlist findById(Integer watchlistId) {

        Users user = getCurrentUser();

        return repository
            .findByWatchlistIdAndUser_UserId(
                watchlistId,
                user.getUserId()
            )
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Lista no encontrada: " + watchlistId
                )
            );
    }

    // ==============================
    // VERIFICAR SI ESTA EN LA LISTA
    // ==============================
    public boolean isInWatchlist(
        Integer contentId
    ){
        Users user = getCurrentUser();
        return repository.existsByUser_UserIdAndContent_ContentId(user.getUserId(), contentId);
    }

    // ==============================
    // AGREGAR A LA LISTA
    // ==============================
    public Watchlist add(Integer contentId){
        Users user = getCurrentUser();

       
        Content content = contentRepository.findById(contentId)
            .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado: " + contentId));

        if(repository.existsByUser_UserIdAndContent_ContentId(user.getUserId(), contentId)){
            throw new DuplicateResourceException("El contenido ya está en lista");
        }

        Watchlist favorite = new Watchlist();

        favorite.setUser(user);
        favorite.setContent(content);
        return repository.save(favorite);
    }

    // ==============================
    // ELIMINAR DE LA LISTA
    // ==============================
    public void remove(Integer contentId) {
        Users user = getCurrentUser();
        Watchlist favorite = repository.findByUser_UserIdAndContent_ContentId(user.getUserId(), contentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "El contenido no se encuentra en lista"
            ));
        repository.delete(favorite);
    }

    // ==============================
    // USUARIO AUTENTICADO
    // ==============================
    private Users getCurrentUser() {

        return (Users) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
    }
    
}
