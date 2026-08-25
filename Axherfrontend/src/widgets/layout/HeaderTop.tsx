"use client";
// src/components/layout/HeaderTop.tsx
import hamburgerStyles from '@/shared/components/ui/Hamburger.module.css';
import styles from '@/shared/styles/layout/Header.module.css';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import HamburgerButton from '../../shared/components/ui/HamburgerButton';
import DesktopMenu from './DesktopMenu';
import SearchButton from '@/features/search/components/SearchButton';
import UserMenu from '@/features/profile/components/UserMenu';
import { useEffect, useState } from 'react';
interface HeaderTopProps{
  onMenuToggle: () => void;
  isOpen: boolean;
}

export default function HeaderTop({onMenuToggle, isOpen}: HeaderTopProps) {
    const router = useRouter();
 
    const [scrolled,setScrolled] = useState(false);

    useEffect(()=>{

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };


        window.addEventListener(
            "scroll",
            handleScroll
        );


        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };

    },[]);
    
    return (
        <header 
            className={`
                ${styles.headerTop}
                ${scrolled ? styles.headerScrolled : ""}
            `}
        >
            <HamburgerButton
                isOpen={isOpen}
                onToggle={onMenuToggle}
                className={hamburgerStyles.hamburgerMobile}
            />

            {/*IZQUIERDA*/}

            <div className={styles.leftSide}>

                <div
                    className={styles.logo}
                    onClick={() => router.push("/")}
                >
                    <Image
                        src="/images/axher-logo.svg"
                        alt="AXHER"
                        width={170}
                        height={52}
                        priority
                        className={styles.logoImage}
                    />
                </div>

                <DesktopMenu />

            </div>

            {/*DERECHA*/}
            <div className={styles.rightSide}>
               
                <SearchButton></SearchButton>
                <UserMenu></UserMenu>

             
            </div>
                
        </header>
    );
    
};

