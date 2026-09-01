export interface MenuItem {
    id: string;
    labelKey: string;
    href?: string;
    children?: MenuItem[];
    permission?: string;
}

export const menuConfig: MenuItem[] = [
    {id: "home", labelKey: "home", href: "/"},
    {id: "movies", labelKey: "movies", href: "/peliculas"},
    {id: "series", labelKey: "series", href: "/serie"},
    {id: "settings", labelKey: "settings", href: "/settings"},

    {
        id: "administration",
        labelKey:"administration",
        children: [
            {
                id: "content-management",
                labelKey:"contentManagement",
                children: [
                    {id: "contents", labelKey: "contents", href: "/admin/contents", permission: "CONTENT:VIEW"},
                    {id: "content-categories", labelKey: "contentCategories", href: "/admin/contentCategories", permission: "CATEGORY:VIEW"},
                    {id: "content-status", labelKey: "contentStatus", href: "/admin/contentStatus", permission: "CONTENT:VIEW"},
                    {id: "shelves", labelKey: "shelves", href: "/admin/shelves"},
                    {id: "page-sections", labelKey: "pageSections", href: "/admin/page-sections"},
                    {id: "hero-banners", labelKey: "heroBanners", href: "/admin/hero-banners"},

                ],

                
            },

            {
                id: "support",
                labelKey: "support",
                children: [
                    {id: "support-tickets", labelKey: "supportTickets", href: "/admin/support/tickets"},
                    {id: "support-categories", labelKey: "supportCategories", href: "/admin/support/ticket-category"},
                    {id: "support-tickets-status", labelKey: "supportTicketStatuses", href:"/admin/support/ticket-status"},
                    {id: "support-faqs", labelKey: "supportFaqs", href: "/admin/faqs"},
                    {id: "problem-reports", labelKey: "problemReports", href: "/admin/reports/problems",},
                    {id: "problem-status", labelKey: "problemReportStatuses", href: "/admin/report-status",},
                    {id: "problem-categories", labelKey: "problemReportCategories", href: "/admin/report-category",},


                ]
            },

            {
                id: "commercial-management",
                labelKey: "commercialManagement",
                children: [
                    {id: "discounts", labelKey: "discounts", href: "/admin/discounts", permission: "DISCOUNT:VIEW"},
                ],
            },
            {
                id: "users-management",
                labelKey: "usersManagement",
                children: [

                    {id: "users", labelKey: "users", href: "/admin/users", permission: "USER:VIEW"},
                    {id: "system-roles", labelKey: "systemRoles", href: "/admin/systemRoles", permission: "ROLE:VIEW"},
                    {id: "system-permissions", labelKey: "systemPermissions", href: "/admin/systemPermissions", permission: "SYSTEM_PERMISSION:VIEW"},

                ]
            },
            {
                id: "system",
                labelKey: "system",
                children: [
                    {id: "languages", labelKey: "languages", href: "/admin/languages"},
                ],
             }
        ]
    }

];