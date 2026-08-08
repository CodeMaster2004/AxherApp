package com.axher.backend.content.core.service;

import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasCategory;
import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasDiscountAmount;
import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasStatus;
import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.CreateContentDto;
import com.axher.backend.content.core.DTOs.UpdateContentDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.entities.ContentStatusCode;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.entities.Discounts;
import com.axher.backend.content.core.repositories.ContentCategoriesRepository;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.content.core.repositories.DiscountsRepository;
import com.axher.backend.content.core.strategy.ContentTypeService;
import com.axher.backend.infrastructure.quartz.ContentPublicationScheduler;
import com.axher.backend.infrastructure.specification.ContentSpecifications;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ContentService {
    private final ContentRepository contentRepository;
    private final ContentCategoriesRepository categoriesRepository;
    private final DiscountsRepository discountsRepository;
    private final FileStorageService fileStorageService;
    private final Map<ContentTypeEnum, ContentTypeService> contentTypeServices;
    private final ContentPublicationScheduler contentPublicationScheduler;
    private final ContentStatusService statusService;

    public ContentService(ContentRepository contentRepository,
                          ContentCategoriesRepository categoriesRepository,
                          DiscountsRepository discountsRepository,
                          FileStorageService fileStorageService,
                          Set<ContentTypeService> services,
                          ContentPublicationScheduler contentPublicationScheduler,
                          ContentStatusService statusService
                        ) {
        this.contentRepository = contentRepository;
        this.categoriesRepository = categoriesRepository;
        this.discountsRepository = discountsRepository;
        this.fileStorageService = fileStorageService;
        this.contentPublicationScheduler = contentPublicationScheduler;
        this.statusService = statusService;
        // Mapear los servicios por tipo de contenido
        this.contentTypeServices = services.stream()
            .collect(Collectors.toMap(ContentTypeService::getType, s -> s));
    }

    // ==============================
    // LECTURA
    // ==============================
    public Page<Content> findAll(Pageable pageable, String search){
        if(search != null && !search.isEmpty()){
            return contentRepository.findByTitleContainingIgnoreCase(search, pageable);
        }
        return contentRepository.findAll(pageable);
    }

    public Content findById (Integer id){
        return contentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado: " + id));
    }

    public Page<Content> filterContents(
            String query,
            Integer categoryId,
            Integer year,
            Integer statusId,
            BigDecimal discountAmount,
            ContentTypeEnum type,
            Pageable pageable
    ){

        Specification<Content> spec = Specification.allOf();


        
        if(query != null && !query.isBlank()){
            spec = spec.and(
                ContentSpecifications.globalSearch(query)
            );
        }


        if(categoryId != null){
            spec = spec.and(
                hasCategory(
                    categoriesRepository.getReferenceById(categoryId)
                )
            );
        }

        if(year != null){
            spec = spec.and(
                ContentSpecifications.hasReleaseYear(year)
            );
        }


        if(statusId != null){
            spec = spec.and(
                hasStatus(statusId)
            );
        }


        if(discountAmount != null){
            spec = spec.and(
                hasDiscountAmount(discountAmount)
            );
        }


        if(type != null){
            spec = spec.and(
                hasType(type)
            );
        }


        return contentRepository.findAll(spec,pageable);
    }


    public Page<Content> findWithDiscount(Pageable pageable) {
        return contentRepository.findByDiscountIsNotNull(pageable);
    }

    public Page<Content> findByDiscountId(Integer discountId, Pageable pageable){
        return contentRepository.findByDiscount_DiscountId(discountId, pageable);
    }

    public Page<Content> findByDiscountAmount(BigDecimal amount, Pageable pageable){
        return contentRepository.findByDiscount_Amount(amount, pageable);
    }
    

    @Transactional
    public void publish(Integer id) {

        Content content = findById(id);

        if(ContentStatusCode.PUBLISHED.name().equals(content.getContentStatus().getCode())) {
            log.info("El contenido {} ya estaba publicado. Se omite la publicación.", id);
            return;
        }

        ContentStatus published = statusService.getStatus(ContentStatusCode.PUBLISHED);

        content.setContentStatus(published);
        contentRepository.save(content);

        log.info(
            "Contenido publicado correctamente"
        );
    }

    // ==============================
    // CREACION
    // ==============================
    @Transactional
    public Content create(CreateContentDto dto){

        Content content = buildAndSaveContent(dto);

        ContentTypeService service = contentTypeServices.get(dto.getType());

        if(service != null){
            if(dto.getMovie() != null){
                service.create(content, dto.getMovie());
            }else if(dto.getSeries() != null){
                service.create(content, dto.getSeries());
            }
        }

        return content;
    }
    // ==============================
    // ACTUALIZACION
    // ==============================
    @Transactional
    public Content update( Integer id, UpdateContentDto dto)
    {
        Content content = findById(id);

        // No permitir cambiar el tipo después de creado
        if(dto.getType() != null && dto.getType() != content.getType()){
            throw new IllegalArgumentException("No se puede cambiar el tipo de contenido");
        }

        if(dto.getTitle() != null){
            content.setTitle(dto.getTitle());
        }

        if(dto.getDescription() != null){
            content.setDescription(dto.getDescription());
        }
        if(dto.getPrice() != null){
            content.setPrice(dto.getPrice());
        }

        // Poster
        if(dto.getPosterFile() != null && !dto.getPosterFile().isEmpty()){
            String newPoster = fileStorageService.saveFile(dto.getPosterFile(), "posters");
            fileStorageService.deleteFile(content.getPosterUrl());
            content.setPosterUrl(newPoster);
        }

        if(dto.getBackdropFile() != null && !dto.getBackdropFile().isEmpty()){
            String newBackdrop = fileStorageService.saveFile(dto.getBackdropFile(), "backdrop");
            fileStorageService.deleteFile(content.getBackdropUrl());
            content.setBackdropUrl(newBackdrop);
        }

        // Trailer
        if(dto.getTrailerFile() != null && !dto.getTrailerFile().isEmpty()){
            String newTrailer = fileStorageService.saveFile(dto.getTrailerFile(), "trailers");
            fileStorageService.deleteFile(content.getTrailerUrl());
            content.setTrailerUrl(newTrailer);
        }

        // Categorias
        if(dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            content.setCategories(getValidatedCategories(dto.getCategoryIds()));

        }

        // Descuento
        if (dto.getDiscountId() != null) {
            content.setDiscount(getValidatedDiscount(dto.getDiscountId()));
        } else if (dto.getDiscountId() == null && content.getDiscount() != null) {
            content.setDiscount(null); // Quitar descuento si antes tenía
        }

        if(dto.getReleaseDate() != null){
            content.setReleaseDate(dto.getReleaseDate());
        }

        // Estado
        if (dto.getStatusId() != null) {
            ContentStatus status = statusService.findById(dto.getStatusId());
            content.setContentStatus(status);
        }

        // Actualizar datos específicos de Movie
        ContentTypeService service = contentTypeServices.get(content.getType());

        if(service != null ){

            if(ContentTypeEnum.MOVIE.equals(content.getType()) && dto.getMovie() != null){
                service.update(content, dto.getMovie());
            }else if(ContentTypeEnum.SERIE.equals(content.getType()) && dto.getSeries() != null){
                service.update(content, dto.getSeries());
            }
        }

        Content saved = contentRepository.save(content);

        try {
            syncPublication(saved);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Error al sincronizar la publicación automática", e);
        }

        return saved;

    }

    @Transactional
    public Content updateStatus(Integer contentId, Integer statusId) {

        Content content = findById(contentId);

        ContentStatus status = statusService.findById(statusId);

        content.setContentStatus(status);

        Content saved = contentRepository.save(content);

        try {

            syncPublication(saved);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Error al programar la publicación automática", e);

        }

        return saved;
    }

    //================================
    // ELIMINACION
    //================================
   @Transactional
    public void delete(Integer id){

        Content content = findById(id);

        String poster = content.getPosterUrl();
        String backdrop = content.getBackdropUrl();
        String trailer = content.getTrailerUrl();

        ContentTypeService service = contentTypeServices.get(content.getType());

        if(service != null){
            service.delete(content);
        }
        

        try{
            contentPublicationScheduler.cancel(content.getContentId());
        }catch (Exception e) {
            throw new IllegalStateException("Error al cancelar la publicacion del contenido", e);
        }
        contentRepository.delete(content);

        fileStorageService.deleteFile(poster);
        fileStorageService.deleteFile(backdrop);
        fileStorageService.deleteFile(trailer);

        
    }

    // ==============================
    // 🔒 MÉTODOS PRIVADOS
    // ==============================
    private Content buildAndSaveContent(CreateContentDto dto){
        //Validar que la categoria exista
        Set<ContentCategories> categories = getValidatedCategories(dto.getCategoryIds());

        
        //Obtener estado "Inactivo" por defecto
        ContentStatus defaultStatus = statusService.getStatus(ContentStatusCode.DRAFT);
        //Validar descuento si se proporciona
        Discounts discount = dto.getDiscountId() != null ? getValidatedDiscount(dto.getDiscountId()) : null;

        String posterUrl = fileStorageService.saveFile(dto.getPosterFile(), "posters");
        String backdropUrl = fileStorageService.saveFile(dto.getBackdropFile(), "backdrop");
        String trailerUrl = fileStorageService.saveFile(dto.getTrailerFile(), "trailers");

        Content content = new Content();
        content.setTitle(dto.getTitle());
        content.setDescription(dto.getDescription());
        content.setType(dto.getType());
        content.setPosterUrl(posterUrl);
        content.setBackdropUrl(backdropUrl);
        content.setTrailerUrl(trailerUrl);
        content.setPrice(dto.getPrice());
        content.setCategories(categories);
        content.setContentStatus(defaultStatus);
        content.setDiscount(discount);
        content.setReleaseDate(dto.getReleaseDate());

        return contentRepository.save(content);
    }

    private Set<ContentCategories> getValidatedCategories(Collection<Integer> categoryIds){
        return categoryIds.stream()
            .map(id -> categoriesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada: " + id)))
            .collect(Collectors.toSet());
    }


    private Discounts getValidatedDiscount(Integer discountId){
        return discountsRepository.findById(discountId)
            .orElseThrow(() -> new ResourceNotFoundException("Descuento no encontrado: " + discountId));
    }

    private void syncPublication(Content content) throws Exception {

        if(ContentStatusCode.UPCOMING.name().equals(content.getContentStatus().getCode())){

            if(content.getReleaseDate() == null){
                throw new IllegalArgumentException(
                    "El contenido UPCOMING necesita fecha de estreno"
                );
            }

            if(content.getReleaseDate().isBefore(LocalDateTime.now())){
                throw new IllegalArgumentException(
                    "La fecha de estreno debe ser futura"
                );
            }

            contentPublicationScheduler.schedule(
                content.getContentId(),
                content.getReleaseDate()
            );
        }else {
            contentPublicationScheduler.cancel(
                content.getContentId()
            );
        }
    }

   


}

