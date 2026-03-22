#  E-Commerce Frontend (React)

##  Overview
This is the frontend of a full-stack e-commerce application built using React and Redux Toolkit. It provides a responsive and dynamic user interface for browsing products, managing a shopping cart, and completing purchases.

---

##  Features

- Product listing with pagination
- Search and filtering (by category)
- URL-based state management (pageNumber, pageSize, q, categoryId)
- Redux Toolkit for global state management
- Async API calls using createAsyncThunk
- Authentication using JWT
- Automatic refresh token handling
- Protected routes based on authentication
- Basket persistence using cookies for guest users
- Error handling with retry mechanism
- Responsive UI (Bootstrap)

---

##  Tech Stack

- React
- Redux Toolkit
- React Router
- Axios
- Bootstrap

---

##  State Management

- Global state handled using Redux Toolkit
- Async operations handled via createAsyncThunk
- Separate slices for products, authentication, and basket
- Centralized error and loading handling

---

##  Authentication

- JWT-based authentication
- Access token + refresh token flow
- Automatic token refresh on expiration
- Secure API communication using Axios interceptors

---

## Filtering & Pagination

- Server-side pagination and filtering
- Query parameters:
  - pageNumber
  - pageSize
  - q (search term)
  - categoryId
- URL is the source of truth for filters
- UI stays in sync with URL parameters

---

##  Basket System

- Add/remove items from basket
- Basket stored in cookies for guest users
- Persistent cart across sessions
- Ready for backend sync on login (extendable)

---

##  Getting Started

### 1. Clone the repository

git clone https://github.com/fathigasim/E-CommerceFront
cd ecommerce-frontend

---

### 2. Install dependencies

npm install

---

### 3. Run the application

npm run dev

---

##  API Configuration

Make sure the backend API is running and update the base URL if needed:

baseURL: https://localhost:7104/api

---

##  Screenshots 

 screenshots here:
- Search and filtering
- Basket page
- Checkout page

---

##  Future Improvements

- multilingual support 


---

##  Author

Mohammed Fathi Abualgasim Mustafa
