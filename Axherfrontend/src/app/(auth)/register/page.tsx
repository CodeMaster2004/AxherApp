"use client";

import styles from "@/features/auth/components/AuthCard.module.css";
import UserRegisterForm from "@/features/auth/components/RegisterForm";
import { useUsersActions } from "@/features/users/hooks";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register, loading, error } = useUsersActions();
  const router = useRouter();

  const handleRegister = async (email: string, pwd: string, confirm: string) => {
        const response = await register({ email, password: pwd, confirmPassword: confirm });
        // Si el registro fue exitoso, redirige a la página de confirmación
        // Puedes validar el response si lo necesitas
        //setUserId(response?.userId ?? null);
        
        if(response?.email){
          router.push(`/confirm?email=${encodeURIComponent(response.email)}`);
        }
  };

  return (
    
    <div className={styles.authContainer}>
      
        <UserRegisterForm
            onSubmit={handleRegister}
            saving={loading}  // <- ahora sí pasa saving para deshabilitar inputs
            error={error}
        />
    </div>
  );
}