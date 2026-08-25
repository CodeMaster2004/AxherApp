"use client";

import { LanguageResponse } from "@/entities/types";
import { useLanguageActions } from "@/features/language/hooks/useLanguageActions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import LanguageForm from "@/features/language/components/LanguageForm";
import { languageService } from "@/features/language/services/languageService";
import { useTranslations } from "next-intl";

export default function EditLanguagePage() {

    const router = useRouter();
    const params = useParams();
    const t = useTranslations("language");

    const id = params?.id ? Number(params.id) : null;

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [nativeName, setNativeName] = useState("");
    const [active, setActive] = useState(true);

    const [loading, setLoading] = useState(true);

    const {
        editLanguage,
        saving
    } = useLanguageActions({
        onSuccess: () => router.push("/admin/languages"),
    });

    useEffect(() => {

        if (!id) {
            router.push("/admin/languages");
            return;
        }

        const loadLanguage = async () => {

            try {

                const language: LanguageResponse =
                    await languageService.getById(id);

                setCode(language.code);
                setName(language.name);
                setNativeName(language.nativeName);
                setActive(language.active);

            } catch (error) {

                console.error("Error cargando idioma:", error);

                alert(t("errors.load"));

                router.push("/admin/languages");

            } finally {

                setLoading(false);

            }
        };

        loadLanguage();

    }, [id, router, t]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!id) return;

        const codeTrim = code.trim();
        const nameTrim = name.trim();
        const nativeNameTrim = nativeName.trim();

        if (!codeTrim) {
            alert(t("validation.codeRequired"));
            return;
        }

        if (!nameTrim) {
            alert(t("validation.nameRequired"));
            return;
        }

        if (!nativeNameTrim) {
            alert(t("validation.nativeNameRequired"));
            return;
        }

        await editLanguage(id, {
            code: codeTrim,
            name: nameTrim,
            nativeName: nativeNameTrim,
            active
        });
    };

    const handleCancel = () => {
        router.push("/admin/languages");
    };

    if (loading) {
        return (
            <div className={layoutStyles.loading}>
                {t("loading")}
            </div>
        );
    }

    return (
        <div className={layoutStyles.pageContainer}>

            <h1>{t("editPageTitle")}</h1>

            <LanguageForm
                code={code}
                setCode={setCode}

                name={name}
                setName={setName}

                nativeName={nativeName}
                setNativeName={setNativeName}

                active={active}
                setActive={setActive}

                onSubmit={handleSubmit}
                isEditing={true}
                onCancel={handleCancel}
                saving={saving}
            />

        </div>
    );
}
