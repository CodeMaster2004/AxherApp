import { MenuItem } from "@/shared/config/menuConfig";

export const filterMenuByPermissions = (
  items: MenuItem[],
  permissions?: string[]
): MenuItem[] => {
  return items
    .filter((item) => {
      if (!item.permission) return true;
      if (!permissions) return false;

      return permissions.includes(item.permission);
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? filterMenuByPermissions(item.children, permissions)
        : undefined,
    }))
    .filter((item) =>
      item.children ? item.children.length > 0 || !!item.href : true
    );
};
