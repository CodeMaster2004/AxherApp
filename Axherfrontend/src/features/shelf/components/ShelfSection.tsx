"use client";

import ShelfCarousel from "@/features/shelf/components/ShelfCarousel";
import FeaturedShelf from "@/features/shelf/components/FeaturedShelf";
import { useShelves } from "@/features/shelf/hooks/useShelves";

interface Props {
    target: "HOME" | "MOVIES" | "SERIES";
    slug?: string;
    excludeSlugs?: string[];
}

export default function ShelfSection({
    target,
    slug,
    excludeSlugs
}: Props) {

    const {
        shelves,
        loading,
    } = useShelves(target, slug);

    if(loading) return null;


    const visibleShelves = excludeSlugs
        ? shelves.filter(
            shelf => !excludeSlugs.includes(shelf.slug)
          )
        : shelves;


    return (
        <>
            {
                visibleShelves.map((shelf)=>{

                    if(shelf.slug === "destacados"){
                        return (
                            <FeaturedShelf
                                key={shelf.slug}
                                shelf={shelf}
                            />
                        );
                    }


                    return (
                        <ShelfCarousel
                            key={shelf.slug}
                            shelf={shelf}
                        />
                    );

                })
            }
        </>
    );
}