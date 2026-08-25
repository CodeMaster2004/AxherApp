"use client";

import LanguageForm from "@/features/language/components/LanguageForm";
import { useLanguageActions } from "@/features/language/hooks/useLanguageActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";

export default function CreateLanguagePage() {

    const router = useRouter();
    const t = useTranslations("language");

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [nativeName, setNativeName] = useState("");
    const [active, setActive] = useState(true);
    const [error, setError] = useState("");

    const {
        addLanguage,
        saving
    } = useLanguageActions({
        onSuccess: () => router.push("/admin/languages"),
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const codeTrim = code.trim();
        const nameTrim = name.trim();
        const nativeNameTrim = nativeName.trim();

        if (!codeTrim) {
            setError(t("validation.codeRequired"));
            return;
        }

        if (!nameTrim) {
            setError(t("validation.nameRequired"));
            return;
        }

        if (!nativeNameTrim) {
            setError(t("validation.nativeNameRequired"));
            return;
        }

        setError("");

        await addLanguage({
            code: codeTrim,
            name: nameTrim,
            nativeName: nativeNameTrim,
            active
        });
    };

    const handleCancel = () => {
        router.push("/admin/languages");
    };

    const handleCodeChange = (value: string) => {
        setCode(value);

        if (error) {
            setError("");
        }
    };

    return (
        <div className={layoutStyles.pageContainer}>

            <h1>{t("createPageTitle")}</h1>

            <LanguageForm
                code={code}
                setCode={handleCodeChange}

                name={name}
                setName={setName}

                nativeName={nativeName}
                setNativeName={setNativeName}

                active={active}
                setActive={setActive}

                onSubmit={handleSubmit}
                isEditing={false}
                onCancel={handleCancel}
                saving={saving}
                error={error}
            />

        </div>
    );
}
