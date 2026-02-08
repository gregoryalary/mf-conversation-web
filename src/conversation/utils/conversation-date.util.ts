const dateDayFormatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const dateDayVerboseFormatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    year: "numeric",
});

const dateTimestampFormatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
});

export const areUTCDatesDifferentDays = (dateUTC1: Date, dateUTC2: Date) => {
    return dateDayFormatter.format(dateUTC1) !== dateDayFormatter.format(dateUTC2);
};

export const formatDateUTCForConversationItemMessage = (dateUTC: Date) => {
    return dateTimestampFormatter.format(dateUTC);
};

export const formatDateUTCForConversationItemDate = (dateUTC: Date) => {
    return dateDayVerboseFormatter.format(dateUTC);
};

export const getTodayUTCBounds = (): { start: string; end: string } => {
    const now = new Date();

    const todayInParis = dateDayFormatter.format(now);
    const [day, month, year] = todayInParis.split("/");

    const midnightUTC = Date.UTC(+year, +month - 1, +day, 0, 0, 0, 0);

    const dateAtMidnightUTC = new Date(midnightUTC);
    const parisHourAtMidnightUTC = +new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Paris",
        hour: "numeric",
        hour12: false,
    }).format(dateAtMidnightUTC);

    const offsetMs = parisHourAtMidnightUTC * 60 * 60 * 1000;

    const startMs = midnightUTC - offsetMs;
    const endMs = startMs + 24 * 60 * 60 * 1000 - 1;

    return {
        start: new Date(startMs).toISOString(),
        end: new Date(endMs).toISOString(),
    };
};
