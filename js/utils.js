// ==================== Utils ====================
export const API_BASE = "http://localhost:5062/API/v1";

// --- Token helpers ---
export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// --- Redirect if not logged in ---
export function requireAuth() {
    const token = getToken();
    if (!token) window.location.href = "index.html";
    return token;
}

// --- Redirect if already logged in ---
export function redirectIfLoggedIn() {
    const token = getToken();
    if (token) window.location.href = "dashboard.html";
}

// json helper function
export async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    let data;

    try {
        data = await res.json();
    } catch {
        data = { message: "Invalid response from server" };
    }

    return { res, data };
}
