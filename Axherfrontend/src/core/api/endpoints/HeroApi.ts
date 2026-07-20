import axiosClient from "@/core/api/axiosClient";
import { HeroContent } from "@/entities/types";

export const heroApi = {

    getHero: () => 
        axiosClient.get<HeroContent[]>(
            "/hero"
        )
}