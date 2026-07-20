export interface MenuItem {
    id: string;
    label: string;
    href?: string;
    children?: MenuItem[];
    permission?: string;
}

export const menuConfig: MenuItem[] = [
    {id: "home", label: "Inicio", href: "/"},
    {id: "movies", label: "Peliculas", href: "/peliculas"},
    {id: "series", label: "Series", href: "/serie"},
    {id: "favorites", label: "Favoritos", href: "/favorites"},
    {id: "settings", label: "Configuración", href: "/settings"},

    {
        id: "administration",
        label:"Admins",
        children: [
            {
                id: "content-management",
                label:"Gestión de Contenido",
                children: [
                    {id: "content-categories", label: "Categorías", href: "/contentCategories", permission: "CATEGORY:VIEW"},
                    {id: "content-status", label: "Estado Películas", href: "/contentStatus", permission: "CONTENT:VIEW"},
                    {id: "movies-admin", label: "Películas", href: "/movies", permission: "CONTENT:VIEW"},
                    {id: "series-admin", label: "Series", href: "/series", permission: "CONTENT:VIEW"},
                ],

                
            },

            {
                id: "commercial-management",
                label:"Gestión Comercial",
                children: [
                    {id: "discounts", label: "Descuentos", href: "/discounts", permission: "DISCOUNT:VIEW"},
                ],
            },
             {
                id: "system",
                label:"Sistema",
                children: [
                    {id: "contents", label: "Contents", href: "/contents", permission: "CONTENT:VIEW"},
                    {id: "users", label: "Usuarios", href: "/users", permission: "USER:VIEW"},
                    {id: "system-roles", label: "Roles", href: "/systemRoles", permission: "ROLE:VIEW"},
                    {id: "system-permissions", label: "Permisos", href: "/systemPermissions", permission: "SYSTEM_PERMISSION:VIEW"},
                ],
             }
        ]
    }

];