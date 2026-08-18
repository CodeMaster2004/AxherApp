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
    {id: "settings", label: "Configuración", href: "/settings"},

    {
        id: "administration",
        label:"Admins",
        children: [
            {
                id: "content-management",
                label:"Gestión de Contenido",
                children: [
                    {id: "content-categories", label: "Categorías", href: "/admin/contentCategories", permission: "CATEGORY:VIEW"},
                    {id: "content-status", label: "Estado Películas", href: "/admin/contentStatus", permission: "CONTENT:VIEW"},
                    {id: "movies-admin", label: "Películas", href: "/admin/movies", permission: "CONTENT:VIEW"},
                    {id: "series-admin", label: "Series", href: "/admin/series", permission: "CONTENT:VIEW"},
                    {id: "shelves", label: "Carruseles", href: "/admin/shelves"},
                    {id: "page-sections", label: "Secciones de Página", href: "/admin/page-sections"},
                    {id: "hero-banners", label: "Hero Banners", href: "/admin/hero-banners"},

                ],

                
            },

            {
                id: "support",
                label: "Soporte",
                children: [
                    {id: "support-tickets", label: "Tickets de Soporte", href: "/admin/support/tickets"},
                    {id: "support-categories", label: "Categorias de soporte", href: "/admin/support/ticket-category"},
                    {id: "support-tickets-status", label: "Estados de Tickest", href:"/admin/support/ticket-status"},
                    {id: "problem-reports", label: "Reportes de Problemas", href: "/admin/reports/problems",},
                    {id: "problem-status", label: "Estados de Reportes", href: "/admin/report-status",},


                ]
            },

            {
                id: "commercial-management",
                label:"Gestión Comercial",
                children: [
                    {id: "discounts", label: "Descuentos", href: "/admin/discounts", permission: "DISCOUNT:VIEW"},
                ],
            },
            {
                id: "users-management",
                label: "Usuarios y Acceso",
                children: [

                    {id: "users", label: "Usuarios", href: "/admin/users", permission: "USER:VIEW"},
                    {id: "system-roles", label: "Roles", href: "/admin/systemRoles", permission: "ROLE:VIEW"},
                    {id: "system-permissions", label: "Permisos", href: "/admin/systemPermissions", permission: "SYSTEM_PERMISSION:VIEW"},

                ]
            },
            {
                id: "system",
                label:"Sistema",
                children: [
                    {id: "contents", label: "Contents", href: "/admin/contents", permission: "CONTENT:VIEW"},
                ],
             }
        ]
    }

];