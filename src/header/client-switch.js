export function isLocalDevelopment() {
    return (
        process.env.NODE_ENV === "development" ||
        ["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"].includes(window.location.hostname)
    );
}

export function getCurrentClient() {
    if (isLocalDevelopment()) {
        const client = new URLSearchParams(window.location.search).get("client");
        if (client === "std" || client === "origin") return client;
    }
    return window.location.hostname.includes("origin") ? "origin" : "std";
}
