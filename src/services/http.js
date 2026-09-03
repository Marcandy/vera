// The one place that knows the app talks to a server.
//
// Everything above this file still calls domain verbs (getVisits, checkInVisit)
// and has no idea whether the answer came from an array in memory or from
// Postgres. That was the point of the service layer, and this is the file that
// collects the payment.
//
// Relative, not an absolute origin. Vite proxies /api to the API in
// development, so the browser sees a single origin and CORS stays a production
// concern rather than something switched off locally and forgotten.
const API_BASE = "/api";

/**
 * A failure the server described. Keeps the status code, because the callers
 * care about the difference: 404 on a detail read means "no such record" and
 * has to become undefined, while anything else is a genuine failure that the
 * page should surface with a retry.
 */
export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const buildQuery = (params) => {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params ?? {})) {
        // An absent filter means no restriction, so it must not be sent at all.
        // Sending status= empty would ask the server to match the empty string.
        if (value === null || value === undefined || value === "") continue;
        query.set(key, String(value));
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
};

export const request = async (path, { method = "GET", params, body } = {}) => {
    let response;

    try {
        response = await fetch(`${API_BASE}${path}${buildQuery(params)}`, {
            method,
            headers: body === undefined ? undefined : { "Content-Type": "application/json" },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        // fetch rejects only when the request never got an answer: the server is
        // down, DNS failed, the network dropped. "Failed to fetch" is what the
        // browser says and it is not a sentence anyone should read on screen.
        throw new ApiError(0, "Could not reach the server.");
    }

    if (!response.ok) {
        // The API returns { status, message } for its own failures. A proxy or a
        // crash might not, so the status line is the fallback rather than an
        // exception thrown while handling an exception.
        const problem = await response.json().catch(() => null);
        throw new ApiError(response.status, problem?.message ?? `Request failed (${response.status})`);
    }

    // 204 has no body to parse. Nothing returns one yet; this stops the day
    // something does from being a mystery.
    if (response.status === 204) return null;

    return response.json();
};
