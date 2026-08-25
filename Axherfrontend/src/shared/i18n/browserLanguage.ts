export function getBrowserLanguageCode(): string | null {
    if (typeof navigator === "undefined") {
        return null;
    }

    const language = navigator.language?.trim();

    if (!language) {
        return null;
    }

    return language.split("-")[0].toLowerCase();
}