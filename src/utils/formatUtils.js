/**
 * Format a number as currency.
 * @param {number} amount - The amount to format.
 * @param {string} [currency='MYR'] - The currency code.
 * @param {string} [locale='en-MY'] - The locale to use.
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount, currency = 'MYR', locale = 'en-MY') => {
    if (isNaN(amount)) return '';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Capitalize the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};
