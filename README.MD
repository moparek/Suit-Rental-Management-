# 👔 Suit Rental Management System

 📋 Project Overview

Suit Rental Management System is a full-stack web application designed to streamline the suit rental business operations. The system allows customers to browse, book, and rent suits while providing administrators with tools to manage inventory, bookings, rentals, and generate business reports.

Purpose: To digitalize and automate the suit rental business, reducing manual work and improving customer experience through an intuitive interface and efficient backend operations.

---

 👥 Team Members & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| Khalid Abdikarim Daud | Fronend Developer | API endpoints, database design, server logic, authentication |
| Saacid Abdirisak Jama | Frontend Developer | System integration, Frontend components |
| Hamse Hassan Abdulahi | documentation | preparing document
| Yasiid Mahamud Ayaanle | Backend Developer | Database management, API testing, server optimization |
| Masoud Abdikarim Mohamed | Backend Developer | Styling, responsive design, component creation |
| Mohamed Esse Yusuf | frontend Developer | Deployment, testing, documentation, integration |

---

 Technologies Used

# Frontend
- React 18 - UI library
- Vite - Build tool (faster than Create React App)
- React Router - Client-side routing
- Axios - HTTP client for API calls
- CSS3 - Styling (custom CSS)
- React Context API - State management

# Backend
- Node.js - JavaScript runtime
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB ODM (Object Data Modeling)
- JWT (jsonwebtoken) - Authentication & authorization
- bcrypt - Password hashing
- CORS - Cross-Origin Resource Sharing
- dotenv - Environment variable management

# Development Tools
- Git & GitHub - Version control
- Postman/Insomnia - API testing
- MongoDB Atlas - Cloud database
- VS Code - Code editor
- npm - Package manager

---

 Installation Instructions

# Prerequisites
- Node.js (v14 or higher)
- npm 
- MongoDB (local or MongoDB Atlas account)
- Git

# Backend Setup


bash
# 1. Clone repository
git clone -b backend https://github.com/moparek/Suit-Rental-Management-.git backend-project
cd backend-project

# 2. Install dependencies
npm install

# 3. Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/suit-rental" > .env
echo "PORT=5000" >> .env
echo "JWT_SECRET=your_secret_key_here" >> .env

# 4. Start MongoDB (if using local)
mongod

# 5. Run backend server
npm run dev



Expected Output:


Server running on port 5000
 MongoDB Connected Successfully!



# Frontend Setup


bash
# 1. Clone repository
git clone -b frontend https://github.com/moparek/Suit-Rental-Management-.git frontend-project
cd frontend-project

# 2. Install dependencies
npm install

# 3. Create .env file
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/suit
JWT_SECRET=Tele-Som_A44%cdem.dsa//proje!@ject|fin&^project#12

# 4. Run development server
npm start



Expected Output:


 Compiled successfully!
Localhost running on http://localhost:3000



---

  Environment Variables Configuration

# Backend (.env)


env
# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/suit-rental

# Server Configuration
PORT=5000

# JWT Authentication
JWT_SECRET=your_super_secret_key_min_32_characters

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development



# Frontend (.env)


env
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api

# Environment
REACT_APP_ENV=development



# MongoDB Connection String Examples

Local MongoDB:


MONGODB_URI=mongodb://localhost:27017/suit-rental



MongoDB Atlas (Cloud):


MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/suit-rental?retryWrites=true&w=majority



---

  API Endpoints Documentation

# Base URL: `http://localhost:5000/api`

# Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/profile` | Get current user profile | Yes |

Example Login Request:

json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}



Example Response:

json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "Ahmed Ali"
  }
}



---

# Users Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| POST | `/users` | Create new user | Yes (Admin) |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |

---

# Suits (Inventory) Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/suits` | Get all suits | No |
| GET | `/suits/:id` | Get suit details | No |
| POST | `/suits` | Add new suit | Yes (Admin) |
| PUT | `/suits/:id` | Update suit | Yes (Admin) |
| DELETE | `/suits/:id` | Delete suit | Yes (Admin) |
| GET | `/suits/search?size=M` | Search by size/color | No |

Example Suit Response:

json
{
  "_id": "suit_id",
  "name": "Classic Black Suit",
  "size": "M",
  "color": "Black",
  "price": 50,
  "availability": true,
  "description": "Premium black suit for special occasions",
  "quantity": 5
}



---

# Customers Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/customers` | Get all customers | Yes |
| GET | `/customers/:id` | Get customer details | Yes |
| POST | `/customers` | Create customer | Yes |
| PUT | `/customers/:id` | Update customer | Yes |
| DELETE | `/customers/:id` | Delete customer | Yes (Admin) |

---

# Rentals Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/rentals` | Get all rentals | Yes |
| GET | `/rentals/:id` | Get rental details | Yes |
| POST | `/rentals` | Create new rental | Yes |
| PUT | `/rentals/:id` | Update rental status | Yes |
| DELETE | `/rentals/:id` | Cancel rental | Yes |

Example Rental Request:

json
POST /api/rentals
{
  "customerId": "customer_id",
  "suitId": "suit_id",
  "rentalDate": "2024-01-15",
  "returnDate": "2024-01-18",
  "totalDays": 3,
  "totalCost": 150
}



---

# Bookings Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/bookings` | Get all bookings | Yes |
| POST | `/bookings` | Create booking | Yes |
| PUT | `/bookings/:id` | Update booking | Yes |
| DELETE | `/bookings/:id` | Cancel booking | Yes |

---

# Reports Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/reports` | Get sales reports | Yes (Admin) |
| GET | `/reports/monthly` | Monthly revenue report | Yes (Admin) |
| GET | `/reports/suits` | Suit popularity report | Yes (Admin) |

---

# Dashboard Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard` | Get dashboard overview | Yes |
| GET | `/dashboard/stats` | Get business statistics | Yes (Admin) |

Example Dashboard Response:

json
{
  "totalRentals": 45,
  "totalRevenue": 2250,
  "activeBookings": 8,
  "availableSuits": 12,
  "totalCustomers": 23
}



---

  Implemented Features

# Frontend Features 

 User Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- User profile management

 Suit Browsing & Search
- Browse all available suits
- Search by size, color, price
- Suit details page
- Availability checking

 Booking System
- Create bookings
- View booking history
- Modify bookings
- Cancel bookings

 Rental Management
- Create rental records
- Track rental status
- Calculate rental costs
- Return suit functionality

 Customer Management
- Customer information forms
- View customer details
- Update customer profile
- Customer transaction history

 Admin Dashboard
- Inventory management
- Staff management
- View reports
- System statistics

 Responsive UI
- Mobile-friendly design
- Sidebar navigation
- Navbar with user options
- Error/success alerts
- Loading states
- Pagination

# Backend Features 

 Authentication & Security
- User registration and login
- Password hashing with bcrypt
- JWT token generation
- Protected routes with middleware
- Role-based access control

 Database Models
- User model (staff/admin)
- Customer model
- Suit model
- Rental model
- Booking model

 CRUD Operations
- Full CRUD for all resources
- Input validation
- Error handling
- HTTP status codes

 Business Logic
- Rental cost calculation
- Availability checking
- Booking confirmation
- Inventory tracking
- Report generation

 API Features
- RESTful API design
- CORS enabled
- JSON data format
- Error responses
- Pagination support

---

Screenshots & Demo

# Login Page


Users can login with email and password
- Input validation
- Error messages
- Redirect to dashboard on success



# Dashboard


Admin overview showing:
- Total rentals
- Revenue statistics
- Booking status
- Inventory summary



# Suit Listing Page


Browse all available suits with:
- Suit images
- Size and color options
- Pricing
- Availability status
- Book now button



# Booking Form


Create rental bookings:
- Customer selection
- Suit selection
- Date range picker
- Automatic cost calculation
- Confirmation



# Reports Page


Generate business reports:
- Monthly revenue
- Popular suits
- Customer statistics
- Download options



---

  Developer Experience & Learning Journey

# My Experience with Node.js, Express.js, and MongoDB

During this project, my main focus was backend development. I used Node.js to run the server, Express.js to create the API routes, and MongoDB to store the project data. At the beginning, I created the server and connected Express with MongoDB. I thought everything was working correctly, but when I tested my API, I started getting errors and some data was not being saved in the database.

The First Challenge: MongoDB Connection Issues

The first problem I faced was with the MongoDB connection. I had made a mistake in the database connection string, so the server could not connect to MongoDB. I spent some time checking my code and the error message. Finally, I found the mistake, corrected the connection string, and restarted the server. After that, MongoDB connected successfully and I was able to save data.

API Routes and Data Handling

I also faced some problems while creating my Express API routes. Sometimes I used the wrong field name, and sometimes my request was not returning the data I expected. I tested my APIs using Postman and checked the errors in the Node.js terminal. By checking the code step by step, I found and fixed the bugs. I also added error handling to make it easier to understand what was wrong when a request failed.

Key Learnings

In the end, I was able to complete the backend and make the APIs work correctly with MongoDB. This experience taught me that errors and bugs are a normal part of backend development. Instead of giving up when I got an error, I learned to read the error message, check my code, test the API, and find the solution. Working with Node.js, Express.js, and MongoDB helped me improve my backend development skills and become more confident in solving problems.

Skills Gained:
- MongoDB connection and data modeling
- RESTful API design and implementation
- Error handling and debugging
- Postman API testing
- Problem-solving methodology
- Code organization and best practices

---

  Challenges Faced & Solutions

# Challenge 1: MongoDB Connection Issues

Problem: MongoDB connection string was undefined in .env file, causing server crash on startup.

Solution: 
- Created proper .env configuration file
- Added validation in db.config.js to check if MONGODB_URI exists
- Provided clear error messages for debugging
- Added MongoDB Atlas connection guide


javascript
// db.config.js
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env file');
}



---

# Challenge 2: CORS (Cross-Origin Resource Sharing) Errors

Problem: Frontend couldn't communicate with backend API due to CORS restrictions.

Solution:
- Enabled CORS in Express server
- Set allowed origin to frontend URL
- Configured credentials for token-based auth


javascript
// server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));



---

# Challenge 3: Authentication Token Management

Problem: JWT tokens weren't persisting across page refreshes and API calls were failing.

Solution:
- Implemented localStorage for token storage
- Created axios interceptor to attach token to all requests
- Added token refresh mechanism
- Implemented logout functionality


javascript
// api.js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



---

# Challenge 4: Rental Cost Calculation

Problem: Complex pricing logic for different rental periods (daily, weekly, monthly discounts).

Solution:
- Created utility function for cost calculation
- Implemented business rules for discounts
- Added test cases for various scenarios


javascript
// utils.js
const calculateRentalCost = (days, dailyRate) => {
  if (days >= 7 && days < 30) return days * dailyRate * 0.9;
  if (days >= 30) return days * dailyRate * 0.8;
  return days * dailyRate;
};



---

# Challenge 5: Real-time Inventory Synchronization

Problem: Inventory wasn't updating in real-time when suits were rented.

Solution:
- Implemented proper update logic in rental controller
- Added database transactions for consistency
- Created refresh mechanism on Frontend


javascript
// rentalController.js
const createRental = async (req, res) => {
  const suit = await Suit.findById(req.body.suitId);
  if (suit.quantity < 1) {
    return res.status(400).json({ message: 'Suit not available' });
  }
  suit.quantity -= 1;
  await suit.save();
  // Create rental record...
};



---

  Future Improvements

# Phase 2 Features

1. Payment Integration
   - Stripe/PayPal payment gateway
   - Online payment processing
   - Invoice generation and emailing

2. Notifications System
   - Email notifications for bookings
   - SMS reminders for rental returns
   - In-app notification bell

3. Advanced Reporting
   - Revenue analytics
   - Customer behavior analysis
   - Suit performance metrics
   - Exportable reports (PDF/Excel)

4. Mobile App
   - React Native mobile application
   - iOS and Android versions
   - Push notifications

5. Customer Portal
   - Self-service booking
   - Payment history
   - Reward points system
   - Customer reviews and ratings

6. Staff Management
   - Employee scheduling
   - Performance tracking
   - Commission calculations

7. Inventory Optimization
   - Automatic stock reordering
   - Warehouse management
   - Supplier integration

8. Security Enhancements
   - Two-factor authentication
   - OAuth/Google login
   - Data encryption at rest
   - Regular security audits

9. Performance Improvements
   - Implement caching (Redis)
   - Database indexing
   - CDN for static assets
   - API rate limiting

10. DevOps & Deployment
    - Docker containerization
    - CI/CD pipeline (GitHub Actions)
    - AWS/Azure cloud deployment
    - Automated testing (Jest, Mocha)

---

  Support & Contact

For questions or issues:
- GitHub Issues: https://github.com/moparek/Suit-Rental-Management-/issues
- Email: axmed.development@gmail.com

---

  License

This project is licensed under the MIT License - see the LICENSE file for details.

---

 Quick Start Summary


bash
# Terminal 1 - Backend
git clone -b backend https://github.com/moparek/Suit-Rental-Management-.git backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
git clone -b frontend https://github.com/moparek/Suit-Rental-Management-.git frontend
cd frontend
npm install
npm start

# Access at http://localhost:3000



---

Made with  by the Suit Rental Management Team

