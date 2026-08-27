import { UserProfile } from "@/entities/types";
import styles from "@/shared/styles/shared/UserProfile.module.css";
import {
    Calendar,
    Camera,
    Eye,
    Link,
    MapPin,
    Mars,
    SettingsIcon,
    User,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { Area } from "react-easy-crop";
import { getCroppedImg } from "../../../shared/utils/getCroppedImg";
import ImageCropModal from "../../../shared/components/ui/ImageCropModal";
import { useTranslations } from "next-intl";

interface Props {
    profile: UserProfile;
    onEditProfile?: () => void;
    onLogout?: () => void;
    onProfilePictureChange?: (file: File) => void;
    onBannerChange?: (file: File) => void; // 🔥 NUEVO
    isOwnProfile?: boolean;
}

export default function Profile({
    profile,
    onEditProfile,
    onProfilePictureChange,
    onBannerChange,
    isOwnProfile = false,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
    const [, setRawFile] = useState<File | null>(null);
    const [type, setType] = useState<"profile" | "banner" | null>(null);
    const t = useTranslations("profile");
    const handleFileClick = (type: "profile" | "banner") => {
    setType(type);

        if (fileInputRef.current) {
            fileInputRef.current.value = ""; //  RESET CLAVE
            fileInputRef.current.click();
        }
    };
    

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);

            setRawFile(file);

            if (type === "profile") {
                setSelectedImage(imageUrl);
            } else if (type === "banner") {
                setSelectedBanner(imageUrl);
            }
        }
    };

    return (
        <div className={styles.userProfileCard}>
        {/* 🔥 INPUT GLOBAL reutilizado */}
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
        />

        {/* 🖼 BANNER */}
        <div className={styles.banner}>
            <Image
                src={profile.profileBannerUrl || "/default/banner.png"}
                alt="Banner"
                width={900}
                height={220}
                loading="eager"
                className={styles.bannerImg}
            />

            {isOwnProfile && (
            <button
                className={styles.cameraButton}
                onClick={() => handleFileClick("banner")}
            >
                <Camera size={18} />
            </button>
            )}
        </div>

        {/* 👤 FOTO PERFIL */}
        <div className={styles.profilePicture}>
            <Image
                src={profile.profilePicture || "/default/profile.png"}
                alt={t("pictureAlt")}
                width={120}
                height={120}
                loading="eager"
                className={styles.profileImg}
            />

            {isOwnProfile && (
                <button
                    type="button"
                    className={styles.cameraButton}
                    onClick={() => handleFileClick("profile")}
                >
                    <Camera size={18} />
                </button>
            )}
        </div>

        {/*  CONTENIDO */}
        <div className={styles.profileContent}>
            <div className={styles.userHeader}>
            <div>
                <h2>{profile.displayName || profile.username}</h2>
                <span className={styles.username}>@{profile.username}</span>
            </div>

            {isOwnProfile && onEditProfile && (
                <button className={styles.editBtn} onClick={onEditProfile}>
                <SettingsIcon size={16} /> {t("editTitle")}
                </button>
            )}
            </div>

            <div className={styles.bio}>{profile.bio || t("bioEmpty")}</div>

            <div className={styles.profileDetails}>
                <span>
                    <User size={16} /> {profile.firstName} {profile.lastName}
                </span>
                <span>
                    <Calendar size={16} /> {profile.birthDate}
                </span>
                <span>
                    <Mars size={16} /> {profile.gender}
                </span>
                <span>
                    <MapPin size={16} /> {profile.location}
                </span>
                <span>
                    <Link size={16} />
                    <a href={profile.website} target="_blank">
                    {profile.website}
                    </a>
                </span>
                <span>
                    <Eye size={16} /> {profile.profileVisibility}
                </span>
            </div>
        </div>

        {/*  MODAL PERFIL */}
        {selectedImage && type === "profile" && (
            <ImageCropModal
                image={selectedImage}
                aspect={1}
                cropShape="round"
                onCancel={() => {
                    setSelectedImage(null);
                    setRawFile(null);
                    setType(null);
                }}
                onSave={async (area: Area) => {
                    const blob = await getCroppedImg(selectedImage, area);

                    const file = new File([blob], "profile.jpg", {
                        type: "image/jpeg",
                    });

                    onProfilePictureChange?.(file);

                    setSelectedImage(null);
                    setRawFile(null);
                    setType(null);
                }}
            />
        )}

        {/*  MODAL BANNER */}
        {selectedBanner && type === "banner" && (
            <ImageCropModal
                image={selectedBanner}
                aspect={16 / 5}
                cropShape="rect"
                onCancel={() => {
                    setSelectedBanner(null);
                    setRawFile(null);
                    setType(null);
                }}
                onSave={async (area: Area) => {
                    const blob = await getCroppedImg(selectedBanner, area);

                    const file = new File([blob], "banner.jpg", {
                        type: "image/jpeg",
                    });

                    onBannerChange?.(file);

                    setSelectedBanner(null);
                    setRawFile(null);
                    setType(null);
                }}
            />
        )}
        </div>
    );
}