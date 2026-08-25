import { defaultLocale, Locale, locales } from "@/i18n/config";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const LANGUAGE_COOKIE_KEY = "app_language";

export default getRequestConfig(async () => {

    const cookieStore = await cookies();

    const cookieLocale = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;

    const locale = locales.includes(cookieLocale as Locale)
        ? (cookieLocale as Locale)
        : defaultLocale;

        return {
            locale,
            messages: (
                await import(`../messages/${locale}.json`)
            ).default,
        };
});