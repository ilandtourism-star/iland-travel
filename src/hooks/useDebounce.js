import { useState, useEffect } from 'react';

/**
 * Custom Hook untuk melambatkan (debounce) kemaskini nilai.
 * Sangat berguna untuk fungsi carian (search) supaya tidak membebankan prestasi
 * semasa pengguna sedang menaip.
 * 
 * @param {any} value - Nilai yang ingin di-debounce.
 * @param {number} delay - Masa lengah dalam milisaat (default: 500ms).
 * @returns {any} - Nilai yang telah di-debounce.
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set pemasa (timer) untuk mengemaskini nilai selepas 'delay'
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Bersihkan pemasa jika nilai berubah (sebelum delay tamat)
        // Ini adalah kunci utama debounce
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
