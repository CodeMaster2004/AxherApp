"use client";

import { Discounts } from "@/entities/types";
import DiscountsForm from "@/features/discounts/components/DiscountsForm";
import { useDiscountsActions } from "@/features/discounts/hooks";
import { discountsService } from "@/features/discounts/services/DiscountsService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditDisocuntsPage(){
    const router = useRouter();
    const params = useParams();
    const id = params?.id ? Number(params.id) : null;
    const common = useTranslations("common");
    const t = useTranslations("discounts");
    const [discountType, setDiscountType] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [startDate, setStartDate] = useState(""); // "YYYY-MM-DD"
    const [endDate, setEndDate] = useState("");     // "YYYY-MM-DD"
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    const { editDiscounts, saving } = useDiscountsActions({
        onSuccess: () => router.push("/admin/discounts"),
    });

    useEffect(() => {
        if(!id){
            router.push("/admin/discounts");
            return;
        }

        const loadDiscount = async () => {
            try{
                const discount: Discounts = await discountsService.getById(id);
                setDiscountType(discount.discountType);
                setAmount(discount.amount);
                // startDate ya viene como string "YYYY-MM-DD" del backend
                setStartDate(discount.startDate);
                setEndDate(discount.endDate);
                setDescription(discount.description);
            }catch(error){
                alert(t("error.load"));
                router.push("/admin/discounts");
            }finally{
                setLoading(false);
            }
        };

        loadDiscount();

    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!id) return;

        const discountTypeTrim = discountType.trim();
        const descriptionTrim = description.trim();

        if(!discountTypeTrim){
            alert(t("form.validation.discountTypeRequired"));
            return;
        }

        if(amount <= 0){
            alert(t("form.validation.amountInvalid"));
            return;
        }

        if(startDate > endDate){
            // Comparar strings "YYYY-MM-DD" funciona correctamente
            alert(t("form.validation.startDateAfterEndDate"));
            return;
        }

        await editDiscounts(id, {
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

    if(loading){
        return <div className={layoutStyles.loading}>{common("loading")}...</div>
    }

    return(
        <div className={layoutStyles.pageContainer}>
            <h1>{t("editTitle")}</h1>

            <DiscountsForm
                discountType={discountType}
                setDiscountType={setDiscountType}
                amount={amount}
                setAmount={setAmount}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                description={description}
                setDescription={setDescription}
                onSubmit={handleSubmit}
                isEditing={true}
                onCancel={handleCancel}
                saving={saving}
            
            />

        </div>
    )

    
}