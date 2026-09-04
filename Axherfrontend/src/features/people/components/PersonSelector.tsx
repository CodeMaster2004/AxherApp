"use client";

import { PersonResponse } from "@/entities/types";
import { personService } from "@/features/people/services/personService";
import { usePersonSelector } from "@/features/people/hooks/usePersonSelector";
import Input from "@/shared/components/ui/Input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./PersonSelector.module.css";
import { useTranslations } from "next-intl";

interface Props {
    value?: number | null;
    onChange: (id: number) => void;
}

export default function PersonSelector({
    value,
    onChange,
}: Props) {
    const {
        people,
        loading,
        searchPeople,
        clearPeople,
    } = usePersonSelector();

    const [selected, setSelected] = useState<PersonResponse | null>(null);
    const t = useTranslations("person");
    const common = useTranslations("common");

    const [search, setSearch] = useState("");

    const debouncedSearch =
        useDebounce(search, 500);

    useEffect(() => {
        const term = debouncedSearch.trim();

        if (!term) {
            clearPeople();
            return;
        }

        searchPeople(term);
    }, [
        debouncedSearch,
        clearPeople,
        searchPeople,
    ]);

    useEffect(() => {
        if (value == null) {
            setSelected(null);
            return;
        }

        let cancelled = false;

        personService
            .getById(value)
            .then((data) => {
                if (!cancelled) {
                    setSelected(data);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [value]);

    const handleSelect = (
        person: PersonResponse
    ) => {
        setSelected(person);
        onChange(person.personId);

        setSearch("");
        clearPeople();
    };

    return (
        <div className={styles.wrapper}>
            {selected && (
                <div className={styles.selected}>
                    <div className={styles.selectedPhoto}>
                        {selected.photo && (
                            <Image
                                src={selected.photo}
                                alt={`${selected.firstName} ${selected.lastName ?? ""}`}
                                width={55}
                                height={55}
                            />
                        )}
                    </div>

                    <div className={styles.selectedInfo}>
                        <span className={styles.selectedLabel}>
                            {t("selector.selected")}
                        </span>

                        <strong>
                            {selected.firstName}{" "}
                            {selected.lastName ?? ""}
                        </strong>
                    </div>
                </div>
            )}

            <div className={styles.searchBox}>
                <Input
                    label={common("search")}
                    value={search}
                    placeholder={t("list.searchPlaceholder")}
                    onChange={setSearch}
                />
            </div>

            {loading && (
                <div className={styles.loading}>
                    {t("list.loading")}
                </div>
            )}

            {people.length > 0 && (
                <div className={styles.results}>
                    {people.map((person) => (
                        <article
                            key={person.personId}
                            className={styles.resultItem}
                            onClick={() =>
                                handleSelect(person)
                            }
                        >
                            {person.photo && (
                                <Image
                                    src={person.photo}
                                    alt={`${person.firstName} ${person.lastName ?? ""}`}
                                    width={55}
                                    height={55}
                                    className={styles.photo}
                                />
                            )}

                            <div className={styles.info}>
                                <h3>
                                    {person.firstName}{" "}
                                    {person.lastName ?? ""}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {!loading &&
                debouncedSearch.trim() !== "" &&
                people.length === 0 && (
                    <div className={styles.empty}>
                         {t("list.empty")}
                    </div>
                )}
        </div>
    );
}