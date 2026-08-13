package com.axher.backend.catalog.watchlist.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.catalog.watchlist.entities.Watchlist;


public interface WatchlistRepository extends JpaRepository<Watchlist, Integer> {

    // ==============================
    // VERIFICAR SI ESTA EN LA LISTA
    // ==============================
    boolean existsByUser_UserIdAndContent_ContentId(
        Integer userId,
        Integer contentId
    );

    // ==============================
    // BUSCAR ELEMENTO DE LA LISTA
    // ==============================
    Optional<Watchlist> findByUser_UserIdAndContent_ContentId(
        Integer userId,
        Integer contentId
    );

    // ==============================
    // LISTAR ELEMENTOS DE LA LISTA
    // ==============================
    Page<Watchlist> findByUser_UserIdOrderByAddedAtDesc(
        Integer userId,
        Pageable pageable
    );

    // ==============================
    // BUSCAR ELEMENTO POR ID + USUARIO
    // ==============================
    Optional<Watchlist> findByWatchlistIdAndUser_UserId(
        Integer watchlistId,
        Integer userId
    );

}
