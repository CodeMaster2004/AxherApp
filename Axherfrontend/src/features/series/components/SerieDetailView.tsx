"use client";

import { SeriesDetail } from "@/entities/types";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Image from "next/image";

interface Props{
    series: SeriesDetail;
}

export default function SerieDetailView({ series }: Props) {
    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className={layoutStyles.section}>
            <h1>{series.title}</h1>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1.5rem' }}>
                {series.posterUrl && (
                    <Image
                        src={series.posterUrl}
                        alt={series.title}
                        width={250}
                        height={375}
                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                )}
                
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '1.5rem' }}>
                        {series.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                        <p><strong>Precio:</strong> ${series.price.toFixed(2)}</p>
                        <p><strong>Estado:</strong> {series.status.status}</p>
                        <p><strong>Categorías:</strong> {series.categories.join(", ")}</p>
                        <p><strong>Descuento:</strong> {series.discountAmount ? `${series.discountAmount}%` : "Sin descuento"}</p>
                        <p><strong>Registrado:</strong> {formatDate(series.registeredAt)}</p>
                        <p><strong>Temporadas:</strong> {series.seasonCount}</p>
                    </div>

                    {series.trailerUrl && (
                        <Button 
                            variant="secondary"
                            onClick={() => window.open(series.trailerUrl, '_blank')}
                            style={{ marginTop: '1rem' }}
                        >
                            🎬 Ver Trailer
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}