/// <reference types="vite/client" />
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''; // from .env or proxy

// 🔧 Universal request wrapper
async function request(path, options = {}) {
    // Get token from sessionStorage
    let token = '';
    const stored = localStorage.getItem('jwt');

    if (stored) {
        try {
            // If login saved { token, user }
            const parsed = JSON.parse(stored);

            if (typeof parsed === 'string') {
                token = parsed; // raw token string
            } else if (parsed.token) {
                token = parsed.token;
            }
        } catch {
            token = stored; // raw token
        }
    }


    // Set up headers
    const headers = new Headers(options.headers);
    // If body is FormData → let browser set correct multipart headers
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

    // Try to parse JSON response
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

    // NEW — for file uploads
    formPost: (path, formData) =>
        request(path, {
            method: 'POST',
            body: formData,
            headers: { /* DON'T set Content-Type — browser will set multipart boundary */ }
        }),
};


