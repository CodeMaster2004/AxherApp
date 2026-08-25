"use client";

import { ShelfTarget } from "@/entities/types";
import { PageSectionType, PageType } from "@/entities/types/pageSection.types";
import { useShelfOptions } from "@/features/shelf/hooks/useShelfOptions";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import Select from "@/shared/components/ui/Select";
import { pageSectionTypeOptions, pageTypeOptions } from "@/shared/constants/selectOptions";
import styles from "@/shared/styles/shared/Form.module.css"
import { useTranslations } from "next-intl";


interface Props {
    page: PageType | undefined;
    type: PageSectionType | undefined;
    displayOrder: number | null;
    active: boolean;
    contentShelfId?: number;

    setPage: (value: PageType) => void;
    setType: (value: PageSectionType) => void;
    setDisplayOrder: (value: number | null) => void;
    setActive: (value: boolean) => void;
    setContentShelfId: (value: number | undefined) => void;

    onSubmit: (
        e: React.FormEvent<HTMLFormElement>
    ) => void;

    isEditing?: boolean;
    saving?: boolean;
    error?: string;

    onCancel?: () => void;
}

export default function PageSectionForm({
    page,
    type,
    displayOrder,
    active,
    contentShelfId,

    setPage,
    setType,
    setDisplayOrder,
    setActive,
    setContentShelfId,

    onSubmit,
    
    isEditing = false,
    saving = false,
    error,

    onCancel
}: Props){

    const common = useTranslations("common");
    const t = useTranslations("pageSections");
    
    const shelfTarget = page as ShelfTarget;

    const {
        options: shelfOptions,
        loading: loadingShelves,
        error: shelfError
    } = useShelfOptions(
        page as ShelfTarget | undefined
    );

    return (

        <form className={styles.form} onSubmit={onSubmit}>

            {error && (
                <p className={styles.errorMessage}>{error}</p>
            )}

            <Select
                label={t("form.page")}
                value={page}
                onChange={(value) =>
                    setPage(value as PageType)
                }
                options={pageTypeOptions}
                disabled={saving}
            />

            <Select
                label={t("form.type")}
                value={type}
                onChange={(value) =>
                    setType(value as PageSectionType)
                }
                options={pageSectionTypeOptions}
                disabled={saving}
            />

            <Input
                label={t("form.displayOrder")}
                type="number"
                value={displayOrder?.toString() ?? ""}
                onChange={(value) =>
                    setDisplayOrder(Number(value))
                }
                min={1}
                disabled={saving}
            />

            {type === "SHELF" && (
                <Select
                    label={t("form.shelf")}
                    value={contentShelfId?.toString() ?? ""}
                    onChange={(value) => {

                        if (value === "") {
                            setContentShelfId(undefined);
                            return;
                        }

                        setContentShelfId(Number(value));
                    }}
                    options={shelfOptions.map((shelf) => ({
                        value: shelf.contentShelfId.toString(),
                        label: shelf.name
                    }))}
                    disabled={
                        saving ||
                        loadingShelves ||
                        !page
                    }
                />
            )}

            <div className={styles.switchField}>

                <span>{common("active")}</span>

                <BubbleToggle
                    checked={active}
                    onChange={() =>
                        setActive(!active)
                    }
                    disabled={saving}
                />
            </div>
            <div>
                <Button
                    type="submit"
                    variant="animated"
                    disabled={saving}
                    loadingText={
                        isEditing ? common("updating") : common("creating")
                    }
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
    )

}