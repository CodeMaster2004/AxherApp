"use client";

import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import DiscountsFrom from "@/features/discounts/components/DiscountsForm";
import { useRouter } from "next/navigation";
import { useDiscountsActions } from "@/features/discounts/hooks";
import { useTranslations } from "next-intl";

export default function CreateDiscountPage(){
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0]; // "2026-02-05"
    const t = useTranslations("discounts");
    const [discountType, setDisocuntType] = useState("");
     const [amount, setAmount] = useState<number>(0);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [description, setDescription] = useState("");

    const { addDiscounts, saving } = useDiscountsActions({
        onSuccess: () => router.push("/admin/discounts"),
    });
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const discountTypeTrim = discountType.trim();
        const startDateTrim = startDate.trim();
        const endDateTrim = endDate.trim();
        const descriptionTrim = description.trim();

        if(!discountTypeTrim){
            alert(t("form.validation.discountTypeRequired"));
            return;
        }

        if (amount <= 0 || Number.isNaN(amount)) {
            alert(t("form.validation.amountInvalid"));
            return;
        }

        if(!startDateTrim || !endDateTrim){
            alert(t("form.validation.datesRequired"));
            return;
        }

        if(new Date(startDateTrim) > new Date(endDateTrim)){
            alert(t("form.validation.startDateAfterEndDate"));
            return;
        }

        await addDiscounts({
            discountType: discountTypeTrim,
            amount,
            startDate,
            endDate,
            description: descriptionTrim,
        });
    };

    const handleCancel = () => {
        router.push("/admin/discounts");
    };

    return(
        <div className={layoutStyles.pageContainer}>
            <h1>{t("createTitle")}</h1>

            <DiscountsFrom
                discountType={discountType}
                setDiscountType={setDisocuntType}
                amount={Number(amount)}
                 setAmount={setAmount} 
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving}

            />


        </div>
    )
}
