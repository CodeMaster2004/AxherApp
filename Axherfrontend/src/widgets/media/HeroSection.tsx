"use client";

import { HeroContent } from "@/entities/types";
import HeroBanner from "@/widgets/media/HeroBanner";

type Props = {
    hero: HeroContent[];
}
export default function HeroSection({ hero }: Props) {

    return (
        <HeroBanner 
            contents={hero}
        />
    );
}