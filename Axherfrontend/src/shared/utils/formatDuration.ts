export function formatDuration(seconds?: number): string | undefined {

    if(seconds == null) return undefined;


    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
        (seconds % 3600) / 60
    );


    if(hours > 0){
        return `${hours}h ${minutes}min`;
    }


    return `${minutes} min`;
}