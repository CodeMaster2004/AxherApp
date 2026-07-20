/**
 * EJEMPLOS DE USO DE SONNER (Sistema de Notificaciones)
 * 
 * Este archivo contiene ejemplos de cómo usar toast en diferentes escenarios.
 * NO es necesario importar este archivo, solo es una referencia.
 * 
 * Para usar en tus componentes:
 * import { toast } from 'sonner'
 */

import type { ContentCategories } from '@/entities/types'
import { contentCategoriesService } from '@/features/contentCategories/services/ContentCategoriesService'
import { getErrorMessage } from '@/shared/lib/errors/errorHandler'
import { toast } from 'sonner'

// ============================================
// EJEMPLO 1: Crear Categoría
// ============================================
export const ejemploCrearCategoria = async (data: Omit<ContentCategories, 'contentCategoryId'>) => {
  try {
    // Tu lógica existente
    await contentCategoriesService.create(data);
    
    // ✅ Mostrar mensaje de éxito
    toast.success('Categoría creada correctamente');
    
  } catch (error) {
    // ❌ Mostrar mensaje de error
    toast.error('No se pudo crear la categoría');
    console.error(error);
  }
}

// ============================================
// EJEMPLO 2: Eliminar Categoría
// ============================================
export const ejemploEliminarCategoria = async (id: number) => {
  try {
    await contentCategoriesService.delete(id);
    
    // ✅ Con acción de deshacer
    toast.success('Categoría eliminada', {
      action: {
        label: 'Deshacer',
        onClick: () => {
          // Lógica para restaurar
          console.log('Restaurando...');
        },
      },
    });
    
  } catch {
    toast.error('Error al eliminar la categoría');
  }
}

// ============================================
// EJEMPLO 3: Editar con Loading
// ============================================
// ============================================
// EJEMPLO 3: Actualizar con promesa
// ============================================
export const ejemploActualizarCategoria = async (
  id: number, 
  data: Partial<ContentCategories>
) => {
  // ⏳ Mostrar loading mientras se procesa
  const loadingToast = toast.loading('Guardando cambios...');
  
  try {
    await contentCategoriesService.update(id, data);
    
    // ✅ Reemplazar loading con éxito
    toast.success('Categoría actualizada', {
      id: loadingToast,
    });
    
  } catch {
    // ❌ Reemplazar loading con error
    toast.error('No se pudo actualizar', {
      id: loadingToast,
    });
  }
}

// ============================================
// EJEMPLO 4: Diferentes Tipos de Toast
// ============================================
export const ejemplosTiposDeToast = () => {
  // Éxito
  toast.success('Operación exitosa');
  
  // Error
  toast.error('Algo salió mal');
  
  // Info
  toast.info('Información importante');
  
  // Advertencia
  toast.warning('Ten cuidado');
  
  // Loading
  toast.loading('Procesando...');
  
  // Personalizado
  toast('Mensaje personalizado', {
    description: 'Descripción adicional',
    duration: 5000, // 5 segundos
  });
}

// ============================================
// EJEMPLO 5: Con manejo de errores
// ============================================
export const ejemploConManejoErrores = async () => {
  try {
    // Crear con datos incorrectos para provocar error
    await contentCategoriesService.create({ 
      name: 'Test',
      description: 'Test categoria' 
    });
    toast.success('Operación exitosa');
  } catch {
    toast.error('Algo salió mal', {
      description: 'Por favor intenta nuevamente',
    });
  }
}

// ============================================
// EJEMPLO 6: Integración con Error Handler
// ============================================
export const ejemploConErrorHandler = async () => {
  try {
    await contentCategoriesService.create({
      name: 'Test',
      description: 'Test categoria'
    });
  } catch (error) {
    // Usa el error handler para obtener mensaje amigable
    const message = getErrorMessage(error);
    toast.error(message);
  }
}

// ============================================
// CÓMO USAR EN TUS COMPONENTES REALES
// ============================================

/*
// En CategoriasForm.tsx
import { toast } from 'sonner'

const handleSubmit = async (data) => {
  try {
    await addCategoria(data);
    toast.success('Categoría creada correctamente');
    resetForm();
  } catch (error) {
    toast.error('No se pudo crear la categoría');
  }
}

// En CategoriesList.tsx
import { toast } from 'sonner'

const handleDelete = async (id) => {
  try {
    await removeCategoria(id);
    toast.success('Categoría eliminada');
  } catch (error) {
    toast.error('Error al eliminar');
  }
}
*/
