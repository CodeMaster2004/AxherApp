"use client";

import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import DiscountsFrom from "@/features/discounts/components/DiscountsForm";
import { useRouter } from "next/navigation";
import { useDiscountsActions } from "@/features/discounts/hooks";

export default function CreateDiscountPage(){
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0]; // "2026-02-05"
    
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
            alert("Por favor completa el campo de tipo de descuento");
            return;
        }

        if (amount <= 0 || Number.isNaN(amount)) {
            alert("Monto inválido");
            return;
        }

        if(!startDateTrim || !endDateTrim){
            alert("Completa ambas fechas");
            return;
        }

        if(new Date(startDateTrim) > new Date(endDateTrim)){
            alert("La fecha de inicio no puede ser mayor que la fecha de fin");
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
            <h1>Crear nuevo descuento</h1>

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
