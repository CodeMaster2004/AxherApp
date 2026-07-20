"use client";
// src/components/layout/HeaderTop.tsx
import { useAuth } from '@/features/auth/context/AuthContext';
import UsersProfileCard from '@/features/profile/components/ProfileCard';
import { useProfileContext } from '@/features/profile/context/ProfileContext';
import hamburgerStyles from '@/shared/components/ui/Hamburger.module.css';
import userStyles from '@/shared/styles/components/UserMenu.module.css';
import styles from '@/shared/styles/layout/Header.module.css';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HamburgerButton from '../../shared/components/ui/HamburgerButton';
import MobileSearchOverlay from '../navigation/search/MobileSearchOverlay';
import Search from '../navigation/search/Search';
import DesktopMenu from './DesktopMenu';

interface HeaderTopProps{
  onMenuToggle: () => void;
  isOpen: boolean;
}

export default function HeaderTop({onMenuToggle, isOpen}: HeaderTopProps) {
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();
    const { user, logout } = useAuth();
    const userId = user?.userId;
    console.log("HeaderTop render userId:", userId);
    const resolvedUserId = userId ?? undefined;
    console.log("HeaderTop resolvedUserId:", resolvedUserId);

    const { profile, loading: profileLoading } = useProfileContext();
    console.log("HeaderTop profile hook return:", { profile, profileLoading });
    const [showProfileCard, setShowProfileCard] = useState(false);
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const initials = (() => {
        const name = profile?.firstName || profile?.fullName   || "";
        return name ? name.charAt(0).toUpperCase() : "U";
    })();

    let timeout: NodeJS.Timeout;

    const handleEnter = () => {
    clearTimeout(timeout);
    setShowProfileCard(true);
    };

    const handleLeave = () => {
    timeout = setTimeout(() => {
        setShowProfileCard(false);
    }, 200);
    };

    return (
        <header className={styles.headerTop}>
            <HamburgerButton
                isOpen={isOpen}
                onToggle={onMenuToggle}
                className={hamburgerStyles.hamburgerMobile}
            />

            <div className={styles.logo}>
                <h1>AXHER</h1>
            </div>

            <DesktopMenu />

            <div className={styles.headerRight}>
                <Search
                    className={styles.desktopSearch}
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Buscar películas o series..."
                />
                <MobileSearchOverlay
                    value={searchValue}
                    onChange={setSearchValue}
                />
                <div className={userStyles.userMenu}>
                    {userId ? (
                    <div
                        className={userStyles.userWrapper}
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                    >
                    <button
                        className={userStyles.userIcon}
                        aria-label="Menú de usuario"
                    >
                        {profileLoading ? (
                            <span className={userStyles.skeleton}/>
                        ) : profile?.profilePicture ? (
                            <Image
                            src={profile.profilePicture}
                            alt={profile.firstName || "Usuario"}
                            className={userStyles.avatarImg}
                            width={40}
                            height={40}
                            />
                        ) : (
                            <span className={userStyles.initials}>{initials}</span>
                        )}
                    </button>
                        {showProfileCard && profile && (
                        <div className={userStyles.profileCardWrapper}>
                            <UsersProfileCard
                            profile={profile}
                            isOwnProfile={true}
                            onViewProfile={() => router.push(`/profile/${profile.profileId}`)}
                            onEditProfile={() => router.push(`/userProfile/edit/${profile.profileId}`)}
                            onLogout={handleLogout}
                            />
                        </div>
                        )}
                    </div>
                    ) : (
                    <>
                        <button className={userStyles.userIcon} aria-label="Usuario invitado">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="28" fill="currentColor">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M2 20c0-3.313 3.134-6 7-6h6c3.866 0 7 2.687 7 6v1H2v-1z" />
                        </svg>
                        </button>
                        <div className={userStyles.dropdownContent}>
                            <a href="/login">Login</a>
                        </div>
                    </>
                    )}
                </div>
            </div>
                
        </header>
    );
    
};

