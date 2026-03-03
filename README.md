# 🎬 ReelTalk

A fullstack movie catalog and social discussion platform built using the **MEVN stack** (MongoDB, Express, Vue, Node.js).  
ReelTalk allows users to discover, rate, and discuss movies while administrators manage and moderate the platform.

---

## 🚀 Overview

ReelTalk is a community-driven movie platform where users can:

- Discover and browse movies  
- Rate and like films  
- Participate in threaded discussions  
- Manage personal watchlists  
- Contribute movies to the catalog  

Administrators have extended privileges for content management and moderation.

---

## 🧩 Core Features

## 👥 User Features

### Public Access

- View movies in a responsive card layout  
- Search movies by title  
- Filter movies by genre  
- Sort movies (Highest Rated, Most Liked, Trending, A–Z)  
- Paginated movie browsing  

### Authentication

- User registration (Username, Email, Password)  
- Secure login with JWT authentication  
- Role-based access control (User / Admin)  

### Logged-In Users

- Add movies via OMDb API integration  
- View full movie details  
- Like / Unlike movies  
- Rate movies (1–5 stars)  
- Add movies to personal watchlist  
- Remove movies from watchlist  
- Comment on movies  
- Reply to comments (threaded discussions)  
- Edit or delete own comments  
- React to comments (Like / Dislike)  

---

## 🛠 Admin Features

- Admin Dashboard with platform metrics  
- View all movies in table format  
- Create movies  
- Update movies  
- Delete movies  
- Moderate comments (Edit / Delete any comment)  
- Movies sorted alphabetically (A–Z)  
- Comments sorted newest-first (by `createdAt`)  

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users/register | Register new user |
| POST | /users/login | Authenticate and receive JWT |

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /movies/getMovies | Fetch movies with filters & pagination |
| GET | /movies/getMovie/:id | Fetch single movie |
| POST | /movies/addMovie | Add movie (authenticated) |
| PATCH | /movies/updateMovie/:id | Update movie |
| DELETE | /movies/deleteMovie/:id | Delete movie |
| PATCH | /movies/likeMovie/:id | Like / Unlike movie |
| PATCH | /movies/rateMovie/:id | Rate movie |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | /movies/addComment/:id | Add comment |
| PATCH | /movies/replyComment/:movieId/:commentId | Reply to comment |
| PATCH | /movies/editComment/:movieId/:commentId | Edit comment |
| DELETE | /movies/deleteComment/:movieId/:commentId | Delete comment |
| PATCH | /movies/reactComment/:movieId/:commentId | Like / Dislike comment |

### Watchlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | /movies/watchlist/:movieId | Toggle watchlist |
| GET | /movies/watchlist | Get user watchlist |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /movies/admin/dashboard | Platform statistics |

---

## 📊 Feature Completion Status

## 📊 Feature Completion Status

### 1. Core Application Features

| Feature Description | Status |
|---------------------|--------|
| User Registration with email and password authentication | ✅ Complete |
| Secure User Login using JWT | ✅ Complete |
| Admin Dashboard with platform metrics | ✅ Complete |
| Add Movie via OMDb API integration | ✅ Complete |
| Update Movie (Creator or Admin) | ✅ Complete |
| Delete Movie (Creator or Admin) | ✅ Complete |
| Prevent Duplicate Movies (Title + Year validation) | ⚠️ Partial |
| View Single Movie Details | ✅ Complete |
| Search Movies by Title | ✅ Complete |
| Filter Movies by Genre | ✅ Complete |
| Pagination for Movies | ✅ Complete |
| Sort Movies by Highest Rated | ✅ Complete |
| Sort Movies by Most Liked | ✅ Complete |
| Sort Movies by Trending Score | ✅ Complete |
| Track Movie Creator (createdBy field) | ✅ Complete |

---

### 2. Engagement & Social Features

| Feature Description | Status |
|---------------------|--------|
| Like / Unlike Movies | ✅ Complete |
| Prevent Duplicate Movie Likes | ✅ Complete |
| Movie Rating System (1–5 Stars) | ✅ Complete |
| Automatic Average Rating Calculation | ✅ Complete |
| Add Movies to Personal Watchlist | ✅ Complete |
| Remove Movies from Watchlist | ✅ Complete |
| View Personal Watchlist | ✅ Complete |
| Add Comment to Movies | ✅ Complete |
| Reply to Comments (Threaded Discussion) | ✅ Complete |
| Edit Own Comments | ✅ Complete |
| Delete Own Comments | ✅ Complete |
| Admin Edit Any Comment | ✅ Complete |
| Admin Delete Any Comment | ✅ Complete |
| Like / Dislike Comments | ⚠️ Partial |
| Prevent Duplicate Comment Reactions | ⚠️ Partial |

---

### 3. Authentication & Role Control

| Feature Description | Status |
|---------------------|--------|
| JWT-Based Authentication | ✅ Complete |
| Role-Based Access Control (User/Admin) | ✅ Complete |
| Creator-Based Authorization for Movie Updates | ✅ Complete |
| Admin Override Permissions | ✅ Complete |

---

### 4. System & Architecture Improvements

| Feature Description | Status |
|---------------------|--------|
| Environment-Based Configuration for Production | ✅ Complete |
| Database Indexing for Performance | ⚠️ Partial |
| Pagination for Comments | ❌ Not Implemented |
| Centralized Error Handling Middleware | ❌ Not Implemented |
| Input Validation Middleware | ❌ Not Implemented |
| Logging & Monitoring System | ❌ Not Implemented |
| API Documentation (Swagger / Postman) | ❌ Not Implemented |
| Caching Layer (Redis) | ❌ Not Implemented |

---

## 🏗 Tech Stack

- **Frontend:** Vue 3 + Vite  
- **Backend:** Node.js + Express  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT  
- **External APIs:** OMDb API, Giphy API  
- **Deployment:** Render (Backend), Vercel (Frontend)