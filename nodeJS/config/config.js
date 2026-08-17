
// Database Configuration
export const cloud_mongo_URI = process.env.MONGO_CLOUD_URI;
export const local_mongo_URI = process.env.MONGO_LOCAL_URI;

// JWT Secret
export const jwtSecret = process.env.JWT_SECRET;

// Admin Credentials
export const adminEmail = process.env.ADMIN_EMAIL || null;
export const adminPassword = process.env.ADMIN_PASSWORD || null;