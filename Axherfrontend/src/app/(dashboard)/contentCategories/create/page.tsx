"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ContentCategoriesForm from "@/features/contentCategories/components/ContentCategoriesForm";
import { useContentCategoriesActions } from "@/features/contentCategories/hooks";

export default function CreateContentCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { addContentCategory, saving } = useContentCategoriesActions({
    onSuccess: () => router.push("/contentCategories"),
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameTrim = name.trim();
    const descriptionTrim = description.trim();
    
    if (!nameTrim || !descriptionTrim) {
      alert("Por favor completa todos los campos");
      return;
    }

    await addContentCategory({
      name: nameTrim, description: descriptionTrim,
      
    });
  };

  const handleCancel = () => {
    router.push("/contentCategories");
  };

  return (
    <div className={layoutStyles.pageContainer}>
      <h1>Crear Nueva Categoría</h1>
      
      <ContentCategoriesForm
        contentCategories={name}
        description={description}
        setContentCategories={setName}
        setDescription={setDescription}
        onSubmit={handleSubmit}
        isEditing={false}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}
