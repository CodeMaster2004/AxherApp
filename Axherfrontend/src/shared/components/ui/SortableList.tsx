"use client";

import {DndContext, DragEndEvent,closestCenter} from "@dnd-kit/core";
import {SortableContext,arrayMove,verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

interface Props<T>{

    items:T[];
    getId:(item:T)=>number;
    onChange:(items:T[])=>void;
    renderItem:(
        item:T,
        index:number,
        dragHandle:React.ReactNode
    )=>React.ReactNode;
    onMove?:(
        id:number,
        position:number
    )=>void;
    itemAs?:React.ElementType;

}



export default function SortableList<T>({
    items,
    getId,
    onChange,
    renderItem,
    onMove,
    itemAs="div"
}: Props<T>){

    const handleDragEnd = (event: DragEndEvent)=>{

        const {active, over} = event;

        if(!over) return;

        if(active.id === over.id) return;


        const oldIndex = items.findIndex(
            item =>
            getId(item) === active.id
        );


        const newIndex = items.findIndex(
            item =>
            getId(item) === over.id
        );


        if(oldIndex === -1 || newIndex === -1) return;

        const newItems = arrayMove(
            items,
            oldIndex,
            newIndex
        );

        // actualiza UI
        onChange(newItems);

        // persiste la posicion
        const movedItem = items[oldIndex];


        onMove?.(
            getId(movedItem),
            newIndex + 1
        );


    }


    return (

        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >


        <SortableContext

            items={
                items.map(getId)
            }

            strategy={
                verticalListSortingStrategy
            }

        >


        {
            items.map(
            (item,index)=>(


            <SortableItem

                key={
                    getId(item)
                }

                id={
                    getId(item)
                }

                as={
                    itemAs
                }

            >


            {
                dragHandle => renderItem(item, index, dragHandle)
           
           }


            </SortableItem>


            ))

        }


        </SortableContext>


        </DndContext>


    );


}