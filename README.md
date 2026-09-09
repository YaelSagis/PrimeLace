
https://github.com/user-attachments/assets/0b553545-60f4-4e73-8ebd-326e3ce265d6


# PrimeLace - Bridal Salon Rental Platform

A full-stack web application for a bridal dress rental salon. Customers can browse the
catalog by collection, filter and sort dresses, reserve a dress for specific dates, pay
online, and manage their rentals - while the salon owner runs the entire business
(dresses, categories, orders, customers) from an admin dashboard with live charts.

## Features

**Customer-facing**
- Browse dresses by collection or as one flat, filterable/sortable catalog (price range, sort by price/popularity)
- Product page with an image gallery, size selection, and a date-range picker that blocks already-booked dates per size
- Server-side availability check on booking - prevents two customers from double-booking the same dress and size for overlapping dates
- Online payment flow (PayPal) and rental history ("My Rentals")
- Favorites list, authentication (sign up / log in), profile management
- Scroll position is restored correctly when navigating back (custom hook, no jank)

**Admin dashboard**
- KPI overview: revenue, orders, customers, dress occupancy rate
- Live charts (revenue over time, order status, size demand, collection availability)
- Manage dresses, categories, rentals and customers - with search on every table

## Tech stack

**Frontend:** React 19, Vite, React Router 7, Redux Toolkit, Recharts, Axios
**Backend:** Node.js, Express 5, MongoDB with Mongoose, JWT authentication, Cloudinary (image hosting)

## Project structure

```
react/    - the React SPA (Vite)
nodeJS/   - the Express API + MongoDB models
```

## Running locally

### Backend
```
cd nodeJS
npm install
cp .env.example .env   # fill in real values (see below)
npm start
```

### Frontend
```
cd react
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:2000
npm run dev
```

### Backend environment variables (`nodeJS/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_CLOUD_URI` | yes | MongoDB Atlas connection string |
| `JWT_SECRET` | yes | Secret used to sign auth tokens |
| `MONGO_LOCAL_URI` | no | Local MongoDB, for offline development |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | no | Seed admin credentials |
| `PORT` | no | Defaults to 2000 locally; hosting platforms set this automatically |

## Deployment

The backend reads `process.env.PORT`, so it's ready to deploy as-is on platforms like
Render (set the environment variables above in the dashboard). Point the frontend's
`VITE_API_URL` at the deployed backend's URL.
