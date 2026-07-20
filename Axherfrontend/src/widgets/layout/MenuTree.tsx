"use client";

import { MenuItem } from "@/shared/config/menuConfig";
import Link from "next/link";

interface Props {
    items: MenuItem[];
    renderSubMenu: (children: React.ReactNode) => React.ReactNode;
    onItemClick?: () => void; // Nueva prop para manejar clics en items
}



export default function MenuTree({ items, renderSubMenu, onItemClick }: Props) {
    
    const renderItems = (menuItems: MenuItem[])  => {
        return menuItems.map((item) => (
            <li key={item.id}>

                {item.href
                    ? <Link href={item.href} onClick={onItemClick}>{item.label}</Link>
                    : <span>{item.label}</span>
                }

                {item.children && renderSubMenu (
                    <ul>{renderItems(item.children)}</ul>
                )}

            </li>
        ));
    };

    return <ul>{renderItems(items)}</ul>
}
