import { usersService } from "@/features/users/services/UsersService";
import useSWR from "swr";

export const useCheckEmail = (email: string) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const { data, isLoading } = useSWR(
        isValidEmail ? ["check-email", email] : null,
        () => usersService.checkEmail(email),
        {
            dedupingInterval: 5000,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    return {
        exists: data ?? null,
        loading: isLoading
    };
};