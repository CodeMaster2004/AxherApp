"use client";

import { ContentPersonRoleResponse } from "@/entities/types";
import styles from "./PersonCreditCard.module.css";
import Image from "next/image";

interface Props {
    credit: ContentPersonRoleResponse;
}

export default function PersonCreditCard({ credit }: Props) {

   return (

    <article className={styles.card}>

        <div className={styles.photoWrapper}>
            {credit.personPhoto ? (

                <Image
                    src={credit.personPhoto}
                    alt={credit.personName}
                    fill
                    className={styles.photo}
                    sizes="120px"
                />
            ) : (
                <div className={styles.placeholder}>
                    <span>
                        {credit.personName.charAt(0).toUpperCase()}
                    </span>
                </div>
            )}
        </div>

        <div className={styles.info}>
            <h3 className={styles.name}> 
                {credit.personName}
            </h3>
            <span className={styles.role}>
                {credit.cinematicRoleName}
            </span>
            {credit.characterName && (
                <span className={styles.character}>
                    {credit.characterName}
                </span>
            )}
        </div>

    </article>
   )

}