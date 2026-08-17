# 👰 Bridal Salon - Wedding Dress Rental Platform

A modern, full-stack web application for managing wedding dress rentals. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

- 👗 Browse and view wedding dress collections
- ❤️ Save favorite dresses to your wishlist  
- 📅 Rent dresses with date selection
- 💳 Payment processing (Credit Card & PayPal)
- 👤 User account management
- 🛡️ Admin dashboard for managing:
  - Users
  - Dress inventory
  - Categories
  - Rentals

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Cloud or Local)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Bridal_salon_project
```

#### 2. Setup Server (Node.js)
```bash
cd nodeJS
npm install
cp .env.example .env
# Edit .env with your MongoDB credentials and admin details
```

#### 3. Setup Client (React)
```bash
cd ../react
npm install
```

---

## 🔧 Configuration

### Server Environment Variables (`.env` in nodeJS folder)

```env
# MongoDB
MONGO_CLOUD_URI=your_mongodb_cloud_url
MONGO_LOCAL_URI=mongodb://localhost:27017/PrimeLaceDB

# Security
JWT_SECRET=your_jwt_secret_key

# Admin Credentials
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password

# Server
PORT=2000
```

### Features
- **Environment-based configuration**: Credentials stored in `.env`, not in code
- **Admin authentication**: Hidden credentials, not exposed in source
- **JWT tokens**: 7-day expiration for session security

---

## 📖 Running the Project

### Start Server
```bash
cd nodeJS
npm start
# Server runs on http://localhost:2000
```

### Start Client (in another terminal)
```bash
cd react
npm run dev
# App runs on http://localhost:5173
```

---

## 🌐 Routes

### Public Routes
- `/` - Home page
- `/about` - About us
- `/contact` - Contact page
- `/collections` - Dress collections
- `/product/:id` - Dress details
- `/login` - User login
- `/signIn` - User registration

### Protected Routes (Requires Login)
- `/profile` - User profile
- `/favorites` - Saved dresses
- `/my-rentals` - My rentals
- `/checkout` - Checkout page
- `/payment` - Payment page (Credit Card)
- `/paypal` - PayPal payment
- `/order-confirmation` - Order confirmation

### Admin Routes (Admin Only)
- `/admin/users` - Manage users
- `/admin/categories` - Manage categories
- `/admin/rentals` - Manage rentals

---

## 🔐 Security Features

✅ **Environment Variables**: All credentials stored in `.env`  
✅ **JWT Authentication**: Secure token-based authentication  
✅ **Admin Verification**: Server-side and client-side admin checks  
✅ **Password Hashing**: Passwords stored securely  
✅ **Protected Routes**: Client-side route protection + server middleware

---

## 📁 Project Structure

```
Bridal_salon_project/
├── nodeJS/
│   ├── app.js              # Server entry point
│   ├── package.json
│   ├── .env.example        # Environment variables template
│   ├── config/             # Configuration files
│   ├── controllers/        # Route handlers
│   ├── middlewares/        # Auth middleware
│   ├── models/             # MongoDB schemas
│   ├── routers/            # API routes
│   └── services/           # Business logic
│
├── react/
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── styles/         # CSS files
│   │   ├── redux/          # State management
│   │   └── API/            # API calls
│   └── package.json
│
└── README.md               # This file
```

---

## 🔌 API Endpoints

### User Endpoints
- `POST /users/addUser` - Register
- `POST /users/logInUser` - Login
- `GET /users/getMe` - Get current user
- `PUT /users/updateUser` - Update profile
- `POST /users/addToFavorites` - Add to favorites
- `POST /users/removeFromFavorites` - Remove from favorites

### Dress Endpoints
- `GET /dresses/getAllDresses` - Get all dresses
- `GET /dresses/getById/:id` - Get dress details
- `POST /dresses/addDress` - Add dress (Admin)
- `PUT /dresses/updateDress/:id` - Update dress (Admin)
- `DELETE /dresses/deleteDress/:id` - Delete dress (Admin)

### Rental Endpoints
- `GET /rentings/getByUserId/:id` - Get user rentals
- `POST /rentings/addRenting` - Create rental
- `GET /rentings/getAllRentings` - Get all rentals (Admin)
- `PUT /rentings/updateRenting/:id` - Update rental
- `DELETE /rentings/deleteRenting/:id` - Cancel rental

### Payment Endpoints
- `POST /payments/addPayments` - Process payment
- `GET /payments/getAllPayments` - Get all payments (Admin)

---

## 🎨 Tech Stack

**Frontend:**
- React 19
- Redux Toolkit (State Management)
- React Router (Navigation)
- Axios (HTTP Client)
- CSS (Responsive Design)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (Authentication)
- CORS

---

## 📝 Notes

- Default MongoDB connection uses cloud instance
- Admin features visible only to logged-in admins
- Dress images stored via Cloudinary
- Date selection uses `react-date-range`
- Responsive design for mobile & desktop

---

## 🐛 Troubleshooting

### Server won't start
- Check MongoDB connection in `.env`
- Ensure port 2000 is not in use
- Check for missing dependencies: `npm install`

### Admin features not visible
- Verify admin credentials in `.env`
- Ensure you're logged in as admin user
- Check browser console for errors

### React app won't load
- Clear browser cache
- Check if server is running (port 2000)
- Verify API base URL in `react/src/API/`

---

## 📧 Contact & Support

For issues or questions, please contact the development team.

---

## 📄 License

This project is private and proprietary.

---

**Last Updated**: August 2026
