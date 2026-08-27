// components/layout/DesktopMenu.tsx
"use client";

import { useAuth } from '@/features/auth/context/AuthContext';
import { menuConfig } from '@/shared/config/menuConfig';
import styles from '@/shared/styles/layout/Header.module.css';
import { filterMenuByPermissions } from '@/shared/utils/filterMenuByRole';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import MenuTree from './MenuTree';
import { useTranslations } from 'next-intl';

const DesktopMenu = () => {
    const { user } = useAuth();
    const t = useTranslations("navigation");
    const menuRef = useRef<HTMLDivElement>(null);
    const filteredMenu = filterMenuByPermissions(
        menuConfig,
        user?.permissions
    );

    const scrollMenu = (direction: "left" | "right") => {
        if (!menuRef.current) return;
        const amount = 220;
        menuRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    return (
        <nav className={styles.desktopMenuWrap}>

            <button
                className={`${styles.menuArrow} ${styles.left}`}
                onClick={() => scrollMenu("left")}
                aria-label={t("scrollLeft")}
                type="button"
            >
                <ChevronLeft size={18} />
            </button>
            
            <div ref={menuRef} className={styles.desktopMenuTrack}>
                <div className={styles.desktopMenu}>
                    <MenuTree
                        items={filteredMenu}
                        getLabel={(item) =>
                            t(item.labelKey)
                        }
                        renderSubMenu={(Children) => (
                            <div className={styles.desktopSubMenu}>
                                {Children}
                            </div>
                        )}
                    />
                </div>
            </div>

            <button
                className={`${styles.menuArrow} ${styles.right}`}
                onClick={() => scrollMenu("right")}
                aria-label={t("scrollRight")}
                type="button"
            >
                <ChevronRight size={18} />
            </button>

        </nav>
    );
};

export default DesktopMenu;