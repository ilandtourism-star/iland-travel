const { z } = require('zod');

// Schema for Currency (Must be an integer in Sen, >= 0)
const currencySchema = z.number().int().min(0);

// Schema for Season Listener
const seasonListenerSchema = z.object({
    email: z.string().email({ message: "Format emel tidak sah." }).trim().toLowerCase(),
    sku: z.string().min(1, { message: "SKU diperlukan." })
});

// Schema for Booking
const bookingSchema = z.object({
    firstName: z.string().min(2, { message: "Nama diperlukan (min 2 aksara)." }),
    email: z.string().email({ message: "Format emel tidak sah." }).trim().toLowerCase(),
    packageName: z.string().min(1),
    vacation_sku: z.string().nullable().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Tarikh tidak sah.",
    }),
    adults: z.number().int().min(1).default(1),
    children: z.number().int().min(0).default(0),
});

// Schema for Vacation (For Admin/Partner updates)
const vacationSchema = z.object({
    sku: z.string().min(1),
    name: z.string().min(3),
    description: z.string().optional(),
    price: currencySchema,
    childPrice: currencySchema.nullable().optional(),
    max_pax: z.number().int().min(1).default(12),
    island: z.string().optional(),
    category: z.string().optional(),
});

const registrationSchema = z.object({
    username: z.string().min(3, { message: "Username mesti sekurang-kurangnya 3 aksara." }).regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandungi huruf, nombor dan garis bawah."),
    email: z.string().email({ message: "Format emel tidak sah." }).trim().toLowerCase(),
    password: z.string().min(8, { message: "Kata laluan mesti sekurang-kurangnya 8 aksara." })
        .regex(/[A-Z]/, { message: "Kata laluan mesti mengandungi sekurang-kurangnya satu huruf besar." })
        .regex(/[0-9]/, { message: "Kata laluan mesti mengandungi sekurang-kurangnya satu nombor." })
});

const loginSchema = z.object({
    username: z.string().min(1, { message: "Username diperlukan." }),
    password: z.string().min(1, { message: "Kata laluan diperlukan." })
});

module.exports = {
    seasonListenerSchema,
    bookingSchema,
    vacationSchema,
    currencySchema,
    registrationSchema,
    loginSchema,
    // Params Validation Schemas
    skuSchema: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/, "Format SKU tidak sah (hanya huruf, nombor, - dan _)."),
    idSchema: z.string().min(1),
    dateSchema: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tarikh tidak sah (YYYY-MM-DD)."),
    // Query Validation Schemas
    emailSchema: z.string().email().trim().toLowerCase(),
    islandSchema: z.string().optional(),
    categorySchema: z.string().optional(),
    keySchema: z.string().regex(/^[a-zA-Z0-9_]+$/, "Format Key tidak sah (huruf, nombor dan _ sahaja).")
};
