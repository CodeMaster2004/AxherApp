import { UserProfile } from "@/entities/types";
import styles from "@/shared/styles/shared/UsersProfileCard.module.css";
import { Languages, LifeBuoy, List, LogOut, SettingsIcon, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
    profile: UserProfile;
    onViewProfile?: () => void;
    onViewWatchlist?: () => void;
    onViewSupport?: () => void;
    onEditProfile?: () => void;
    onLanguage?: () => void;
    onLogout?: () => void;
    isOwnProfile?: boolean;
  
}

export default function ProfileCard({ 
    profile,
    onViewProfile,
    onViewWatchlist,
    onViewSupport,
    onEditProfile,
    onLanguage,
    onLogout,
    isOwnProfile = false 
}: Props) {
    const t = useTranslations("profile");
    return (
        <div className={styles.profileCard}>
        <div className={styles.banner}>
            {profile.profileBannerUrl ? (
            <Image
                src={profile.profileBannerUrl}
                alt="Banner"
                fill
                priority
                sizes="250px"
                style={{ objectFit: "cover" }}
            />
            ) : (
            <div className={styles.defaultBanner}></div>
            )}
        </div>
        <div className={styles.avatar}>
            {profile.profilePicture ? (
            <Image
                src={profile.profilePicture}
                alt="Avatar"
                width={90}
                height={90}
                loading="eager"
            />
            ) : (
            <div className={styles.avatar}></div>
            )}
        </div>
        <div className={styles.info}>
            <div className={styles.name}>{profile.displayName || profile.username}</div>
            <div className={styles.username}>@{profile.username}</div>
            <div className={styles.bio}>{profile.bio || t("bioEmpty")}</div>
        </div>
        <div className={styles.menu}>
        {onViewProfile && (
            <div className={styles.menuItem} onClick={onViewProfile}>
            <User size={16} />
            <span>{t("menu.viewProfile")}</span>
            </div>
        )}
        {isOwnProfile && onViewWatchlist && (
            <div className={styles.menuItem} onClick={onViewWatchlist}>
                <List size={16} />
                <span>{t("menu.watchlist")}</span>
            </div>
        )}

        {isOwnProfile && onViewSupport && (
            <div className={styles.menuItem} onClick={onViewSupport}>
                <LifeBuoy size={16} />
                <span>{t("menu.support")}</span>
            </div>
        )}

        {isOwnProfile && onEditProfile && (
            <div className={styles.menuItem} onClick={onEditProfile}>
            <SettingsIcon size={16} />
            <span>{t("menu.edit")}</span>
            </div>
        )}

        {isOwnProfile && onLanguage && (
            <div
                className={styles.menuItem}
                onClick={onLanguage}
            >
                <Languages size={16} />
                <span>{t("menu.language")}</span>
            </div>
        )}
        

        {onLogout && (
            <div className={`${styles.menuItem} ${styles.logout}`} onClick={onLogout}>
            <LogOut size={16} />
            <span>{t("menu.logout")}</span>
            </div>
        )}
        </div>
        </div>
    );
}

      
