"use client";

import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";
import { usePermissionSocket } from "@/features/auth/hooks/usePermissionSocket";
import { ProfileProvider } from "@/features/profile/context/ProfileContext";
import Loader from "@/shared/components/ui/Loader";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import SidebarLeft from "../navigation/AppSidebar";
import HeaderTop from "./HeaderTop";
import { LanguageProvider } from "@/features/language/context/LanguageContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Componente interno que usa useAuth
function LayoutContent({ children }: { children: React.ReactNode }) {
    const { loading, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    usePermissionSocket(user?.userId ?? 0);
    if (loading) return <Loader />; // Loader mientras carga la sesión
    
    return (
        <>
            <HeaderTop onMenuToggle={toggleSidebar} isOpen={isSidebarOpen} />
            <SidebarLeft isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div>{children}</div>
        </>
    );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider> {/* Primero el provider */}
                <LanguageProvider>
                    <ProfileProvider>
                        <ProtectedRoute>
                            <LayoutContent>{children}</LayoutContent>
                        </ProtectedRoute>
                    </ProfileProvider>
                </LanguageProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}