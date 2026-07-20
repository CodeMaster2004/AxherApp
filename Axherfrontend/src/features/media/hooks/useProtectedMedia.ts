"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";


export function useProtectedMedia(){

    const { user } = useAuth();

    const router = useRouter();


    const requireAuth = (
        action: () => void
    ) => {


        if(!user){

            router.push("/login");

            return;

        }


        action();

    };


    return {
        requireAuth
    };

}