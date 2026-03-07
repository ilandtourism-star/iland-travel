/**
 * Format a date object or string into a standard display format.
 * @param {Date|string} date - The date to format.
 * @param {string} [locale='en-MY'] - The locale to use.
 * @param {object} [options] - Intl.DateTimeFormat options.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (date, locale = 'en-MY', options = {}) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const defaultOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(d);
};

/**
 * Format a date object or string into a time string.
 * @param {Date|string} date - The date to format.
 * @param {string} [locale='en-MY'] - The locale to use.
 * @returns {string} - The formatted time string.
 */
export const formatTime = (date, locale = 'en-MY') => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(d);
};
