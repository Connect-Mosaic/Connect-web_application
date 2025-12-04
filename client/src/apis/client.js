/// <reference types="vite/client" />
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''; // from .env or proxy

// ⭐ Universal file URL helper
export function fileURL(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path; 
    return `${BASE_URL}${path}`;
}

// 🔧 Universal request wrapper
async function request(path, options = {}) {
    // Get token from localStorage
    let token = '';
    const stored = localStorage.getItem('jwt');

    if (stored) {
        try {
            const parsed = JSON.parse(stored);

            if (typeof parsed === 'string') {
                token = parsed;
            } else if (parsed.token) {
                token = parsed.token;
            }
        } catch {
            token = stored;
        }
    }

    // Setup headers
    const headers = new Headers(options.headers);

    // Only JSON if not FormData
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Make request
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    // Try JSON
    let responseBody;
    try {
        responseBody = await res.json();
    } catch {
        const text = await res.text().catch(() => '');
        throw new Error(`API ${options.method ?? 'GET'} ${path} failed: ${res.status} ${text}`);
    }

    return responseBody;
}

export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
    patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
    delete: (path) => request(path, { method: 'DELETE' }),

    // File upload shortcut
    formPost: (path, formData) =>
        request(path, {
            method: 'POST',
            body: formData,
            headers: {}
        }),
};
