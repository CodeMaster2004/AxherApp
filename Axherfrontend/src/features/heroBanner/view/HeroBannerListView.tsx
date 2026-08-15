"use client";

import { HeroBanner } from "@/entities/types";
import { useHeroBannerActions } from "@/features/heroBanner/hooks/useHeroBannerActions";
import { useRouter } from "next/navigation";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import { useHeroBanners } from "@/features/heroBanner/hooks/useHeroBanners";
import HeroBannerList from "@/features/heroBanner/components/HeroBannerList";

export default function HeroBannerListView() {
    const router = useRouter();
    const {
        heroBanners,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch
    } = useHeroBanners();

    const {
        deleting,
        removeHeroBanner,
        toggleHeroBanner
    } = useHeroBannerActions({
        onSuccess: refetch
    });

    const handleCreate = () => {
        router.push("/admin/hero-banners/create");
    }

    const handleEdit = (banner: HeroBanner) => {
        router.push(`/admin/hero-banners/${banner.heroBannerId}/edit`);
    }

    const handleToggle = async (id: number) => {
        await toggleHeroBanner(id);
    }

    return (

        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>

                <h1>
                    Hero Banners
                </h1>
                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    Crear Banner
                </Button>

            </div>

            <HeroBannerList

                banners={heroBanners}
                onEdit={handleEdit}
                onDelete={removeHeroBanner}
                onToggle={handleToggle}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

            />

        </div>

    )
}