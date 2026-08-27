import { Locale, locales } from "./config";

const supportedLocales = new Set<string>(locales);

export function isSupportedLocale(
    value: string | null | undefined
): value is Locale {
    return (
        value != null &&
        supportedLocales.has(value)
    );
}

export function resolveSupportedLocale(
    value: string | null | undefined
): Locale | null {
    return isSupportedLocale(value)
        ? value
        : null;
}
