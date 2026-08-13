package com.axher.backend.shared.util;

import java.util.List;
import java.util.function.BiConsumer;
import java.util.function.Function;

public final class PositionUtils {

    private PositionUtils() {
    }

    public static <T, ID> void move(
            List<T> items,
            ID moveId,
            int newPosition,
            Function<T, ID> idGetter,
            Function<T, Integer> positionGetter,
            BiConsumer<T, Integer> positionSetter
    ){
        T movedItem = items.stream()
                .filter(item -> moveId.equals(idGetter.apply(item)))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Elemento no encontrado"));
        int oldPosition = positionGetter.apply(movedItem);

        if(newPosition < 1) {
            throw new IllegalArgumentException("La nueva posición debe ser mayor o igual a 1");
        }

        int maxPosition = items.size();

        newPosition = Math.min(newPosition, maxPosition);

        if(oldPosition == newPosition) {
            return; // No hay cambios necesarios
        }

        /*
         * Primero llevamos todas las posiciones
         * a valores temporales para evitar conflictos
         * con UNIQUE(position).
         */

        for(T item : items) {
            int currentPosition = positionGetter.apply(item);
            positionSetter.accept(item, -currentPosition);
        }

        /*
         * Ahora reconstruimos las posiciones
         * desde 1.
         */

        int position = 1;

        for (T item : items) {

            if(idGetter.apply(item).equals(moveId)) {
                continue;
            }

            if(position == newPosition){
                position++;
            }

            positionSetter.accept(item, position);
            position++;

        }
        positionSetter.accept(movedItem, newPosition);

    }

    public static int normalizeInsertPosition(
        Integer requestedPosition,
        int currentSize
    ){
        
        if (requestedPosition == null) {
            return currentSize + 1;
        }
        if(requestedPosition < 1){
            throw new IllegalArgumentException(
                "La posición debe ser mayor a o igual a 1"
            );
        }
        return Math.min(requestedPosition, currentSize + 1);
    }

    public static<T> void openPosition(
        List<T> items,
        int position,
        Function<T, Integer> positionGetter,
        BiConsumer<T, Integer> positionSetter
    ){
        for(T item : items){
            int currentPosition = positionGetter.apply(item);
            if(currentPosition >= position){
                positionSetter.accept(item, currentPosition + 1);
            }
        }
    }
    
    public static<T> void closePosition(
        List<T> items,
        int deletedPosition,
        Function<T, Integer> positionGetter,
        BiConsumer<T, Integer> positionSetter
    ) {
        for(T item : items){
            int currentPosition = positionGetter.apply(item);
            if(currentPosition > deletedPosition){
                positionSetter.accept(item, currentPosition - 1);
            }
        }
    }
    
}
