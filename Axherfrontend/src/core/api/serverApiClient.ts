import { cookies } from "next/headers";
import { API_URL } from "./axiosClient";

const LANGUAGE_COOKIE_KEY = "app_language";

export async function serverApiFetch<T>(
    path: string,
    options?: RequestInit
): Promise<T> {

    const cookieStore = await cookies();

    const language =
        cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;

    const headers = new Headers(options?.headers);

    if (language) {
        headers.set("Accept-Language", language);
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    return response.json();
}