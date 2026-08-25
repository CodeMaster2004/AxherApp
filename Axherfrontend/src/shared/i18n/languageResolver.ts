const LANGUAGE_COOKIE_KEY = "app_language";

export const languageResolver = {
    get(): string | null {
        if (typeof document === "undefined") {
            return null;
        }

        const cookies = document.cookie.split("; ");

        const cookie = cookies.find(
            (row) => row.startsWith(`${LANGUAGE_COOKIE_KEY}=`)
        );

        return cookie
            ? decodeURIComponent(cookie.split("=")[1])
            : null;
    },

    set(code: string | null) {
        if (typeof document === "undefined") {
            return;
        }

        if (code) {
            document.cookie =
                `${LANGUAGE_COOKIE_KEY}=${encodeURIComponent(code)}; ` +
                "path=/; " +
                "max-age=31536000; " +
                "SameSite=Lax";

            return;
        }

        this.clear();
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