import { resolveSupportedLocale } from "@/i18n/localeResolver";
import { Locale } from "next-intl";

export function getBrowserLanguageCode(): Locale | null {
    if (typeof navigator === "undefined") {
        return null;
    }

    const language = navigator.language?.trim();

    if (!language) {
        return null;
    }

    const languageCode = language
        .split("-")[0]
        .toLowerCase();

    return resolveSupportedLocale(languageCode);
}