"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { getBrowserLanguageCode } from "@/shared/i18n/browserLanguage";
import { languageResolver } from "@/shared/i18n/languageResolver";
import { Locale } from "next-intl";
import { resolveSupportedLocale } from "@/i18n/localeResolver";

interface LanguageContextProps {
    languageCode: Locale | null;
    setLanguage: (language: string) => void;
    languageReady: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
    undefined
);

export function LanguageProvider({
    children,
}: {
    children: ReactNode;
}) {

    const { user, loading: authLoading } = useAuth();

    const [languageCode, setLanguageCodeState] = useState<string | null>(null);
    const [languageReady, setLanguageReady] = useState(false);

    useEffect(() => {

        if (authLoading) {
            return;
        }

        /*
         * 1. Usuario autenticado:
         * el idioma viene desde /auth/me.
         */
        if (user?.preferredLanguageCode) {

            const language = resolveSupportedLocale(user.preferredLanguageCode);

            if(language) {
                setLanguageCodeState(language);
                languageResolver.set(language);
                setLanguageReady(true);
            }
        
            console.log("🌐 Idioma del usuario:", language);

            return;
        }

        /*
         * 2. Usuario sin preferencia:
         * usamos el idioma detectado del navegador.
         */
        const browserLanguage = getBrowserLanguageCode();
        const supportedBrowserLanguage = 
            resolveSupportedLocale(browserLanguage);

        if (supportedBrowserLanguage) {

            setLanguageCodeState(supportedBrowserLanguage);
            languageResolver.set(supportedBrowserLanguage);
            setLanguageReady(true);

            console.log("🌐 Idioma del navegador:", browserLanguage);

            return;
        }

        /*
         * 3. No existe una preferencia ni idioma detectable.
         *
         * No inventamos un idioma aquí.
         * El backend podrá aplicar su configuración/default.
         */
        setLanguageCodeState(null);
        languageResolver.set(null);
        setLanguageReady(true);

        console.log("🌐 No se pudo determinar el idioma");

    }, [user, authLoading]);

    const setLanguage = (language: string) => {

        const supportedLanguage = resolveSupportedLocale(language);

        if (!supportedLanguage) {
            console.warn(
                `🌐 Idioma no soportado por el frontend: ${language}`
            );
            return;
        }

        setLanguageCodeState(supportedLanguage);
        languageResolver.set(supportedLanguage);

    };

    return (
        <LanguageContext.Provider
            value={{
                languageCode,
                setLanguage,
                languageReady,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {

    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage debe usarse dentro de LanguageProvider"
        );
    }

    return context;
}