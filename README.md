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

| Feature | Description | Status |
|----------|-------------|--------|
| User Registration | Allow users to create an account using email and password | ✅ Complete |
| User Login (JWT) | Authenticate users securely using JSON Web Tokens | ✅ Complete |
| Admin Dashboard | Provide administrators with platform metrics and overview | ✅ Complete |
| Add Movie (OMDb Integration) | Allow users to add movies fetched from OMDb API | ✅ Complete |
| Update Movie | Allow movie creator or admin to modify movie details | ✅ Complete |
| Delete Movie | Allow movie creator or admin to remove movies | ✅ Complete |
| Duplicate Movie Guard | Prevent duplicate movie entries based on title and year | ⚠️ Partial |
| View Single Movie | Display complete movie details and engagement metrics | ✅ Complete |
| Search by Title | Enable users to search movies by title | ✅ Complete |
| Filter by Genre | Enable filtering of movies by genre | ✅ Complete |
| Pagination (Movies) | Limit number of movies per page for performance | ✅ Complete |
| Sort by Highest Rated | Display movies ordered by highest average rating | ✅ Complete |
| Sort by Most Liked | Display movies ordered by number of likes | ✅ Complete |
| Sort by Trending | Rank movies using rating and like combination | ✅ Complete |
| Track Movie Creator | Store and display which user added the movie | ✅ Complete |

---

### 2. Engagement & Social Features

| Feature | Description | Status |
|----------|-------------|--------|
| Like Movie | Allow users to like or unlike a movie | ✅ Complete |
| Prevent Duplicate Movie Likes | Ensure a user can only like a movie once | ✅ Complete |
| Movie Rating System | Allow users to rate movies from 1–5 stars | ✅ Complete |
| Automatic Average Rating | Automatically calculate and display average rating | ✅ Complete |
| Add to Watchlist | Allow users to save movies to personal watchlist | ✅ Complete |
| Remove from Watchlist | Allow users to remove movies from watchlist | ✅ Complete |
| View Personal Watchlist | Display user's saved watchlist movies | ✅ Complete |
| Add Comment | Allow users to comment on movies | ✅ Complete |
| Reply to Comment | Allow threaded replies to comments | ✅ Complete |
| Edit Own Comment | Allow users to modify their own comments | ✅ Complete |
| Delete Own Comment | Allow users to delete their own comments | ✅ Complete |
| Admin Edit Comment | Allow administrators to edit any comment | ✅ Complete |
| Admin Delete Comment | Allow administrators to delete any comment | ✅ Complete |
| Like Comment | Allow users to like a comment | ⚠️ Partial |
| Dislike Comment | Allow users to dislike a comment | ⚠️ Partial |
| Prevent Duplicate Comment Reactions | Ensure users cannot react multiple times to same comment | ⚠️ Partial |

---

### 3. Authentication & Role Control

| Feature | Description | Status |
|----------|-------------|--------|
| JWT Authentication | Secure protected routes using token-based authentication | ✅ Complete |
| Role-Based Access Control | Differentiate admin and regular user privileges | ✅ Complete |
| Creator-Based Authorization | Restrict movie modification to creator or admin | ✅ Complete |
| Admin Override Permissions | Grant administrators full moderation rights | ✅ Complete |

---

### 4. System & Architecture

| Feature | Description | Status |
|----------|-------------|--------|
| Environment-Based Configuration | Use environment variables for deployment flexibility | ✅ Complete |
| Database Indexing | Improve query performance using indexed fields | ⚠️ Partial |
| Pagination for Comments | Implement pagination for large comment threads | ❌ Not Implemented |
| Centralized Error Handling | Use middleware for unified error responses | ❌ Not Implemented |
| Input Validation Middleware | Validate requests using structured validation | ❌ Not Implemented |
| Logging & Monitoring | Add structured logging for production debugging | ❌ Not Implemented |
| API Documentation | Provide API documentation via Swagger or Postman | ❌ Not Implemented |
| Caching Layer | Use Redis or caching strategy for performance | ❌ Not Implemented |

---

## 🏗 Tech Stack

- **Frontend:** Vue 3 + Vite  
- **Backend:** Node.js + Express  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT  
- **External APIs:** OMDb API, Giphy API  
- **Deployment:** Render (Backend), Vercel (Frontend)