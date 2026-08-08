"use client";

import SearchModal from "@/features/search/components/SearchModal";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchButton() {

    const [open, setOpen] = useState(false);

    return (

        <>
            <button
                onClick={() => setOpen(!open)}
            >
                <Search size={20} />
            </button>

            {
                open && (
                    <SearchModal
                        onClose={()=>setOpen(false)}
                    />
                )
            }
        </>
    )
}