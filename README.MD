👔 Suit Rental Management System

A full-stack **MERN** web application for managing suit inventory, customers, rentals, returns, and availability.

## 📋 Project Overview

The **Suit Rental Management System** digitalizes suit rental operations by replacing manual records with a centralized web platform. It helps administrators manage suits and customers, track rentals and returns, and improve business efficiency.

## 👥 Team Members

| No. | Name | Role |
|---|---|---|
| 1 | Khalid Abdikarim Daud | Team Leader & frontend developer |
| 2 | Saacid Abdirisak Jama | Frontend Developer |
| 3 | Yasid Mahamud Ayanle | Backend Developer |
| 4 | Hamse Hassan Abdulahi | Documentation |
| 5 | Masoud Abdikarim Mohamed | Backend / UI Developer |
| 6 | Mohamed Esse Yusuf | Frontend / Integration |

## 🛠️ Technologies Used

- **Frontend:** React, Vite, React Router, Axios, CSS3, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Other:** CORS, dotenv, Git, GitHub, Postman, MongoDB Atlas, VS Code

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm
- MongoDB or MongoDB Atlas
- Git

### Backend

```bash
git clone -b backend https://github.com/moparek/Suit-Rental-Management-.git backend
cd backend
npm install
npm run dev
```

Backend: `http://localhost:5000`

### Frontend

```bash
git clone -b frontend https://github.com/moparek/Suit-Rental-Management-.git frontend
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/suit
JWT_SECRET=Tele-Som_A44%cdem.dsa//proje!@ject|fin&^project#12
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

> Do not commit real passwords, database credentials, or JWT secrets to GitHub.

## 🔌 API Endpoints

**Base URL:** `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/profile` | Get current profile |

### Suits

| Method | Endpoint | Description |
|---|---|---|
| GET | `/suits` | Get all suits |
| GET | `/suits/:id` | Get suit details |
| POST | `/suits` | Add suit |
| PUT | `/suits/:id` | Update suit |
| DELETE | `/suits/:id` | Delete suit |
| GET | `/suits/search?size=M` | Search suits |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/customers` | Get customers |
| GET | `/customers/:id` | Get customer |
| POST | `/customers` | Create customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

### Rentals

| Method | Endpoint | Description |
|---|---|---|
| GET | `/rentals` | Get rentals |
| GET | `/rentals/:id` | Get rental details |
| POST | `/rentals` | Create rental |
| PUT | `/rentals/:id` | Update rental status |
| DELETE | `/rentals/:id` | Cancel rental |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/bookings` | Get bookings |
| POST | `/bookings` | Create booking |
| PUT | `/bookings/:id` | Update booking |
| DELETE | `/bookings/:id` | Cancel booking |

## ✅ Implemented Features

- User registration and login
- JWT authentication and protected routes
- bcrypt password hashing
- Role-based access
- Suit CRUD management
- Suit categories, sizes, colors, prices, conditions, and availability
- Customer management
- Rental creation and tracking
- Rental cost calculation
- Suit return and availability updates
- Dashboard statistics
- Responsive UI
- Loading states, alerts, and pagination


**GitHub Repository:** https://github.com/moparek/Suit-Rental-Management-

**Live Demo:** https://profound-surprise-production-bf4c.up.railway.app/.

## 🧩 Challenges and Solutions

### MongoDB Connection
**Problem:** Database connection errors caused by an incorrect or missing connection string.

**Solution:** Configured `.env` correctly and verified the MongoDB connection.

### CORS Errors
**Problem:** Frontend requests were blocked by the backend.

**Solution:** Configured CORS and allowed the frontend origin.

### JWT Token Management
**Problem:** Authentication tokens were not consistently available after refreshes.

**Solution:** Stored the token and used an Axios interceptor for authenticated requests.


## 🔮 Future Improvements

- Online payment integration
- Email and SMS notifications
- Advanced revenue reports
- PDF/Excel report export
- Customer portal
- Mobile application
- Two-factor authentication
- Google/OAuth login
- Redis caching
- Automated testing
- Docker and CI/CD deployment

## 📄 License

This project is licensed under the **MIT License**.
