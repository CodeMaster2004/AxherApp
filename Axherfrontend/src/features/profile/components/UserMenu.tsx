"use client";

import Image from "next/image";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useProfileContext } from "@/features/profile/context/ProfileContext";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./UserMenu.module.css"
import ProfileCard from "@/features/profile/components/ProfileCard";

export default function UserMenu() {

    const router = useRouter();

    const {user, logout} = useAuth();
    const {profile, loading: profileLoading} = useProfileContext();

    const [showProfileCard, setShowProfileCard] = useState(false);
    const userId = user?.userId;
    const [showLogin,setShowLogin]=useState(false);
    const initials = (() => {
        const name =
            profile?.firstName ||
            profile?.fullName ||
            "";
        return name
            ?name.charAt(0).toUpperCase()
            :"U";
    })();

    const handleLogout = () => {

        logout();
        router.push('/');
    }

    const timeout = useRef<NodeJS.Timeout | null>(null);


    const handleEnter = () => {
        if(timeout.current)
            clearTimeout(timeout.current);

        setShowProfileCard(true);
    };


    const handleLeave = () => {

        timeout.current = setTimeout(() => {
            setShowProfileCard(false);
        },200);

    };

    const loginTimeout = useRef<NodeJS.Timeout | null>(null);


    const handleLoginEnter = () => {

        if(loginTimeout.current)
            clearTimeout(loginTimeout.current);

        setShowLogin(true);

    };


    const handleLoginLeave = () => {

        loginTimeout.current = setTimeout(() => {
            setShowLogin(false);
        },200);

    };

    return (

        <div className={styles.userMenu}>
            {
                userId ? (
                    <div
                        className={styles.userWrapper}
                        onMouseEnter={handleEnter}
                        onMouseLeave={handleLeave}
                    >
                        <button
                            className={styles.userIcon}
                            aria-label="Usuario"
                        >
                            {
                                profileLoading ? (
                                    <span className={styles.skeleton}/>
                                )
                                : 
                                profile?.profilePicture ? (
                                    <Image
                                        src={profile.profilePicture}
                                        alt={
                                            profile.firstName ??
                                            "Usuario"
                                        }
                                        width={40}
                                        height={40}
                                        className={styles.avatarImg}
                                    />
                                )
                                :
                                (
                                    <span className={styles.initials}>
                                        {initials}
                                    </span>
                                )
                            }
                        </button>
                        {
                            showProfileCard && profile && (
                                <div className={styles.profileCardWrapper}>
                                    <ProfileCard
                                        profile={profile}
                                        isOwnProfile={true}
                                        onViewProfile={() =>{
                                            router.push(
                                                `/profile/${profile.profileId}`
                                            )
                                        }}
                                        onViewWatchlist={() => {
                                            router.push("/mi-lista");
                                        }}
                                        onEditProfile={() => {
                                            router.push(
                                                `/userProfile/edit/${profile.profileId}`
                                            )
                                        }}
                                        onLogout={handleLogout}
                                        
                                    />
                                </div>
                            )
                        }
                        
                    </div>
                )
                : (
                    <div 
                        className={styles.guestWrapper}
                        onMouseEnter={handleLoginEnter}
                        onMouseLeave={handleLoginLeave}
                    >
                        <button className={styles.userIcon}>
                            <svg

                            xmlns="http://www.w3.org/2000/svg"

                            viewBox="0 0 24 24"

                            width="20"

                            height="28"

                            fill="currentColor"

                            >

                                <circle cx="12" cy="8" r="4"/>

                                <path d="
                                M2 20
                                c0-3.313
                                3.134-6
                                7-6h6
                                c3.866 0
                                7 2.687
                                7 6v1H2v-1z"/>

                            </svg>
                        </button>
                        <div
                            className={`${styles.dropdownContent} ${
                                showLogin ? styles.show : ""
                            }`}
                        >
                            <a href="/login">
                                Login
                            </a>
                        </div>
                    </div>
                )
            }
        </div>
    )
}