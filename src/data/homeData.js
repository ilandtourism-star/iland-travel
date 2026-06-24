/**
 * Home Page Static Data
 * This file contains hardcoded activities, FOMO bookings, and rankings 
 * for the Home page to keep Home.jsx clean and readable.
 */

// SNORKELING IMAGES (Import these within the component as they need Vite asset resolution)
// These keys will map to the imported variables in Home.jsx

export const initialActivities = [
    {
        id: 1,
        title: "Snorkeling and island hopping in Kapas Island",
        rating: "4.5",
        reviews: 120,
        price: "49.00",
        originalPrice: "89.00",
        imageKey: 'kapasSnorkelImg',
        link: "/kapas-snorkeling-details",
        buttonText: "View Details",
        isFlashSale: true,
        totalSeats: 20,
        seatsLeft: 3
    },
    {
        id: 2,
        title: "Redang Island Snorkeling Day Trip",
        rating: "5.0",
        reviews: 250,
        price: "100.00",
        originalPrice: "160.00",
        imageKey: 'redangSnorkelImg',
        link: "/redang-snorkeling-details",
        buttonText: "View Details",
        isFlashSale: true,
        totalSeats: 25,
        seatsLeft: 5
    },
    {
        id: 3,
        title: "Perhentian Island Snorkeling Day Trip",
        rating: "4.0",
        reviews: 85,
        price: "80.00",
        originalPrice: "135.00",
        imageKey: 'perhentianSnorkelImg',
        link: "/perhentian-snorkeling-details",
        buttonText: "View Details",
        isFlashSale: true,
        totalSeats: 15,
        seatsLeft: 2
    },
];

export const fomoBookings = [
    { name: "Siti from KL", act: "Private Boat Kapas" },
    { name: "John from UK", act: "Snorkeling Redang" },
    { name: "Ali from Johor", act: "Perhentian Package" },
    { name: "Sarah from Penang", act: "Squid Jigging" }
];

export const wallOfFameData = [
    {
        island: "Kapas Island",
        date: "Feb 2026",
        users: [
            { name: "Ahmad Zaki", initials: "AZ", trips: 12, tale: "Found a hidden sea turtle resting spot on Trip #3." },
            { name: "Fatimah Zahra", initials: "FZ", trips: 10, tale: "Completed a 4km island kayak run smoothly." },
            { name: "John Doe", initials: "JD", trips: 9, tale: "Snorkeled alongside 5 reef sharks!" },
        ]
    },
    {
        island: "Redang Island",
        date: "Feb 2026",
        users: [
            { name: "James Bond", initials: "JB", trips: 15, tale: "Caught a 2kg giant squid during a heavy storm." },
            { name: "Michelle Yeoh", initials: "MY", trips: 13, tale: "Discovered a massive coral garden untouched by crowds." },
            { name: "Tony Fernandes", initials: "TF", trips: 11, tale: "Flew here just for the sunrise dive." },
        ]
    },
    {
        island: "Perhentian Island",
        date: "Feb 2026",
        users: [
            { name: "Steve Irwin", initials: "SI", trips: 20, tale: "Swam with a rare dugong early in the morning." },
            { name: "Bear Grylls", initials: "BG", trips: 18, tale: "Survived 3 days using only local island tactics." },
            { name: "Greta Thunberg", initials: "GT", trips: 16, tale: "Organized a 50-person beach cleanup." },
        ]
    }
];

export const wofTitles = ["Elite Ilander", "Ocean Guardian", "Legendary Wayfinder"];
