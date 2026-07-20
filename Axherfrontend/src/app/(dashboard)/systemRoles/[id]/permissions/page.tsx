"use client";

import { useParams } from "next/navigation";
import RolePermissionAssignmentForm from "@/features/rolePermissionAssignment/components/RolePermissionAssignmentForm";

export default function RolePermissionsPage() {
  const params = useParams();
  const roleId = params?.id ? Number(params.id) : null;

  if (!roleId) {
    return <div>ID de rol inválido</div>;
  }

  return (
    <div>
      <RolePermissionAssignmentForm roleId={roleId} />
    </div>
  );
}
