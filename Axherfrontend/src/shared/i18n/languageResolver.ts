import { resolveSupportedLocale } from "@/i18n/localeResolver";
import { Locale } from "next-intl";

const LANGUAGE_COOKIE_KEY = "app_language";

export const languageResolver = {
    get(): Locale | null {
        if (typeof document === "undefined") {
            return null;
        }

        const cookies = document.cookie.split("; ");

        const cookie = cookies.find(
            (row) => row.startsWith(`${LANGUAGE_COOKIE_KEY}=`)
        );

        if(!cookie) {
            return null;
        }

        const value = decodeURIComponent(
            cookie.split("=")[1]
        );

        return resolveSupportedLocale(value);
    },

    set(code: Locale | null) {
        if (typeof document === "undefined") {
            return;
        }

        if (!code) {
            this.clear();
            return;
        }

        document.cookie =
            `${LANGUAGE_COOKIE_KEY}=${encodeURIComponent(code)}; ` +
            "path=/; " +
            "max-age=31536000; " +
            "SameSite=Lax";

    },

    clear() {
        if (typeof document === "undefined") {
            return;
        }

        document.cookie =
            `${LANGUAGE_COOKIE_KEY}=; ` +
            "path=/; " +
            "max-age=0; " +
            "SameSite=Lax";
    },
};