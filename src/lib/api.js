/**
 * Utiliti API untuk menguruskan permintaan HTTP dengan perlindungan CSRF.
 */

let cachedCsrfToken = null;

/**
 * Mengambil token CSRF daripada pelayan.
 * Sentiasa hantar credentials supaya cookie CSRF boleh disimpan.
 */
export const getCsrfToken = async (forceRefresh = false) => {
    if (cachedCsrfToken && !forceRefresh) return cachedCsrfToken;

    try {
        const response = await fetch('/api/v1/csrf-token', {
            credentials: 'include',  // ✅ WAJIB — supaya cookie CSRF diterima
        });
        if (!response.ok) throw new Error('Gagal ambil token CSRF');
        const data = await response.json();
        cachedCsrfToken = data.token;
        return cachedCsrfToken;
    } catch (err) {
        console.error("Gagal mengambil token CSRF:", err);
        cachedCsrfToken = null;
        return null;
    }
};

/**
 * Wrapper untuk fetch yang menyertakan token CSRF secara automatik.
 */
export const secureFetch = async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    // Jangan override Content-Type jika multipart (FormData)
    const isFormData = options.body instanceof FormData;

    const headers = {
        'Accept': 'application/json',
        ...options.headers,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    };

    if (needsCsrf) {
        const token = await getCsrfToken();
        if (token) {
            headers['X-CSRF-Token'] = token;
        }
    }

    const fetchOptions = {
        ...options,
        headers,
        credentials: 'include',  // ✅ WAJIB — supaya session cookie dihantar
    };

    // Backup: Append token to query string for multipart requests
    let finalUrl = url;
    if (needsCsrf && headers['X-CSRF-Token']) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl = `${finalUrl}${separator}_csrf=${encodeURIComponent(headers['X-CSRF-Token'])}`;
    }

    try {
        const response = await fetch(finalUrl, fetchOptions);

        // Jika ralat CSRF (403), cuba refresh token dan ulang sekali
        // Tambah had retry untuk elak infinite loop
        const retryCount = options._retryCount || 0;
        if (response.status === 403 && retryCount < 1) { // Limit to 1 retry
            console.warn(`CSRF Error (403). Retrying with new token... (Attempt ${retryCount + 1})`);

            const data = await response.clone().json().catch(() => ({}));
            if (data.message && data.message.includes('CSRF')) {
                cachedCsrfToken = null;

                // Cuba semula dengan token baru
                const newToken = await getCsrfToken(true);
                if (newToken) {
                    headers['X-CSRF-Token'] = newToken;
                    // RECURSIVE CALL: Supaya error handling (dan retry jika perlu) berjalan semula
                    return secureFetch(url, { ...options, headers, skipErrorHandling: options.skipErrorHandling, _retryCount: retryCount + 1 });
                }
            }
        }

        // Automatic Error Handling (Optional: can be disabled via options.skipErrorHandling)
        if (!response.ok && !options.skipErrorHandling) {
            console.log("SecureFetch Error Detected:", response.status, response.statusText);
            const data = await response.clone().json().catch(() => ({}));
            const error = new Error(data.message || `Request failed with status ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        } else {
            console.log("SecureFetch Request OK or Skipped Error Handling:", response.status, response.ok);
        }

        return response;
    } catch (err) {
        throw err;
    }
};
