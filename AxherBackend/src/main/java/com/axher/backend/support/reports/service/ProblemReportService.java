package com.axher.backend.support.reports.service;

import java.time.Instant;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.repositories.EpisodesRepository;
import com.axher.backend.infrastructure.specification.ProblemReportSpecification;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.reports.DTOS.ProblemReportRequestDto;
import com.axher.backend.support.reports.DTOS.ProblemReportStatusRequestDto;
import com.axher.backend.support.reports.entities.ProblemReport;
import com.axher.backend.support.reports.entities.ProblemReportCategory;
import com.axher.backend.support.reports.entities.ReportCategory;
import com.axher.backend.support.reports.entities.ReportStatus;
import com.axher.backend.support.reports.entities.ReportStatusCode;
import com.axher.backend.support.reports.repositories.ProblemReportRepository;
import com.axher.backend.support.reports.repositories.ReportCategoryRepository;
import com.axher.backend.support.reports.repositories.ReportStatusRepository;
import com.axher.backend.users.entities.Users;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemReportService {

    private final ProblemReportRepository repository;
    private final ReportStatusRepository reportStatusRepository;
    private final ContentRepository contentRepository;
    private final EpisodesRepository episodesRepository;
    private final ReportCategoryRepository reportCategoryRepository;

    // ==============================
    // LISTAR REPORTES DEL USUARIO
    // ==============================
    public Page<ProblemReport> findAllByCurrentUser(Pageable pageable ){
        Users user = getCurrentUser();

        return repository.findByUser_UserIdOrderByReportedAtDesc(
            user.getUserId(),
            pageable
        );
    }

    // ==============================
    // OBTENER REPORTE DEL USUARIO
    // ==============================
    public ProblemReport findByIdForCurrentUser(Integer reportId){
        Users user = getCurrentUser();

        return repository.findByReportIdAndUser_UserId(reportId, user.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado: " + reportId));
    }

    // ==============================
    // CREAR REPORTE
    // ==============================
    public ProblemReport create(ProblemReportRequestDto request) {

        Users user = getCurrentUser();

        ReportStatus status = reportStatusRepository
            .findByCode(ReportStatusCode.OPEN.name())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Estado de reporte no encontrado: "
                    + ReportStatusCode.OPEN.name()
                )
            );

        ProblemReport report = new ProblemReport();

        report.setUser(user);
        ReportCategory category = reportCategoryRepository
            .findById(request.getReportCategoryId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Categoría de reporte no encontrada: "
                    + request.getReportCategoryId()
                )
            );

        report.setCategory(category);
        report.setDescription(request.getDescription());
        report.setReportStatus(status);

        if (request.getContentId() != null) {

            Content content = contentRepository
                .findById(request.getContentId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Contenido no encontrado: "
                        + request.getContentId()
                    )
                );

            report.setContent(content);
        }

        if (request.getEpisodeId() != null) {

            Episodes episode = episodesRepository
                .findById(request.getEpisodeId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Episodio no encontrado: "
                        + request.getEpisodeId()
                    )
                );

            report.setEpisode(episode);
        }

        return repository.save(report);
    }

    // ==============================
    // ELIMINAR REPORTE DEL USUARIO
    // ==============================
    public void delete(Integer reportId) {

        Users user = getCurrentUser();

        long deleted = repository.deleteByReportIdAndUser_UserIdAndReportStatus_Code(
            reportId,
            user.getUserId(),
            ReportStatusCode.OPEN.name()
        );

        if (deleted == 0) {
            throw new ResourceNotFoundException(
                "El reporte no existe, no pertenece al usuario o ya no está abierto: "
                + reportId
            );
        }
    }


    // ==============================
    // LISTAR REPORTES POR FILTROS (ADMIN)
    // ==============================
    public Page<ProblemReport> findAll(
        Pageable pageable,
        String search,
        String statusCode,
        ProblemReportCategory category,
        Integer userId,
        Integer contentId,
        Integer episodeId,
        LocalDateTime reportedAtFrom,
        LocalDateTime reportedAtTo
    ) {
        Specification<ProblemReport> specification =
            ProblemReportSpecification.filter(
                search,
                statusCode,
                category,
                userId,
                contentId,
                episodeId,
                reportedAtFrom,
                reportedAtTo
            );

        return repository.findAll(specification, pageable);
    }
    

    // ==============================
    // OBTENER REPORTE (ADMIN)
    // ==============================
    public ProblemReport findById(Integer reportId) {
        return repository.findById(reportId)
            .orElseThrow(() -> 
                new ResourceNotFoundException("Reporte no encontrado: " + reportId)
            );
    }

    // ==============================
    // ACTUALIZAR ESTADO DE REPORTE (ADMIN)
    // ==============================
    public ProblemReport updateStatus(
        Integer reportId,
        ProblemReportStatusRequestDto request
    ) {

        ProblemReport report = findById(reportId);

        ReportStatus status = reportStatusRepository
            .findById(request.getReportStatusId())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Estado de reporte no encontrado: "
                    + request.getReportStatusId()
                )
            );

        report.setReportStatus(status);

        if (ReportStatusCode.RESOLVED.name().equals(status.getCode())) {

            if (report.getResolvedAt() == null) {
                report.setResolvedAt(Instant.now());
            }

        } else {

            report.setResolvedAt(null);
        }

        return repository.save(report);
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
