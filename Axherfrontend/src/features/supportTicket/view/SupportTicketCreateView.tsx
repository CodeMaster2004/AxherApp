"use client";

import SupportTicketForm from "@/features/supportTicket/components/SupportTicketForm";
import { useSupportTicketActions } from "@/features/supportTicket/hooks/useSupportTicketActions";
import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";

export default function SupportTicketCreateView() {

    const router = useRouter();

    const [subject, setSubject] = useState("");
    const [supportCategoryId, setSupportCategoryId] =
        useState<number | "">("");
    const [description, setDescription] = useState("");
    const t = useTranslations("supportTickets");
    const [error, setError] = useState("");

    const {
        supportCategory: categories,
        loading: categoriesLoading,
    } = useSupportCategory();

    const {
        createTicket,
        saving,
        error: actionError,
    } = useSupportTicketActions({
        onSuccess: (ticket) => {
            router.push(`/soporte/tickets/${ticket?.supportTicketId}`);
        },
    });

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        const subjectTrim = subject.trim();
        const descriptionTrim = description.trim();

        if (!subjectTrim) {
            setError(t("form.validation.subjectRequired"));
            return;
        }

        if (!supportCategoryId) {
            setError(t("form.validation.categoryRequired"));
            return;
        }

        if (!descriptionTrim) {
            setError(t("form.validation.descriptionRequired"));
            return;
        }

        await createTicket({
            subject: subjectTrim,
            supportCategoryId,
            description: descriptionTrim,
        });
    };

    const handleCancel = () => {
        router.push("/soporte/tickets");
    };

    return (
        <div className={layoutStyles.pageContainer}>

            <h1>{t("form.title")}</h1>

            <SupportTicketForm
                subject={subject}
                setSubject={setSubject}

                supportCategoryId={supportCategoryId}
                setSupportCategoryId={setSupportCategoryId}

                description={description}
                setDescription={setDescription}

                categories={categories}

                onSubmit={handleSubmit}

                saving={saving || categoriesLoading}

                error={
                    error ||
                    (actionError instanceof Error
                        ? actionError.message
                        : undefined)
                }

                onCancel={handleCancel}
            />

        </div>
    );
}