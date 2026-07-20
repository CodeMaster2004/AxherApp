"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import Loader from "@/shared/components/ui/Loader";
import { routePermissions } from "@/shared/config/routePermissions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 🔍 Buscar permiso requerido según la ruta
  const matched = routePermissions.find(({ pattern }) =>
    pattern.test(pathname)
  );

  useEffect(() => {
    if (loading || !user) return;

    // 🚫 Si la ruta requiere permiso y no lo tiene → 403
    if (matched && !user.permissions.includes(matched.permission)) {
      router.replace("/403");
    }
  }, [loading, user, pathname, matched, router]);

  // ⏳ Mientras carga sesión
  if (loading) return <Loader />;

  // 🚫 Bloquear render mientras redirige
  if (matched && !user?.permissions.includes(matched.permission)) {
    return null;
  }

  return <>{children}</>;
}