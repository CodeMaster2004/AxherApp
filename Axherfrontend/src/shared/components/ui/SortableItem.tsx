"use client";

import { useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {ElementType, ReactNode} from "react";

interface Props {

    id:number;
    children:( dragHandle: ReactNode) => ReactNode;
    as?:ElementType;

}


export default function SortableItem({
    id,
    children,
    as:Component="div"
}:Props){

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id
    });



    const style={
        transform:
        CSS.Transform.toString(transform),
        transition
    };

    const dragHandle = (
         <button
            type="button"
            {...attributes}
             {...listeners}
             aria-label="Mover elemento"
             style={{
                cursor: "grab", background: "none", border: "none", padding: 4, color: "inherit"
             }}
         >
            ☰
         </button>
    )



    return (

        <Component
            ref={setNodeRef}
            style={style}
        >

            {
                children(
                    dragHandle
                )
        
            }

        </Component>

    );

}