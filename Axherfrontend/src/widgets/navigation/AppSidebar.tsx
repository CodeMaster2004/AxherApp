// src/components/layout/SidebarLeft.tsx
"use client"

import { useAuth } from '@/features/auth/context/AuthContext';
import { menuConfig } from '@/shared/config/menuConfig';
import styles from '@/shared/styles/layout/Sidebar.module.css';
import { filterMenuByPermissions } from '@/shared/utils/filterMenuByRole';
import React, { useEffect, useRef, useState } from 'react';
import MenuTree from '../layout/MenuTree';
import { useTranslations } from 'next-intl';

interface SidebarLeftProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const AppSidebar: React.FC<SidebarLeftProps> = ({isOpen = false, onClose}) => {
    const [, setOpenMenu] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);
    const { user } = useAuth();
    const filteredMenu = filterMenuByPermissions(
        menuConfig,
        user?.permissions
    );
    const t = useTranslations("navigation");

    useEffect(() => {
        if (!isOpen) return;

        function handleOutside(e: MouseEvent | TouchEvent) {
            const target = e.target as Node;

            if (ref.current && !ref.current.contains(target)) {
            onClose?.();

            }
        }

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("touchstart", handleOutside);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("touchstart", handleOutside);
        };
    }, [isOpen, onClose]);

    // Resetear submenús abiertos cuando el sidebar se cierra
    useEffect(() => {
        if (!isOpen) {
            setOpenMenu(null);
        }
    }, [isOpen]);

    // Cerrar sidebar cuando la pantalla es grande (> 768px)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isOpen) {
                onClose?.();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen, onClose]);
    
    return (
        <div ref={ref} className={`${styles.sidebar} ${isOpen ? styles.active : ""}`}>
            <h2>{t("menu")}</h2>
            <MenuTree
                items={filteredMenu}
                getLabel={(item) => t(item.labelKey)}
                renderSubMenu={(children) => <div className={styles.subMenu}>{children}</div>}
                onItemClick={onClose}
            />
        </div>
    );
};

export default AppSidebar;
