/**
 * Centralized mapping for activity SKUs to their respective routes.
 * This ensures consistency across the Home page, Search Results, and Island pages.
 */

export const getActivityLink = (sku, island) => {
    const map = {
        // Kapas Island
        'relax-kapas': '/book/kapas-relaxation',
        'mental-escape-kapas': '/book/kapas-mental-escape',
        'joy-play-kapas': '/book/kapas-joy-playfulness',
        'mood-booster-kapas': '/book/kapas-mood-booster',
        'private-boat-10pax-kapas': '/book/kapas-private-boat-10pax',
        'private-boat-15pax-kapas': '/book/kapas-private-boat-15pax',
        'private-boat-25pax-kapas': '/book/kapas-private-boat-25pax',
        'private-boat-40pax-kapas': '/book/kapas-private-boat-40pax',
        'private-package-10pax-kapas': '/book/kapas-private-package-10pax',
        'private-package-15pax-kapas': '/book/kapas-private-package-15pax',
        'private-package-25pax-kapas': '/book/kapas-private-package-25pax',
        'private-package-40pax-kapas': '/book/kapas-private-package-40pax',

        // Redang Island
        'snorkeling-redang': '/book/redang-snorkeling-day-trip',
        'squid-jigging-redang': '/book/redang-squid-jigging-private',
        'skin-dive-redang': '/book/redang-skin-dive',
        'free-dive-redang': '/book/redang-free-diving',

        // Perhentian Island
        'snorkeling-perhentian': '/book/perhentian-snorkeling-day-trip',
        'skin-dive-perhentian': '/book/perhentian-learn-skindiving',
        'free-dive-perhentian': '/book/perhentian-free-diving',
        'private-boat-perhentian': '/checkout' // Taxi boat default link
    };

    const defaultLinks = {
        'Kapas': '/kapas-island-day-trips',
        'Redang': '/redang-island-day-trips',
        'Perhentian': '/perhentian-island-day-trips'
    };

    return map[sku] || defaultLinks[island] || '/search';
};

export const getIslandPageLink = (island) => {
    const map = {
        'Kapas': '/kapas-island-day-trips',
        'Redang': '/redang-island-day-trips',
        'Perhentian': '/perhentian-island-day-trips'
    };
    return map[island] || '/';
};

/**
 * Maps package SKUs to clean package names (e.g., PACKAGE A, PACKAGE B).
 */
export const getDisplayPackageName = (sku, defaultTitle = '') => {
    const map = {
        // Kapas Island
        'relax-kapas': 'PACKAGE A',
        'mental-escape-kapas': 'PACKAGE B',
        'joy-play-kapas': 'PACKAGE C',
        'mood-booster-kapas': 'PACKAGE D',
        'private-boat-10pax-kapas': 'PACKAGE E',
        'private-boat-15pax-kapas': 'PACKAGE F',
        'private-boat-25pax-kapas': 'PACKAGE G',
        'private-boat-40pax-kapas': 'PACKAGE H',
        'private-package-10pax-kapas': 'PACKAGE I',
        'private-package-15pax-kapas': 'PACKAGE J',
        'private-package-25pax-kapas': 'PACKAGE K',
        'private-package-40pax-kapas': 'PACKAGE L',

        // Redang Island
        'snorkeling-redang': 'PACKAGE A',
        'skin-dive-redang': 'PACKAGE B',
        'free-dive-redang': 'PACKAGE C',
        'squid-jigging-redang': 'PACKAGE D',

        // Perhentian Island
        // (Removed to use original names)
    };

    if (sku && map[sku]) {
        return map[sku];
    }

    return defaultTitle || 'PACKAGE';
};

