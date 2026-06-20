
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical, type = 'website' }) => {
    const siteTitle = 'ilaand - Island Activities Booking';
    const siteUrl = 'https://iland-app.com'; // Gantikan dengan domain sebenar nanti

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || "Discover and book the best island activities in Malaysia. Snorkeling, boat trips, and more on Kapas, Redang, and Perhentian Islands."} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEO;
