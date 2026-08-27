"use client";

import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from "../../../shared/components/ui/Input";
import TextArea from "../../../shared/components/ui/TextArea";
import Button from "../../../shared/components/ui/Button";
import { useTranslations } from "next-intl";

interface Props{
    discountType: string;
    amount: number;
    startDate: string; // formato "YYYY-MM-DD"
    endDate: string;   // formato "YYYY-MM-DD"
    description: string,

    setDiscountType: (value: string) => void;
    setAmount: (value: number) => void;
    setStartDate: (value: string) => void;
    setEndDate: (value: string) => void;
    setDescription: (value: string) => void;

    onSubmit: (e: React.FormEvent) => void;
    isEditing: boolean;
    onCancel?: () => void;
    saving?: boolean;
}

export default function DiscountsForm({
    discountType,
    amount,
    startDate,
    endDate,
    description,
    setDiscountType,
    setAmount,
    setStartDate,
    setEndDate,
    setDescription,
    onSubmit,
    isEditing,
    onCancel,
    saving = false,
}: Props) {
    const common = useTranslations("common");
    const t = useTranslations("discounts");
    
    return(
        <form onSubmit={onSubmit} className={formStyles.form}>

            <Input
                label={t("form.discountTypeLabel")}
                value={discountType}
                onChange={setDiscountType}
                placeholder={t("form.discountTypePlaceholder")}
                required
                disabled={saving}
                autoFocus={!isEditing}
            />

            <Input
                label={t("form.amountLabel")}
                type="number"
                value={String(amount)}
                onChange={(val) => setAmount(val === "" ? 0 : Math.min(100, Math.max(0, Number(val))))}
                required
                disabled={saving}
                min={0}
                max={100}
            />

            <Input
                label={t("form.startDateLabel")}
                type="date"
                value={startDate}
                onChange={setStartDate}
                required
                disabled={saving}
            />

            <Input
                label={t("form.endDateLabel")}
                type="date"
                value={endDate}
                onChange={setEndDate}
                required
                disabled={saving}
            />

            <TextArea
                label={t("form.descriptionLabel")}
                value={description}
                onChange={setDescription}
                placeholder={t("form.descriptionPlaceholder")}
                rows={4}
                required
                disabled={saving}
            />

            <div className={formStyles.formActions}>
                <Button
                    type="submit"
                    variant="animated"
                    disabled={saving}
                    loadingText={isEditing ? common("updating") : common("creating")}
                >
                    {isEditing ? common("update") : common("create")}
                </Button>

                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        {common("cancel")}

                    </Button>
                )}

            </div>

        </form>

    );
}