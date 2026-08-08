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

// Human phrases for a location the device could not provide. Keys match the
// reason values in locationService.
const LOCATION_REASONS = {
    denied: "permission denied",
    unavailable: "no signal",
    timeout: "timed out",
    unsupported: "not supported on this device",
};

// Renders a stored checkInLocation as a plain statement of what was captured.
// It never dresses up an absence: an unavailable fix reads as unavailable,
// because a placeholder that looks like a position would be a claim the
// record cannot support.
export const formatLocation = (location) => {
    if (!location) return "Not captured";

    if (!location.available) {
        return `Unavailable (${LOCATION_REASONS[location.reason] ?? "reason unknown"})`;
    }

    const coords = `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;

    return Number.isFinite(location.accuracy)
        ? `${coords} (within ${Math.round(location.accuracy)} m)`
        : coords;
};

// hours between two ISO strings; Date minus Date yields milliseconds
export const hoursBetween = (checkIn, checkOut) =>
    ((new Date(checkOut) - new Date(checkIn)) / 3600000).toFixed(1);
