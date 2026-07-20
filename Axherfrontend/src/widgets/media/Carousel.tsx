// src/components/media/Carousel.tsx
import styles from '@/shared/styles/components/Carousel.module.css';
import React from 'react';




interface CarouselProps {
  title: string;
  items: { id: number; title: string; image: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ title, items }) => {
  return (
    <div className={styles.carousel}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <div className={styles.carouselItems}>
      {items.map((item) => (
        <div key={item.id} className={styles.carouselItem}>
          <img src={item.image} alt={item.title} />
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Carousel;
