import CategoriasPageClient from "../../../features/contentCategories/view/ContentCategoriesListView";

   // Usa tags para permitir revalidación on-demand (revalidateTag('categories'))

export default async function ContentCategoriesPage() {
  return <CategoriasPageClient  />;
}