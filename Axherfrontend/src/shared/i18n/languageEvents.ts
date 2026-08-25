export const LANGUAGE_CHANGED_EVENT = "app:language-changed";

export function emitLanguageChanged(languageCode: string) {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(LANGUAGE_CHANGED_EVENT, {
            detail: {
                languageCode,
            },
        })
    );
}