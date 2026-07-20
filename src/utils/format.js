// Shared display formatters. Store ISO strings, format at render.

export const formatDateTime = (isoString) =>
    new Date(isoString).toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    });

export const formatTime = (isoString) =>
    isoString
        ? new Date(isoString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        : "—";

export const formatCurrency = (amount) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

// hours between two ISO strings; Date minus Date yields milliseconds
export const hoursBetween = (checkIn, checkOut) =>
    ((new Date(checkOut) - new Date(checkIn)) / 3600000).toFixed(1);
