export const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

export const formatDateShort = (date: string | Date) => {
    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
    }).format(new Date(date));
};

export const formatTime = (date: string | Date) => {
    return new Intl.DateTimeFormat("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(date));
};

export const getDateGroup = (date: string | Date) => {
    const target = new Date(date);
    const now = new Date();

    const targetDay = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate()
    );

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (targetDay.getTime() === today.getTime()) {
        return "HOY";
    }

    if (targetDay.getTime() === yesterday.getTime()) {
        return "AYER";
    }

    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
    })
        .format(new Date(date))
        .toUpperCase();
}