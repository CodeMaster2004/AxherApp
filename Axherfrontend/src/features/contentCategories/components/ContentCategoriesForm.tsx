"use client";

import formStyles from "@/shared/styles/shared/Form.module.css";
import Input from '@/shared/components/ui/Input';
import TextArea from '@/shared/components/ui/TextArea';
import Button from '@/shared/components/ui/Button';

interface Props {
  contentCategories: string;
  description: string;
  setContentCategories: (value: string) => void;
  setDescription: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  onCancel?: () => void;
  saving?: boolean;
}

export default function ContentCategoriesForm({
  contentCategories,
  description,
  setContentCategories,
  setDescription,
  onSubmit,
  isEditing,
  onCancel,
  saving = false,
}: Props) {
  return (
    <form onSubmit={onSubmit} className={formStyles.form}>
      <h2>{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</h2>
      
      <Input 
        label="Nombre de la Categoría"
        value={contentCategories}
        onChange={setContentCategories}
        placeholder="Ej: Acción, Drama, Comedia"
        required
        disabled={saving}
        autoFocus={!isEditing}
      />
      
      <TextArea 
        label="Descripción"
        value={description}
        onChange={setDescription}
        placeholder="Descripción de la categoría"
        rows={4}
        required
        disabled={saving}
      />

      <div className={formStyles.formActions}>
        <Button 
          type="submit" 
          variant="animated" 
          loading={saving} 
          loadingText={isEditing ? 'Actualizando...' : 'Creando...'}
        >
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
