import { RatingTargetType } from "@/entities/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useEffect, useState } from "react";
import { ratingsService } from "../services/ratingsService";
import { useRatingsActions } from "./useRatingsActions";


export function useContentRating(
    targetId: number,
    targetType: RatingTargetType
){

    const [rating, setRating] = useState(0);

    const { user, isAuthenticated } = useAuth();

    const { addRating } = useRatingsActions();



    useEffect(() => {

        if(!user || !isAuthenticated) return;


        ratingsService.getUserRating(
            user.userId,
            targetType,
            targetId
        )
        .then(data => {
            setRating(data.ratingValue);
        })
        .catch(() => {
            setRating(0);
        });


    }, [
        user,
        targetId,
        targetType
    ]);



    const rate = async(value:number) => {


        if(!user || !isAuthenticated){
            alert("Debes iniciar sesión");
            return;
        }


        setRating(value);


        await addRating({

            userId: user.userId,

            targetType,

            targetId,

            ratingValue:value,

            comment:""

        });

    };


    return {
        rating,
        rate
    };
}