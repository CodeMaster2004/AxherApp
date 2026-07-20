export const routePermissions: Array<{
  pattern: RegExp;
  permission: string;
}> = [
  { pattern: /^\/contentStatus\/?$/, permission: "CONTENT_STATUS:VIEW" },
  { pattern: /^\/contentStatus\/create\/?$/, permission: "CONTENT_STATUS:CREATE" },
  { pattern: /^\/contentStatus\/\d+\/edit\/?$/, permission: "CONTENT_STATUS:EDIT" },
  { pattern: /^\/contentStatus\/\d+\/delete\/?$/, permission: "CONTENT_STATUS:DELETE" },

  { pattern: /^\/contentCategories\/?$/, permission: "CATEGORY:VIEW" },
  { pattern: /^\/contentCategories\/create\/?$/, permission: "CATEGORY:CREATE" },
  { pattern: /^\/contentCategories\/\d+\/edit\/?$/, permission: "CATEGORY:EDIT" },
  { pattern: /^\/contentCategories\/\d+\/delete\/?$/, permission: "CATEGORY:DELETE" },

  { pattern: /^\/contents\/?$/, permission: "CONTENT:VIEW" },
  { pattern: /^\/contents\/create\/?$/, permission: "CONTENT:CREATE" },
  { pattern: /^\/contents\/\d+\/edit\/?$/, permission: "CONTENT:EDIT" },
  { pattern: /^\/contents\/\d+\/delete\/?$/, permission: "CONTENT:DELETE" },

  { pattern: /^\/movies\/?$/, permission: "CONTENT:VIEW" },
  { pattern: /^\/movies\/create\/?$/, permission: "CONTENT:CREATE" },
  { pattern: /^\/movies\/\d+\/edit\/?$/, permission: "CONTENT:EDIT" },

  { pattern: /^\/series\/?$/, permission: "CONTENT:VIEW" },
  { pattern: /^\/series\/create\/?$/, permission: "CONTENT:CREATE" },
  //{ pattern: /^\/series\/\d+\/seasons\/?$/, permission: "SEASON:VIEW" },
  { pattern: /^\/series\/\d+\/seasons\/create\/?$/, permission: "SEASON:CREATE" },
  { pattern: /^\/series\/\d+\/seasons\/\d+\/edit\/?$/, permission: "SEASON:EDIT" },
  { pattern: /^\/series\/\d+\/seasons\/\d+\/delete\/?$/, permission: "SEASON:DELETE" },

  { pattern: /^\/discounts\/?$/, permission: "DISCOUNT:VIEW" },
  { pattern: /^\/discounts\/create\/?$/, permission: "DISCOUNT:CREATE" },
  { pattern: /^\/discounts\/\d+\/edit\/?$/, permission: "DISCOUNT:EDIT" },
  { pattern: /^\/discounts\/\d+\/delete\/?$/, permission: "DISCOUNT:DELETE" },

  { pattern: /^\/users\/?$/, permission: "USER:VIEW" },
  { pattern: /^\/systemRoles\/?$/, permission: "ROLE:VIEW" },
  { pattern: /^\/systemRoles\/create\/?$/, permission: "ROLE:CREATE" },
  { pattern: /^\/systemRoles\/\d+\/edit\/?$/, permission: "ROLE:EDIT" },
  { pattern: /^\/systemRoles\/\d+\/delete\/?$/, permission: "ROLE:DELETE" },

  { pattern: /^\/systemPermissions\/?$/, permission: "SYSTEM_PERMISSION:VIEW" },
  { pattern: /^\/systemPermissions\/create\/?$/, permission: "SYSTEM_PERMISSION:CREATE" },
  { pattern: /^\/systemPermissions\/\d+\/edit\/?$/, permission: "SYSTEM_PERMISSION:EDIT" },
  { pattern: /^\/systemPermissions\/\d+\/delete\/?$/, permission: "SYSTEM_PERMISSION:DELETE" },

  { pattern: /^\/userProfile\/?$/, permission: "PROFILE:VIEW" },
  { pattern: /^\/userProfile\/edit\/?$/, permission: "PROFILE:EDIT" },

  { pattern: /^\/userRoleAssignments\/?$/, permission: "USER_ROLE:VIEW" },
  { pattern: /^\/userRoleAssignments\/assign\/?$/, permission: "USER_ROLE:ASSIGN" },
  { pattern: /^\/userRoleAssignments\/remove\/?$/, permission: "USER_ROLE:REMOVE" },
];
