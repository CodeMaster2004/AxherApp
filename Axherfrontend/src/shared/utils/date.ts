import { Locale } from "@/i18n/config";

export const formatDate = (
    date: string | Date | null | undefined,
    locale: string
) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

export const formatDateShort = (
    date: string | Date | null | undefined,
    locale: string
) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
    }).format(new Date(date));
};

export const formatTime = (
    date: string | Date | null | undefined,
    locale: string
) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(date));
};

export const formatYear = (
    date: string | Date | null | undefined,
    locale: string
) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
    }).format(new Date(date));
};

export type DateGroup = "today" | "yesterday" | "date";

const getLocalDate = (date: string | Date): Date => {
    const value = new Date(date);

    return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
    );
};

export const getDateGroup = (
    date: string | Date
): DateGroup => {
    const target = getLocalDate(date);
    const today = getLocalDate(new Date());

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (target.getTime() === today.getTime()) {
        return "today";
    }

    if (target.getTime() === yesterday.getTime()) {
        return "yesterday";
    }

    return "date";
};