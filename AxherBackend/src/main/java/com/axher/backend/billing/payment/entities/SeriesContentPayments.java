package com.axher.backend.billing.payment.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.entities.Series;
import com.axher.backend.users.entities.Users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "series_content_payments")
public class SeriesContentPayments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer seriesContentPaymentId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users userId;

    @ManyToOne
    @JoinColumn(name = "series_id")
    private Series seriesId;

    @ManyToOne
    @JoinColumn(name = "season_id")
    private Seasons seasonId;

    @ManyToOne
    @JoinColumn(name = "episode_id")
    private Episodes episodeId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethods paymentMethodId;
    @ManyToOne
    @JoinColumn(name = "payment_status_id")
    private PaymentStatus paymentStatusId;

}
