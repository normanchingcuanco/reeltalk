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

### 1. Core Application Features

| Feature | Status |
|---------|--------|
| User Registration | ✅ Complete |
| User Login (JWT) | ✅ Complete |
| Admin Dashboard | ✅ Complete |
| Add Movie (OMDb Integration) | ✅ Complete |
| Update Movie | ✅ Complete |
| Delete Movie | ✅ Complete |
| Duplicate Movie Guard | ⚠️ Partial |
| View Single Movie | ✅ Complete |
| Search by Title | ✅ Complete |
| Filter by Genre | ✅ Complete |
| Pagination (Movies) | ✅ Complete |
| Sort by Highest Rated | ✅ Complete |
| Sort by Most Liked | ✅ Complete |
| Sort by Trending | ✅ Complete |
| Track Movie Creator | ✅ Complete |

---

### 2. Engagement & Social Features

| Feature | Status |
|---------|--------|
| Like Movie | ✅ Complete |
| Prevent Duplicate Movie Likes | ✅ Complete |
| Movie Rating System | ✅ Complete |
| Automatic Average Rating | ✅ Complete |
| Watchlist Feature | ✅ Complete |
| Add Comment | ✅ Complete |
| Reply to Comment | ✅ Complete |
| Edit Own Comment | ✅ Complete |
| Delete Own Comment | ✅ Complete |
| Admin Comment Moderation | ✅ Complete |
| Comment Reactions | ⚠️ Partial |

---

### 3. Authentication & Role Control

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ Complete |
| Role-Based Access Control | ✅ Complete |
| Creator-Based Authorization | ✅ Complete |
| Admin Override Permissions | ✅ Complete |

---

### 4. System & Architecture

| Feature | Status |
|---------|--------|
| Environment-Based Configuration | ✅ Complete |
| Database Indexing | ⚠️ Partial |
| Pagination for Comments | ❌ Not Implemented |
| Centralized Error Handling | ❌ Not Implemented |
| Input Validation Middleware | ❌ Not Implemented |
| Logging & Monitoring | ❌ Not Implemented |
| API Documentation | ❌ Not Implemented |
| Caching Layer | ❌ Not Implemented |

---

## 🏗 Tech Stack

- **Frontend:** Vue 3 + Vite  
- **Backend:** Node.js + Express  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT  
- **External APIs:** OMDb API, Giphy API  
- **Deployment:** Render (Backend), Vercel (Frontend)