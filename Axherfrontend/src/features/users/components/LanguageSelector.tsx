"use client";

import { LanguageResponse } from "@/entities/types";
import { X, Languages } from "lucide-react";
import styles from "./LanguageSelector.module.css";
import { useTranslations } from "next-intl";

interface Props {
    languages: LanguageResponse[];
    selectedLanguageId: number | null;
    loading?: boolean;
    saving?: boolean;
    onSelect: (languageId: number) => void;
    onSave: () => void;
    onClose: () => void;
}

export default function LanguageSelector({
    languages,
    selectedLanguageId,
    loading = false,
    saving = false,
    onSelect,
    onSave,
    onClose,
}: Props) {

    const t = useTranslations("common");


    return (
        <div className={styles.overlay} onClick={onClose}>

            <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
            >

                <div className={styles.header}>

                    <div className={styles.titleWrapper}>
                        <Languages size={20} />

                        <div>
                            <h2>Idioma</h2>
                            <p>
                                Selecciona el idioma de la aplicación
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>

                </div>

                <div className={styles.content}>

                    {loading ? (

                        <p className={styles.message}>
                            Cargando idiomas...
                        </p>

                    ) : languages.length === 0 ? (

                        <p className={styles.message}>
                            No hay idiomas disponibles.
                        </p>

                    ) : (

                        <div className={styles.languageList}>

                            {languages.map((language) => (

                                <button
                                    key={language.languageId}
                                    type="button"
                                    className={`${styles.languageItem} ${
                                        selectedLanguageId === language.languageId
                                            ? styles.selected
                                            : ""
                                    }`}
                                    onClick={() =>
                                        onSelect(language.languageId)
                                    }
                                    disabled={saving}
                                >

                                    <div className={styles.languageInfo}>

                                        <span className={styles.languageName}>
                                            {language.nativeName}
                                        </span>

                                        <span className={styles.languageCode}>
                                            {language.code.toUpperCase()}
                                        </span>

                                    </div>

                                    <span className={styles.radio}>
                                        {selectedLanguageId === language.languageId
                                            ? "✓"
                                            : ""}
                                    </span>

                                </button>

                            ))}

                        </div>
                    )}

                </div>

                <div className={styles.footer}>

                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={saving}
                    >
                        {t("cancel")}
                    </button>

                    <button
                        type="button"
                        className={styles.saveButton}
                        onClick={onSave}
                        disabled={
                            saving ||
                            selectedLanguageId === null
                        }
                    >
                        {saving ? "Guardando..." : t("save")}
                    </button>

                </div>

            </div>

        </div>
    );
}