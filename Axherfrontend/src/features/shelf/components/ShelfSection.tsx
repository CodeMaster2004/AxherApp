"use client";

import ShelfCarousel from "@/features/shelf/components/ShelfCarousel";
import FeaturedShelf from "@/features/shelf/components/FeaturedShelf";
import { useShelf } from "@/features/shelf/hooks/useShelf";

interface Props {
    shelfId: number;
}

export default function ShelfSection({
    shelfId
}: Props) {

    const {
        shelf,
        loading
    } = useShelf(shelfId);


    if (loading) {
        return null;
    }


    if (!shelf) {
        return null;
    }


    if (shelf.slug === "destacados") {

        return (
            <FeaturedShelf
                shelf={shelf}
            />
        );
    }


    return (
        <ShelfCarousel
            shelf={shelf}
        />
    );
}