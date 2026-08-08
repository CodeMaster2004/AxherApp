"use client";

import { ContentCategories } from "@/entities/types";
import ContentCategoriesForm from "@/features/contentCategories/components/ContentCategoriesForm";
import { useContentCategoriesActions } from "@/features/contentCategories/hooks";
import { contentCategoriesService } from "@/features/contentCategories/services/ContentCategoriesService";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditContentCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  

  const {editContentCategory, saving} = useContentCategoriesActions({
    onSuccess: () => router.push("/contentCategories"),
  });

  useEffect(() => {
    if (!id) {
      router.push("/contentCategories");
      return;
    }

    const loadCategory = async () => {
      try {
        const category: ContentCategories = await contentCategoriesService.getById(id);
        setName(category.name);
        setDescription(category.description);
      } catch (error) {
        console.error("Error cargando categoría:", error);
        alert("Error al cargar la categoría");
        router.push("/contentCategories");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    const nameTrim = name.trim();
    const descriptionTrim = description.trim();
    
    if (!nameTrim || !descriptionTrim ) {
      alert("Por favor completa todos los campos");
      return;
    }

    console.log({
    name: nameTrim,
    description: descriptionTrim
});
    await editContentCategory(id, { name: nameTrim, description: descriptionTrim});
  };

  const handleCancel = () => {
    router.push("/contentCategories");
  };

  if (loading) {
    return <div className={layoutStyles.loading}>Cargando categoría...</div>;
  }

  return (
    <div className={layoutStyles.pageContainer}>
      <h1>Editar Categoría</h1>
      
      <ContentCategoriesForm
        contentCategories={name}
        description={description}
        setContentCategories={setName}
        setDescription={setDescription}
        onSubmit={handleSubmit}
        isEditing={true}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}
