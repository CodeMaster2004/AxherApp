"use client";

import { useParams } from "next/navigation";
import RolePermissionAssignmentForm from "@/features/rolePermissionAssignment/components/RolePermissionAssignmentForm";
import { useTranslations } from "next-intl";

export default function RolePermissionsPage() {
  const params = useParams();
  const t = useTranslations("systemRoles");
  const roleId = params?.id ? Number(params.id) : null;

  if (!roleId) {
    return <div>{t("errors.idInvalid")}</div>;
  }

  return (
    <div>
      <RolePermissionAssignmentForm roleId={roleId} />
    </div>
  );
}
